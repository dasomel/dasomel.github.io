---
title: 릴리스 표준
description: Semantic Versioning, 자동화된 변경 이력 관리 및 배포 표준.
project: OpenForge
path: openforge/standards/release
order: 1033
lastModified: 2026-08-23
---

# 릴리스 표준

릴리스는 예측 가능하고 추적 가능하며 재현 가능해야 합니다.

## 릴리스 수칙

- **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH` 규칙을 엄격히 준수합니다.
- **CHANGELOG 관리**: 변경 사항을 기능 추가, 버그 수정, 보안 패치로 구분하여 명확히 정리합니다.
- **Git 태그 트리거**: 릴리스는 Git 태그(`vX.Y.Z`) 푸시를 통해서만 자동으로 빌드되고 배포됩니다.

## 원문 및 권위 소스 (Canonical Source)

- [Release Standard](https://github.com/dasomel/openforge/blob/main/docs/release.md)
