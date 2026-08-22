---
title: 컨트롤 플레인 아키텍처
description: Next.js App Router, REST/WebSocket 어댑터 및 상태 집계 모델.
project: Beluga Manager
path: beluga-manager/architecture
order: 1601
lastModified: 2026-08-23
---

# 컨트롤 플레인 아키텍처

Beluga Manager는 Next.js App Router를 기반으로 프론트엔드와 플랫폼 서비스 API를 연결합니다.

## 백엔드 어댑터 구성

- **Kafka Adapter**: Kafka REST Proxy를 통해 토픽 및 컨슈머 그룹 상태 조회
- **Flink Adapter**: Flink JobManager REST API 연동
- **Trino Adapter**: Trino REST API를 통한 쿼리 실행 이력 및 클러스터 워커 상태 집계
