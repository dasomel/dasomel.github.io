---
title: ADR
description: OpenForge 문서 아키텍처와 표준에 대한 의사결정 기록.
project: OpenForge
path: openforge/adr
order: 1009
lastModified: 2026-08-21
---

# ADR

ADR은 무엇을 구현했는지만이 아니라 왜 그렇게 결정했는지를 기록합니다.

## ADR-0001: Source Asset과 Public Documentation 분리

**Status:** Accepted

**Decision:** OpenForge는 Standard, Template, reusable implementation asset의 source of truth로 유지합니다. `cne.io.kr`은 해당 자산을 설명하는 bilingual documentation, tutorial, reference explanation, evidence를 제공합니다.

**Reason:** 구현 내용을 여러 repository에서 복제하면 문서 drift가 발생합니다. Source asset과 설명 문서를 분리하면 ownership을 명확히 유지하면서도 문서 사이트의 discovery와 learning experience를 개선할 수 있습니다.

**Consequence:** 프로젝트 문서는 정확한 OpenForge asset과 대응하는 cne.io.kr documentation page를 함께 연결합니다.

## 향후 ADR

문서 아키텍처, template contract, portfolio-wide engineering baseline이 변경될 때 ADR을 추가합니다.
