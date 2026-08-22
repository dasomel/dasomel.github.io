---
title: 회귀 검증 & 카오스
description: 263건의 인시던트 교훈을 반영한 51개 회귀 테스트 및 Chaos Mesh 실험.
project: Narwhal
path: narwhal/testing
order: 1108
lastModified: 2026-08-23
---

# 회귀 검증 & 카오스

Narwhal의 차별화된 엔지니어링 경쟁력은 장애 경험을 영구적인 테스트 코드로 자산화한 검증 시스템에 있습니다.

## 3단계 플랫폼 검증 체계

1. **Cluster Verification (120+ Checks)**:
   - 노드 커널 파라미터, VIP 응답성, CNI 포워딩, DNS 확인, 스토리지 마운트 전수 검사
2. **SSO & IAM Verification (49 Checks)**:
   - Keycloak OIDC 토큰 발급, OAuth2 Proxy 쿠키 검증, RBAC 권한 분리 테스트
3. **CI Regression Suite (51 Checks)**:
   - `docs/lessons-log.md`의 263건 장애 원인과 판별자를 바탕으로 작성된 전용 회귀 테스트

## Chaos Mesh 카오스 엔지니어링

- **네트워크 단절 실험**: etcd 노드 간 네트워크 파티션 발생 시 쿼럼 유지 및 자동 복구 검증
- **파드 크래시 실험**: APISIX Gateway 파드 강제 종료 시 트래픽 무중단 인입 검증
