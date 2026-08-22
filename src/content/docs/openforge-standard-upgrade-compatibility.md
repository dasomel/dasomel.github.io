---
title: 업그레이드 및 호환성 엔지니어링 표준
description: 지원 주기, 하위 호환성 검증 및 버전 드리프트 방지 표준.
project: OpenForge
path: openforge/standards/upgrade-compatibility
order: 1022
lastModified: 2026-08-23
---

# 업그레이드 및 호환성 엔지니어링 표준

호환성 보장은 사용자와 생태계가 안정적으로 프로젝트를 채택할 수 있는 기반입니다.

## 호환성 규칙

- **지원 주기(Support Window) 명시**: 지원하는 최소 런타임/OS/쿠버네티스 버전 범위를 README에 명시합니다.
- **하위 호환성 검증**: 마이너/패치 버전 릴리스 시 기존 API 및 설정 매니페스트와의 하위 호환성을 테스트합니다.
- **폐기(Deprecation) 정책**: 주요 인터페이스 폐기 시 최소 1개 마이너 버전 이전 사전 경고를 거칩니다.

## 원문 및 권위 소스 (Canonical Source)

- [Upgrade & Compatibility Engineering](https://github.com/dasomel/openforge/blob/main/docs/upgrade-compatibility.md)
