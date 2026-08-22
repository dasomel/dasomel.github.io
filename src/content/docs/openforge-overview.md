---
title: 문서 개요
description: 오픈소스 프로젝트 Blueprint, 재사용 가능한 엔지니어링 표준, 템플릿 및 참고 관행 가이드.
project: OpenForge
path: openforge/overview
order: 1000
lastModified: 2026-08-23
---

# OpenForge 문서 개요

**OpenForge**는 오픈소스 프로젝트를 일관된 품질과 구조로 생성·발전·배포·운영·유지보수하기 위한 공통 **Project Blueprint + Engineering Standards + Reusable Templates**입니다.

새로운 OSS 프로젝트를 시작할 때마다 반복되는 저장소 구조, 문서화 규칙, GitHub 운영, CI/CD 파이프라인, 공급망 보안, 릴리스 관리, 운영 런북 등의 엔지니어링 토대를 재사용 가능한 표준과 검증된 템플릿으로 제공합니다.

## 엔지니어링 생명주기 루프 (Engineering Loop)

```text
Project Definition (목적, 범위, 라이선스 정의)
      ↓
Repository Bootstrap (디렉토리 구조, GitHub 템플릿)
      ↓
Documentation / Architecture (README 쌍, ADR 체계, 문서 인벤토리)
      ↓
Standards + Templates (CI/CD, Docker, K8s, 보안 베이스라인)
      ↓
Implementation / CI / Security (언어별 툴체인, 빌드, 보안 스캔)
      ↓
Release / Operations (SemVer, SBOM, 서명, 관측성, 백업)
      ↓
Evidence / Lessons / Metrics (Maturity Scorecard 점검)
      ↓
OpenForge Improvement (공통 표준 및 템플릿으로 환류)
      ↺
```

OpenForge는 특정 프로그래밍 언어나 프레임워크를 강제하지 않습니다. 프로젝트 상황에 따라 적용 범위를 유연하게 조정하며, 중요한 기술적 예외는 [ADR (아키텍처 결정 기록)](/oss/openforge/adr)으로 투명하게 관리합니다.

## 이 포털의 역할

OpenForge GitHub 저장소가 **구현 자산의 단일 진실 공급원(Source of Truth)**이라면, `/oss/openforge/` 웹 포털은 다음을 설명하는 기술 문서 공간입니다.

- **표준의 필요성**: 왜 이 기준이 프로젝트에 필수적인가
- **적용 맥락**: 어떤 개발 단계와 아키텍처 환경에서 적용하는가
- **엔지니어링 트레이드오프**: 표준 적용 시 발생하는 비용과 효익은 무엇인가
- **실제 프로젝트 적용**: 활성 OSS에 어떻게 배포하고 운영하는가
- **학습과 지표**: 변경 이력, 장애 회고, 성숙도 지표로부터 무엇을 개선했는가

## 핵심 문서 안내

- **[핵심 개념 (Concepts)](/oss/openforge/concepts)** — 3계층 모델, 신뢰 경계, 변경 관리 및 거버넌스 원칙
- **[시작하기 (Getting Started)](/oss/openforge/getting-started)** — 신규 및 기존 OSS에 OpenForge를 점진적으로 적용하는 절차
- **[엔지니어링 표준 체계 (Standards)](/oss/openforge/standards)** — 29개 세부 엔지니어링 표준 전체 목록 및 탐색 가이드
- **[템플릿 카탈로그 (Templates)](/oss/openforge/templates)** — 즉시 활용 가능한 GitHub, CI/CD, Container, K8s 템플릿
- **[아키텍처 블루프린트 (Blueprints)](/oss/openforge/blueprints)** — 플랫폼 및 서비스 아키텍처 결합 청사진
- **[운영 가이드 (Operations)](/oss/openforge/operations)** — 배포 이후 관측성, 헬스체크, 백업/복구 및 장애 대응 기준
- **[참조 자료 및 소스 맵 (Reference)](/oss/openforge/reference)** — 표준, 템플릿, 구현체 간의 권위 소스 맵
- **[성숙도 평가 메트릭 (Reference Metrics)](/oss/openforge/reference/metrics)** — 프로젝트 성숙도 측정을 위한 체크포인트 및 채점표
- **[문제 해결 가이드 (Troubleshooting)](/oss/openforge/troubleshooting)** — 증상-증거-원인-조치 기반의 장애 분석 모델
- **[아키텍처 결정 기록 (ADR)](/oss/openforge/adr)** — OpenForge 핵심 설계 결정 및 트레이드오프 기록

## 단일 진실 공급원 (Source of Truth)

- **구현 저장소**: [dasomel/openforge](https://github.com/dasomel/openforge)
- **엔지니어링 표준**: [docs/](https://github.com/dasomel/openforge/tree/main/docs)
- **재사용 템플릿**: [templates/](https://github.com/dasomel/openforge/tree/main/templates)
- **참고 구현체**: Narwhal, KubeMetal, nfs-quota-agent, Beluga Manager 등 실제 OSS 저장소
