---
title: "Beluga"
description: "로컬 Kubernetes에서 Kafka·CDC·Flink·Iceberg·Trino·Superset·Airflow를 통합하는 데이터 플랫폼. 통합 control plane(manager/)을 같은 저장소에 포함"
github: "https://github.com/dasomel/beluga"
tags: ["Kubernetes", "k3s", "Data Platform", "Kafka", "Debezium", "Flink", "Iceberg", "Trino", "Airflow", "GitOps", "Control Plane"]
order: 10
type: "own"
featured: true
problem: "모던 데이터 플랫폼의 핵심 컴포넌트는 각각 쉽게 설치할 수 있지만 CDC, streaming, lakehouse, query, BI, orchestration의 경계를 로컬 환경에서 일관되게 연결하고 검증하기가 어려움"
solution: "Vagrant와 k3s 위에 Helm·Argo CD GitOps로 전체 데이터 플랫폼을 재현하고, synthetic clickstream과 PostgreSQL CDC 두 가지 end-to-end 시나리오로 실제 동작을 검증"
---

## 프로젝트 소개

**Beluga**는 개인 개발 환경에서 현대적인 데이터 플랫폼의 전체 흐름을 재현하기 위한 Kubernetes 기반 self-hosted data platform입니다.

핵심은 개별 OSS를 모아 놓는 것이 아니라 다음과 같은 **데이터 lifecycle을 하나의 재현 가능한 환경에서 검증하는 것**입니다.

<Mermaid chart={`flowchart TB
  SRC["Source / PostgreSQL"] -->|"Debezium CDC"| KAFKA["Kafka"]
  KAFKA --> FLINK["Flink"]
  FLINK --> ICEBERG["Iceberg Lakehouse"]
  ICEBERG --> TRINO["Trino"]
  TRINO --> SUPERSET["Superset"]
  AIRFLOW["Airflow orchestration"] -.-> FLINK
  AIRFLOW -.-> TRINO`} />

Beluga는 “프로덕션 규모 데이터 플랫폼”을 표방하지 않습니다. 로컬에서 데이터 플랫폼의 통합 동작, 권한 모델, storage/query 경계와 GitOps 운영 패턴을 실험하기 위한 **개인/학습 스케일 reference platform**입니다.

## 플랫폼 구성

| 영역 | 컴포넌트 | 역할 |
|---|---|---|
| Cluster | k3s + Cilium + MetalLB | 로컬 Kubernetes 실행 기반 |
| Gateway | APISIX + etcd | 플랫폼 UI 및 API entrypoint |
| GitOps | Argo CD | app-of-apps 기반 선언적 배포 |
| Identity | Keycloak + OpenLDAP | 인증 및 그룹 기반 접근 제어 |
| Policy | OPA + OpenFGA | 서비스 정책과 lakehouse 인가 |
| Streaming | Strimzi Kafka + Debezium | Event streaming / CDC |
| Processing | Flink Kubernetes Operator | Statefull stream processing |
| Catalog | Lakekeeper | Iceberg REST catalog |
| Storage | SeaweedFS | S3-compatible object storage |
| Database | CloudNativePG | PostgreSQL source / metadata DB |
| Query | Trino | Iceberg distributed SQL |
| BI | Superset | Interactive analytics / dashboards |
| Orchestration | Airflow 3 | compaction / aggregation DAG |
| Optional Governance | OpenMetadata + OpenSearch | metadata / lineage |
| Observability | Prometheus Stack | platform metrics |

