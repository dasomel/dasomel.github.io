---
title: "Beluga"
description: "로컬 Kubernetes에서 CDC부터 Lakehouse, BI까지 전체 데이터 흐름을 재현하는 self-hosted 데이터 플랫폼"
github: "https://github.com/dasomel/beluga"
tags: ["Data Platform", "Kafka", "CDC", "Flink", "Iceberg", "Trino", "Kubernetes", "GitOps"]
order: 1
type: "own"
featured: true
problem: "Kafka·CDC·Flink·Iceberg·Trino·Superset·Airflow를 따로 익히는 대신 실제 데이터가 끝까지 흐르는 플랫폼을 로컬에서 재현하기 어려움"
solution: "Vagrant + Helm + ArgoCD 기반으로 CDC → Kafka → Flink → Iceberg → Trino/Superset → Airflow 흐름을 하나의 검증 가능한 환경으로 제공"
---

## 프로젝트 소개

**Beluga**는 로컬 Kubernetes에서 현대적인 데이터 플랫폼의 전체 흐름을 재현하기 위한 self-hosted 데이터 플랫폼입니다.

```text
PostgreSQL
  ↓ CDC
Kafka
  ↓
Flink
  ↓
Iceberg Lakehouse
  ↓
Trino / Superset
  ↓
Airflow
```

컴포넌트 설치 자체보다 **데이터가 실제로 끝까지 흐르는 경험과 E2E 검증**을 프로젝트의 중심으로 둡니다.

## 현재 상태

- Vagrant + Kubernetes 기반 로컬 환경
- Kafka + CDC
- Flink streaming
- Iceberg Lakehouse
- Trino / Superset query & BI
- Airflow orchestration
- Helm + ArgoCD 기반 IaC

## 관련 링크

- **GitHub**: [dasomel/beluga](https://github.com/dasomel/beluga)
