---
title: "Beluga Manager"
description: "Beluga Data Platform을 위한 통합 Control Plane 및 데이터 플랫폼 관리 계층"
github: "https://github.com/dasomel/beluga-manager"
tags: ["Data Platform", "Control Plane", "Kafka", "Flink", "Iceberg", "Trino", "Airflow", "Kubernetes"]
order: 3
type: "own"
featured: true
problem: "Kafka·Flink·Iceberg·Trino·Airflow 등 여러 OSS의 상태와 데이터 흐름을 각각의 UI에서 확인해야 하므로 서비스 경계를 넘는 운영 맥락을 한 번에 파악하기 어려움"
solution: "개별 OSS의 authoritative API를 adapter와 discovery/correlation 계층으로 통합하여 Pipeline, Data Asset, Service, Operations라는 Beluga Domain과 통합 UI/API를 제공"
---

## 프로젝트 소개

**Beluga Manager**는 Beluga Data Platform의 통합 진입점이자 관리 계층입니다.

```text
Upstream OSS
    ↓
Authoritative APIs
    ↓
Integration Adapters
    ↓
Discovery / Correlation
    ↓
Beluga Domain API
    ↓
Beluga Manager UI
```

OSS를 단순히 모아놓은 Portal이 아니라, 각 프로젝트의 API를 조합하여 **서비스 경계를 넘는 새로운 운영 맥락**을 제공합니다.

## 핵심 Domain

- **Pipeline** — Kafka Topic, Flink Job, Iceberg Table, Trino Context 등의 cross-service 데이터 흐름
- **Data Asset** — Catalog, Schema, Table, Column, Partition, Query Context
- **Service** — 서비스 Identity, Version, Health, Dependencies, Capabilities
- **Operations** — Resource, Event, Health, Log, Dependency 기반 장애 분석

## 초기 MVP

첫 번째 Vertical Slice은 다음 흐름을 대상으로 합니다.

```text
Kafka → Flink → Iceberg → Trino
```

MVP에서는 Unified Service API, Service Discovery, Cross-service Correlation, Pipeline Domain API, Health/Status, Drill-down과 영/한 UI 기반을 우선 검증합니다.

## 설계 원칙

- 각 OSS는 자신의 리소스에 대한 authoritative source로 유지
- Frontend는 OSS별 API가 아니라 Beluga Domain API 사용
- 데이터 전체를 복제하기보다 correlation과 최소한의 cache/index 활용
- upstream API/version 차이는 integration adapter 뒤에 격리
- 확신할 수 없는 관계는 authoritative 사실처럼 표시하지 않음
- 초기에는 read-first로 제품 가치를 검증한 후 mutation을 확장

## 국제화

- `en-US` — English
- `ko-KR` — 한국어
- Browser locale detection
- Manual language selection
- Locale-neutral API
- 실제 Kafka Topic, Table, Job, Namespace 및 identifier는 번역하지 않음

## 관련 링크

- **GitHub**: [dasomel/beluga-manager](https://github.com/dasomel/beluga-manager)
- **Architecture**: [Beluga Manager Architecture](https://github.com/dasomel/beluga-manager/blob/main/docs/architecture.md)
