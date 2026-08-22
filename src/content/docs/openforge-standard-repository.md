---
title: 저장소 표준
description: OSS 저장소 구조, 필수 파일 및 유지보수성 베이스라인.
project: OpenForge
path: openforge/standards/repository
order: 1011
lastModified: 2026-08-23
---

# 저장소 표준

저장소 구조는 프로젝트의 가장 기본적인 엔지니어링 계약입니다. 새로운 기여자가 숨겨진 관행을 역공학할 필요 없이 프로젝트를 빌드, 테스트, 릴리스, 거버넌스 및 보안 조치할 수 있어야 합니다.

## 기본 요구사항 (Baseline)

- **예측 가능한 디렉토리 구조**: 소스 코드, 문서, 빌드 스크립트, 배포 매니페스트를 표준 위치에 배치합니다.
- **루트 필수 파일 완비**: `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `README.md`, `README-ko.md`를 루트에 배치합니다.
- **Issue 및 PR 템플릿**: `.github/ISSUE_TEMPLATE/` 및 `.github/PULL_REQUEST_TEMPLATE.md`를 통해 구조화된 변경 요청을 유도합니다.
- **명시적 소유권 모델**: `CODEOWNERS` 파일을 정의하여 영역별 책임자를 명확히 합니다.
- **시크릿 격리**: 환경변수 예시 파일(`.env.example`)만 커밋하고 실제 비밀값은 소스 제어에 커밋하지 않습니다.

## 변경 원칙

저장소 전역 설정은 실행 가능한 소프트웨어 동작입니다. 워크플로 파일, 패키지 매니페스트, 훅, 린트 설정 변경 시 영향을 받는 모든 워크플로를 전수 검토합니다.

## 1인 메인테이너 고려사항

OpenForge는 특정 인원수를 강제하지 않으며, 변경 위험도와 자동화 수준에 맞춰 거버넌스를 확장합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Repository Standard](https://github.com/dasomel/openforge/blob/main/docs/repository.md)
