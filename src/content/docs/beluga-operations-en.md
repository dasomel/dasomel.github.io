---
title: Data Operations Guide
description: Pipeline lifecycle, Iceberg table compaction, and metric monitoring runbooks.
project: Beluga
path: beluga/operations
order: 1503
lastModified: 2026-08-23
---

# Data Operations Guide

Operational guidelines covering table compaction, snapshot maintenance, and telemetry.

## Iceberg Table Maintenance & Compaction

Execute periodic optimization tasks to compact small Parquet files and purge stale snapshots:
```sql
ALTER TABLE iceberg.default.order_events EXECUTE optimize(file_size_threshold => '128MB');
ALTER TABLE iceberg.default.order_events EXECUTE expire_snapshots(retention_threshold => '7d');
```

## Core Telemetry Metrics

- **Kafka**: `kafka_consumergroup_lag`
- **Flink**: `flink_jobmanager_job_checkpointing_duration`
- **Trino**: `trino_execution_executor_runningqueries`
