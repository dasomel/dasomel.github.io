---
title: 보안 및 인증 체계
description: Keycloak OIDC, Istio Ambient ztunnel mTLS, OpenBao 및 Kyverno 정책.
project: Narwhal
path: narwhal/security
order: 1104
lastModified: 2026-08-23
---

# 보안 및 인증 체계

Narwhal은 제로 트러스트(Zero-Trust) 보안 모델을 인프라 전 계층에 걸쳐 구현합니다.

## 핵심 보안 구성 요소

1. **IAM & SSO (Keycloak)**:
   - 모든 플랫폼 서비스(ArgoCD, Grafana, Gitea, Narwhal Portal)에 대한 단일 로그인(SSO) 제공
   - OpenID Connect (OIDC) 및 OAuth2 Proxy 연동
2. **Sidecar-less mTLS (Istio Ambient)**:
   - 애플리케이션 파드에 무거운 사이드카를 주입하지 않고 노드 레벨 `ztunnel`을 통해 투명한 L4 mTLS 암호화 수행
   - 파드 메모리 소비량 80% 절감
3. **시크릿 거버넌스 (OpenBao)**:
   - Kubernetes Secret을 직접 코드에 커밋하지 않고 Vault 호환 OpenBao를 통해 동적 시크릿 주입
4. **정책 엔진 (Kyverno)**:
   - Pod Security Standards (PSS Baseline/Restricted) 준수 강제
   - Non-root 사용자, Read-only 루트 파일시스템, 불변 컨테이너 태그 정책 적용
