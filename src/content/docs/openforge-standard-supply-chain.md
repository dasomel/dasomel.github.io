---
title: 공급망 보안 표준
description: 의존성 거버넌스, 패키지 신원 검증 및 레지스트리 방어.
project: OpenForge
path: openforge/standards/supply-chain
order: 1024
lastModified: 2026-08-23
---

# 공급망 보안 표준

소프트웨어 공급망 보안은 외부 의존성과 빌드 파이프라인의 무결성을 보호하는 핵심 통제입니다.

## 공급망 방어 수칙

- **신뢰할 수 있는 레지스트리만 사용**: 공식 및 서명된 패키지 레지스트리만 소스로 지정합니다.
- **의존성 출처 검증**: 패키지 이름, 네임스페이스, 배포자 서명을 확인하여 타이포스쿼팅 공격을 차단합니다.
- **SBOM 자동 생성**: 릴리스마다 소프트웨어 자재명세서(SBOM)를 생성하여 배포 산출물과 함께 제공합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Supply Chain Security Standard](https://github.com/dasomel/openforge/blob/main/docs/supply-chain.md)
