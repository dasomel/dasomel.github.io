---
title: 데이터 운영 가이드
description: 파이프라인 수명주기, Iceberg 테이블 컴팩션 및 메트릭 모니터링 런북.
project: Beluga
path: beluga/operations
order: 1503
lastModified: 2026-08-23
---

# 데이터 운영 가이드

Beluga 데이터 플랫폼의 일일 운영, 테이블 유지보수 및 모니터링 지침입니다.

## Iceberg 테이블 관리 및 컴팩션 (Compaction)

작은 파케이(Parquet) 파일들이 누적되어 쿼리 성능이 저하되는 것을 방지하기 위해 Airflow DAG로 정기 컴팩션을 실행합니다:
```sql
ALTER TABLE iceberg.default.order_events EXECUTE optimize(file_size_threshold => '128MB');
ALTER TABLE iceberg.default.order_events EXECUTE expire_snapshots(retention_threshold => '7d');
```

## 핵심 모니터링 메트릭

- **Kafka**: `kafka_consumergroup_lag` (토픽 지연율)
- **Flink**: `flink_jobmanager_job_checkpointing_duration` (체크포인트 지연)
- **Trino**: `trino_execution_executor_runningqueries` (동시 실행 쿼리 수)
