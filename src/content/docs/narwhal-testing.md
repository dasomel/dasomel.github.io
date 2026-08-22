---
title: 회귀 검증 & 카오스
description: 263건의 인시던트 회귀 테스트(51 checks) 및 Chaos Mesh.
project: Narwhal
path: narwhal/testing
order: 1100
lastModified: 2026-08-23
---

# 회귀 검증 & 카오스

Narwhal의 핵심 유지보수성은 장애로부터 얻은 교훈을 테스트 코드로 자산화하는 데 있습니다.

## 검증 체계
- **Cluster Verification**: 120개 이상의 노드 및 컴포넌트 헬스체크
- **SSO Verification**: 49개 OIDC 인증 경로 자동 검증
- **CI Regression Suite**: `lessons-log.md`의 263건 인시던트를 바탕으로 작성된 51개 핵심 회귀 테스트
- **Chaos Mesh**: 네트워크 단절, 노드 다운, 패킷 지연 카오스 실험 실행

## 관련 링크

- [Narwhal 저장소](https://github.com/dasomel/narwhal)
- [Narwhal 포털](/oss/narwhal/)
