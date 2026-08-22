---
title: CI/CD 복원력 표준
description: CI 서비스 장애 시 안전한 Fallback 전략 및 리스크 완화.
project: OpenForge
path: openforge/standards/ci-resilience
order: 1019
lastModified: 2026-08-23
---

# CI/CD 복원력 표준

CI 서비스는 외부 플랫폼 장애에 취약할 수 있으므로, 장애 발생 시에도 보안 원칙을 훼손하지 않는 복원력을 갖추어야 합니다.

## 복원력 원칙

- **Fail-Safe 기본 동작**: CI 검증 실패나 네트워크 장애 시 자동 배포가 무분별하게 실행되지 않도록 차단합니다.
- **비상 배포 절차**: CI 서비스 중단 시 로컬 검증 증거를 문서화하고 서명된 산출물로 수동 릴리스하는 표준 SOP를 정의합니다.
- **캐시 종속성 완화**: 외부 패키지 레지스트리 일시 장애에 대비하여 로컬/미러 캐시 전략을 수립합니다.

## 원문 및 권위 소스 (Canonical Source)

- [CI/CD Resilience Standard](https://github.com/dasomel/openforge/blob/main/docs/ci-resilience.md)
