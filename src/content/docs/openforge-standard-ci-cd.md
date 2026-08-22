---
title: CI/CD 표준
description: 지속적 통합/배포 파이프라인 및 사전 검증 품질 게이트.
project: OpenForge
path: openforge/standards/ci-cd
order: 1017
lastModified: 2026-08-23
---

# CI/CD 표준

CI/CD는 소프트웨어의 신뢰성을 보장하는 자동화된 품질 게이트입니다.

## CI 파이프라인 필수 단계

1. **정적 분석 및 린트**: 코드 스타일, 보안 취약점 패턴, 타입 체크 수행
2. **단위 및 통합 테스트**: 코드 커버리지 리포트 및 레이스 컨디션 검사
3. **빌드 검증**: 실제 릴리스 타깃 환경에서의 무결성 컴파일 검증
4. **산출물 보안 검사**: 컨테이너 이미지 취약점 스캔 및 SBOM 생성

## 원문 및 권위 소스 (Canonical Source)

- [CI/CD Standard](https://github.com/dasomel/openforge/blob/main/docs/ci-cd.md)
