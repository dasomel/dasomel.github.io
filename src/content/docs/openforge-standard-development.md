---
title: 개발 환경 표준
description: 언어별 툴체인 베이스라인, 포매팅 및 태스크 자동화 표준.
project: OpenForge
path: openforge/standards/development
order: 1014
lastModified: 2026-08-23
---

# 개발 환경 표준

일관된 로컬 개발 환경은 코드 품질을 유지하고 협업 마찰을 최소화합니다.

## 개발 원칙

- **단일 명령어 태스크 실행**: `make test`, `make build`, `make lint` 등 Makefile을 통해 공통 개발 작업을 자동화합니다.
- **결정론적 포매팅**: 소스 코드는 커밋 전에 언어별 표준 포매터를 통해 항상 자동으로 정리합니다.
- **테스트 격리**: 단위 테스트는 외부 네트워크나 환경에 의존하지 않고 독립적으로 실행 가능해야 합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Development Standard](https://github.com/dasomel/openforge/blob/main/docs/development.md)
