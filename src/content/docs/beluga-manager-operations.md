---
title: 배포 및 운영
description: 아직 배포 산출물이 없는 초기 Control Plane의 운영 및 배포 준비 기준.
project: Beluga Manager
path: beluga-manager/operations
order: 1603
lastModified: 2026-09-14
---

# 배포 및 운영

현재 Beluga Manager에는 container image, Helm chart 또는 Kubernetes manifest가 없습니다. `ghcr.io/dasomel/beluga-manager:v1.0.0`과 같은 배포 예시는 실제 발행 산출물이 아니므로 사용해서는 안 됩니다.

## 배포 가능 상태의 조건

- 선택된 application architecture와 승인된 ADR
- 실제 build/test가 통과한 versioned image
- SBOM, provenance와 공개 digest
- read-only service account와 adapter별 최소 권한
- health/readiness probe 및 dependency failure 표현
- air-gap용 image와 manifest inventory
- 실제 Beluga 환경을 대상으로 한 integration evidence

그 전까지 이 저장소에서 운영 가능한 대상은 문서와 CI/검증 workflow뿐입니다.
