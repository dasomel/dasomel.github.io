---
title: "NFS Quota Agent"
description: "NFS 기반 Kubernetes PersistentVolume에 파일시스템 수준 Project Quota를 적용하는 에이전트"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "Go", "Storage", "NFS", "XFS", "ext4", "Btrfs", "Quota", "Prometheus"]
order: 8
type: "own"
featured: true
problem: "Kubernetes의 NFS 기반 PersistentVolume은 PVC 용량이 파일시스템의 실제 사용량 제한으로 자동 연결되지 않아 하나의 워크로드가 공유 저장소를 소진할 수 있음"
solution: "NFS 서버 노드에서 PV를 감시하고 파일시스템 Project Quota를 자동 적용해 XFS, ext4, Btrfs 환경에서 실제 저장공간 사용량을 강제"
---

## 프로젝트 소개

**NFS Quota Agent**는 Kubernetes의 NFS PersistentVolume에 정의된 저장공간 용량을 실제 NFS 서버 파일시스템에서도 강제하기 위한 경량 Kubernetes 에이전트입니다.

일반적인 NFS 프로비저너는 PVC/PV 객체에 용량을 기록할 수 있지만, 그 숫자가 NFS 서버의 디렉터리 사용량을 자동으로 제한하는 것은 아닙니다. NFS Quota Agent는 이 **Kubernetes Storage API와 실제 Filesystem 사이의 제어 공백**을 해결합니다.

에이전트는 NFS PersistentVolume을 감시하고, PV의 실제 export/subdirectory와 파일시스템 quota 메커니즘을 연결합니다. 중요한 점은 quota 명령이 NFS client가 아닌 **실제 NFS server의 local filesystem**에서 실행되어야 한다는 것입니다.

## 핵심 동작

<Mermaid chart={`flowchart TB
  PVC["PVC"] --> PV["PersistentVolume"]
  PV --> NFS["NFS CSI / NFS Provisioner"]
  NFS --> EXPORT["NFS export + subdirectory"]
  EXPORT --> AGENT["NFS Quota Agent"]
  AGENT --> QUOTA["Filesystem Project Quota"]
  QUOTA --> LIMIT["실제 저장공간 사용량 제한"]`} />

### PV 감시

에이전트는 `Bound` 상태의 NFS PV를 감시하며 설정된 provisioner를 기준으로 대상 PV를 필터링할 수 있습니다. Native NFS PV뿐 아니라 `nfs.csi.k8s.io` 기반 CSI PV도 처리합니다.

### 경로 매핑

CSI NFS의 `share`와 `subdir`, Native NFS의 `path`를 로컬 NFS export 경로로 변환해 실제 quota 대상 디렉터리를 결정합니다.

### Project ID

PV 이름을 기반으로 안정적인 project ID를 생성하여 여러 PVC가 같은 NFS 서버에서 운영될 때 quota 대상을 구분합니다.

### 상태 추적

PV annotation을 통해 quota가 `pending`, `applied`, `failed` 중 어떤 상태인지 확인할 수 있어 Kubernetes 리소스 조회만으로도 적용 결과를 파악할 수 있습니다.

## 파일시스템 지원

| Filesystem | Mechanism | Mount option | 최소 커널 | 특징 |
|---|---|---|---|---|
| **XFS** | `xfs_quota` / project quota | `prjquota` | 2.6+ | Kubernetes NFS 환경에서 주력 지원 |
| **ext4** | `setquota` + project attribute | `prjquota` | 4.5+ (e2fsprogs 1.43+) | Linux project quota 기반 지원 |
| **Btrfs** | qgroup quota (`btrfs quota enable`) | 불필요 | 3.4+ | 대상 디렉터리가 subvolume이어야 함 — 아니면 에이전트가 에러를 반환 |

따라서 이 프로젝트는 단순한 Kubernetes controller라기보다 **Kubernetes + Linux filesystem 경계에서 동작하는 storage enforcement agent**에 가깝습니다.

> **ext4 보안 한계**: ext4 project quota의 hard limit은 `CAP_SYS_RESOURCE` 권한을 가진 writer(root)에게는 강제되지 않습니다 — 커널의 `ignore_hardlimit()`(`fs/quota/dquot.c`)가 제한을 그냥 무시합니다. `no_root_squash`가 설정된 NFS export에서는 `knfsd`가 client의 자격증명으로 쓰기를 수행하므로, root로 동작하는 워크로드가 ext4 quota를 조용히 우회할 수 있습니다. XFS와 Btrfs는 writer의 권한과 무관하게 제한을 강제합니다. ext4 export에는 (기본값인) `root_squash`를 쓰고 테넌트 워크로드를 non-root로 실행하거나, root 워크로드가 있는 환경에서는 XFS/Btrfs를 우선 고려하세요.

