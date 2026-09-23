---
title: "Beluga Manager"
description: "Beluga Data Platform의 여러 OSS를 공통 Domain으로 연결하기 위해 아키텍처와 계약을 정립하는 초기 Control Plane 프로젝트"
github: "https://github.com/dasomel/beluga-manager"
tags: ["Data Platform", "Control Plane", "Architecture", "Kafka", "Flink", "Iceberg", "Trino", "Airflow"]
order: 11
type: "own"
featured: true
problem: "Kafka, Flink, Iceberg, Trino, Airflow가 각각 자신의 UI와 API 모델을 가지므로 데이터 파이프라인 전체의 상태와 관계를 확인하려면 여러 시스템을 직접 탐색해야 함"
solution: "각 OSS를 새로운 source of truth로 복제하지 않고 authoritative API를 adapter로 연결해 Pipeline, Data Asset, Service, Operations라는 플랫폼 도메인으로 상관관계를 제공"
---

## 프로젝트 소개

**Beluga Manager**는 Beluga Data Platform을 위한 통합 Control Plane의 **아키텍처와 계약을 정립하는 초기 프로젝트**입니다. 아직 실행 가능한 Management Console은 없습니다.

중요한 설계 원칙은 Kafka, Flink, Iceberg, Trino, Airflow 등의 UI를 다시 만드는 것이 아닙니다. 각 OSS는 자신의 리소스에 대한 authoritative system으로 남고, Beluga Manager는 서로 다른 API를 연결해 플랫폼 수준의 질문에 답합니다.

예를 들어 다음 질문은 단일 OSS의 화면만으로는 어렵습니다.

- 이 Kafka Topic은 어떤 Flink Job으로 처리되고 어떤 Iceberg Table을 갱신하는가?
- 이 Data Asset은 어느 catalog/schema/table에 존재하며 어디에서 query할 수 있는가?
- 장애가 발생한 Job이 downstream 어떤 데이터와 서비스에 영향을 주는가?
- 지금 전체 플랫폼에서 어느 서비스가 degraded 상태인가?

Beluga Manager의 제품 가치는 바로 **경계 사이의 context**에 있습니다.

## Domain Model

### Pipeline

<Mermaid chart={`flowchart TB
  SRC["Source / CDC"] --> KAFKA["Kafka Topic"]
  KAFKA --> FLINK["Flink Job"]
  FLINK --> ICEBERG["Iceberg Table"]
  ICEBERG --> TRINO["Trino / Query"]`} />

Pipeline은 여러 OSS 리소스를 하나의 운영 단위로 묶습니다.

### Data Asset

Catalog, schema, table, column, partition, location, query context를 하나의 관점에서 보여줍니다. Iceberg는 lakehouse metadata의 authoritative source이며 Trino는 query/catalog context를 제공합니다.

### Service

서비스를 단순 설치 목록이 아니라 **platform capability**로 표현합니다.

예: Streaming, Processing, Lakehouse, Query, Orchestration, BI, Storage, Observability.

각 Service는 identity, version, health, dependency, capability 정보를 가집니다.

### Operations

Health, event, log, dependency와 같은 서로 다른 운영 신호를 하나의 context로 묶어 장애 분석에 필요한 이동 경로를 줄입니다.

## 통합 아키텍처

<Mermaid chart={`flowchart TB
  UI["Beluga Manager UI"] --> DOMAIN["Unified Domain API"]
  DOMAIN --> CORR["Discovery / Correlation"]
  CORR --> KAFKA["Kafka Adapter"]
  CORR --> FLINK["Flink Adapter"]
  CORR --> ICEBERG["Iceberg Adapter"]
  CORR --> TRINO["Trino Adapter"]
  CORR --> AIRFLOW["Airflow Adapter"]
  KAFKA --> PLATFORM["Beluga Data Platform"]
  FLINK --> PLATFORM
  ICEBERG --> PLATFORM
  TRINO --> PLATFORM
  AIRFLOW --> PLATFORM`} />

