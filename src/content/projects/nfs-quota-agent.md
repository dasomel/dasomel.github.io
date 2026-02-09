---
title: "NFS Quota Agent"
description: "Kubernetes NFS PV에 파일시스템 쿼터를 자동 적용하고 웹 대시보드로 모니터링하는 에이전트"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "NFS", "Storage", "Quota", "Go", "Web UI", "Helm"]
order: 2
type: "own"
---

## 프로젝트 소개

NFS Quota Agent는 **Kubernetes의 NFS 기반 PersistentVolume에 파일시스템 수준의 쿼터를 자동으로 적용하고, 웹 대시보드를 통해 모니터링하는 에이전트**입니다.

Kubernetes에서 NFS 스토리지를 사용할 때 PVC의 용량 요청은 실제로 파일시스템에 제한이 적용되지 않습니다. 이 에이전트는 NFS 서버 노드에서 실행되며, PV 용량에 맞춰 XFS/ext4 프로젝트 쿼터를 자동으로 설정하고, 사용량 추이, 고아 디렉토리 정리, 감사 로그까지 통합 관리합니다.

## 주요 기능

### 자동 쿼터 관리
- **PV 감시**: Kubernetes NFS PersistentVolume을 자동으로 감지 (네이티브 NFS + CSI NFS)
- **쿼터 자동 적용**: PV 용량에 맞춰 XFS/ext4 프로젝트 쿼터 설정
- **상태 추적**: PV 어노테이션을 통한 쿼터 적용 상태 모니터링

### 웹 UI 대시보드
5개 탭으로 구성된 통합 모니터링 대시보드:

![Quotas 대시보드](/images/nfs-quota-agent/01-dashboard-quotas.png)

| 탭 | 기능 |
|----|------|
| **Quotas** | 실시간 디스크 사용량, PV/PVC 바인딩 상태, 프로그레스 바 |
| **Orphans** | 고아 디렉토리 감지 및 정리 (유예기간, Dry-Run/Live 모드) |
| **Trends** | 24시간/7일/30일 사용량 추이, 증감 트렌드 분석 |
| **Policies** | 네임스페이스별 LimitRange/ResourceQuota 정책 및 위반 표시 |
| **Audit Logs** | CREATE/UPDATE/DELETE/CLEANUP 전체 작업 이력 |

#### Orphans - 고아 디렉토리 관리

![Orphans 탭](/images/nfs-quota-agent/02-orphans.png)

PV가 삭제된 후 NFS에 남아있는 디렉토리를 감지하고, 유예기간 후 안전하게 정리합니다.

#### Trends - 사용량 추이 분석

![Trends 탭](/images/nfs-quota-agent/03-trends.png)

24시간/7일/30일 단위로 사용량 변화를 추적하여 용량 계획에 활용합니다.

#### Policies - 네임스페이스 정책

![Policies 탭](/images/nfs-quota-agent/04-policies.png)

LimitRange, ResourceQuota 기반의 네임스페이스별 스토리지 정책과 위반 현황을 표시합니다.

#### Audit Logs - 감사 로그

![Audit Logs 탭](/images/nfs-quota-agent/05-audit-logs.png)

모든 쿼터 CREATE/UPDATE/DELETE/CLEANUP 작업의 이력을 기록하고 필터링할 수 있습니다.

### 다양한 프로비저너 지원
- **csi-driver-nfs**: CSI 기반 NFS 드라이버 (권장)
- **nfs-subdir-external-provisioner**: NFS Subdir External Provisioner
- **범용 모드**: `--process-all-nfs`로 모든 NFS PV 처리

### 파일시스템 지원

| 파일시스템 | 쿼터 도구 | 마운트 옵션 | 최소 커널 |
|-----------|----------|------------|----------|
| XFS | `xfs_quota` | `prjquota` | 2.6+ |
| ext4 | `setquota` | `prjquota` | 4.5+ |

## 아키텍처

```
┌─────────────────┐     ┌─────────────────────────────────────────────────┐
│   Kubernetes    │     │              NFS Server Node                    │
│    API Server   │     │  ┌─────────────────────────────────────────────┐│
│                 │     │  │           nfs-quota-agent                   ││
│  ┌───────────┐  │     │  │  ┌───────────┐    ┌─────────────────────┐  ││
│  │    PV     │◄─┼─────┼──┼──│  Watcher  │    │  Quota Manager      │  ││
│  │ (NFS type)│  │     │  │  └───────────┘    │  (XFS / ext4)       │  ││
│  └───────────┘  │     │  │         │         └─────────────────────┘  ││
│                 │     │  │         ▼                    │             ││
└─────────────────┘     │  │  ┌───────────────────────────────────────┐ ││
                        │  │  │  Web UI · Metrics · Audit · History  │ ││
                        │  │  └───────────────────────────────────────┘ ││
                        │  └─────────────────────────────────────────────┘│
                        │                      │                          │
                        │                      ▼                          │
                        │  ┌──────────────────────────────────────────┐   │
                        │  │      XFS/ext4 Filesystem (/data)         │   │
                        │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
                        │  │  │ ns-pvc-1 │ │ ns-pvc-2 │ │ ns-pvc-3 │  │   │
                        │  │  │ quota:1G │ │ quota:5G │ │quota:10G │  │   │
                        │  │  └──────────┘ └──────────┘ └──────────┘  │   │
                        │  └──────────────────────────────────────────┘   │
                        └─────────────────────────────────────────────────┘
```

