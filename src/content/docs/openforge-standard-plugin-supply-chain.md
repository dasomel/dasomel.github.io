---
title: 플러그인 공급망 인테이크 표준
description: 플러그인/스킬 무결성 검증, 실행 권한 제약 및 인테이크 파이프라인.
project: OpenForge
path: openforge/standards/plugin-supply-chain
order: 1026
lastModified: 2026-08-23
---

# 플러그인 공급망 인테이크 표준

외부 플러그인, 확장 도구, AI 에이전트 스킬은 잠재적인 공격 벡터가 될 수 있으므로 엄격한 인테이크 검증을 거쳐야 합니다.

## 플러그인 인테이크 수칙

- **코드 및 매니페스트 감사**: 플러그인 소스 코드와 권한 요구사항을 사전에 감사합니다.
- **실행 권한 격리**: 플러그인이 파일시스템, 네트워크, 환경변수에 접근할 수 있는 범위를 최소화합니다.
- **고정된 버전 채택**: 플러그인 의존성을 특정 커밋 해시로 고정하고 주기적으로 갱신합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Plugin Supply-Chain Intake Standard](https://github.com/dasomel/openforge/blob/main/docs/plugin-supply-chain.md)
