---
title: 컨트롤 플레인 아키텍처
description: Domain API, correlation, adapter 구조와 authoritative state 경계, 그리고 policy compiler seam.
project: Beluga
path: beluga/manager-architecture
order: 1506
lastModified: 2026-10-15
---

# 컨트롤 플레인 아키텍처

<Mermaid chart={`flowchart TB
  UI["Manager Web (React + Vite)"] --> API["Domain API (Hono)"]
  API --> DOMAIN["Pipeline · Data Asset · Service · Operations"]
  DOMAIN --> CORR["Discovery / Correlation"]
  CORR --> ADAPTER["Capability-aware Adapters"]
  ADAPTER --> SOURCE["Authoritative OSS APIs"]`} />

## 원칙

- Kafka, Flink, Iceberg, Trino, Airflow는 자신의 상태를 계속 소유합니다.
- 프런트엔드는 upstream OSS API가 아니라 Beluga 도메인 API(`/api/v1/services`, `/pipelines`, `/data-assets` 등)만 호출합니다.
- Adapter는 version/capability 차이를 Domain API 밖으로 격리합니다.
- 상태는 authoritative state, short-lived cache, correlation index, Beluga-owned metadata로 구분합니다. 불확실한 관계는 authoritative fact처럼 표시하지 않고 confidence와 evidence를 유지합니다.

## 구현된 어댑터와 남은 범위

| 대상 | 상태 |
|---|---|
| Flink REST | opt-in 읽기 전용. job을 Pipeline으로 매핑하고 sink Iceberg 테이블을 name-convention(confidence 0.6)으로 연결 |
| Trino 쿼리 이력 | opt-in 읽기 전용, 기본적으로 SQL 리터럴/주석 마스킹 |
| Lakekeeper(Iceberg REST) | opt-in 읽기 전용 카탈로그 소스. 노드 단위 인가 필터링은 아직 없음 |
| Kafka, Debezium, Airflow | 미구현 |

어댑터를 켜지 않으면 Domain API는 fixture를 반환합니다. upstream 호스트 이름은 `*.local.beluga.internal`에 고정되어 있어(beluga ADR-0005 근거) 이 플랫폼 밖에서는 독립 배포 대상이 없습니다.

## Policy compiler seam

`policies/`의 YAML 정책은 `manager/packages/policy-compiler`가 Keycloak 설정, Trino OPA Rego(`trino.rego`), PostgreSQL DDL/role(`db-roles.sql`)로 컴파일합니다. 통합 전에는 `ci.yml`과 `release.yml`이 서로 다른 SHA로 고정한 beluga-manager 체크아웃을 사용했고, `ci.yml`의 핀은 통합 시점에 118 커밋 뒤처져 있었습니다. 지금은 테스트 14와 두 워크플로가 같은 트리의 `manager/`에서 컴파일러를 실행하므로, 컴파일러 변경과 재생성된 산출물이 한 PR로 들어갑니다.

## 결정 기록

Manager ADR은 `manager/docs/adr/`에 있습니다: 0001 프런트엔드(React + Vite), 0002 백엔드(Hono), 0003 UI 디자인 시스템(shadcn/ui, WCAG 2.2 AA 목표), 0004 계층형 Data Asset API는 Accepted이고, 0006 Safe Actions, 0007 Observability, 0008 ArgoCD 연동은 Proposed입니다. 0005(배포·GitOps)는 beluga ADR-0005로 대체되었습니다.
