---
title: "기능 가이드"
description: "NFS Quota Agent에서 제공하는 자동 쿼터 관리, 정리, 추이, 정책 및 감사 기능 가이드"
project: "NFS Quota Agent"
order: 402
lastModified: 2026-07-17
---

## 쿼터 모니터링 (Quota)

NFS 익스포트 경로(`--nfs-base-path`) 하위에 쿼터가 적용된 모든 디렉토리의 현재 사용량과 용량 제한 상태를 실시간으로 모니터링합니다.

- **사용량 평가 (상태 뱃지)**: 디렉토리의 현재 용량 사용률에 따라 세 가지 상태를 보여줍니다.
  - **OK** (녹색): 설정 쿼터의 90% 미만 사용
  - **Warning** (노란색): 쿼터의 90% 이상 100% 미만 사용
  - **Exceeded** (빨간색): 쿼터 용량 100% 초과
- **메트릭 모니터링**: Prometheus에 호환되는 상태 메트릭(`nfs_disk_used_bytes`, `nfs_quota_used_percent` 등)을 내보냅니다.

## 고아 디렉토리 정리 (Orphans)

Kubernetes 클러스터에서 PersistentVolume은 삭제되었으나, 실제 파일시스템에는 삭제되지 않고 남아 있는 '고아(Orphaned)' 디렉토리를 식별하고 관리합니다. (이 기능은 `--enable-auto-cleanup` 플래그로 활성화됩니다.)

- **유예 기간 (Grace Period)**: 고아 디렉토리를 발견한 즉시 삭제하지 않고 기본 24시간 동안 유지하여 데이터 유실을 방지합니다.
- **Dry-Run 및 Live 모드**: `--cleanup-dry-run=true` 인 경우 감지만 수행하며, Live 모드(`false`)일 때 실제 삭제를 진행합니다. CLI의 `cleanup` 서브커맨드나 UI에서 직접 실행할 수 있습니다.

## 사용량 추이 (Trends)

주기적으로 쿼터 사용 내역을 스냅샷으로 저장해, 스토리지 사용 패턴 및 증감 추이를 기록합니다. (`--enable-history` 필요)

- 최근 24시간(24H), 7일(7D), 30일(30D) 기간의 사용량 증감을 추적합니다.
- 데이터는 화살표(↑, →, ↓)와 함께 추세로 시각화되어 용량 고갈 시점을 예상하고 스토리지 확장을 계획하는 데 도움을 줍니다.

## 네임스페이스 정책 (Policies)

클러스터 상의 네임스페이스 및 PVC 설정에 따라 우선순위에 맞춰 쿼터 한도를 제한합니다. (`--enable-policy` 필요) 다음은 쿼터 정책이 어떠한 우선순위로 평가되고 결정되는지를 보여주는 흐름도입니다.

<Mermaid chart={`flowchart TB
  START["쿼터 정책 평가 시작"]
  CHK_LR{"LimitRange<br/>객체가 존재하는가?"}
  VAL_LR["LimitRange 정책 적용<br/>(max, min, default)"]
  CHK_NS{"Namespace<br/>Annotation이 존재하는가?"}
  VAL_NS["Annotation 정책 적용<br/>(nfs.io/default-quota 등)"]
  VAL_GLOB["Global Default 적용<br/>(--default-quota 플래그)"]
  END["최종 쿼터 사이즈 결정"]

  START --> CHK_LR
  CHK_LR -->|"Yes"| VAL_LR
  CHK_LR -->|"No"| CHK_NS
  VAL_LR --> END
  CHK_NS -->|"Yes"| VAL_NS
  CHK_NS -->|"No"| VAL_GLOB
  VAL_NS --> END
  VAL_GLOB --> END

  style START fill:#f9fafb,stroke:#d1d5db,color:#111
  style CHK_LR fill:#f0fdf4,stroke:#059669,color:#111
  style CHK_NS fill:#f0fdf4,stroke:#059669,color:#111
  style VAL_LR fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style VAL_NS fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style VAL_GLOB fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style END fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

- **우선순위 결정 원칙**: `LimitRange > Namespace Annotation > Global Default`
  1. 가장 먼저 Kubernetes의 `LimitRange` 객체(`type: PersistentVolumeClaim`)를 스캔하여 최대(max), 최소(min), 기본(default) 용량을 확인합니다.
  2. 다음으로 네임스페이스의 어노테이션(`nfs.io/default-quota`, `nfs.io/max-quota`)을 확인합니다.
  3. 명시된 제한이 없을 경우 에이전트의 `--default-quota` 전역 플래그를 적용합니다.
- 이 규칙을 벗어나는 PVC(예: `max` 초과)를 감지하면 정책 위반(Violation)으로 리포트합니다.

## 감사 로깅 (Audit Logs)

시스템에서 이루어진 모든 쿼터 변경 액션 이력을 보존합니다. (`--enable-audit` 필요)

- 에이전트가 실행하는 `CREATE`, `UPDATE`, `DELETE`, `CLEANUP` 작업들이 기록됩니다.
- 실패 및 성공 내역을 모두 로깅하여 추후 장애 분석과 컴플라이언스 문서화에 활용됩니다. 로그는 기본적으로 `/var/log/nfs-quota-agent/audit.log` 파일로 출력됩니다.
