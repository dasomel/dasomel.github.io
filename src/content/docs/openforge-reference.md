---
title: 참조 자료 및 소스 맵
description: OpenForge 기준 문서, 템플릿, 참고 구현체 및 증거 자산의 권위 소스 맵.
project: OpenForge
path: openforge/reference
order: 1007
lastModified: 2026-08-23
---

# 참조 자료 및 소스 맵 (Reference)

OpenForge는 모든 자산을 한곳에 복사해 두는 것이 아니라, 자산의 성격에 따라 **권위 있는 원본(Source of Truth)**을 명확히 분리하여 관리합니다.

## 권위 소스 맵 (Source Map)

| 자산 유형 | 권위 있는 원본 위치 | 포털(`/oss/openforge/`)의 역할 |
|---|---|---|
| **[Engineering Standards](/oss/openforge/standards)** | `dasomel/openforge/docs/` | 표준의 목적, 적용 시점, 트레이드오프 해설 |
| **[Reusable Templates](/oss/openforge/templates)** | `dasomel/openforge/templates/` | 템플릿 사용법 및 대상 프로젝트 커스터마이징 가이드 |
| **[Maturity Metrics](/oss/openforge/reference/metrics)** | `dasomel/openforge/docs/reference-metrics.md` | 저장소 엔지니어링 성숙도 채점 및 체크포인트 |
| **Reference Implementations** | 실제 OSS 저장소 (Narwhal, KubeMetal 등) | 표준 적용 사례, 실측 데이터 및 장애 학습 공유 |
| **Architecture Decisions** | `openforge/docs/adr/` | 아키텍처 핵심 결정 기록 및 기술적 배경 |
