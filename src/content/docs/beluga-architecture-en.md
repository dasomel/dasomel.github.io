---
title: Pipeline Architecture
description: Kafka → Flink → Iceberg → Trino → Airflow end-to-end data pipeline flow and integration.
project: Beluga
path: beluga/architecture
order: 1501
lastModified: 2026-08-23
---

# Pipeline Architecture

Beluga seamlessly combines real-time event streaming with open lakehouse architectures.

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
