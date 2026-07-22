---
title: "운영 & 재해복구"
description: "Narwhal IDP 클러스터의 일상 운영, 데이터 백업/복원, 주요 장애 상황 복구 런북"
project: "Narwhal"
order: 107
lastModified: 2026-07-17
---

## 클러스터 라이프사이클

Narwhal은 Vagrant 로컬 환경 기반이므로 호스트 재부팅, 절전 모드 등 빈번한 전원 이벤트에 대비하는 것이 중요합니다.

### 시작 및 종료

- **전체 시작**: `vagrant up --provider=vmware_desktop`
- **전체 종료**: `vagrant halt` (`trigger.before :halt` 설정에 의해 `kubelet`이 먼저 종료되어 컨테이너가 Graceful Shutdown 됩니다.)
- **일부 노드 시작**: `vagrant up master-1 worker-1`
- **재시작**: `vagrant halt && vagrant up`

### 리부트 생존성 (Reboot Survivability)

VM이 재부팅(Cold boot)될 경우, containerd의 Stale 컨테이너 유지로 인한 `CreateContainerError` 및 Istio/Cilium 네트워크 동기화 문제로 노드들이 `CrashLoopBackOff` 상태에 빠질 수 있습니다. 이를 해결하기 위해 두 개의 systemd 서비스가 작동합니다.

1. **`narwhal-boot-heal.service` (모든 노드)**: 부팅 시 및 주기적으로 작동하여 `kubelet`과 `containerd`의 멈춤 상태(Wedged)를 감지합니다. Stale 컨테이너 예약 오류가 발생하면 자동으로 containerd를 재시작합니다.
2. **`narwhal-cluster-heal.service` (master-1 전용)**: `Unknown` 상태인 Cilium/Istio 파드나 CrashLoop 중인 핵심 컴포넌트를 강제 삭제하여 깔끔하게 재생성되도록 유도합니다.

**시간 동기화 (Clock Skew) 버그:**
호스트가 절전 모드에서 복귀한 직후, `Unauthorized` 에러와 함께 `kube-apiserver` 인증이 거부되는 현상이 발생합니다.

```shell
# 모든 노드의 시간 동기화 재시작으로 즉시 해결
for node in master-1 master-2 master-3 worker-1 worker-2 worker-3; do
  vagrant ssh $node -c "sudo systemctl restart systemd-timesyncd"
done
```

## 스토리지 및 백업

Kubernetes 리소스 백업은 Velero가 담당하며, 데이터베이스는 CloudNative-PG(CNPG)를 이용합니다. 백업 타겟은 내부 SeaweedFS S3 호환 스토리지입니다.

<Mermaid chart={`flowchart TB
  subgraph K8S["Kubernetes Cluster"]
    API["API Server<br/>(Cluster State)"]
    PVC["Persistent Volumes<br/>(File Data)"]
    DB["CNPG narwhal-db<br/>(PostgreSQL)"]
  end

  subgraph S3["SeaweedFS S3 Store"]
    VB["velero bucket<br/>(Kopia Backups)"]
    CB["cnpg-backups bucket<br/>(WALs & Base Backups)"]
  end

  VELERO["Velero Controller"]
  CNPG["CNPG Operator<br/>(Barman)"]

  API -->|"Manifests"| VELERO
  PVC -->|"Kopia Node Agent"| VELERO
  VELERO -->|"Daily Backup"| VB

  DB -->|"Continuous WAL + Daily Base"| CNPG
  CNPG --> CB

  VB -.->|"Full/Namespace Restore"| VELERO
  CB -.->|"PITR Restore"| CNPG

  style S3 fill:#fafafa,stroke:#d1d5db,color:#374151
  style K8S fill:#fafafa,stroke:#d1d5db,color:#374151
  style VB fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style CB fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style VELERO fill:#f0fdf4,stroke:#059669,color:#111
  style CNPG fill:#f0fdf4,stroke:#059669,color:#111
  style API fill:#fff,stroke:#9ca3af,color:#111
  style PVC fill:#fff,stroke:#9ca3af,color:#111
  style DB fill:#fff,stroke:#9ca3af,color:#111
`} />

### Velero 클러스터 백업 및 복원

```shell
# 1. 수동 백업 생성
vagrant ssh master-1 -c "kubectl exec -n velero deployment/velero -- velero backup create manual-full-backup"

# 2. 최신 완료 백업 이름 추출
LATEST_BACKUP=$(vagrant ssh master-1 -c "kubectl exec -n velero deployment/velero -- velero backup get -o json | jq -r '[.items[] | select(.status.phase==\"Completed\")] | sort_by(.status.completionTimestamp) | last | .metadata.name'")

# 3. 전체 복원 실행 (코어 네임스페이스 제외)
vagrant ssh master-1 -c "kubectl exec -n velero deployment/velero -- velero restore create full-restore-$(date +%Y%m%d) --from-backup ${LATEST_BACKUP} --include-namespaces '*' --exclude-namespaces kube-system,storage,monitoring"
```

### CNPG 데이터베이스 (PITR)

