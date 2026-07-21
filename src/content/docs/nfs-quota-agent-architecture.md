---
title: "에이전트 아키텍처"
description: "NFS Quota Agent의 내부 구조, 쿼터 적용 메커니즘 및 배포 형태에 대한 상세 아키텍처"
project: "NFS Quota Agent"
order: 401
lastModified: 2026-07-17
---

## 아키텍처 개요

NFS Quota Agent는 Kubernetes 내 NFS 기반 PersistentVolume(PV)의 파일시스템(XFS, ext4) 프로젝트 쿼터(prjquota)를 자동으로 관리하는 데몬입니다. 이 에이전트는 Kubernetes API를 감시(Watch)하며, 프로비저닝된 PV 용량에 맞춰 로컬 파일시스템의 쿼터 설정을 적용합니다. (Narwhal IDP 클러스터의 스토리지 설정은 [스토리지 관련 문서](/ko/docs/narwhal-storage)에서 확인할 수 있습니다.)

## 동작 메커니즘 (Reconcile Loop)

다음은 PV 이벤트를 감지하고 파일시스템 쿼터를 적용하는 전체 Reconcile Loop의 흐름도입니다.

<Mermaid chart={`flowchart TB
  subgraph K8S["Kubernetes API"]
    WATCH["PV 감시 (Watch Bound PVs)"]
  end
  
  subgraph AGENT["Reconcile Loop"]
    MATCH["NFS 경로 매칭<br/>(Base Path 확인)"]
    POL["쿼터 정책 결정<br/>(LimitRange / Annotation)"]
    APP["XFS/ext4 쿼터 적용<br/>(prjquota 설정)"]
    ORP["고아 디렉토리 감지<br/>(PV 매칭 없는 디렉토리)"]
    AUD["감사 로그 기록<br/>(Audit Log)"]
  end

  WATCH --> MATCH
  MATCH --> POL
  POL --> APP
  APP --> ORP
  ORP --> AUD

  style WATCH fill:#f0fdf4,stroke:#059669,color:#111
  style MATCH fill:#f0fdf4,stroke:#059669,color:#111
  style POL fill:#f0fdf4,stroke:#059669,color:#111
  style APP fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style ORP fill:#f9fafb,stroke:#d1d5db,color:#111
  style AUD fill:#f9fafb,stroke:#d1d5db,color:#111
  style K8S fill:#fff,stroke:#9ca3af,color:#111
  style AGENT fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

1. **파일시스템 감지**: 시작 시 에이전트가 XFS 또는 ext4 파일시스템을 자동으로 식별합니다.
2. **PV 감시 (Watcher)**: `client-go v0.29.0`을 사용하여 NFS PV 중 `Bound` 상태인 항목을 감시합니다.
   - 네이티브 NFS(`pv.Spec.NFS`) 및 CSI NFS(`nfs.csi.k8s.io`) PV 모두 감지합니다.
   - `--provisioner-name`으로 특정 프로비저너의 PV만 필터링하거나, `--process-all-nfs` 플래그로 모든 NFS PV를 대상으로 할 수 있습니다.
3. **경로 매핑**: NFS 서버의 노출(Export) 경로를 컨테이너 내 로컬 마운트 경로로 변환합니다.
4. **프로젝트 ID 생성**: FNV 해시를 사용해 PV 이름으로부터 고유한 프로젝트 ID를 부여합니다.
5. **쿼터 적용 (Quota Manager)**:
   - **XFS**: `xfs_quota` 명령어를 통해 프로젝트를 초기화하고 블록 용량 제한(bhard)을 설정합니다.
   - **ext4**: `chattr`로 프로젝트 속성을 설정한 뒤, `setquota` 명령어를 사용해 용량을 제한합니다.
   - 구성 시 `/etc/projects`, `/etc/projid` 파일을 매핑하여 관리합니다.
6. **상태 보고**: 처리된 PV의 상태(`pending`, `applied`, `failed`)를 `nfs.io/quota-status` 어노테이션으로 기록합니다.

## 모듈 및 패키지 구조

에이전트는 Go 1.25 환경에서 컴파일되며, 관심사의 분리를 위해 `internal` 하위에 모듈을 나누어 구성했습니다.

- `cmd/nfs-quota-agent/`: CLI 진입점. 플래그 파싱 및 하위 명령어(`run`, `status`, `top`, `report`, `cleanup`, `ui`, `audit`, `completion`, `version`) 라우팅을 담당합니다.
- `internal/agent/`: 핵심 에이전트 로직. `QuotaAgent` 구조체, PV 감시(`watch.go`), 쿼터 동기화 루프 및 고아(Orphan) 감지 로직을 포함합니다.
- `internal/quota/`: 파일시스템 쿼터 명령어 구현. OS 의존적인 명령어(XFS: `xfs.go`, ext4: `ext4.go`) 및 프로젝트 ID 관리(`project.go`)를 캡슐화합니다.
- `internal/policy/`: Kubernetes LimitRange, Namespace 리소스를 분석해 스토리지 쿼터 정책 우선순위를 적용합니다.
- `internal/audit/`: 모든 쿼터의 `CREATE`, `UPDATE`, `DELETE`, `CLEANUP` 액션을 로깅하는 역할을 담당합니다.
- `internal/history/`: 디스크 사용량에 대한 스냅샷을 주기적으로 저장하여 트렌드를 기록합니다 (`store.go`).
- `internal/metrics/`: Prometheus 호환 메트릭(예: `nfs_quota_used_bytes`) 수집 및 `:9090/metrics` 노출을 구현합니다.
- `internal/status/`, `internal/cleanup/`, `internal/ui/`, `internal/completion/`, `internal/util/`: 상태 출력, CLI 정리 유틸리티, 내장 웹 대시보드 서버, 셸 자동완성 스크립트 생성 등 기타 보조 기능을 수행합니다.

## 배포 아키텍처 (Helm Chart)

에이전트가 로컬 파일시스템 명령어(`xfs_quota`, `setquota`)를 실행해야 하므로, **반드시 NFS 서버가 실행 중인 노드**에 배포되어야 합니다.

- **노드 선택**: `nodeSelector: nfs-server: "true"`를 통해 NFS 서버 노드에만 스케줄링되도록 구성합니다.
- **권한 및 볼륨**:
  - PID 네임스페이스 접근(`hostPID: true`)이 요구됩니다.
  - 컨테이너는 NFS 익스포트 디렉토리(`hostPath`)와 블록 디바이스 접근을 위한 `/dev`, 그리고 쿼터 맵핑 파일인 `/etc/projects`, `/etc/projid` 등을 마운트합니다.
- **프로비저닝 설정 지원**:
  - Helm `values.yaml`에서 `config.provisionerName`에 `nfs.csi.k8s.io` 등을 지정하여 타겟팅할 수 있습니다.
  - `webUI.enabled`, `audit.enabled`, `cleanup.enabled`, `history.enabled`, `policy.enabled` 설정으로 각 모듈별 기능을 제어합니다.
