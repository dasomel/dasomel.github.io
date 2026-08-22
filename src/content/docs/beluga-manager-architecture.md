---
title: 컨트롤 플레인 아키텍처
description: 프론트엔드/백엔드 통신 및 상태 집계 모델.
project: Beluga Manager
path: beluga-manager/architecture
order: 1600
lastModified: 2026-08-23
---

# 컨트롤 플레인 아키텍처

Next.js App Router 기반의 서버 사이드 데이터 집계 아키텍처입니다.

## 아키텍처 구성
- **Client UI**: React Server Components + Client Workbench
- **Backend Adapter**: Kafka REST Proxy, Flink REST API, Trino JDBC 어댑터
- **State Store**: 메모리 캐시 및 경량 상태 저장소

## 관련 링크

- [Beluga Manager 저장소](https://github.com/dasomel/beluga-manager)
- [프로젝트 홈](/oss/beluga-manager/)
