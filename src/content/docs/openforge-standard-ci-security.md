---
title: CI/CD 보안 표준
description: CI 신뢰 경계, 권한 제어, 러너/캐시 격리 및 릴리스 보안.
project: OpenForge
path: openforge/standards/ci-security
order: 1018
lastModified: 2026-08-23
---

# CI/CD 보안 표준

CI 환경은 단순한 자동화 도구가 아니라 중요한 보안 실행 경계입니다.

## 보안 통제 규칙

- **최소 권한 원칙**: 워크플로 기본 권한을 `permissions: read-all` 또는 `contents: read`로 제한합니다.
- **포크 PR 시크릿 격리**: 외부 기여자의 포크 PR 워크플로에는 배포/발행 시크릿을 절대 노출하지 않습니다.
- **Actions SHA 핀 고정**: 서드파티 GitHub Actions는 변경 불가능한 전체 커밋 SHA로 고정하여 공급망 공격을 방어합니다.
- **OIDC 토큰 활용**: 장기 지속 API 키 대신 수명이 짧은 OpenID Connect 기반 인증을 사용합니다.

## 원문 및 권위 소스 (Canonical Source)

- [CI/CD Security Standard](https://github.com/dasomel/openforge/blob/main/docs/ci-security.md)
