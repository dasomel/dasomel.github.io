---
title: 컨트롤 플레인 아키텍처
description: 계획된 Domain API, correlation, adapter 구조와 authoritative state 경계.
project: Beluga Manager
path: beluga-manager/architecture
order: 1601
lastModified: 2026-09-14
---

# 컨트롤 플레인 아키텍처

아래 구조는 **target architecture**이며 현재 구현된 application topology가 아닙니다.

<Mermaid chart={`flowchart TB
  UI["Planned Manager UI"] --> API["Beluga Domain API"]
  API --> DOMAIN["Pipeline · Data Asset · Service · Operations"]
  DOMAIN --> CORR["Discovery / Correlation"]
  CORR --> ADAPTER["Capability-aware Adapters"]
  ADAPTER --> SOURCE["Authoritative OSS APIs"]`} />

## 계획된 Adapter 경계

- Kafka, Flink, Iceberg, Trino와 Airflow는 자신의 상태를 계속 소유합니다.
- Adapter는 version/capability 차이를 Domain API 밖으로 격리합니다.
- Correlation index는 파생 상태이며 upstream 사실을 대체하지 않습니다.
- 불확실한 관계에는 provenance와 confidence를 유지합니다.

Frontend/Backend framework와 transport는 ADR로 결정하기 전까지 미정입니다. Next.js, REST/WebSocket 또는 특정 Kafka proxy를 현재 확정 기술로 가정하지 않습니다.
