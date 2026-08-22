---
title: 장애 대응 가이드
description: Kafka 지연, Flink 체크포인트 실패 및 Trino OOM 장애 분석 및 해결 절차.
project: Beluga
path: beluga/troubleshooting
order: 1504
lastModified: 2026-08-23
---

# 장애 대응 가이드

Beluga 데이터 플랫폼 운영 시 자주 발생하는 장애 패턴과 해결 절차입니다.

## 1. Kafka Consumer Lag 급증 시 대응
- **원인**: Flink 작업 연산 병목 또는 파티션 편향
- **조치**: Flink TaskManager 메모리 증설 및 토픽 파티션 수 확장

## 2. Flink Checkpoint Timeout 발생 시
- **원인**: MinIO S3 I/O 지연 또는 RocksDB 상태 크기 급증
- **조치**: RocksDB Incremental Checkpoint 활성화 확인 및 MinIO 스토리지 디스크 I/O 점검

## 3. Trino 쿼리 메모리 한도 초과 (QueryExceededMemoryLimitException)
- **조치**: `etc/config.properties`에서 `query.max-memory-per-node` 상향 및 Iceberg 파티션 필터 조건 추가
