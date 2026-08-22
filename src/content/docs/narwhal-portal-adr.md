---
title: 아키텍처 결정 기록 (ADR)
description: Skaffold 개발 워크플로 및 비용 최적화 ADR.
project: Narwhal Portal
path: narwhal-portal/adr
order: 1200
lastModified: 2026-08-23
---

# 아키텍처 결정 기록 (ADR)

Narwhal Portal의 핵심 아키텍처 결정 기록입니다.

## ADR 요약
- **ADR-0001: Skaffold 기반 로컬 개발 채택**: 매번 컨테이너를 수동 재빌드하지 않고 소스 변경 시 즉시 반영
- **ADR-0002: gRPC/Proto 통신 규격 표준화**: JSON REST 대비 직렬화 성능 및 타입 안전성 확보

## 관련 링크

- [Narwhal Portal 저장소](https://github.com/dasomel/narwhal-portal)
- [포털 홈](/oss/narwhal-portal/)
