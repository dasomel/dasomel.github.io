---
title: 매니저 개요
description: Beluga 데이터 플랫폼 통합 컨트롤 플레인의 목표와 현재 문서·설계 단계 경계.
project: Beluga Manager
path: beluga-manager/overview
order: 1600
lastModified: 2026-09-14
---

# 매니저 개요

**Beluga Manager**는 Beluga 데이터 플랫폼의 여러 OSS를 하나의 Domain Model로 연결하기 위한 통합 Control Plane 설계 프로젝트입니다. 현재 저장소에는 Frontend, Backend, Tauri Application 또는 실제 Integration Adapter가 없으며 실행 가능한 운영 콘솔로 배포할 수 없습니다.

## 목표 영역

- **Pipeline**: Kafka → Flink → Iceberg → Trino 관계 표현
- **Data Asset**: Catalog, schema, table과 query context 연결
- **Service**: 개별 OSS를 platform capability 관점으로 표현
- **Operations**: Health, event, log와 dependency correlation

## 현재 구현됨

- 영문/한글 제품·아키텍처·개발·보안 문서
- 저장소 검증 스크립트와 테스트
- CI 및 OpenForge portfolio status 게시 연동

API, UI, topology visualization, job control과 schema management는 아직 목표 범위이며 현재 기능이 아닙니다.
