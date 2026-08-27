---
title: "모든 OSS를 똑같이 만들지 않는 Design System"
description: "Figma와 DESIGN.md를 이용해 Semantic Token과 Accessibility는 공유하면서 각 OSS의 제품 정체성은 유지하는 OpenForge Design System의 경계를 정리합니다."
pubDate: 2026-08-28
tags: ["Design System", "Figma", "Open Source", "OpenForge", "UI/UX"]
featured: false
draft: true
---

> **OpenForge Engineering Series — 4/7**

여러 OSS에 Design System을 적용한다고 하면 먼저 공통 Component Library를 떠올리기 쉽습니다. 버튼, 입력창, 색상, 간격을 하나로 만들고 모든 프로젝트가 같은 UI를 쓰게 하는 방식입니다.

하지만 OpenForge에서 다루는 프로젝트는 성격이 다릅니다. Platform Portal, Operations Dashboard, Desktop Operator, Admin Console, Developer Tool은 사용자의 작업 흐름도 다르고 정보 밀도도 다릅니다.

그래서 목표를 "모두 같은 화면"으로 잡지 않았습니다.

## 공유해야 할 것은 제품의 외형보다 의미다

공통화의 중심을 Semantic Token과 Accessibility에 두었습니다.

```text
Shared
- semantic color roles
- typography roles
- spacing principles
- focus / keyboard behavior
- status semantics
- accessibility baseline
- common interaction contracts

Project-specific
- product accent
- navigation model
- information density
- dashboard composition
- domain-specific visualization
- brand identity
```

예를 들어 `success`는 프로젝트마다 다른 녹색 값을 직접 사용하는 대신 의미 수준에서 동일하게 다룰 수 있습니다. 하지만 Cluster Operations Dashboard와 Developer Portal이 같은 Navigation이나 Density를 가져야 할 이유는 없습니다.

## Figma를 문서의 그림 저장소로만 쓰지 않는다

Figma는 최종 화면을 그리는 도구로만 사용하지 않고 공통 Design Language를 탐색하고 비교하는 Source of Truth 중 하나로 활용했습니다.

공통 Token, Component State, Accessibility Pattern을 정리하고 각 OSS가 어떤 Archetype인지에 따라 적용 범위를 달리합니다.

이때 중요한 것은 Figma와 코드 사이에 계약이 필요하다는 점입니다.

## DESIGN.md를 Repository 계약으로 둔다

각 UI 프로젝트에는 `DESIGN.md`를 두어 프로젝트가 OpenForge Design System을 어떻게 해석하는지 기록하도록 했습니다.

예를 들어 다음 내용을 다룹니다.

```text
Archetype
Token mapping
Navigation pattern
Density
Accessibility expectations
Project-specific exceptions
Figma reference
```

이 파일의 목적은 모든 CSS 값을 문서화하는 것이 아닙니다. **공통 Design System과 실제 제품 구현 사이의 경계**를 명시하는 것입니다.

## Archetype이 필요한 이유

동일한 Design Rule을 모든 Repository에 적용하면 Compliance 점수는 단순해지지만 제품은 나빠질 수 있습니다.

그래서 프로젝트를 Platform Portal, Operations Dashboard, Desktop Operator, Admin Console, Developer Tool, Data Control Plane 같은 Archetype으로 구분해 가이드를 달리했습니다.

Design System의 성공 기준은 "같아 보이는가"가 아니라 다음에 가깝습니다.

- 같은 의미는 같은 방식으로 표현되는가?
- Keyboard와 Focus 같은 기본 접근성이 일관적인가?
- 상태와 위험 수준이 예측 가능한가?
- 프로젝트 고유 Workflow는 보존되는가?

## Compliance로 연결하면서 생긴 변화

Design System을 문서로만 두면 실제 Repository 적용 여부를 알기 어렵습니다.

그래서 Compliance Audit에 `DESIGN-001`, `DESIGN-002` 같은 Stable Metric을 넣었습니다. UI 적용 대상 프로젝트에서 `DESIGN.md`와 구조적인 Token Mapping이 존재하는지 확인합니다.

초기 검사에서는 단순히 `tokens`라는 문자열이 있으면 통과할 위험이 있었습니다. 이후 Fixture를 추가해 일반 문장 속 `tokens`와 실제 구조적 Mapping을 구분하도록 보강했습니다.

이 과정은 Design System에도 같은 원칙이 적용된다는 것을 보여줬습니다.

**문서가 존재하는 것과 계약이 실제로 적용된 것은 다릅니다.**

## 표준화의 경계를 표준화한다

OpenForge Design System에서 가장 중요한 결정은 특정 색상이나 Component가 아니라 "어디까지 같아야 하는가"였습니다.

Semantic, Accessibility, Interaction Contract는 공유하되 Product Identity와 Domain Workflow는 남깁니다.

다음 글에서는 이런 계약들을 감으로 관리하지 않고 **35개 Stable Metric으로 실제 14개 OSS의 채택 상태를 측정한 Compliance Audit**을 다룹니다.

## 관련 자료

- [OpenForge OSS Design System](https://github.com/dasomel/openforge/blob/main/docs/design-system.md)
- [OpenForge ADR](https://github.com/dasomel/openforge/tree/main/docs/adr)

**이전 글:** 3/7 — OSS 프로젝트에서 코드는 남는데 의사결정은 왜 사라질까  
**다음 글:** 5/7 — 표준이 실제로 지켜지는지 숫자로 측정할 수 있을까
