---
title: "스토리지 & 데이터베이스"
description: "Narwhal 클러스터의 영구 스토리지 및 데이터베이스 인프라 구성"
project: "Narwhal"
order: 106
lastModified: 2026-07-17
---

Narwhal 프로젝트는 안정적인 데이터 관리를 위해 블록 스토리지, 오브젝트 스토리지(S3), 그리고 고가용성(HA) 관계형 데이터베이스로 구성된 계층화된 스토리지 아키텍처를 제공합니다.

## 스토리지 아키텍처 (Storage)

다음은 클러스터의 기본 블록 스토리지부터 S3 오브젝트 스토리지까지 전체 스토리지 계층 구조를 나타냅니다.

<Mermaid chart={`flowchart TB
  PVC["PersistentVolumeClaim<br/>(Pod Storage Request)"]
  CSI["csi-driver-nfs<br/>(StorageClass: nfs-csi)"]
  
  subgraph MASTER1["master-1 Node"]
    NFS["NFS Server<br/>(/srv/nfs/k8s)"]
    XFS["XFS Filesystem<br/>(prjquota enabled)"]
    NFS --> XFS
  end
  
  QUOTA["nfs-quota-agent<br/>(Enforces Project Quotas)"]
  
  S3["SeaweedFS<br/>(S3-compatible Object Store)"]
  
  PVC -->|"Dynamic Provisioning"| CSI
  CSI -->|"Mounts"| NFS
  QUOTA -.->|"Monitors PVs & Applies Limits"| XFS
  
  PVC -.->|"Alternative: S3 API"| S3

  style XFS fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style S3 fill:#f0fdf4,stroke:#059669,color:#111
  style NFS fill:#f0fdf4,stroke:#059669,color:#111
  style CSI fill:#f9fafb,stroke:#d1d5db,color:#111
  style QUOTA fill:#f9fafb,stroke:#d1d5db,color:#111
  style PVC fill:#fff,stroke:#9ca3af,color:#111
  style MASTER1 fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

### 1. NFS 블록 스토리지 (기반 스토리지)

클러스터의 모든 데이터는 `narwhal-master-1` 노드의 NFS 서버(`/srv/nfs/k8s`)를 기반으로 저장됩니다.

- **StorageClass**: `nfs-csi` (기본 스토리지 클래스로 설정)
- **CSI 드라이버**: `csi-driver-nfs` (v4.13.2)
- **파일시스템**: XFS 기반 `prjquota`(프로젝트 쿼터)를 활성화하여 용량 제한을 강제합니다.

### 2. 스토리지 용량 제어 (nfs-quota-agent)

Kubernetes 네이티브 NFS는 PVC의 요청 용량(`resources.requests.storage`)을 실제로 물리적 디스크에 강제하지 못하는 한계가 있습니다. 이를 해결하기 위해 자체 개발한 **[NFS Quota Agent](/ko/projects/nfs-quota-agent)** (v0.2.1)가 내장되어 있습니다.

- **용량 강제 할당**: PV 생성을 감지하고 XFS 프로젝트 쿼터를 자동으로 설정하여 PVC 요청 크기만큼만 사용하도록 제한합니다.
- **주요 기능**: 고아(Orphan) 디렉토리 정리, 사용량 추이 수집, 웹 UI 대시보드 통합 모니터링 기능 제공.

### 3. S3 호환 오브젝트 스토리지 (SeaweedFS)

분산 스토리지 시스템인 **SeaweedFS** (v4.34, chart 4.34.0)를 배포하여 클러스터 내부에 S3 API 호환 오브젝트 스토리지를 제공합니다. 모든 데이터는 `nfs-csi` 위에 저장됩니다.

- **용량 할당**: Master 1Gi, Filer 5Gi, Volume 50Gi
- **접근 엔드포인트**: `http://seaweedfs-s3.storage.svc.cluster.local:8333` (자격증명: admin/admin)
- **활용처**:
  - **Velero**: 전체 클러스터 백업 및 복원 저장소 (`velero` 버킷)
  - **Loki**: 로그 청크 및 인덱스 저장소 (`loki` 버킷)
  - **Tempo**: 분산 트레이싱 데이터 저장소 (`tempo` 버킷)
  - **PostgreSQL**: 데이터베이스 WAL 아카이빙 및 전체 백업 저장소

## 데이터베이스 계층 (CloudNativePG)

개별 애플리케이션마다 자체 데이터베이스를 프로비저닝하는 대신, **CloudNative-PG** (v1.29.1) 오퍼레이터를 활용하여 하나의 통합된 **PostgreSQL 18.3 HA 클러스터**를 운영합니다. 이를 통해 리소스 효율성을 높이고 관리 편의성을 극대화했습니다.

### 클러스터 구성 (`narwhal-db`)

| 항목 | 상세 설정 |
|---|---|
| **네임스페이스** | `database` |
| **인스턴스 수** | 2개 (1 Primary + 1 Replica) |
| **용량 할당** | 인스턴스당 20Gi (총 40Gi, `nfs-csi` 기반) |
| **자동 장애 조치** | Primary 장애 시 Replica가 자동으로 승격(Failover) |
| **커넥션 풀링** | **PgBouncer** (Transaction 모드, 최대 1000 커넥션 풀링) |

### 통합 데이터베이스 목록

| 데이터베이스 | Owner | 접속 대상 플랫폼 |
|---|---|---|
| `keycloak` | `keycloak` | Keycloak (IAM/SSO) |
| `harbor` | `harbor` | Harbor (컨테이너 레지스트리) |
| `gitea` | `gitea` | Gitea (Git 서버) |

### 데이터베이스 접속

애플리케이션은 성능 향상과 안전성을 위해 PgBouncer 풀러를 거쳐 접속합니다.

- **풀러 엔드포인트**: `narwhal-db-pooler-rw.database.svc.cluster.local:5432`
- **단축 서비스 명**: 각 애플리케이션 네임스페이스에 `ExternalName` 서비스가 구성되어 있어, `keycloak-db-rw:5432` 같은 짧은 도메인으로도 접속할 수 있습니다.

### 데이터베이스 백업 전략

- **CNPG Barman 백업**: 매일 00:00에 전체 백업 및 지속적인 WAL 아카이빙이 **SeaweedFS S3**로 수행됩니다 (보존 기간: 7일, Point-in-Time Recovery 지원).
- **스냅샷 백업**: 매일 02:00에 Velero가 데이터베이스 PVC 스냅샷을 백업합니다.