각 integration은 adapter/capability boundary 뒤에 존재합니다. 이 구조로 OSS API 버전과 제품별 구현 차이가 frontend에 직접 새지 않도록 합니다.

<Mermaid chart={`flowchart TB
  OSS["OSS API"] --> ADAPTER["Integration Adapter"]
  ADAPTER --> CORR["Discovery / Correlation"]
  CORR --> DOMAIN["Beluga Domain"]
  DOMAIN --> API["Unified API"]
  API --> UI["Manager UI"]`} />

## State 모델

Beluga Manager는 네 종류의 상태를 구분합니다.

| 상태 | 의미 |
|---|---|
| Authoritative state | upstream OSS가 실제로 소유한 상태 |
| Short-lived cache | 성능을 위한 일시적 cache |
| Correlation index | 서비스 간 관계 탐색을 위한 index |
| Beluga-owned metadata | 명시적인 사용자 mapping이나 플랫폼 메타데이터 |

불확실한 관계는 authoritative fact처럼 표시하지 않는 것을 원칙으로 합니다.

## MVP 방향

<Mermaid chart={`flowchart TB
  CONTRACT["API Contract"] --> API["Unified Service API"]
  API --> CORR["Discovery / Correlation"]
  CORR --> PIPE["Kafka → Flink → Iceberg → Trino"]
  PIPE --> DOMAIN["Data Asset · Query · Operations"]`} />

초기 범위와 실제 구현 상태(2026-09-21 기준, `main` 코드 확인):

