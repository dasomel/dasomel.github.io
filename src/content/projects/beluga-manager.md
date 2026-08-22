---
title: "Beluga Manager"
description: "Beluga Data Platform의 여러 OSS를 Pipeline·Data Asset·Service·Operations 도메인으로 연결하는 통합 Control Plane"
github: "https://github.com/dasomel/beluga-manager"
tags: ["Data Platform", "Control Plane", "Kafka", "Flink", "Iceberg", "Trino", "Airflow", "Next.js", "API"]
order: 11
type: "own"
featured: true
problem: "Kafka, Flink, Iceberg, Trino, Airflow가 각각 자신의 UI와 API 모델을 가지므로 데이터 파이프라인 전체의 상태와 관계를 확인하려면 여러 시스템을 직접 탐색해야 함"
solution: "각 OSS를 새로운 source of truth로 복제하지 않고 authoritative API를 adapter로 연결해 Pipeline, Data Asset, Service, Operations라는 플랫폼 도메인으로 상관관계를 제공"
---

## 프로젝트 소개

**Beluga Manager**는 Beluga Data Platform을 위한 **통합 Control Plane 및 Management Console**입니다.

중요한 설계 원칙은 Kafka, Flink, Iceberg, Trino, Airflow 등의 UI를 다시 만드는 것이 아닙니다. 각 OSS는 자신의 리소스에 대한 authoritative system으로 남고, Beluga Manager는 서로 다른 API를 연결해 플랫폼 수준의 질문에 답합니다.

예를 들어 다음 질문은 단일 OSS의 화면만으로는 어렵습니다.

- 이 Kafka Topic은 어떤 Flink Job으로 처리되고 어떤 Iceberg Table을 갱신하는가?
- 이 Data Asset은 어느 catalog/schema/table에 존재하며 어디에서 query할 수 있는가?
- 장애가 발생한 Job이 downstream 어떤 데이터와 서비스에 영향을 주는가?
- 지금 전체 플랫폼에서 어느 서비스가 degraded 상태인가?

Beluga Manager의 제품 가치는 바로 **경계 사이의 context**에 있습니다.

## Domain Model

### Pipeline

```text
Source / CDC
    ↓
Kafka Topic
    ↓
Flink Job
    ↓
Iceberg Table
    ↓
Trino / Query
```

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

```text
                    Beluga Manager
                          │
                 Unified Domain API
                          │
       ┌──────────┬───────┼────────┬───────────┐
       ↓          ↓       ↓        ↓           ↓
     Kafka      Flink  Iceberg   Trino      Airflow
       │          │       │        │           │
       └──────────┴───────┴────────┴───────────┘
                          │
                  Beluga Data Platform
```

각 integration은 adapter/capability boundary 뒤에 존재합니다.

```text
OSS API
   ↓
Integration Adapter
   ↓
Discovery / Correlation
   ↓
Beluga Domain
   ↓
Unified API
   ↓
Manager UI
```

이 구조로 OSS API 버전과 제품별 구현 차이가 frontend에 직접 새지 않도록 합니다.

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

현재 프로젝트는 **Early development** 단계입니다. 먼저 read-first vertical slice를 만들고, 이후 mutation 범위를 확대하는 순서입니다.

```text
API Contract
    ↓
Unified Service API
    ↓
Discovery / Correlation
    ↓
Kafka → Flink → Iceberg → Trino
    ↓
Data Asset / Query / Operations
```

초기 범위:

- Unified Service API
- Service discovery
- Cross-service correlation
- Pipeline Domain API
- Pipeline topology
- Service health/status
- degraded / stale state
- resource / event / log drill-down
- English / Korean UI foundation

초기에는 전문 OSS UI를 재구현하거나 광범위한 destructive operation을 제공하지 않습니다.

## API 방향

```text
GET /api/v1/services
GET /api/v1/services/{id}
GET /api/v1/pipelines
GET /api/v1/pipelines/{id}
GET /api/v1/data-assets
GET /api/v1/health
GET /api/v1/events
```

Frontend는 가능하면 Kafka, Flink, Iceberg, Trino, Airflow의 API를 직접 호출하지 않고 Beluga Domain API만 사용하도록 설계합니다.

## 국제화

초기부터 `en-US`와 `ko-KR`을 지원하며 브라우저 locale detection, 수동 언어 변경, persistent preference, locale-neutral API를 지향합니다.

Kafka Topic, table, job, namespace 같은 실제 리소스 식별자는 번역하지 않습니다.

## 현재 상태

Beluga Manager는 **architecture-first / early implementation** 프로젝트입니다. 즉시 완성된 운영 콘솔이 아니라, Beluga 플랫폼에서 반복적으로 발생하는 “여러 OSS의 관계를 어떻게 하나의 domain으로 표현할 것인가”를 먼저 해결하기 위한 reference implementation입니다.

## 개발 시작

```bash
git clone https://github.com/dasomel/beluga-manager.git
cd beluga-manager
pnpm install
pnpm dev
```

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [매니저 개요](/oss/beluga-manager/overview) | 문제 정의, MVP, domain model |
| Architecture | [컨트롤 플레인 아키텍처](/oss/beluga-manager/architecture) | Adapter, correlation, unified API |
| Development | [개발 가이드](/oss/beluga-manager/development) | 프로젝트 구조와 개발 흐름 |
| Operations | [운영 가이드](/oss/beluga-manager/operations) | 배포/환경 및 운영 기준 |

## 프로젝트 관계

```text
Beluga
  ├── Kafka
  ├── Flink
  ├── Iceberg
  ├── Trino
  └── Airflow
          ↓
    Beluga Manager
          ↓
 Pipeline / Data Asset / Service / Operations
```
