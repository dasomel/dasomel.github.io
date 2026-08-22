---
title: Development Standard
description: 코드 품질, 테스트, 개발 도구와 변경 규율을 정의하는 기준.
project: OpenForge
path: openforge/standards/development
order: 1019
lastModified: 2026-08-22
---

# Development Standard

OpenForge는 개발 과정 자체가 **재현 가능하고, 검토 가능하며, 유지보수 가능**해야 한다고 봅니다.

## Baseline

- formatter / linter 설정을 repository에 버전 관리
- 중요한 동작과 regression을 테스트로 보호
- local development command와 prerequisite 문서화
- code intelligence와 static analysis를 가능한 범위에서 사용
- generated code와 repository tooling도 Engineering Asset으로 취급

## Quality Gate

CI에서는 format, test, static analysis, repository contract와 security-sensitive check를 merge 전에 검증합니다.

## Change Evidence

행동이 바뀌는 변경은 test 또는 명확한 validation evidence를 가져야 합니다. 규모가 크거나 위험한 변경은 설계 결정과 compatibility impact도 함께 기록합니다.

## Canonical Source

[OpenForge Development Standard](https://github.com/dasomel/openforge/blob/main/docs/development.md)