## Kubernetes 배포 모델

에이전트는 일반 Deployment가 아니라 NFS 서버가 위치한 노드에 실행되는 **DaemonSet 모델**을 사용합니다.

<Mermaid chart={`flowchart TB
  subgraph NODE["NFS Server Node"]
    AGENT["nfs-quota-agent DaemonSet"]
    API["Kubernetes API"]
    HOST["hostPath:/data · /dev · /etc/projects · /etc/projid"]
    FS["Local XFS / ext4 / Btrfs"]
    AGENT --> API
    AGENT --> HOST
    HOST --> FS
  end`} />

이 배포 방식은 호스트 파일시스템 접근이 필요하기 때문에 일반적인 cluster-wide controller보다 보안 경계가 큽니다. 따라서 `nodeSelector`, hostPath, hostPID 등 privileged access를 실제 NFS 서버 노드로 좁히는 것이 핵심입니다.

## 운영 기능

프로젝트에는 단순 quota 적용 외에도 실제 운영을 위한 선택 기능이 포함됩니다.

- Prometheus metrics / ServiceMonitor, Grafana 대시보드 ConfigMap
- PrometheusRule 기반 알림
- `events.k8s.io/v1` Kubernetes Events + retry metrics (opt-in, RBAC 확장 동반)
- Audit logging
- Usage history
- Orphan cleanup과 dry-run
- Namespace quota policy (advisory) + `QuotaPolicy` CRD 기반 선언적 enforcement
- Optional Web UI
- 선택적 NetworkPolicy 템플릿
- Air-gapped(offline bundle) 설치와 cosign 서명 검증
- RollingUpdate 기반 DaemonSet 배포
- Helm chart를 통한 환경별 설정

Namespace 정책을 사용할 때는 LimitRange, Namespace annotation, global default와 같은 Kubernetes 정책 모델을 활용해 quota의 기본값과 최대값을 관리할 수 있습니다(이 policy는 advisory 뷰일 뿐 실제 quota 크기에는 영향을 주지 않습니다). 실제로 quota 상한/하한을 강제하려면 아래 `QuotaPolicy` CRD를 사용합니다.

### Helm 설정값 (주요 항목)

| Key | 기본값 | 설명 |
|---|---|---|
| `image.digest` | `""` | 이미지를 digest로 고정 (air-gap 설치용, 설정 시 `tag` 무시) |
| `config.provisionerName` | `nfs.csi.k8s.io` | 필터링할 provisioner |
| `config.processAllNFS` | `false` | provisioner 무관하게 모든 NFS PV 처리 |
| `config.syncInterval` | `30s` | quota 동기화 주기 |
| `webUI.enabled` | `false` | Web UI 대시보드 |
| `cleanup.enabled` / `cleanup.dryRun` | `false` / `true` | 자동 orphan cleanup, 기본은 dry-run |
| `policy.enabled` | `false` | Web UI의 advisory namespace quota policy 뷰 (informational only) |
| `quotaPolicy.enabled` / `quotaPolicy.singleWriter` | `false` / `false` | `QuotaPolicy` CRD 기반 강제 enforcement 활성화, status write-back을 담당할 단일 writer 지정 |
| `events.enabled` | `false` | PV별 quota 결과를 Kubernetes Event로 발행 (RBAC 권한 확장 동반, 멀티테넌트 클러스터에서는 검토 필요) |
| `dashboard.enabled` | `false` | Grafana 대시보드 ConfigMap 배포 |
| `networkPolicy.enabled` | `false` | NetworkPolicy 템플릿 활성화 |
| `nodeSelector` | `nfs-server: "true"` | 비워둘 수 없음 — 비어 있으면 render 단계에서 거부 |
| `updateStrategy.rollingUpdate.maxUnavailable` | `1` | rolling update 시 동시 갱신 노드 수 |

전체 값 목록은 저장소의 `charts/nfs-quota-agent/values.yaml`을 참고하세요.

### QuotaPolicy CRD (선언적 filesystem quota policy)

