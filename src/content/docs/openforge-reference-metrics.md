---
title: 참고 구현 메트릭
description: 저장소 엔지니어링 성숙도 및 표준 준수 수준을 측정하기 위한 Maturity Scorecard 모델.
project: OpenForge
path: openforge/reference/metrics
order: 1030
lastModified: 2026-08-23
---

# 참고 구현 메트릭 (Reference Metrics)

OpenForge는 저장소의 엔지니어링 품질과 표준 준수 여부를 객관적으로 측정할 수 있는 **Maturity Scorecard**를 제공합니다.

## 채점 기준 (Scoring Rubric)

| 점수 | 상태 | 설명 |
|---|---|---|
| **`2`** | 완전 구현 (Automated) | 표준이 완벽히 구현되어 있으며 가능한 영역은 CI/CD로 자동화됨 |
| **`1`** | 부분 구현 (Manual) | 수동으로 운영되거나 부분적으로 구현됨 |
| **`0`** | 미구현 (Missing) | 기준이 구현되지 않았거나 미달함 |
| **`N/A`** | 해당 없음 (Not Applicable) | 프로젝트 성격상 해당 항목이 적용되지 않음 (예: CLI 도구의 UI i18n 항목) |

---

## 9대 핵심 평가 영역

| 영역 | 핵심 점검 항목 | 목표 상태 |
|---|---|---|
| **문서화 (Documentation)** | 영문/한글 README 쌍, 아키텍처 문서, 개발 가이드, Lessons Log | 영/한 1:1 완비, 장애 기록 누적 |
| **아키텍처 (Architecture)** | 아키텍처 결정 기록(ADR) 체계 운영 | `docs/adr/` 디렉토리 및 인덱스 유지 |
| **GitHub 거버넌스** | Issue/PR 템플릿, CODEOWNERS, 라벨링 체계 | 표준 템플릿 기반 변경 흐름 확립 |
| **CI / 검증** | 빌드, 테스트, 포맷 검증, 문서 유효성 검사 | Merge 전 필수 게이트 자동화 |
| **보안 / 공급망** | Dependabot, 컨테이너 스캔, 시크릿 탐지, SECURITY 정책 | 정기 스캔 및 SBOM 생성 자동화 |
| **개발 환경** | 언어별 표준 포매터(`gofumpt` 등), Makefile 작업 도구 | 단일 명령어로 로컬 테스트/빌드 가능 |
| **릴리스 관리** | SemVer, CHANGELOG, 릴리스 워크플로, 산출물 서명 | 태그 기반 자동 빌드 및 서명 발행 |
| **설정 관리** | `.env.example`, 환경변수/설정 경계 정의 | 비밀값과 일반 설정 분리 |
| **국제화 (i18n)** | UI 프로젝트의 다국어 지원 리소스(`ko-KR`, `en-US`) | 구조화된 i18n 리소스 번들 관리 |
