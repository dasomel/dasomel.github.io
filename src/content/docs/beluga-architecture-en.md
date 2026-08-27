---
title: Pipeline Architecture
description: Kafka → Flink → Iceberg → Trino → Airflow end-to-end data pipeline flow and integration.
project: Beluga
path: beluga/architecture
order: 1501
lastModified: 2026-08-27
---

# Pipeline Architecture

Beluga seamlessly combines real-time event streaming with open lakehouse architectures.

<Mermaid chart={`flowchart TB
  PG["PostgreSQL RDBMS"] -->|"Debezium CDC"| KAFKA["Apache Kafka\nEvent streaming · partitioned topics"]
  KAFKA -->|"real-time stream processing"| FLINK["Apache Flink\nExactly-once transformations"]
  FLINK -->|"lakehouse table sink · MinIO S3"| ICEBERG["Apache Iceberg\nACID tables · time travel · Parquet"]
  ICEBERG -->|"distributed SQL"| TRINO["Trino Query Coordinator"]
  ICEBERG -->|"orchestration"| AIRFLOW["Apache Airflow DAGs"]
  TRINO -->|"visualization"| SUPERSET["Apache Superset Dashboards"]
  AIRFLOW -.->|"schedule / coordinate"| FLINK
  AIRFLOW -.->|"schedule / coordinate"| TRINO`} />

The primary data path is **PostgreSQL → Kafka → Flink → Iceberg → Trino → Superset**. Airflow is modeled separately as the **orchestration plane**, because it coordinates processing rather than carrying the data stream itself.
