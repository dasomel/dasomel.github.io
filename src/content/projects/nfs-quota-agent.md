---
title: "NFS Quota Agent"
description: "Kubernetes NFS PV에 XFS·ext4·Btrfs 파일시스템 쿼터를 자동 적용하고 웹 대시보드로 관리하는 에이전트"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "NFS", "Storage", "Quota", "Go", "Web UI", "Helm", "Btrfs"]
order: 2
type: "own"
---

## 프로젝트 소개

**NFS Quota Agent**는 Kubernetes의 NFS 기반 PersistentVolume에 파일시스템 수준의 프로젝트 쿼터를 자동 적용하고, 사용량·정책·감사·고아 디렉터리를 웹 UI로 관리하는 Kubernetes 에이전트입니다.

NFS 환경에서는 PVC의 `requests.storage`가 실제 파일시스템 사용량 제한으로 자동 연결되지 않는 경우가 많습니다. 이 프로젝트는 NFS 서버 노드에서 실제 export 파일시스템을 제어해 그 간극을 메웁니다.

## 최신 소스 점검 · 2026-08-20

최근 소스에서는 **Go 1.26 환경에 맞춘 CI/toolchain 현대화**가 진행됐습니다.

- golangci-lint를 Go 1.26에 맞춰 modernize
- 최신 Go toolchain에서 lint/build가 안정적으로 동작하도록 CI 기준 정리

현재 프로젝트 문서의 Go 1.26 / client-go v0.36.2 baseline과도 일치합니다.

## 현재 상태

- **v0.3.0 계열**
- Go 1.26
- Kubernetes client-go v0.36.2
- XFS / ext4 / **Btrfs** 지원
- Helm Chart
- Multi-arch 이미지
- Web UI 및 KO/EN i18n
- ServiceMonitor / PrometheusRule / PDB 옵션

## 주요 기능

### 쿼터 관리

- Native NFS PV 및 CSI NFS PV 감시
- PV 용량 기반 자동 quota 적용
- XFS project quota
- ext4 project quota
- Btrfs qgroup quota
- `nfs.io/quota-status` 어노테이션 상태 추적

### 웹 UI

| 메뉴 | 기능 |
|---|---|
| **Quotas** | 실시간 사용량, PV/PVC 상태, quota 대비 사용률 |
| **Orphans** | 고아 디렉터리 탐지·Dry-Run·정리 |
| **Trends** | 24시간/7일/30일 사용량 추이 |
| **Policies** | LimitRange/ResourceQuota 및 namespace 정책 |
| **Audit Logs** | CREATE/UPDATE/DELETE/CLEANUP 감사 이력 |

UI는 한국어/영어를 지원하며 quota 상태, 파일시스템 타입, 정리 결과 등을 운영자가 바로 확인할 수 있습니다.

## 지원 파일시스템

| 파일시스템 | 방식 | 요구사항 |
|---|---|---|
| XFS | `xfs_quota` project quota | `prjquota` |
| ext4 | `setquota` + project attribute | `prjquota` |
| Btrfs | qgroup quota | 대상 경로가 subvolume이어야 함 |

Btrfs는 일반 디렉터리를 quota 대상으로 만들지 않고 qgroup 기반으로 동작하므로 대상이 subvolume인지 검증합니다.

## 아키텍처

```text
Kubernetes API
      ↓ Watch
NFS Quota Agent
 ├─ PV/NFS path mapping
 ├─ Policy evaluation
 ├─ Quota Manager
 │   ├─ XFS
 │   ├─ ext4
 │   └─ Btrfs
 ├─ History
 ├─ Audit
 ├─ Metrics
 ├─ Cleanup
 └─ Web UI
      ↓
NFS Server local filesystem
```

에이전트는 실제 파일시스템 quota 명령을 실행해야 하므로 **NFS 서버 노드에서 실행해야 합니다.** Kubernetes NFS client 노드에서 원격 mount만으로 quota를 설정할 수 없습니다.

## 정책 우선순위

정책 기능은 다음 순서로 quota 기준을 결정합니다.

**LimitRange > Namespace Annotation > Global Default**

## Prometheus

`:9090/metrics`에서 quota 및 agent 상태 메트릭을 제공하고, Helm에서는 선택적으로 `ServiceMonitor`와 `PrometheusRule`을 생성할 수 있습니다.

## Helm

```bash
helm install nfs-quota-agent ./charts/nfs-quota-agent \
  --namespace nfs-quota-agent \
  --create-namespace \
  --set config.nfsBasePath=/export \
  --set config.nfsServerPath=/data \
  --set config.provisionerName=nfs.csi.k8s.io \
  --set webUI.enabled=true
```

주요 기능 옵션은 `webUI`, `audit`, `cleanup`, `history`, `policy`, `metrics.serviceMonitor`, `metrics.prometheusRule`, `podDisruptionBudget`입니다.

## 품질과 보안

최근 OSS modernization에서 Go 1.26 및 Kubernetes 라이브러리 업그레이드, hermetic unit test, `govulncheck`, quota command seam 테스트, path/project-name validation, UI XSS 방어 및 HTTP timeout 등을 정비했습니다.

## 기술 문서

| 문서 | 내용 |
|---|---|
| [에이전트 아키텍처](/ko/docs/nfs-quota-agent-architecture) | reconcile loop, 파일시스템별 quota, Helm 배포 |
| [기능 가이드](/ko/docs/nfs-quota-agent-features) | 정책, 감사, 이력, cleanup, metrics |
| [웹 UI](/ko/docs/nfs-quota-agent-web-ui) | dashboard와 API |

## 참고 링크

- **GitHub**: [dasomel/nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
- **Helm Chart**: [nfs-quota-agent Charts](https://dasomel.github.io/nfs-quota-agent)
- **Narwhal 연계**: [Narwhal](/ko/projects/narwhal)
