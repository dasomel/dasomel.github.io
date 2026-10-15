---
title: 배포 및 운영
description: manager/ 의 현재 배포 경계 — 컨테이너 이미지와 compose는 있고, 클러스터 배포 차트는 없다.
project: Beluga
path: beluga/manager-operations
order: 1508
lastModified: 2026-10-15
---

# 배포 및 운영

## 현재 있는 것

- `manager/packages/domain-api/Dockerfile`, `manager/packages/web/Dockerfile`(nginx)과 `manager/compose.yaml`. `make dev-up`이 두 컨테이너를 fixture 기반으로 띄웁니다. 컨테이너는 non-root, read-only 루트 파일시스템, 전체 capability drop, `no-new-privileges`로 구성됩니다.
- 호스트 포트는 5180(웹)과 8787(API)로 고정입니다. Podman은 문서상 미검증입니다.
- Manager는 플랫폼과 독립적으로 릴리스합니다. CI는 `manager/**`로 path-filter되어 beluga 전용 PR에서는 돌지 않습니다.
- OpenForge 상태는 별도 항목이 아니라 루트 `.openforge/status.json`의 `beluga` 아래(`policy-compiler` capability)로 보고합니다.

## 아직 없는 것

- Helm chart 또는 Argo CD `Application`. 별도 manager 배포 차트는 추진하지 않기로 했고(beluga ADR-0005), 클러스터 내 배포는 beluga `docs/adr/`의 새 ADR로 결정합니다.
- 인증/인가 미들웨어. 따라서 opt-in Trino 쿼리 이력은 서비스 자격증명 관점이 모든 호출자에게 공유되며, 명시적 acknowledgement가 필요합니다.
- Kafka·Debezium·Airflow 어댑터, 노드 단위 OPA 필터링.

배포 가능 상태가 되려면 인증/인가, 어댑터별 최소 권한의 read-only 계정, health/readiness, 실제 Beluga 환경에 대한 통합 증거가 필요합니다. 이 항목들은 beluga 이슈 `area:manager`에서 추적합니다.
