---
title: 패키지 및 산출물 신원 표준
description: 불변 패키지 출처, 체크섬, 전자서명 및 메타데이터 무결성 검증.
project: OpenForge
path: openforge/standards/package-identity
order: 1025
lastModified: 2026-08-23
---

# 패키지 및 산출물 신원 표준

패키지와 배포 산출물은 변경 불가능한 고유 식별자와 무결성 검증 수단을 가져야 합니다.

## 신원 검증 규칙

- **체크섬 대조**: 모든 다운로드 산출물에 대해 SHA256 체크섬을 생성하고 검증합니다.
- **불변 태그 및 다이제스트**: 컨테이너 이미지는 변조 가능한 태그 대신 불변 다이제스트(`@sha256:...`)로 참조합니다.
- **디지털 서명**: Cosign 등을 활용하여 릴리스 바이너리와 컨테이너 이미지에 서명합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Package & Artifact Identity](https://github.com/dasomel/openforge/blob/main/docs/package-identity.md)
