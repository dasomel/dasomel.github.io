---
title: 장애 대응 가이드
description: 카프카 지연, Flink 체크포인트 장애 해결.
project: Beluga
path: beluga/troubleshooting
order: 1500
lastModified: 2026-08-23
---

# 장애 대응 가이드

자주 발생하는 데이터 파이프라인 장애와 해결 방법입니다.

## 주요 장애 유형
- **Kafka Consumer Lag 급증**: 파티션 추가 및 Flink Parallelism 조정
- **Flink Checkpoint Timeout**: MinIO 스토리지 I/O 병목 및 RocksDB 상태 크기 점검
- **Trino Out of Memory (OOM)**: 쿼리 메모리 한도(`query.max-memory`) 조정

## 관련 링크

- [Beluga 저장소](https://github.com/dasomel/beluga)
- [프로젝트 홈](/oss/beluga/)
