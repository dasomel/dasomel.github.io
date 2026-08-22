---
title: OpenForge Documentation
description: OSS Project Blueprint, reusable engineering standards, templates, and reference practices.
project: OpenForge
path: openforge/overview
order: 1000
lastModified: 2026-08-22
---

# OpenForge Documentation

**OpenForge**는 오픈소스 프로젝트를 만들고 발전시키고 유지하기 위한 공통 **Project Blueprint + Engineering Standards**입니다.

프로젝트마다 반복되는 Repository, Documentation, GitHub, CI/CD, Security, Supply Chain, Release, Operations와 같은 Engineering Foundation을 재사용 가능한 기준과 구현 템플릿으로 정리합니다.

## Engineering Loop

```text
Project Definition
      ↓
Repository Bootstrap
      ↓
Documentation / Architecture
      ↓
Standards + Templates
      ↓
Implementation / CI / Security
      ↓
Release / Operations
      ↓
Evidence / Lessons / Metrics
      ↓
OpenForge Improvement
      ↺
```

OpenForge는 특정 언어, 클라우드, 런타임 또는 애플리케이션 아키텍처를 강제하지 않습니다. 프로젝트 상황에 따라 적용 범위를 조정하고, 중요한 예외는 ADR로 기록할 수 있습니다.

## 이 포털의 역할

OpenForge repository가 **구현 자산의 Source of Truth**라면, `/oss/openforge/`는 다음을 설명하는 Engineering Documentation입니다.

- 왜 이 기준이 필요한가
- 어떤 상황에서 적용하는가
- 어떤 trade-off가 있는가
- 실제 OSS 프로젝트에 어떻게 적용하는가
- 변경, 장애, 리뷰와 Metrics에서 무엇을 배웠는가

즉, repository의 README를 복제하기보다 **기준을 적용하는 방법과 그 결과를 설명하는 공간**입니다.

## 핵심 문서

- [Concepts](/oss/openforge/concepts) — Standard / Template / Evidence와 Trust, Change, Governance Model
- [Getting Started](/oss/openforge/getting-started) — 기존 OSS에 baseline을 적용하는 시작 경로
- [Standards](/oss/openforge/standards) — Engineering concern별 표준 지도
- [Templates](/oss/openforge/templates) — 재사용 가능한 구현 시작점
- [Blueprints](/oss/openforge/blueprints) — 프로젝트 lifecycle과 적용 순서
- [Operations](/oss/openforge/operations) — 운영, resilience, backup, observability 관점
- [Reference](/oss/openforge/reference) — Source of Truth와 evidence 연결 모델
- [Troubleshooting](/oss/openforge/troubleshooting) — 실제 적용 과정의 문제와 대응
- [ADR](/oss/openforge/adr) — OpenForge의 중요한 Engineering Decision

## Source of Truth

- **Implementation**: [dasomel/openforge](https://github.com/dasomel/openforge)
- **Standards**: [docs/](https://github.com/dasomel/openforge/tree/main/docs)
- **Templates**: [templates/](https://github.com/dasomel/openforge/tree/main/templates)
- **Reference implementation**: 실제 OSS repository

> English documentation uses the same structure under `/oss/en/openforge/...`.