## CLI 서브커맨드

```bash
# 쿼터 적용 에이전트 실행 (기본)
nfs-quota-agent run --nfs-base-path=/export --provisioner-name=nfs.csi.k8s.io

# 쿼터 상태 및 디스크 사용량 확인
nfs-quota-agent status --path=/data

# 사용량 상위 디렉토리 조회 (watch 모드 지원)
nfs-quota-agent top --path=/data -n 10 --watch

# 리포트 생성 (json, yaml, csv)
nfs-quota-agent report --path=/data --format=json --output=report.json

# 고아 쿼터 정리 (기본 dry-run)
nfs-quota-agent cleanup --path=/data --dry-run=false

# 웹 UI 대시보드
nfs-quota-agent ui --path=/data --addr=:8080

# 감사 로그 조회
nfs-quota-agent audit --file=/var/log/nfs-quota-agent/audit.log --action=CREATE
```

## Helm Chart 설치

```bash
helm repo add nfs-quota-agent https://dasomel.github.io/nfs-quota-agent
helm install nfs-quota-agent nfs-quota-agent/nfs-quota-agent \
  --namespace nfs-quota-agent \
  --create-namespace \
  --set config.nfsBasePath=/export \
  --set config.nfsServerPath=/data \
  --set config.provisionerName=nfs.csi.k8s.io \
  --set webUI.enabled=true \
  --set audit.enabled=true
```

### 주요 설정 값

| 키 | 기본값 | 설명 |
|----|--------|------|
| `config.provisionerName` | `nfs.csi.k8s.io` | 필터링할 프로비저너 |
| `config.syncInterval` | `30s` | 동기화 주기 |
| `webUI.enabled` | `false` | 웹 UI 활성화 |
| `audit.enabled` | `false` | 감사 로깅 활성화 |
| `cleanup.enabled` | `false` | 자동 고아 정리 활성화 |
| `cleanup.gracePeriod` | `24h` | 삭제 전 유예기간 |
| `history.enabled` | `false` | 사용량 히스토리 활성화 |
| `policy.enabled` | `false` | 네임스페이스 정책 활성화 |

## 네임스페이스 쿼터 정책

정책은 우선순위에 따라 세 가지 소스에서 결정됩니다:

**LimitRange > Namespace Annotation > Global Default**

```yaml
# LimitRange로 PVC 크기 제한
apiVersion: v1
kind: LimitRange
metadata:
  name: storage-limits
  namespace: team-a
spec:
  limits:
  - type: PersistentVolumeClaim
    max:
      storage: 50Gi
    min:
      storage: 1Gi
    default:
      storage: 5Gi
```

## Prometheus 메트릭

`:9090/metrics` 엔드포인트에서 메트릭을 제공합니다:

```
nfs_disk_total_bytes{path="/data"} 1099511627776
nfs_disk_used_bytes{path="/data"} 698488954880
nfs_quota_used_bytes{directory="prod-data"} 10523566080
nfs_quota_limit_bytes{directory="prod-data"} 10737418240
nfs_quota_directories_total 45
nfs_quota_warning_count 3
nfs_quota_exceeded_count 1
```

## 핵심 제약사항

**NFS 서버 노드에서 실행 필수**: `xfs_quota`, `setquota` 등의 쿼터 명령어는 로컬 파일시스템에서만 작동하므로, 에이전트는 반드시 NFS 서버 노드에서 실행되어야 합니다.

외부 NFS 서버의 경우 바이너리 직접 실행, Docker 컨테이너, 또는 NFS 서버를 클러스터 노드로 추가하는 방법을 지원합니다.

## 기술 스택

- **언어**: Go 1.24
- **Kubernetes**: client-go v0.29 (PV/PVC/Namespace 감시)
- **파일시스템**: XFS, ext4 프로젝트 쿼터
- **배포**: Helm Chart, Multi-arch 컨테이너 이미지 (amd64, arm64, armv7)
- **보안**: Trivy 취약점 스캔, SBOM 생성, Provenance 증명
- **CI/CD**: GitHub Actions (빌드, 테스트, 릴리스 자동화)

## 사용 사례

### 멀티 테넌시 환경
여러 팀이 공유하는 NFS 스토리지에서 각 팀의 사용량을 격리하고, 네임스페이스 정책으로 제한

### 온프레미스 Kubernetes
클라우드 스토리지가 아닌 온프레미스 NFS 환경에서 쿼터 관리 자동화 및 웹 UI 모니터링

### 운영 감사 및 용량 계획
감사 로그로 모든 쿼터 변경 이력을 추적하고, 사용량 추이로 용량 확장 시점을 예측

## 참고 링크

- **GitHub**: [dasomel/nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
- **Helm Chart**: [nfs-quota-agent Charts](https://dasomel.github.io/nfs-quota-agent)
- **기능 가이드**: [Feature Guide (docs)](https://github.com/dasomel/nfs-quota-agent/tree/main/docs)