| 항목 | 상태 |
|---|---|
| Unified Service API / Pipeline Domain API | **구현됨** — `packages/domain-api`(Hono + `@hono/zod-openapi`)가 `/api/v1/services`, `/pipelines`, `/data-assets`, `/health`, `/events`를 제공 |
| Pipeline topology view | **구현됨** — Architecture 화면이 `@xyflow/react`로 그래프 렌더 |
| Service health/status, degraded/stale state | **구현됨** — 서비스별 `staleAfterMs` 기준 경고 배지 |
| resource/event/log drill-down | **부분 구현** — Operations 화면이 event timeline만 제공, resource/log drill-down은 아직 없음 |
| English/Korean UI foundation | **구현됨** |
| Service discovery / Cross-service correlation(실제 어댑터) | **미구현** — 위 API들은 모두 손으로 작성한 stub data(`stub-data/*.ts`)로 응답하며, Kafka/Flink/Iceberg/Trino/Airflow/Kubernetes에 대한 실제 호출은 아직 없음(#41/#42 범위) |

초기에는 전문 OSS UI를 재구현하거나 광범위한 destructive operation을 제공하지 않습니다.

## API 방향

`packages/domain-api`가 OpenAPI 계약(issue #43)으로 아래 엔드포인트를 실제로 구현하고 있습니다 — 단, 응답은 아직 stub data이며 "STUB DATA, NOT LIVE UPSTREAM INTEGRATION"이라고 코드에 명시되어 있습니다.

```text
GET /api/v1/services
GET /api/v1/services/{id}
GET /api/v1/pipelines
GET /api/v1/pipelines/{id}
GET /api/v1/data-assets
GET /api/v1/health
GET /api/v1/events
```

Frontend는 가능하면 Kafka, Flink, Iceberg, Trino, Airflow의 API를 직접 호출하지 않고 Beluga Domain API만 사용하도록 설계합니다. `packages/web`의 Overview·Services·Pipelines·Architecture·Operations 다섯 화면은 TanStack Query 훅(`useServices`/`usePipelines`/`useEvents`/`useDomainApiHealth`)으로 이미 이 API에 연결되어 있고, Data Catalog·Query Workspace·Policy 세 화면은 아직 `mockData.ts` 정적 데이터/데모 내용에 머물러 있습니다.

## Policy Compiler

`packages/policy-compiler`는 별도 companion 개념이 아니라 이 저장소의 npm workspace 일부로 편입되어 있습니다. `policies/`류 YAML 정책 선언(Zod 스키마로 검증)을 Keycloak realm 설정, Trino OPA Rego 정책, PostgreSQL DDL/role로 컴파일하고, 현재 상태와 목표 상태를 비교하는 drift 감지(`src/drift.ts`, `src/compare.ts`)와 `policyctl` CLI(`bin/policyctl.ts`)를 제공합니다. compiler, keycloak/pgddl/rego 각 백엔드, drift, schema, validate 전부에 vitest 테스트가 있습니다.

## 결정 기록 (ADR)

ADR-0001(React 19 + Vite 8 + Tailwind 4 프런트엔드), ADR-0002(TypeScript/Node npm workspace, Hono 백엔드), ADR-0003(shadcn/ui + Radix 디자인 시스템, WCAG 2.2 AA 목표)이 모두 Accepted 상태입니다. 다만 현재 `packages/web`은 Tailwind만으로 만든 화면이고, ADR-0003이 선택한 shadcn/ui 컴포넌트(데이터 그리드, DAG 그래프, SQL 에디터 전용 컴포넌트 등)는 아직 도입되지 않았습니다.

## System-1 Decision Provider (issue #69)

`packages/domain-api/src/decision/`에 provider-neutral하고 Zod로 검증되는 decision 인터페이스와, 원격 telemetry가 없거나 stale하면 fail-closed하는 결정론적 rule-based provider가 스캐폴딩되어 있습니다. 로컬 모델이나 외부 provider 연동은 아직 없습니다.

## 국제화

초기부터 `en-US`와 `ko-KR`을 지원하며 브라우저 locale detection, 수동 언어 변경, persistent preference, locale-neutral API를 지향합니다.

Kafka Topic, table, job, namespace 같은 실제 리소스 식별자는 번역하지 않습니다.

## 현재 상태

Beluga Manager는 더 이상 문서/아키텍처만 있는 단계가 아닙니다. npm workspace(`packages/domain-api`, `packages/web`, `packages/policy-compiler`)로 재구성되었고, Domain API 계약과 8개 UI 화면 중 5개(Overview·Services·Pipelines·Architecture·Operations)가 실제로 연결되어 있으며, Policy Compiler는 구현·테스트가 끝난 상태입니다. 다만 Domain API는 여전히 stub data 기반이라 **실제 Kafka/Flink/Iceberg/Trino/Airflow/Kubernetes 어댑터 연동은 아직 없고**(#41/#42), 완성된 운영 콘솔이 아니라 "여러 OSS의 관계를 어떻게 하나의 domain으로 표현할 것인가"를 먼저 검증하는 reference implementation이라는 원래 성격은 유지됩니다.

## 개발 시작

이 저장소는 pnpm이 아니라 **npm workspace**(루트 `package.json`의 `workspaces: ["packages/*"]`)입니다.

```bash
git clone https://github.com/dasomel/beluga-manager.git
cd beluga-manager
npm install
make verify          # lint + test
npm run dev          # packages/web Vite dev 서버
npm test             # 전체 workspace vitest
npm run typecheck
npm run policyctl    # policy-compiler CLI
```

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [매니저 개요](/oss/beluga-manager/overview) | 문제 정의, MVP, domain model |
| Architecture | [컨트롤 플레인 아키텍처](/oss/beluga-manager/architecture) | Adapter, correlation, unified API |
| Development | [개발 가이드](/oss/beluga-manager/development) | 프로젝트 구조와 개발 흐름 |
| Operations | [운영 가이드](/oss/beluga-manager/operations) | 배포/환경 및 운영 기준 |

## 프로젝트 관계

<Mermaid chart={`flowchart TB
  BELUGA["Beluga Data Platform"] --> KAFKA["Kafka"]
  BELUGA --> FLINK["Flink"]
  BELUGA --> ICEBERG["Iceberg"]
  BELUGA --> TRINO["Trino"]
  BELUGA --> AIRFLOW["Airflow"]
  KAFKA --> MANAGER["Beluga Manager"]
  FLINK --> MANAGER
  ICEBERG --> MANAGER
  TRINO --> MANAGER
  AIRFLOW --> MANAGER
  MANAGER --> DOMAINS["Pipeline · Data Asset · Service · Operations"]`} />
