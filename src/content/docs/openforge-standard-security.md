---
title: 보안 표준
description: 안전한 개발 및 운영 경계를 위한 보안 베이스라인.
project: OpenForge
path: openforge/standards/security
order: 1023
lastModified: 2026-08-23
---

# 보안 표준

보안은 릴리스 직전에 추가하는 체크리스트가 아니라 소프트웨어 전체 수명주기에 걸친 기본 요구사항입니다.

## 핵심 보안 통제

- **최소 권한 원칙**: 저장소, CI 토큰, 컨테이너 런타임의 권한을 필요한 최소한으로 제한합니다.
- **취약점 스캔 자동화**: 코드 정적 분석(SAST), 의존성 스캔(SCA), 컨테이너 스캔을 CI에 통합합니다.
- **시크릿 노출 방지**: 커밋 전 시크릿 탐지 도구(`gitleaks` 등)를 통해 자격증명 유출을 원천 차단합니다.
- **보안 정책 명시**: `SECURITY.md`에 취약점 비공개 보고 절차와 대응 SLA를 안내합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Security Standard](https://github.com/dasomel/openforge/blob/main/docs/security.md)
