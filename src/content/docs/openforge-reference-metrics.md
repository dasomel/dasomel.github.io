---
title: Reference Implementation Metrics
description: OpenForge project maturity scorecard and evidence model.
project: OpenForge
path: openforge/reference/metrics
order: 1030
lastModified: 2026-08-22
---

# Reference Implementation Metrics

OpenForge는 프로젝트가 기준을 실제로 적용했는지 측정할 수 있도록 maturity scorecard를 제공합니다.

## Scoring

| Score | Meaning |
|---|---|
| `2` | implemented and automated where practical |
| `1` | partially implemented or manual |
| `0` | missing |
| `N/A` | not applicable |

## Coverage

평가는 documentation, architecture, GitHub, CI/CD, security, supply chain, change management, upgrade/compatibility, developer environment, AI-assisted engineering, release, resilience, configuration, localization 등을 다룹니다.

## Evidence 원칙

점수 자체보다 **어떤 evidence가 있는지**가 중요합니다. Workflow 결과, regression test, ADR, incident lesson, repository configuration, generated artifact 등을 근거로 남깁니다.

## Portfolio 활용

이 scorecard는 프로젝트 간 품질을 단순 비교하기 위한 KPI가 아니라, 반복되는 gap을 발견하고 OpenForge standard를 개선하기 위한 feedback loop입니다.

## Canonical source

[Reference Implementation Metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md)