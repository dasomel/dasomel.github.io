---
title: 데이터 파이프라인 구조
description: Kafka → Flink → Iceberg → Trino → Airflow 엔드투엔드 데이터 흐름 및 결합 구조.
project: Beluga
path: beluga/architecture
order: 1501
lastModified: 2026-08-23
---

# 데이터 파이프라인 구조

Beluga의 데이터 흐름은 실시간 스트리밍과 오픈 레이크하우스 아키텍처를 결합합니다.

```text
[ PostgreSQL RDBMS ]
         │
         ▼ Debezium CDC Connector
┌──────────────────────────────────────────────────────────┐
│  Apache Kafka (Event Streaming & Partitioned Topics)     │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼ Real-time Stream Processing
┌──────────────────────────────────────────────────────────┐
│  Apache Flink (Exactly-Once Stream Transformation)       │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼ Lakehouse Table Sink (MinIO S3)
┌──────────────────────────────────────────────────────────┐
│  Apache Iceberg (ACID Tables · Time Travel · Parquet)    │
└─────────────┬──────────────────────────────┬─────────────┘
              │                              │
              ▼ Distributed SQL              ▼ Orchestration
┌─────────────────────────────┐   ┌────────────────────────┐
│  Trino Query Coordinator    │   │  Apache Airflow DAGs   │
└─────────────┬───────────────┘   └────────────────────────┘
              │
              ▼ Visualization
┌─────────────────────────────┐
│  Apache Superset Dashboards │
└─────────────────────────────┘
```
