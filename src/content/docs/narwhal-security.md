---
title: 보안 및 인증 체계
description: Keycloak OIDC, OpenBao, Kyverno 정책 통제.
project: Narwhal
path: narwhal/security
order: 1100
lastModified: 2026-08-23
---

# 보안 및 인증 체계

플랫폼 전반에 걸쳐 Zero-Trust 보안 모델을 적용합니다.

## 보안 컴포넌트
- **IAM / SSO**: Keycloak 기반 중앙 사용자 인증 및 OIDC 토큰 발급
- **Secrets Management**: OpenBao (Vault 포크)를 통한 동적 시크릿 및 토큰 관리
- **Policy Engine**: Kyverno를 통한 Pod Security Standards(PSS) 강제 및 배포 검증
- **인증서 관리**: cert-manager를 통한 내부 CA 자동 갱신

## 관련 링크

- [Narwhal 저장소](https://github.com/dasomel/narwhal)
- [Narwhal 포털](/oss/narwhal/)
