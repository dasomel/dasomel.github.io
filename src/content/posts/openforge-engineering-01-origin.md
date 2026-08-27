---
title: "여러 OSS를 만들다 보니 표준을 만들게 됐다"
description: "여러 오픈소스 프로젝트에서 반복되는 Repository, CI/CD, Security, Documentation 문제를 OpenForge라는 Engineering Standard로 정리하게 된 배경을 기록합니다."
pubDate: 2026-08-28
tags: ["Open Source", "Engineering", "OpenForge", "Platform Engineering"]
featured: false
draft: true
---

> **OpenForge Engineering Series — 1/7**
>
> 여러 OSS를 동시에 개발하면서 반복해서 만난 문제를 공통 Engineering Standard로 정리하고, 실제 프로젝트에 적용해 검증한 과정을 기록하는 시리즈입니다.

오픈소스 프로젝트 하나를 시작할 때는 제품 기능에 집중하면 됩니다. 하지만 프로젝트가 늘어나면 기능과 직접 관계없는 질문이 반복되기 시작합니다.

README는 어떤 구조로 쓸 것인가. 한국어 문서는 어떻게 관리할 것인가. CI는 어디까지 검사할 것인가. Dependency Update는 어떻게 자동화할 것인가. Security Policy와 Supply Chain 검증은 어느 수준까지 필요한가. AI Coding Agent에게는 무엇을 항상 읽게 할 것인가.

제가 여러 OSS를 동시에 개발하면서 느낀 문제는 각 질문이 어렵다는 것보다 **같은 판단을 프로젝트마다 다시 하고 있다는 것**이었습니다.

## 복사할 Template보다 판단 기준이 필요했다

처음에는 잘 만들어진 Repository의 파일을 다른 프로젝트로 복사하면 충분하다고 생각할 수 있습니다.

하지만 프로젝트 성격은 다릅니다. Kubernetes Platform과 Desktop Operator, Admin Console, 개발 도구, 문서 사이트에 동일한 CI와 Security Control을 강제하면 오히려 유지보수 비용이 커집니다.

그래서 필요한 것은 완성된 Repository를 복제하는 Template 하나가 아니라 다음 질문에 답할 수 있는 기준이었습니다.

- 무엇을 모든 OSS에 공통으로 적용해야 하는가?
- 무엇은 프로젝트 특성에 따라 달라져야 하는가?
- 왜 그 기준을 선택했는가?
- 실제 프로젝트에서 효과가 있었는가?
- 반복할 수 있는 부분은 어디까지 자동화할 수 있는가?

이 문제를 다루기 위해 [OpenForge](https://github.com/dasomel/openforge)를 만들었습니다.

## OpenForge의 역할이 바뀌기 시작했다

초기에는 Repository Structure, Documentation, CI/CD 같은 반복 작업을 줄이는 Blueprint에 가까웠습니다.

그런데 실제 OSS에 적용할수록 범위가 넓어졌습니다.

```text
Repository Structure
Documentation / i18n
CI/CD
Security / Supply Chain
Release / Upgrade
AI-assisted Engineering
ADR / Decision Management
Design System
Compliance Assessment
```

여기서 중요한 변화가 있었습니다. 단순히 "이 파일을 넣자"가 아니라 **왜 이 규칙이 존재하고 어느 프로젝트에 적용해야 하는가**를 관리해야 했습니다.

## Reference OSS에서 표준을 추출한다

OpenForge에서는 표준을 먼저 상상해서 만들기보다 실제 프로젝트에서 반복되는 문제를 출발점으로 삼으려고 했습니다.

```text
Reference OSS
    ↓
실제 문제 / 운영 경험
    ↓
Decision
    ↓
OpenForge Standard
    ↓
Template / CI / Policy
    ↓
다른 OSS에 Adoption
    ↓
Feedback
```

예를 들어 한국어 문서 파일명이 `README_ko.md`, `README.ko.md`, `README-ko.md`로 프로젝트마다 달라지면 단순한 파일명 문제처럼 보입니다. 하지만 여러 Repository에서 검색, 자동화, 링크 생성까지 고려하면 공통 Convention의 가치가 생깁니다.

반대로 모든 프로젝트에 동일한 UI나 동일한 Security Workflow를 복사하는 것은 좋은 표준화가 아닐 수 있습니다. 공통화의 경계 자체가 Engineering Decision이 됩니다.

## 표준도 검증되지 않으면 가정일 뿐이다

OpenForge를 만들면서 점점 중요하게 본 것은 "문서가 존재한다"와 "표준이 실제로 작동한다"를 구분하는 것이었습니다.

그래서 이후 작업은 다음 방향으로 발전했습니다.

- AI Coding Agent 지침을 짧은 계약과 검증 가능한 Tooling으로 분리했습니다.
- 공통 결정의 이유를 ADR로 기록했습니다.
- Figma와 `DESIGN.md`를 이용해 OSS별 Design System의 공통점과 차이를 정의했습니다.
- 35개 Stable Metric으로 14개 OSS의 표준 채택 상태를 측정했습니다.
- CI와 Branch Protection으로 일부 규칙을 실제로 강제했습니다.
- 감사 결과에서 Gap을 찾고 실제 Repository PR로 다시 적용했습니다.

그 결과 OpenForge는 Template Repository보다 **Engineering Practice를 축적하고 검증하는 Knowledge Base**에 가까워지고 있습니다.

## 이 시리즈에서 다룰 내용

이 시리즈는 결과 문서만 설명하지 않습니다. 왜 이런 구조가 필요했는지, 어떤 선택이 과했는지, 무엇을 자동화했고 무엇을 프로젝트별 판단으로 남겼는지를 순서대로 기록합니다.

다음 글에서는 최근 가장 많은 시행착오가 있었던 **AI Coding Agent의 Repository 지침을 어떻게 구성할 것인가**부터 다룹니다.

## 관련 자료

- [OpenForge](https://github.com/dasomel/openforge)
- [OpenForge Reference Metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md)

**다음 글:** OpenForge Engineering Series 2/7 — AGENTS.md를 길게 쓰는 게 답이 아니었다
