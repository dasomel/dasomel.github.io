---
title: 매니저 개요
description: beluga 모노레포 manager/ 디렉터리의 통합 컨트롤 플레인 — 목표 도메인과 2026-10-15 기준 구현 범위.
project: Beluga
path: beluga/manager-overview
order: 1505
lastModified: 2026-10-15
---

# 매니저 개요

**Beluga Manager**는 Beluga 데이터 플랫폼의 여러 OSS를 하나의 Domain Model로 연결하는 통합 Control Plane입니다. 2026-10-15 [ADR-0005](https://github.com/dasomel/beluga/blob/main/docs/adr/0005-consolidate-beluga-manager-into-monorepo-ko.md)에 따라 별도 저장소 `dasomel/beluga-manager`는 `dasomel/beluga`의 **`manager/` 디렉터리**로 통합(전체 히스토리 보존)되었고, 이전 저장소는 아카이브되었습니다.

Kafka, Flink, Iceberg, Trino, Airflow는 계속 자신의 리소스에 대한 authoritative system이고, Manager는 이들을 상관시켜 플랫폼 수준의 질문에 답합니다. OSS UI를 대체하는 포털이 아닙니다.

## 도메인

- **Pipeline**: Kafka → Flink → Iceberg → Trino 관계 표현
- **Data Asset**: Catalog, schema, table과 query context 연결
- **Service**: 개별 OSS를 platform capability 관점으로 표현
- **Operations**: Health, event, resource, dependency correlation

## 2026-10-15 기준 구현 범위

`manager/docs/IMPLEMENTATION-STATUS.md`와 `manager/` 소스를 beluga `origin/main`(`4bd0190`)에서 확인한 내용입니다.

- **구현됨**: `packages/domain-api`(Hono + `@hono/zod-openapi`) Domain API, `packages/web`(React 19 + Vite) 콘솔의 Overview·Services·Pipelines·Data Catalog·Query Workspace·Policy 화면(Architecture·Operations 포함), `packages/policy-compiler`와 `policyctl` CLI, 영문/한글 UI.
- **기본값은 stub**: 별도 설정이 없으면 Domain API는 저장소에 포함된 fixture로 응답합니다. fixture 기반 테스트 통과가 실제 upstream 동작의 증거는 아닙니다.
- **opt-in 읽기 전용 어댑터 3종**: Flink(`BELUGA_FLINK_*`), Trino 쿼리 이력(`BELUGA_TRINO_*`), Lakekeeper 카탈로그(`BELUGA_LAKEKEEPER_*`). 모두 기본 꺼짐이며, 문서상 live 클러스터 검증은 Flink 어댑터만 기록되어 있습니다.
- **미구현**: Kafka·Debezium(CDC)·Airflow 어댑터와 live telemetry discovery, 인증/인가 미들웨어, 배포 차트.

이전 문서의 "Frontend/Backend/어댑터가 없다"는 서술은 현재 상태와 맞지 않아 정정했습니다. 다만 완성된 운영 콘솔은 아니며 read-first 단계입니다.

## 어디서 이어 읽을까

- [아키텍처](/oss/beluga/manager-architecture) — Adapter, correlation, 상태 모델
- [개발 가이드](/oss/beluga/manager-development) — `cd manager && npm install`
- [배포 및 운영](/oss/beluga/manager-operations) — 현재 배포 경계