`QuotaPolicy`(`quota.nfs.io/v1alpha1`, 기본 비활성)는 PVC가 요청한 용량에만 의존하지 않고 filesystem quota 상한/하한을 Kubernetes 객체로 선언하는 강제 계층입니다. `ResourceQuota`/`LimitRange`를 대체하지 않고 그 위에 얹히는 정책입니다.

```yaml
# team-a 네임스페이스의 모든 PVC에 기본 5Gi, enforceMax로 20Gi 하드 캡
apiVersion: quota.nfs.io/v1alpha1
kind: QuotaPolicy
metadata:
  name: team-a-default
  namespace: team-a
spec:
  selector: {}
  priority: 100
  defaultQuota: 5Gi
  maxQuota: 20Gi
  enforceMax: true
```

`selector`는 `pvcName`(가장 구체적, priority 무관하게 우선), `labelSelector`, `storageClassNames`(PV spec에서만 읽음, AND 조건)를 지원하며, `status.conditions`가 `Ready`/`Applied`/`Degraded`/`Drifted`/`LimitRangeConflict`/`StorageClassBinding`을 보고합니다.

### CLI 명령

```bash
nfs-quota-agent run --nfs-base-path=/export --provisioner-name=nfs.csi.k8s.io   # 에이전트 실행 (기본)
nfs-quota-agent status --path=/data                                             # quota/사용량 조회
nfs-quota-agent top --path=/data -n 10 --watch                                  # 사용량 상위 디렉터리
nfs-quota-agent report --path=/data --format=json|yaml|csv                      # 리포트 생성
nfs-quota-agent cleanup --path=/data --kubeconfig=~/.kube/config [--dry-run=false] [--force]
nfs-quota-agent ui --path=/data --addr=:8080                                    # Web UI
```

### Prometheus 메트릭

`:9090/metrics`에서 `nfs_disk_total_bytes`, `nfs_disk_used_bytes`, `nfs_disk_available_bytes`, 디렉터리별 `nfs_quota_used_bytes`/`nfs_quota_limit_bytes`/`nfs_quota_used_percent`, 요약 지표 `nfs_quota_directories_total`, `nfs_quota_warning_count`, `nfs_quota_exceeded_count`를 노출합니다.

## 보안과 운영상의 핵심 경계

NFS Quota Agent는 실제 파일시스템을 변경하므로 잘못된 경로 매핑이나 quota 명령은 데이터 접근성에 직접 영향을 줄 수 있습니다. 따라서 운영 시 다음을 중요하게 봅니다.

1. NFS 서버 노드만 대상으로 배치
2. hostPath 범위를 실제 export로 제한
3. 자동 cleanup은 기본적으로 disabled / dry-run 우선
4. quota 상태를 PV annotation과 metric으로 관찰
5. Helm upgrade 시 DaemonSet 전환 여부와 host access 변경을 검토

## 시작하기

```bash
git clone https://github.com/dasomel/nfs-quota-agent.git
cd nfs-quota-agent
make build
```

Kubernetes 환경에서는 Helm chart를 사용합니다.

```bash
kubectl label node <nfs-server-node> nfs-server=true

helm install nfs-quota-agent ./charts/nfs-quota-agent \
  --namespace nfs-quota-agent \
  --create-namespace
```

모든 태그 릴리스는 외부 네트워크 접근이 전혀 없는 클러스터를 위한 `nfs-quota-agent-<version>-offline.tar.gz`(멀티아치 이미지 OCI 아카이브 + Helm chart + `hack/verify-release.py` + compatibility matrix)도 함께 배포하며, 매니페스트와 번들 모두 cosign으로 서명됩니다.

## 현재 상태

최신 릴리스는 **v0.5.0**(2026-09-22)이며, 프로젝트는 **Beta** 상태입니다. XFS/ext4/Btrfs quota enforcement 핵심 기능은 완성되어 실제 커널 위에서 CI로 검증되고 릴리스는 서명·재현 가능하지만, `QuotaPolicy` CRD는 아직 `v1alpha1`이라 v1.0 이전에 호환성 없이 바뀔 수 있습니다 — 운영 환경에서는 차트 버전을 고정하세요.

