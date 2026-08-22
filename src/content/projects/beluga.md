---
title: "Beluga"
description: "로컬 Kubernetes 기반 올인원 셀프호스티드 데이터 플랫폼 (Kafka + Flink + Iceberg + Trino + Airflow)"
github: "https://github.com/dasomel/beluga"
tags: ["Kubernetes", "DataPlatform", "Kafka", "Flink", "Iceberg", "Trino", "Superset", "Airflow", "ArgoCD"]
order: 10
type: "own"
featured: true
problem: "모던 데이터 스택(Kafka, Flink, Iceberg, Trino, Superset, Airflow)을 로컬에서 검증하거나 개발할 때 수많은 인프라 설정과 연동 복잡성으로 인해 막대한 시간 소모"
solution: "Vagrant와 Argo CD GitOps를 결합하여 단일 명령어로 완벽히 구동되는 엔드투엔드 데이터 플랫폼 IaC 파이프라인 제공"
---

## 프로젝트 소개

**Beluga**는 로컬 Kubernetes 클러스터 위에 모던 데이터 스택 전체를 선언적 IaC(Infrastructure as Code)로 배포하는 셀프호스티드 올인원 데이터 플랫폼입니다.

Debezium CDC를 통한 데이터 수집부터 Kafka 스트리밍, Apache Flink 실시간 스트림 처리, Apache Iceberg 오픈 레이크하우스 저장, Trino 분산 SQL 쿼리, Apache Superset 대시보드 시각화 및 Apache Airflow 배치 오케스트레이션까지 완벽한 데이터 수명주기를 제공합니다.

### 플랫폼 아키텍처 흐름

```text
  [Data Sources] (RDBMS / PostgreSQL)
         │
         ▼ Debezium CDC
  ┌────────────────────────────────────────────────────────┐
  │  Apache Kafka (Event Streaming & Buffer)               │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼ Stream Processing
  ┌────────────────────────────────────────────────────────┐
  │  Apache Flink (Real-time Stateful Transformations)     │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼ Lakehouse Storage (MinIO S3)
  ┌────────────────────────────────────────────────────────┐
  │  Apache Iceberg (ACID Table Format & Time Travel)      │
  └─────────────┬────────────────────────────┬─────────────┘
                │                            │
                ▼ Query Engine               ▼ Orchestration
  ┌───────────────────────────┐   ┌────────────────────────┐
  │  Trino (Distributed SQL)  │   │  Apache Airflow (DAGs) │
  └─────────────┬─────────────┘   └────────────────────────┘
                │
                ▼ BI & Visualization
  ┌───────────────────────────┐
  │  Apache Superset (Charts) │
  └───────────────────────────┘
```

---

## 7대 핵심 데이터 컴포넌트

| 컴포넌트 | 역할 | 주요 특징 |
|---|---|---|
| **Kafka & Debezium** | 이벤트 스트리밍 및 CDC | DB 변경 사항 실시간 캡처 및 버퍼링 |
| **Apache Flink** | 실시간 스트림 처리 | Stateful 스트림 변환 및 Exactly-Once 처리 |
| **Apache Iceberg** | 오픈 레이크하우스 테이블 포맷 | ACID 트랜잭션, 타임 트래블, 파티션 진화 |
| **MinIO S3** | 객체 스토리지 | 고성능 S3 호환 로컬 분산 스토리지 |
| **Trino** | 분산 SQL 쿼리 엔진 | 대규모 데이터에 대한 초고속 대화형 ANSI SQL 쿼리 |
| **Apache Superset** | BI 및 시각화 대시보드 | 풍부한 차트 및 실시간 비즈니스 인텔리전스 |
| **Apache Airflow** | 워크플로 오케스트레이션 | 파이썬 기반 DAG 선언적 배치 스케줄링 |

---

## 시작하기 (Quickstart)

```bash
# 1. 저장소 클론
git clone https://github.com/dasomel/beluga.git
cd beluga

# 2. 로컬 VM 클러스터 구동 (VMware / VirtualBox)
vagrant up

# 3. Argo CD GitOps 플랫폼 동기화 점검
vagrant ssh master -c "kubectl get applications -n argocd"

# 4. 데모 데이터 파이프라인 실행
make demo-pipeline
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 설명 |
|---|---|---|
| **개요 (Overview)** | [플랫폼 개요](/oss/beluga/overview) | Beluga 데이터 플랫폼 아키텍처 및 핵심 가치 |
| **아키텍처 (Architecture)** | [데이터 파이프라인 구조](/oss/beluga/architecture) | Kafka → Flink → Iceberg → Trino 엔드투엔드 흐름 |
| **시작하기 (Getting Started)** | [클러스터 설치 가이드](/oss/beluga/getting-started) | Vagrant + Helm 기반 로컬 부트스트랩 |
| **운영 가이드 (Operations)** | [데이터 운영 가이드](/oss/beluga/operations) | 파이프라인 수명주기, 메트릭 및 백업/복구 |
| **문제 해결 (Troubleshooting)** | [장애 대응 가이드](/oss/beluga/troubleshooting) | 카프카 지연, Flink 체크포인트 장애 해결 |
