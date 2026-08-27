---
title: 데이터 파이프라인 구조
description: Kafka → Flink → Iceberg → Trino → Airflow 엔드투엔드 데이터 흐름 및 결합 구조.
project: Beluga
path: beluga/architecture
order: 1501
lastModified: 2026-08-27
---

# 데이터 파이프라인 구조

Beluga의 데이터 흐름은 실시간 스트리밍과 오픈 레이크하우스 아키텍처를 결합합니다.

<Mermaid chart={`flowchart TB
  PG["PostgreSQL RDBMS"] -->|"Debezium CDC"| KAFKA["Apache Kafka\nEvent streaming · partitioned topics"]
  KAFKA -->|"real-time stream processing"| FLINK["Apache Flink\nExactly-once transformations"]
  FLINK -->|"lakehouse table sink · MinIO S3"| ICEBERG["Apache Iceberg\nACID tables · time travel · Parquet"]
  ICEBERG -->|"distributed SQL"| TRINO["Trino Query Coordinator"]
  ICEBERG -->|"orchestration"| AIRFLOW["Apache Airflow DAGs"]
  TRINO -->|"visualization"| SUPERSET["Apache Superset Dashboards"]
  AIRFLOW -.->|"schedule / coordinate"| FLINK
  AIRFLOW -.->|"schedule / coordinate"| TRINO`} />

주 데이터 경로는 **PostgreSQL → Kafka → Flink → Iceberg → Trino → Superset**이며, Airflow는 데이터 자체가 통과하는 경로라기보다 처리 작업을 조율하는 **orchestration plane**으로 분리됩니다.
