---
title: 릴리스 보안 표준
description: 전자서명, SBOM 생성, 출처 증명 및 배포 무결성 검증.
project: OpenForge
path: openforge/standards/release-security
order: 1034
lastModified: 2026-08-23
---

# 릴리스 보안 표준

릴리스 산출물은 최종 사용자에게 전달되기까지 변조되지 않았음을 수학적으로 증명할 수 있어야 합니다.

## 릴리스 보안 요구사항

- **암호화 전자서명**: 릴리스 바이너리와 컨테이너 이미지에 서명하고 공개 검증 키를 제공합니다.
- **SBOM 동봉**: SPDX 또는 CycloneDX 형식의 SBOM 파일을 릴리스 아티팩트에 포함합니다.
- **빌드 출처 증명(Provenance)**: 빌드가 신뢰할 수 있는 CI 파이프라인에서 생성되었음을 증명하는 Attestation을 발행합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Release Security](https://github.com/dasomel/openforge/blob/main/docs/release-security.md)
