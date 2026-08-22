---
title: "Beluga Manager"
description: "Beluga 데이터 플랫폼을 위한 통합 컨트롤 플레인 및 엣지 관리 UI"
github: "https://github.com/dasomel/beluga-manager"
tags: ["Next.js", "React", "DataPlatform", "ControlPlane", "TypeScript", "TailwindCSS"]
order: 11
type: "own"
featured: true
problem: "Kafka, Flink, Iceberg, Trino 등 서로 다른 관리 대시보드를 개별적으로 접속하여 모니터링해야 하는 파편화"
solution: "모든 데이터 파이프라인 컴포넌트의 헬스체크, 작업 상태, 스키마 진화 및 에러 로그를 한곳에서 제어하는 단일 통합 컨트롤 플레인 UI 제공"
---

## 프로젝트 소개

**Beluga Manager**는 Beluga 데이터 플랫폼의 모든 파이프라인 컴포넌트를 중앙에서 관제하고 조율하는 통합 컨트롤 플레인 웹 애플리케이션입니다.

Next.js, React, TypeScript, Tailwind CSS 기반으로 구축되어 가볍고 직관적인 사용자 경험을 제공하며, 멀티 클러스터 파이프라인 관리와 작업 수명주기 제어를 지원합니다.

### 핵심 기능

- **파이프라인 토폴로지 시각화**: 소스부터 대시보드까지의 데이터 흐름 및 지연 상태 실시간 표시
- **작업 생명주기 제어**: Flink Job 시작/정지/세이브포인트 트리거 및 Airflow DAG 실행
- **스키마 관리자**: Iceberg 테이블 스키마 조회, 파티션 진화 이력 및 타임 트래블 탐색
- **통합 알림 허브**: Kafka 컨슈머 래그 경고, Flink 실패 이벤트 및 스토리지 임계치 알림

---

## 아키텍처 다이어그램

```text
  Browser (Data Engineer / Ops)
             │
             ▼
  ┌────────────────────────────────────────────────────────┐
  │  Beluga Manager UI (Next.js App Router)               │
  │  - Real-time Pipeline Topology Visualizer              │
  │  - Flink / Kafka / Airflow Status Aggregator           │
  │  - Iceberg Schema & Time-Travel Explorer               │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼ REST / WebSocket API
  ┌────────────────────────────────────────────────────────┐
  │  Beluga Platform Services                              │
  │  (Kafka Connect · Flink REST · Trino Coordinator)     │
  └────────────────────────────────────────────────────────┘
```

---

## 시작하기 (Quickstart)

```bash
# 1. 저장소 클론
git clone https://github.com/dasomel/beluga-manager.git
cd beluga-manager

# 2. 의존성 설치 및 로컬 서버 실행
pnpm install
pnpm dev
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 설명 |
|---|---|---|
| **개요 (Overview)** | [매니저 개요](/oss/beluga-manager/overview) | Beluga Manager 설계 철학 및 관제 범위 |
| **아키텍처 (Architecture)** | [컨트롤 플레인 아키텍처](/oss/beluga-manager/architecture) | 프론트엔드/백엔드 통신 및 상태 집계 모델 |
| **개발 가이드 (Development)** | [로컬 개발 가이드](/oss/beluga-manager/development) | pnpm 설정, 컴포넌트 구조 및 Mock 서버 |
| **운영 가이드 (Operations)** | [배포 및 운영](/oss/beluga-manager/operations) | 컨테이너 빌드, 환경변수 및 쿠버네티스 배포 |
