---
title: Pipeline Architecture
description: Kafka → Flink → Iceberg → Trino end-to-end data pipeline flow.
project: Beluga
path: beluga/architecture
order: 1500
lastModified: 2026-08-23
---

# Pipeline Architecture

End-to-end pipeline flow from data ingestion to BI visualization.

## Pipeline Stages
1. PostgreSQL CDC captured by Debezium into Kafka topics
2. Apache Flink transforms and aggregates streams in real time
3. Records written to Iceberg tables stored on MinIO S3
4. Trino queries Iceberg tables for Superset BI dashboards

## Related Links

- [Beluga Repository](https://github.com/dasomel/beluga)
- [English Project Home](/oss/en/beluga/)
