---
title: Documentation Standard
description: OpenForge 문서 품질과 정보 구조를 일관되게 유지하기 위한 기준.
project: OpenForge
path: openforge/standards/documentation
order: 1010
lastModified: 2026-08-22
---

# Documentation Standard

OpenForge의 문서는 단순한 설명서가 아니라 사용자가 **이해하고, 적용하고, 검증할 수 있는 engineering evidence**를 제공해야 합니다.

## 핵심 원칙

- English를 canonical language로 유지하고 Korean을 first-class translation으로 제공합니다.
- 문서는 Concepts, Guides, Tutorials, Reference, Operations, Troubleshooting, ADR처럼 목적에 따라 분리합니다.
- 구현 저장소와 설명 포털의 책임을 분리합니다.
- 예제는 실제로 실행 가능한 수준을 목표로 하고 환경 의존성은 명시합니다.
- 보안/운영 판단에는 가능한 경우 명시적인 evidence와 source link를 제공합니다.

## 문서 변경 기준

의미가 바뀌는 구현 변경은 관련 문서, 예제, runbook, troubleshooting, ADR까지 함께 검토합니다. 문서가 구현보다 앞서거나 뒤처지지 않도록 CI에서 파일 구조와 naming convention을 검증합니다.

## OSS Portal 적용

`cne.io.kr/oss/openforge`는 repository의 원문을 복제하지 않습니다. repository는 implementation source of truth이고, 포털은 적용 이유, trade-off, 사례와 engineering context를 설명합니다.

## 권위 있는 원본

[OpenForge Documentation Standard](https://github.com/dasomel/openforge/blob/main/docs/documentation.md)