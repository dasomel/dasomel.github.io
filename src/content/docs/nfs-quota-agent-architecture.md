---
title: "에이전트 아키텍처"
description: "NFS Quota Agent의 reconcile 구조, XFS·ext4·Btrfs quota 메커니즘과 Kubernetes 배포 아키텍처"
project: "NFS Quota Agent"
order: 401
lastModified: 2026-08-19
---

## 아키텍처 개요

NFS Quota Agent는 Kubernetes API에서 NFS PersistentVolume을 감시하고 실제 NFS 서버 파일시스템에 프로젝트 quota를 적용하는 Kubernetes agent입니다.

현재 **XFS, ext4, Btrfs**를 지원하며, NFS 서버 노드에서 실행되어야 한다는 제약은 그대로 유지됩니다.

## Reconcile Loop

```text
Kubernetes API
     │ Watch Bound NFS PV
     ▼
PV / NFS Path Mapping
     ▼
Quota Policy Evaluation
     │  LimitRange > Namespace Annotation > Global Default
     ▼
Filesystem Quota Manager
 ┌────────┬────────┬────────┐
 │  XFS   │  ext4  │ Btrfs  │
 │xfs_quota│setquota│ qgroup │
 └────────┴────────┴────────┘
     ▼
PV annotation / metrics / history
     ├─ audit
     ├─ orphan cleanup
     └─ Web UI
```

## 파일시스템별 동작

### XFS

`xfs_quota`와 project ID를 사용합니다. `/etc/projects`, `/etc/projid` 매핑을 통해 PV와 디렉터리를 연결합니다.

### ext4

project attribute를 설정한 뒤 `setquota`로 quota를 적용합니다.

### Btrfs

Btrfs qgroup quota를 사용합니다. `btrfs quota enable`이 필요하며 quota 대상은 **subvolume**이어야 합니다. 일반 디렉터리는 quota 대상으로 취급하지 않습니다.

## 주요 모듈

- `internal/agent`: PV watcher와 reconcile
- `internal/quota`: XFS/ext4/Btrfs command adapter
- `internal/policy`: Kubernetes quota 정책
- `internal/audit`: quota 변경 감사 로그
- `internal/history`: 사용량 snapshot
- `internal/metrics`: Prometheus metric
- `internal/cleanup`: orphan 탐지·정리
- `internal/ui`: 웹 dashboard

프로젝트는 Go 1.26과 Kubernetes client-go v0.36.2 계열로 현대화됐으며 테스트에서는 실제 filesystem command를 호출하지 않도록 `CommandRunner` seam을 사용합니다.

## Kubernetes 배포

quota command는 로컬 파일시스템에만 적용되므로 agent는 NFS server node에 배치합니다.

- `nodeSelector: nfs-server=true`
- `hostPID: true`
- NFS export `hostPath`
- `/dev`
- `/etc/projects`
- `/etc/projid`

Helm에서는 다음 기능을 선택적으로 활성화할 수 있습니다.

- Web UI
- Audit
- History
- Orphan Cleanup
- Namespace Policy
- Prometheus ServiceMonitor
- PrometheusRule
- PodDisruptionBudget

## Observability

`:9090/metrics`에서 quota 사용량과 agent 상태를 노출하며, chart의 `metrics.serviceMonitor`와 `metrics.prometheusRule` 옵션으로 Prometheus Operator 환경에 직접 연결할 수 있습니다.

## 품질 기준

현재 OSS modernization에서 hermetic unit test와 `-race`, `govulncheck`, quota command 입력 검증, UI 보안 hardening을 추가했습니다. 따라서 아키텍처 문서는 단순 컴포넌트 설명뿐 아니라 **실제 운영 시 filesystem 권한과 command execution 경계를 명확하게 보여주는 것**을 목표로 합니다.
