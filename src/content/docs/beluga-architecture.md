---
title: 데이터 파이프라인 구조
description: Kafka → Flink → Iceberg → Trino 엔드투엔드 흐름.
project: Beluga
path: beluga/architecture
order: 1500
lastModified: 2026-08-23
---

# 데이터 파이프라인 구조

데이터 소스로부터 시각화까지의 단계별 파이프라인 흐름입니다.

## 파이프라인 단계
1. PostgreSQL 변경 사항을 Debezium이 캡처하여 Kafka 토픽으로 발행
2. Apache Flink가 토픽 데이터를 실시간 가공 및 집계
3. 가공된 레코드를 MinIO S3에 저장된 Iceberg 테이블로 기록
4. Trino가 Iceberg 테이블을 직접 쿼리하고 Superset 대시보드에 렌더링

## 관련 링크

- [Beluga 저장소](https://github.com/dasomel/beluga)
- [프로젝트 홈](/oss/beluga/)
