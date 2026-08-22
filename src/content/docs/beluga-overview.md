---
title: 플랫폼 개요
description: 모던 데이터 스택(Kafka + Flink + Iceberg + Trino + Airflow) 올인원 플랫폼 개요.
project: Beluga
path: beluga/overview
order: 1500
lastModified: 2026-08-23
---

# 플랫폼 개요

**Beluga**는 로컬 Kubernetes 클러스터 위에 모던 데이터 스택 전체를 선언적 IaC(Infrastructure as Code)로 배포하는 셀프호스티드 올인원 데이터 플랫폼입니다.

## 핵심 가치

- **완전한 엔드투엔드 파이프라인**: Debezium CDC → Kafka 스트리밍 → Apache Flink 실시간 변환 → Apache Iceberg 오픈 레이크하우스 → Trino 분산 SQL → Superset 시각화 → Airflow 워크플로 오케스트레이션
- **단일 명령어 부트스트랩**: Vagrant와 Argo CD GitOps를 결합하여 복잡한 설정 없이 1-클릭으로 전체 클러스터 구동
- **오픈소스 표준 스택**: 특정 벤더 종속 없이 최신 오픈소스 데이터 기술 표준을 준수
