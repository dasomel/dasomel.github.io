---
title: "OSS 프로젝트에서 코드는 남는데 의사결정은 왜 사라질까"
description: "여러 OSS의 공통 표준을 OpenForge로 관리하면서 ADR을 도입한 이유와 ADR → Standard → Automation → Adoption 구조를 정리합니다."
pubDate: 2026-08-27
tags: ["Open Source", "ADR", "Architecture", "Engineering", "OpenForge"]
featured: false
draft: false
---

여러 오픈소스 프로젝트를 동시에 개발하다 보면 비슷한 결정을 반복하게 됩니다.

CI/CD를 어떻게 구성할지, Dependency Upgrade를 어떤 기준으로 할지, Security Control은 어디까지 적용할지, AI Coding Agent에게 어떤 지침을 줄지, UI Design System은 어디까지 공통화할지 같은 문제입니다.

처음에는 README, Issue, Commit, Pull Request에 필요한 내용을 남기면 충분하다고 생각하기 쉽습니다. 실제 구현 이력은 잘 남습니다.

그런데 시간이 지나면 다른 문제가 생깁니다.

**현재 규칙은 알 수 있는데 왜 그렇게 결정했는지는 찾기 어려워집니다.**

## 표준이 많아질수록 `why`가 중요해진다

제가 개발하는 OSS들의 공통 Engineering 기준을 정리하기 위해 [OpenForge](https://github.com/dasomel/openforge)를 만들었습니다.

OpenForge에는 Repository Structure, Documentation, CI/CD, Security, Supply Chain, Release, Upgrade/Compatibility, AI-assisted Engineering, Design System 같은 공통 기준이 계속 추가되고 있습니다.

표준이 적을 때는 문서 자체만으로 충분합니다. 하지만 공통 규칙이 여러 프로젝트로 전파되기 시작하면 하나의 변경이 다른 Repository의 기본값에도 영향을 줍니다.

예를 들어 다음과 같은 결정이 있었습니다.

- English를 canonical language로 하고 Korean을 first-class translation으로 유지한다.
- 최신 Dependency라는 이유만으로 바로 Upgrade하지 않고 workflow 전체 영향을 검증한다.
- 단독 Maintainer OSS라도 Security를 단순화하지 않고 Risk를 기준으로 Control을 선택한다.
- AI Agent의 `AGENTS.md`는 가능한 짧게 유지하고 상세 규칙은 Coding Standard와 Tooling으로 분리한다.
- Design System은 모든 OSS를 똑같이 보이게 하지 않고 Semantic과 Accessibility를 공통화한다.
- CI 외부 서비스 장애가 발생했다고 Security Gate를 무조건 우회하지 않는다.

이런 내용은 단순한 구현 방법이 아닙니다.

**여러 대안 중 하나를 선택한 Engineering Decision입니다.**

## Git history만으로는 부족했다

Git에는 변경된 파일과 Commit이 남습니다. Issue와 PR에는 논의도 남길 수 있습니다.

하지만 몇 달 뒤 새로운 표준을 검토할 때 필요한 질문은 조금 다릅니다.

> 왜 이 방법을 선택했는가?
>
> 다른 방법은 무엇을 검토했는가?
>
> 당시 어떤 Trade-off가 있었는가?
>
> 이 결정을 바꾸면 어떤 표준과 프로젝트가 영향을 받는가?

이 질문에 답하기 위해 과거 Commit과 Issue를 다시 검색하는 것은 점점 어려워집니다.

그래서 OpenForge에 ADR(Architecture Decision Record)을 본격적으로 도입했습니다.

## ADR을 표준 문서와 분리했다

ADR에 모든 규칙을 넣지는 않았습니다.

OpenForge에서는 역할을 다음과 같이 나눴습니다.

```text
ADR
  왜 이 결정을 했는가
       ↓
Standard
  현재 지켜야 할 규칙은 무엇인가
       ↓
Template / CI / Policy
  어떻게 재사용하거나 자동화하는가
       ↓
Adoption Record / Issue / PR
  실제 프로젝트에 어디까지 적용했는가
```

이 구분이 중요합니다.

Standard에 과거 논의를 계속 쌓으면 현재 규칙을 읽기 어려워집니다. 반대로 ADR만 있고 실제 Standard나 Automation으로 이어지지 않으면 문서만 늘어납니다.

ADR은 **Why**, Standard는 **What**, Template과 CI는 **How**, Adoption Record는 **Where/When**을 담당하도록 했습니다.

## 모든 변경을 ADR로 만들지는 않는다

ADR도 많아지면 또 다른 관리 비용이 됩니다.

그래서 다음과 같은 경우에만 ADR을 사용합니다.

- 여러 Repository가 상속하는 공통 규칙을 변경할 때
- Architecture/Security/Supply Chain/Release/Compatibility 같은 장기 정책을 결정할 때
- 현실적인 대안을 검토한 뒤 하나를 의도적으로 선택할 때
- Trust Boundary나 Permission Boundary가 달라질 때
- Migration 또는 Compatibility Obligation이 생길 때
- 향후 다시 논쟁할 가능성이 높아 당시 판단 근거가 필요한 경우

오탈자 수정, 단순 문구 개선, 정책 변화가 없는 Dependency Patch 같은 작업에는 ADR을 만들지 않습니다.

## Accepted ADR은 다시 쓰지 않는다

또 하나의 원칙은 **과거의 결정을 현재 생각에 맞춰 수정하지 않는 것**입니다.

ADR의 상태는 `Proposed`, `Accepted`, `Superseded`, `Deprecated`, `Rejected`로 관리합니다.

Accepted ADR의 결정이 나중에 바뀌면 기존 문서를 수정해서 마치 처음부터 새로운 결정을 했던 것처럼 만들지 않습니다.

새 ADR을 만들고 이전 ADR을 `Superseded`로 연결합니다.

이렇게 해야 프로젝트의 Engineering 판단이 어떻게 발전했는지 볼 수 있습니다.

## 기존 결정도 소급해서 정리했다

OpenForge에 ADR 체계를 추가하면서 앞으로의 결정만 기록하지 않았습니다.

이미 공통 Standard에 들어가 있던 중요한 결정도 다시 살펴보고 ADR로 정리했습니다.

초기 ADR에는 다음과 같은 주제가 포함됐습니다.

- Cross-project Decision Management
- English/Korean Documentation Policy
- Risk-based OSS Security/Governance
- AI Instruction과 Plugin의 Trust Model
- Workflow-wide Upgrade Impact Analysis
- Lifecycle Security/Supply Chain
- OSS Design System의 Standardization Boundary
- Context-efficient Agent Instruction
- Evidence-first Agent Verification
- Reusable Template Policy
- CI Resilience와 Security Bypass
- Intentional Exception Governance

이 작업을 하면서 느낀 점은, 이미 많은 의사결정을 해왔지만 **결과만 Standard에 남고 선택 과정은 여러 곳에 흩어져 있었다**는 것입니다.

## AI Agent 시대에는 Decision Record가 더 중요할 수 있다

최근에는 AI Coding Agent가 Repository의 문서와 규칙을 읽고 직접 구현합니다.

이 환경에서는 명확한 Standard가 중요하지만, 모든 과거 설명을 `AGENTS.md`에 넣는 것도 좋은 방법은 아닙니다. Context가 커질수록 중요한 지침의 Signal이 약해질 수 있기 때문입니다.

그래서 Agent가 항상 읽어야 할 내용은 짧게 유지하고, 필요할 때 Standard와 ADR을 따라갈 수 있도록 구조화하는 편이 낫다고 보고 있습니다.

```text
AGENTS.md
  ↓
Project-specific constraints
  ↓
OpenForge Standard
  ↓
ADR when rationale is needed
```

AI에게 더 많은 문서를 주는 것이 목적이 아니라 **필요한 순간에 올바른 문서를 찾을 수 있는 구조를 만드는 것**이 목적입니다.

## OpenForge를 Engineering Knowledge Base로

처음 OpenForge를 만들 때는 새로운 OSS를 시작할 때 반복되는 Repository Structure와 CI/CD, Documentation 같은 작업을 줄이는 것이 주요 목적이었습니다.

하지만 여러 프로젝트에서 공통 경험이 쌓이면서 역할이 조금씩 확장되고 있습니다.

```text
Reference OSS
    ↓
실제 문제와 운영 경험
    ↓
Decision / ADR
    ↓
OpenForge Standard
    ↓
Template / Automation
    ↓
다른 OSS에 적용
    ↓
새로운 Feedback
```

이 순환이 계속되면 OpenForge는 단순한 Template Repository보다 **OSS Engineering Decision과 Practice를 축적하는 Knowledge Base**에 가까워질 수 있습니다.

중요한 것은 많은 규칙을 만드는 것이 아니라, 실제 프로젝트에서 반복해서 가치가 확인된 규칙과 그 이유를 남기는 것이라고 생각합니다.

## 관련 자료

- [OpenForge](https://github.com/dasomel/openforge)
- [OpenForge ADR Decision History](https://github.com/dasomel/openforge/tree/main/docs/adr)
- [OpenForge Agent Engineering Standard](https://github.com/dasomel/openforge/blob/main/docs/agent-engineering.md)
- [OpenForge OSS Design System](https://github.com/dasomel/openforge/blob/main/docs/design-system.md)