CloudNative-PG는 `database` 네임스페이스에 `narwhal-db` 1개의 클러스터로 통합 운영됩니다. Primary 인스턴스 장애 시 자동으로 Replica가 승격(Failover)됩니다.

```shell
# 현재 Primary 인스턴스 확인
kubectl get cluster narwhal-db -n database -o jsonpath='{.status.currentPrimary}'

# 특정 시점(Point-in-Time)으로 클러스터 복원 매니페스트 적용
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: narwhal-db-restored
  namespace: database
spec:
  instances: 2
  bootstrap:
    recovery:
      source: narwhal-db
      recoveryTarget:
        targetTime: "2026-02-26 02:00:00"
```

## 주요 장애 복구 런북

### 1. APISIX etcd 데드락 (Empty-Prefix)

`apisix-etcd`는 `emptyDir` 볼륨을 사용하므로 파드 재시작 시 데이터가 증발합니다. 이때 APISIX는 404 에러를 반환하며, `apisix-ingress-controller`가 라우트 동기화를 영원히 실패(Deadlock)하는 현상이 있습니다.

- **증상**: APISIX 게이트웨이 파드 로그에 `unexpected status code 404`가 반복되며, 사용자의 외부 접근이 완전히 단절됨.
- **해결**: Bootstrap Seed 파드를 생성하여 404가 반환되는 경로에 임의의 키를 생성(`PUT`)해야 합니다.
  ```shell
  ADMIN_KEY=$(kubectl -n platform-system get secret apisix-admin-key -o jsonpath='{.data.key}' | base64 -d)
  BASE="http://apisix-admin.platform-system.svc.cluster.local:9180/apisix/admin"
  
  # 임시 컨테이너에서 curl로 Dummy 데이터 주입 (routes, upstreams 등)
  kubectl -n platform-system exec seed-batch -- curl -s -X PUT -H "X-API-KEY: ${ADMIN_KEY}" -H "Content-Type: application/json" -d '{"uri":"/__bootstrap-seed-delete-me__","upstream":{"type":"roundrobin","nodes":{"127.0.0.1:1":1}}}' "${BASE}/routes/bootstrap-seed"
  
  # 이후 인그레스 컨트롤러 재시작
  kubectl -n platform-system rollout restart deployment/apisix-ingress-controller
  ```

### 2. 마스터 노드 장애 및 etcd 쿼럼

3대의 마스터로 구성되어 1대의 장애(`1 fault tolerance`)를 견딜 수 있습니다. 

| 마스터 노드 | 영향 및 복구 |
|---|---|
| `master-2` / `master-3` | 2/3 쿼럼이 유지되므로 클러스터 정상 동작. `vagrant up`으로 VM 복귀 시 자동 참여. |
| `master-1` | `192.168.56.100` VIP가 자동으로 페일오버됨. 단, NFS 볼륨(`nfs-server`)과 Primary dnsmasq가 중단되므로 즉각적인 VM 복구가 필수적임. |

만약 2대 이상이 손실되어 **etcd 쿼럼이 붕괴**된 경우:
```shell
# 1대 남은 마스터에서 etcd 강제 초기화
sudo sed -i '/--initial-cluster=/s/,.*//' /etc/kubernetes/manifests/etcd.yaml
# --force-new-cluster=true 플래그 추가 후 kubelet 재시작
```

### 3. 마스터 노드 메모리 압박 현상

- **증상**: API 서버 파드의 빈번한 SIGKILL(OOM 방지), `Ready`와 `NotReady` 상태를 오가는 Flapping 현상.
- **원인**: 4GB 램에서는 `kube-apiserver` (약 2GB 소모) 및 필수 DaemonSet 들로 인해 메모리가 한계(약 500Mi 여유)에 도달합니다.
- **해결**: 현재는 `MASTER_MEMORY`를 `6144`로 상향하여 해결되었습니다. 비슷한 증상 발생 시 추가 상향이 필요합니다.

### 4. OpenBao (Vault) Sealed 상태 해제

보안 정책상 VM 재부팅 시 OpenBao 인스턴스는 자동으로 언실(Unseal) 되지 않으며, 이로 인해 연동된 앱들이 비밀값을 조회하지 못해 실패하게 됩니다.

```shell
# Sealed 상태 확인
kubectl exec -n storage openbao-0 -- bao status

# 초기화 시 생성된 Secret에서 Unseal Key 추출 후 적용
BAO_UNSEAL_KEY=$(kubectl get secret openbao-init -n storage -o jsonpath='{.data.unseal_keys_b64}' | base64 -d)
kubectl exec -n storage openbao-0 -- bao operator unseal $BAO_UNSEAL_KEY
```

### 5. OIDC 인증 닭과 달걀(Chicken-and-egg) 에러

- **증상**: `jwt[0].issuer.url: Invalid value: URL scheme must be https` 에러와 함께 `kube-apiserver` 파드가 크래시.
- **해결**: Kubernetes v1.35 부터는 OIDC 설정 시 HTTPS가 필수입니다. 반드시 `cert-manager`와 APISIX TLS가 모두 배포된 이후에 `11-4-keycloak-apiserver.sh`를 실행하여 OIDC 플래그를 활성화해야 합니다.
