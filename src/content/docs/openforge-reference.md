---
title: Reference
description: OpenForge의 기준 문서, template, reference implementation, evidence 연결 모델.
project: OpenForge
path: openforge/reference
order: 1007
lastModified: 2026-08-22
---

# Reference

OpenForge는 **하나의 Source of Truth로 모든 것을 복사하는 구조가 아니라, 자산의 종류에 따라 권위 있는 원본을 분리**합니다.

## Source Map

| 필요한 것 | 권위 있는 원본 | 이 포털의 역할 |
|---|---|---|
| Standard | `openforge/docs/` | 목적, 적용 시점, trade-off 설명 |
| Template | `openforge/templates/` | 사용 방법과 대상 프로젝트 적용 예시 |
| Reference Implementation | 실제 OSS repository | 프로젝트별 구현과 제약 설명 |
| Engineering Decision | Project ADR | 선택 이유와 대안 기록 |
| Incident Lesson | Issue / Incident / Regression Test | 문제가 기준 개선으로 연결된 근거 |
| Maturity | `docs/reference-metrics.md` | 프로젝트 상태를 정량적으로 평가하는 기준 |

## Evidence Loop

```text
OpenForge Standard
      ↓
Project Application
      ↓
Implementation
      ↓
CI / Review / Runtime Evidence
      ↓
Incident / Lesson / Metric
      ↓
Standard Improvement
```

이 구조를 통해 “기준이 존재한다”와 “실제 프로젝트에서 검증되었다”를 분리하면서도 서로 연결합니다.

## Reference Projects

OpenForge README에서 reference project로 명시하는 OSS는 Narwhal, Narwhal Portal, nfs-quota-agent, kube-ready-box, KubeMetal, ldapium, Beluga Manager 등입니다.

이 프로젝트들은 OpenForge의 종속성이 아니라 **실제 적용을 통해 기준을 검증하고 개선하는 reference set**입니다.

## Canonical Links

- [OpenForge repository](https://github.com/dasomel/openforge)
- [OpenForge standards](https://github.com/dasomel/openforge/tree/main/docs)
- [OpenForge templates](https://github.com/dasomel/openforge/tree/main/templates)
- [Reference metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md)