정확한 버전/이미지/라이선스의 단일 원천은 저장소의 [`VERSIONS.md`](https://github.com/dasomel/beluga/blob/main/VERSIONS.md)이다. 주요 핀 예시: Kubernetes v1.36(k3s 채널), Strimzi Kafka Operator 1.1.0(KRaft, Kafka 4.3.0), Debezium 3.6.1.Final, Flink Kubernetes Operator 1.15.0(런타임 Flink 1.20.0), Lakekeeper v0.13.1, Trino 483, Airflow 3.3.0, Superset 6.1.0, Keycloak 26.7.1, CloudNativePG(PostgreSQL 17.6).

## 핵심 설계 포인트

### 1. Kubernetes가 데이터 플랫폼의 공통 운영 경계

각 데이터 컴포넌트가 서로 다른 설치 방법을 사용하지 않도록 Helm과 Operator를 중심으로 Kubernetes 리소스에 맞춥니다. Beluga의 주요 차트는 `beluga-platform`과 `beluga-data`로 계층화되어 있습니다.

### 2. GitOps가 실제 deployment contract

Argo CD App-of-Apps를 통해 플랫폼과 데이터 레이어를 선언적으로 배포합니다. 따라서 “로컬에서 한 번 잘 동작했다”가 아니라 Git 상태와 실제 cluster 상태를 비교할 수 있습니다.

### 3. 데이터 경로를 두 개의 시나리오로 검증

- **Clickstream demo** — synthetic events → Kafka → Flink → Iceberg → Trino/Superset
- **PostgreSQL CDC** — PostgreSQL → Debezium → Kafka → Flink → Iceberg

이는 단순 chart install 성공보다 실제 데이터가 경계를 통과하는지를 검증합니다.

## 아키텍처

<Mermaid chart={`flowchart TB
  subgraph CLUSTER["Beluga local cluster"]
    EDGE["Gateway · Identity · Policy"]
    KAFKA["Kafka / CDC"]
    PLATFORM["Platform Services"]
    FLINK["Flink"]
    LAKE["Lakekeeper + SeaweedFS"]
    TRINO["Trino"]
    SUPERSET["Superset"]
    AIRFLOW["Airflow"]
    EDGE --> KAFKA
    EDGE --> PLATFORM
    KAFKA --> FLINK
    FLINK --> LAKE
    LAKE --> TRINO
    TRINO --> SUPERSET
    AIRFLOW -.-> FLINK
    AIRFLOW -.-> TRINO
    PLATFORM -.-> TRINO
  end`} />

## 로컬 리소스 모델

Beluga는 VM 4대와 전체 데이터 스택을 함께 구동하므로 가벼운 demo가 아닙니다.

- 최소 호스트 RAM: **32GB**
- 48GB 이상: OpenMetadata 및 Trino worker 등 확장 profile 사용 가능
- 64GB 이상: worker memory 추가 확장
- VMware Fusion(ARM64) 또는 VirtualBox(AMD64) 지원
- 실제 메모리 상황에 따라 profile을 자동 선택

따라서 Kube-Ready-Box처럼 “노드 baseline”을 제공하는 프로젝트와 달리 Beluga는 **전체 data platform 통합 비용을 한 번에 보여주는 상위 reference environment**입니다.

## 검증 구조

Beluga는 렌더링 성공과 실제 동작을 구분합니다.

<Mermaid chart={`flowchart TB
  TEST["make test"] --> H["01 · cluster health"]
  H --> CDC["02 · Kafka + CDC"]
  CDC --> STREAM["03 · Flink + Iceberg"]
  STREAM --> QUERY["04 · Trino query"]
  QUERY --> DAG["05 · Airflow DAG"]
  DAG --> AUTH["06 · authorization regression"]`} />

각 단계는 “서비스가 설치되었는가”가 아니라 실제 API와 데이터 흐름이 기대한 상태인지 확인합니다.

## 보안 및 자격증명

Beluga는 repository에 비밀번호를 커밋하지 않고 bootstrap 시점에 credential을 생성합니다. Kubernetes Secret에 저장하고 Helm에는 값 자체가 아니라 필요한 참조만 넘기는 구조를 사용합니다.

또한 `policies/`를 별도 source of truth로 두어 Keycloak, Rego, PostgreSQL 권한 산출물 사이의 일관성을 관리하려는 방향을 취합니다.

## Operations Agent (읽기 전용 PoC)

이슈 #108의 첫 안전 실행 슬라이스로, `scripts/agent/operations_agent.py`가 클러스터를 관찰하고 장애 신호를 수집해 **mutation 없이 remediation 제안만** 만드는 read-only PoC입니다.

- 실행 경로는 OpenForge Agent Execution Security 원칙을 따릅니다: 요청 → 고정 tool/target 해석 → canonical invocation digest → risk 분류 → 요청측 인가 → 고정 argv executor(읽기 전용만) → 결과 해싱/findings → evidence 기록.
- `configs/operations-agent-policy.json`이 tool별 risk class를 선언합니다 — `cluster.nodes`/`cluster.pods`/`cluster.events`/`gitops.applications`는 `read-only-diagnostic`으로 실행 가능하고, `data.mutate`/`external.http`/`platform.privileged`는 `approvalRequired: true`이면서 PoC 단계에서는 `executable: false`로 원천 차단됩니다. approval 플래그가 비활성 class를 실행 가능하게 만들지는 않습니다.
- 안전 불변식: model이 생성한 자유 형식 shell/kubectl 인자를 실행하지 않고 code-owned argv만 subprocess에 도달, 공유 `~/.kube/config` 대신 격리된 kubeconfig 강제, Kubernetes context는 항상 `beluga`, evidence에는 원본 출력 대신 해시/바이트 수/상태만 저장.
- cluster-inspector·data-service-inspector·identity-inspector·storage-inspector·observability-inspector·hypothesis-agent·verifier로 역할이 설계되어 있으나, 현재 구현은 공용 read-only 검사 경계뿐이고 role별 그래프 오케스트레이션은 아직 future work입니다.
- `make test-agent`로 라이브 클러스터 없이 정책/보안 스위트를 검증하며, 이 계약을 지키는 CI(`operations-agent-security.yml`)가 상시 구동됩니다.

## 현재 상태

Beluga는 개인/학습 스케일의 reference implementation입니다.

- 핵심 Kafka/CDC → Flink → Iceberg → Trino/Superset/Airflow 흐름은 clean-install E2E를 목표로 구현되었고 완료로 표시됨(`docs/IMPLEMENTATION-STATUS.md`, 2026-09-14 검증)
- 라이브 클러스터가 항상 실행 중인 것은 아니므로(`vagrant status` 기준 VM 4대 모두 중지) 모든 최신 변경이 상시 live validation되는 것은 아님
- 정책 컴파일러는 `manager/`로 통합되어 같은 트리에서 실행되며, 거버넌스 영역은 계속 진화
- Operations Agent는 read-only 진단 프로파일만 실행 가능하며, data mutation/외부 egress/privileged 작업 실행은 계약상 비활성화된 상태
- 2026-08-28 이후에도 MetalLB L2Advertisement를 사설 네트워크 인터페이스로 제한, ArgoCD·OpenMetadata UI를 APISIX 뒤에서 언블록, 인증서 key usage 명시, VMware Fusion 프로바이더를 `vagrant-vmware-desktop`(vmware_desktop)으로 교체, 64GB 호스트용 VM RAM 프로파일 튜닝 등 클러스터 안정화 커밋이 계속 들어가고 있음

## Beluga Manager (`manager/`)

**Beluga Manager**는 Beluga 데이터 플랫폼의 통합 Control Plane입니다. 별도 저장소 `dasomel/beluga-manager`였으나 2026-10-15 [ADR-0005](https://github.com/dasomel/beluga/blob/main/docs/adr/0005-consolidate-beluga-manager-into-monorepo-ko.md)에 따라 이 저장소의 `manager/` 디렉터리로 통합(전체 히스토리 보존)되었고, 이전 저장소는 아카이브되었습니다.

Kafka, Flink, Iceberg, Trino, Airflow는 계속 자신의 리소스에 대한 authoritative system이고, Manager는 OSS UI를 복제하지 않고 이들의 API를 adapter로 연결해 플랫폼 수준의 질문(어떤 Topic이 어떤 Job과 Table로 이어지는가, 어느 서비스가 degraded인가)에 답합니다.

| 도메인 | 역할 |
|---|---|
| Pipeline | Kafka → Flink → Iceberg → Trino 데이터 흐름의 cross-service 상관 |
| Data Asset | catalog, schema, table과 query context |
| Service | 개별 OSS를 platform capability로 표현 (identity, version, health, dependency) |
| Operations | health, event, resource, dependency를 하나의 context로 묶음 |

<Mermaid chart={`flowchart TB
  UI["Manager Web"] --> API["Domain API"]
  API --> CORR["Discovery / Correlation"]
  CORR --> ADAPTER["Capability-aware Adapters"]
  ADAPTER --> OSS["Kafka · Flink · Iceberg · Trino · Airflow"]`} />

**저장소 구성** — `manager/`는 자체 `package.json`과 lockfile을 가진 npm workspace(`packages/domain-api`, `packages/policy-compiler`, `packages/web`)이고, `.github/workflows/manager-ci.yml`이 `manager/**` 변경에만 CI를 실행합니다. 릴리스는 플랫폼과 독립적입니다.

**Policy compiler seam** — `policies/`의 YAML은 `manager/packages/policy-compiler`가 Keycloak, Trino OPA Rego(`trino.rego`), PostgreSQL DDL(`db-roles.sql`)로 컴파일합니다. 통합 전에는 두 워크플로가 서로 다른 SHA로 고정한 외부 체크아웃을 썼지만, 지금은 테스트 14와 `ci.yml`/`release.yml`이 같은 트리의 `manager/`에서 컴파일러를 실행합니다. 컴파일러 변경과 재생성된 산출물은 한 PR로 들어갑니다.

**현재 성숙도 (2026-10-15 확인)** — Domain API와 웹 콘솔(Overview·Services·Pipelines·Data Catalog·Query Workspace·Policy 등)과 policy compiler는 구현·테스트되어 있습니다. 다만 Domain API는 기본적으로 저장소 내 fixture(stub)로 응답하고, opt-in 읽기 전용 어댑터는 Flink·Trino 쿼리 이력·Lakekeeper 3종뿐이며 live 클러스터 검증이 기록된 것은 Flink 어댑터입니다. Kafka·Debezium·Airflow 어댑터, 인증/인가 미들웨어와 클러스터 배포 차트는 없습니다. upstream 호스트는 `*.local.beluga.internal`에 고정되어 있습니다. 완성된 운영 콘솔이 아니라 read-first 단계입니다.

열려 있던 beluga-manager 이슈 22건은 이 저장소의 #239–#260(`area:manager` 라벨)으로 이전되었습니다. 자세한 내용은 [매니저 개요](/oss/beluga/manager-overview), [아키텍처](/oss/beluga/manager-architecture), [개발](/oss/beluga/manager-development), [운영](/oss/beluga/manager-operations)을 참고하세요. 통합 배경은 블로그 글 [beluga-manager를 beluga 모노레포로 통합한 이유](/ko/posts/beluga-manager-monorepo-consolidation)에 정리했습니다.

## 시작하기

```bash
git clone https://github.com/dasomel/beluga.git
cd beluga
make up
make status
make test
```

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [플랫폼 개요](/oss/beluga/overview) | 문제 정의와 제품 범위 |
| Architecture | [아키텍처](/oss/beluga/architecture) | 전체 데이터 흐름과 컴포넌트 경계 |
| Getting Started | [설치 가이드](/oss/beluga/getting-started) | VM → k3s → GitOps bootstrap |
| Operations | [운영 가이드](/oss/beluga/operations) | 상태, upgrade, data lifecycle |
| Troubleshooting | [문제 해결](/oss/beluga/troubleshooting) | cluster, Kafka, Flink, query 장애 |
| Manager | [매니저 개요](/oss/beluga/manager-overview) | `manager/` control plane 범위와 현재 구현 상태 |
| Manager Architecture | [컨트롤 플레인 아키텍처](/oss/beluga/manager-architecture) | Adapter, correlation, policy seam |
| Manager Development | [개발 가이드](/oss/beluga/manager-development) | `cd manager && npm install` |
| Manager Operations | [배포 및 운영](/oss/beluga/manager-operations) | 현재 배포 경계 |

## 프로젝트 관계

<Mermaid chart={`flowchart TB
  READY["kube-ready-box"] --> K8S["Beluga local Kubernetes"]
  K8S --> FLOW["Kafka → Flink → Iceberg → Trino → Superset"]
  FLOW --> MANAGER["manager/\nunified control plane · read-first"]`} />
