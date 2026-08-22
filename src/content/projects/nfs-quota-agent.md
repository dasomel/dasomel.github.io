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

```text
PVC
 ↓
PersistentVolume
 ↓
NFS CSI / NFS Provisioner
 ↓
NFS export + subdirectory
 ↓
NFS Quota Agent
 ↓
Filesystem Project Quota
 ↓
실제 저장공간 사용량 제한
```

### PV 감시

에이전트는 `Bound` 상태의 NFS PV를 감시하며 설정된 provisioner를 기준으로 대상 PV를 필터링할 수 있습니다. Native NFS PV뿐 아니라 `nfs.csi.k8s.io` 기반 CSI PV도 처리합니다.

### 경로 매핑

CSI NFS의 `share`와 `subdir`, Native NFS의 `path`를 로컬 NFS export 경로로 변환해 실제 quota 대상 디렉터리를 결정합니다.

### Project ID

PV 이름을 기반으로 안정적인 project ID를 생성하여 여러 PVC가 같은 NFS 서버에서 운영될 때 quota 대상을 구분합니다.

### 상태 추적

PV annotation을 통해 quota가 `pending`, `applied`, `failed` 중 어떤 상태인지 확인할 수 있어 Kubernetes 리소스 조회만으로도 적용 결과를 파악할 수 있습니다.

## 파일시스템 지원

| Filesystem | Mechanism | 특징 |
|---|---|---|
| **XFS** | `xfs_quota` / project quota | Kubernetes NFS 환경에서 주력 지원 |
| **ext4** | `setquota` + project attribute | Linux project quota 기반 지원 |
| **Btrfs** | qgroup quota | 대상이 subvolume이어야 함 |

따라서 이 프로젝트는 단순한 Kubernetes controller라기보다 **Kubernetes + Linux filesystem 경계에서 동작하는 storage enforcement agent**에 가깝습니다.

## Kubernetes 배포 모델

에이전트는 일반 Deployment가 아니라 NFS 서버가 위치한 노드에 실행되는 **DaemonSet 모델**을 사용합니다.

```text
Kubernetes Node
┌─────────────────────────────────────┐
│ NFS Server Node                     │
│                                     │
│  nfs-quota-agent                    │
│       │                             │
│       ├── Kubernetes API            │
│       ├── hostPath:/data            │
│       ├── /dev                       │
│       └── /etc/projects / /etc/projid│
│               │                     │
│               ▼                     │
│        Local XFS/ext4/Btrfs         │
└─────────────────────────────────────┘
```

이 배포 방식은 호스트 파일시스템 접근이 필요하기 때문에 일반적인 cluster-wide controller보다 보안 경계가 큽니다. 따라서 `nodeSelector`, hostPath, hostPID 등 privileged access를 실제 NFS 서버 노드로 좁히는 것이 핵심입니다.

## 운영 기능

프로젝트에는 단순 quota 적용 외에도 실제 운영을 위한 선택 기능이 포함됩니다.

- Prometheus metrics / ServiceMonitor
- PrometheusRule 기반 알림
- Audit logging
- Usage history
- Orphan cleanup과 dry-run
- Namespace quota policy
- Optional Web UI
- RollingUpdate 기반 DaemonSet 배포
- Helm chart를 통한 환경별 설정

Namespace 정책을 사용할 때는 LimitRange, Namespace annotation, global default와 같은 Kubernetes 정책 모델을 활용해 quota의 기본값과 최대값을 관리할 수 있습니다.

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

```text
kube-ready-box / Linux Filesystem
              ↓
         NFS Server
              ↓
      nfs-quota-agent
              ↓
      Kubernetes PV/PVC
              ↓
           Narwhal
```

Narwhal에서는 NFS CSI 기반 스토리지와 함께 사용할 수 있으며, Kube-Ready-Box의 XFS Project Quota 튜닝과도 직접 연결되는 **스토리지 enforcement 계층**입니다.
