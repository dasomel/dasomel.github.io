---
title: "표준이 실제로 지켜지는지 숫자로 측정할 수 있을까"
description: "OpenForge의 35개 Stable Metric과 Profile 기반 N/A 모델로 14개 OSS의 표준 채택 상태를 측정하고 52.5%라는 첫 Baseline을 만든 과정을 설명합니다."
pubDate: 2026-08-28
tags: ["Compliance", "Open Source", "Engineering", "OpenForge", "Automation"]
featured: false
draft: true
---

> **OpenForge Engineering Series — 5/7**

표준 문서가 늘어나면서 새로운 질문이 생겼습니다.

**그래서 실제 OSS들은 이 표준을 얼마나 따르고 있는가?**

README에 Checklist를 만들어도 시간이 지나면 실제 상태와 달라집니다. Repository가 10개를 넘어가면 사람이 파일을 하나씩 열어 확인하는 것도 반복하기 어렵습니다.

그래서 OpenForge에 Portfolio Compliance Audit을 만들었습니다.

## 첫 번째 목표는 점수가 아니라 현재 상태를 보는 것

감사 엔진의 목적은 프로젝트를 줄 세우는 것이 아닙니다.

필요했던 것은 다음 흐름입니다.

```text
Requirement
    ↓
Evidence
    ↓
Score
    ↓
Gap
    ↓
Action / Issue / PR
```

어떤 표준이 적용되어야 하는지, 현재 어떤 증거가 있는지, 무엇이 부족한지를 기계적으로 다시 확인할 수 있어야 했습니다.

## 35개의 Stable Metric

초기 Prototype은 30여 개 검사 함수로 시작했지만, 비교 가능한 Baseline을 만들려면 이름이 바뀌어도 추적할 수 있는 식별자가 필요했습니다.

정식 Metric Set `2026.08`은 35개의 Stable ID를 사용합니다.

```text
DOC-001 ~ DOC-009       9
ARCH-001 ~ ARCH-004     4
GH-001 ~ GH-005         5
CI-001 ~ CI-006         6
SEC-001 ~ SEC-005       5
AGENT-001 ~ AGENT-003   3
DESIGN-001 ~ DESIGN-002 2
I18N-001                1
                       --
                       35
```

각 Metric은 기본적으로 `0 / 1 / 2 / N/A`로 평가합니다.

## N/A가 중요한 이유

모든 프로젝트에 같은 분모를 적용하면 점수는 간단해집니다. 하지만 문서 사이트에 Container Security Metric을 강제하거나 Headless CLI에 UI Design Token을 요구하는 식의 이상한 결과가 생깁니다.

그래서 Profile과 Archetype에 따라 Applicability를 계산하고 적용 대상이 아닌 항목은 `N/A`로 분모에서 제외합니다.

```text
score = earned / possible applicable points
```

현재 Weight는 모두 1로 유지하지만, Metric 구조는 향후 중요도 Weight를 표현할 수 있도록 만들었습니다.

## 특정 개발자의 Mac에서만 돌아가면 표준 도구가 아니다

초기 Audit Script에는 로컬 Workspace 경로가 들어가 있었습니다. 실제 개인 작업에는 편하지만 OpenForge의 재사용 가능한 도구로는 부적절했습니다.

그래서 Portfolio 정의를 Config로 분리하고 다음 입력을 지원하도록 바꿨습니다.

```text
--config
--workspace-root
OPENFORGE_PORTFOLIO_CONFIG
OPENFORGE_WORKSPACE_ROOT
```

공개 JSON과 Scorecard에서도 `/Users/<name>/...` 같은 절대 경로를 제거했습니다.

동일 Commit과 Metric Set을 같은 조건에서 검사하면 Timestamp 같은 비결정적 Metadata를 제외하고 결과가 동일하도록 Ordering도 고정했습니다.

## 첫 공식 Baseline은 52.5%

35개 Stable Metric을 기준으로 14개 활성 OSS를 감사한 첫 공식 Portfolio Adoption Baseline은 다음과 같았습니다.

```text
Portfolio Adoption:       52.5% (468 / 892)
OpenForge Standard Maturity: 96.9% (62 / 64)
```

여기서 52.5%는 **OpenForge 자체의 완성도**가 아닙니다. 14개 OSS가 OpenForge 공통 표준을 얼마나 채택했는지를 나타내는 Portfolio Adoption 값입니다.

이전 Prototype에서 계산된 52.6%는 33개 비표준 지표를 사용한 결과였고, Stable Metric Set으로 확장하면서 분모와 분자가 바뀌었습니다. 따라서 두 숫자를 동일 Metric의 Regression으로 해석하지 않습니다.

## 점수보다 Gap이 중요하다

Audit 결과는 Scorecard에서 끝나지 않습니다.

Gap을 Documentation, Architecture, CI, Security, Agent Engineering, Design System, i18n 같은 영역으로 분리하고 GitHub Issue 초안을 생성합니다.

또 Baseline Compare를 통해 다음을 구분합니다.

- New gaps
- Resolved gaps
- Regressions
- Repository score delta
- Portfolio delta

이 구조 덕분에 "점수가 낮다"가 아니라 **어떤 변경이 가장 많은 Repository의 실제 Gap을 닫는가**를 계산할 수 있게 됐습니다.

## 감사 엔진 자체도 감사한다

Compliance Tool이 잘못된 점수를 내면 이후의 모든 개선 우선순위가 왜곡됩니다.

그래서 `unittest` 기반 Fixture를 만들고 Stable ID 중복, Legacy Korean Filename, Unpaired ADR, Missing DESIGN.md, N/A, Config Error, False Positive, Baseline Compatibility 등을 검증했습니다.

최종 1차 완료 시점에는 12개 Test가 모두 통과했고, 동일 입력의 Deterministic Output도 확인했습니다.

다음 문제는 자연스럽게 이어졌습니다.

**측정만 하면 표준이 지켜지는가?**

다음 글에서는 일부 규칙을 CI Check와 Branch Protection으로 실제 강제한 과정을 다룹니다.

## 관련 자료

- [OpenForge Portfolio Scorecard](https://github.com/dasomel/openforge/blob/main/docs/portfolio-scorecard.md)
- [OpenForge Reference Metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md)

**이전 글:** 4/7 — 모든 OSS를 똑같이 만들지 않는 Design System  
**다음 글:** 6/7 — CI를 통과하는 표준이 아니라 CI가 강제하는 표준 만들기
