---
title: 엔지니어링 도구 표준
description: 툴체인 선정, 설정 관리 및 일관된 개발 워크플로 표준.
project: OpenForge
path: openforge/standards/tooling
order: 1015
lastModified: 2026-08-23
---

# 엔지니어링 도구 표준

도구 체계는 개발 생산성과 저장소 유지보수성을 좌우하는 핵심 인프라입니다.

## 도구 선정 및 관리 원칙

- **공식 표준 도구 우선**: 각 생태계에서 널리 채택된 공식 및 커뮤니티 표준 도구를 우선 채택합니다.
- **버전 고정**: 로컬 개발 환경과 CI 환경 간의 도구 버전 차이로 인한 불일치를 방지하기 위해 도구 버전을 명시적으로 고정합니다.
- **설정 파일 표준화**: 린터와 포매터 설정은 저장소 루트에 버전 관리되는 설정 파일로 유지합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Engineering Tooling Standard](https://github.com/dasomel/openforge/blob/main/docs/tooling.md)