- **v0.5.0**: Grafana 대시보드 ConfigMap과 메트릭 이름 lint, `events.k8s.io/v1` Events + retry metrics(`events.enabled`), 선택적 NetworkPolicy 템플릿, ext4 repquota 프로젝트 선택자 읽기/검증 수정과 ext4·btrfs 실커널 quota enforcement E2E 매트릭스, OpenSSF Scorecard 워크플로 및 이미지 Trivy 스캔 추가.
- **v0.4.0~v0.4.3**: 릴리스 서명 파이프라인 안정화에 집중 — v0.4.0은 Helm chart OCI 서명 단계에서 cosign이 GHCR에 로그인하지 못해 partial release로 남았고(컨테이너 이미지·바이너리·SBOM은 정상 배포, 서명·release-manifest.json·offline bundle은 누락), v0.4.1~v0.4.3에서 로그인 수정과 egress-block 모드를 안정화해 완전한 릴리스로 마무리했습니다.

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [에이전트 개요](/oss/nfs-quota-agent/overview) | 문제 정의와 filesystem enforcement 모델 |
| Architecture | [스토리지 아키텍처](/oss/nfs-quota-agent/architecture) | PV → 경로 매핑 → quota 실행 구조 |
| Feature Guide | [기능 가이드](/oss/nfs-quota-agent/feature-guide) | filesystem, policy, metrics 기능 |
| Getting Started | [설치 및 설정](/oss/nfs-quota-agent/getting-started) | Helm 및 환경 준비 |
| Features | [기능 상세](/oss/nfs-quota-agent/features) | UI, history, policy 등 확장 기능 |
| Operations | [운영 가이드](/oss/nfs-quota-agent/operations) | 모니터링, cleanup, 장애 대응 |
| Web UI | [웹 UI](/oss/nfs-quota-agent/web-ui) | 저장공간 상태와 운영 화면 |

## 프로젝트 관계

<Mermaid chart={`flowchart TB
  READY["kube-ready-box / Linux Filesystem"] --> SERVER["NFS Server"]
  SERVER --> AGENT["nfs-quota-agent"]
  AGENT --> PV["Kubernetes PV / PVC"]
  PV --> NARWHAL["Narwhal"]`} />

Narwhal에서는 NFS CSI 기반 스토리지와 함께 사용할 수 있으며, Kube-Ready-Box의 XFS Project Quota 튜닝과도 직접 연결되는 **스토리지 enforcement 계층**입니다.

## 검증 범위와 파일시스템 전제

XFS, ext4, Btrfs의 핵심 quota 적용 경로는 실제 Linux 커널을 사용하는 CI 시나리오에서 검증되고, 일반적인 기능 회귀는 Go 단위 테스트와 air-gapped E2E 테스트로 확인합니다. 다만 단위 테스트는 외부 quota 명령을 stub 처리하므로 실제 호스트 커널의 quota 강제를 대신 증명하지 않습니다.

파일시스템별 운영 전제도 다릅니다.

| 파일시스템 | 적용 방식 | 운영 전제 및 주의점 |
|---|---|---|
| XFS | project quota와 `xfs_quota` | `pquota`/`prjquota`로 마운트된 export 필요 |
| ext4 | project quota와 `setquota` | `project,quota` 기능 및 `prjquota` 필요; 일부 최소 커널에서는 `quota_tree`와 `quota_v2` 모듈이 추가로 필요 |
| Btrfs | qgroup quota와 `btrfs` | `btrfs quota enable`이 선행되어야 하며 quota 대상은 subvolume이어야 함 |

XFS와 ext4는 `setquota`/`xfs_quota`의 KB 단위 한계 때문에 요청 바이트를 1KiB 단위로 내림하여 실제 hard limit을 설정합니다. 따라서 PV 용량과 디스크 보고값을 비교할 때는 이 filesystem semantics를 반영해야 합니다. 또한 ext4는 `CAP_SYS_RESOURCE`를 가진 root writer가 hard limit을 우회할 수 있으므로, NFS export에서는 기본값인 `root_squash`와 비root workload 사용을 권장합니다.

## 운영 전 체크리스트

1. NFS export가 실제로 quota를 지원하는 XFS, ext4, Btrfs 파일시스템 위에 있는지 확인합니다.
2. `nfs-server=true` 라벨이 붙은 NFS 서버 노드에만 DaemonSet이 배치되는지 확인합니다.
3. 컨테이너의 hostPath가 export, `/dev`, `/etc/projects`, `/etc/projid` 등 필요한 범위로 제한되어 있는지 검토합니다.
4. Btrfs는 각 PV 경로가 subvolume인지, ext4는 커널 quota 모듈과 `root_squash` 설정이 준비됐는지 확인합니다.
5. 처음에는 cleanup을 비활성화하거나 `dryRun=true`로 운영하고, metrics와 audit log를 먼저 관찰합니다.
