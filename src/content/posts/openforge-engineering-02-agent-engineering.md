---
title: "AGENTS.md를 길게 쓰는 게 답이 아니었다"
description: "AI Coding Agent 지침을 AGENTS.md에 모두 넣는 대신 프로젝트 계약, Coding Standard, CI와 Evidence-first 검증으로 분리한 OpenForge의 Agent Engineering 접근을 정리합니다."
pubDate: 2026-08-28
tags: ["AI", "Coding Agent", "Engineering", "OpenForge", "AGENTS.md"]
featured: false
draft: true
---

> **OpenForge Engineering Series — 2/7**

AI Coding Agent의 구현 능력이 좋아지면서 다른 문제가 더 잘 보이기 시작했습니다. 기능은 빠르게 구현하지만 요청하지 않은 코드까지 정리하거나, 장황한 주석을 만들거나, 검증하지 않은 상태를 완료라고 보고하는 문제입니다.

처음에는 해결책이 간단해 보였습니다. `AGENTS.md`에 규칙을 계속 추가하면 된다고 생각했습니다.

하지만 규칙이 늘수록 항상 읽는 Context도 커집니다.

## 반복되는 리뷰 지침을 Repository에 남긴다

Agent에게 반복해서 말하게 되는 내용은 분명히 있습니다.

- 관련 없는 코드를 수정하지 않는다.
- Magic Number를 의미 있는 상수로 올린다.
- 계층 경계를 우회하지 않는다.
- 접근 제한 변경을 가볍게 취급하지 않는다.
- Bug Fix는 재현 가능한 실패 증거부터 만든다.
- 구현 후 실제 Test/Build/CI 결과를 확인한다.

이런 규칙을 매 Session 다시 입력하는 것은 비효율적입니다. Repository 수준의 Agent Instruction이 필요한 이유입니다.

## 그런데 모든 규칙을 AGENTS.md에 넣어야 할까

여기서 OpenForge의 방향을 수정했습니다.

Lint로 결정적으로 검사할 수 있는 규칙까지 Agent에게 자연어로 부탁할 이유가 없습니다. 반대로 Architecture Boundary나 작업 중단 조건처럼 Tool만으로 판단하기 어려운 내용은 Agent Contract에 남길 가치가 있습니다.

그래서 역할을 분리했습니다.

```text
AGENTS.md
  프로젝트별 핵심 계약 / 경계 / 검증 방식
        ↓
Coding Standard
  상세한 Engineering Rule
        ↓
Lint / Test / CI / Policy
  결정적으로 검사 가능한 규칙
        ↓
ADR
  왜 이 구조를 선택했는지 필요한 경우 참조
```

목표는 Agent에게 많은 글을 읽히는 것이 아니라 **항상 필요한 Signal을 작게 유지하는 것**입니다.

## 무엇보다 Evidence가 필요했다

Agent 작업에서 가장 위험한 표현 중 하나는 "완료했습니다"입니다. 실제 Build를 하지 않았거나 CI가 실패했는데도 코드 형태만 보고 완료라고 판단할 수 있습니다.

OpenForge의 Agent Engineering에서는 결과보다 Evidence를 요구하도록 방향을 잡았습니다.

```text
Change
  ↓
Verification
  ↓
Evidence
  ↓
Convergence decision
```

실질적인 작업은 다음 세 상태 중 하나로 수렴하도록 했습니다.

- **A — 완료:** 실제 경로에서 의도한 기능이 동작하고 검증 증거가 있다.
- **B — 유의미한 진전:** 완료는 아니지만 실제 Blocker 하나를 제거하고 다음 Blocker를 증거와 함께 분리했다.
- **C — 중단:** Fragile workaround, 과도한 Scope Expansion, Unsupported assumption이 필요해지는 지점에서 근거를 남기고 멈춘다.

이 규칙의 목적은 Agent를 보수적으로 만드는 것이 아니라 **활동량을 진전으로 착각하지 않게 하는 것**입니다.

## Bug Fix는 실패 증거부터

Bug Fix에서도 같은 원칙을 적용합니다.

가능하면 먼저 문제를 재현하는 Test나 명령을 만들고 실제 실패를 확인합니다. 수정 후 같은 검증이 통과하는지 확인합니다.

```text
Reproduce failure
      ↓
Implement smallest coherent fix
      ↓
Run the same verification
      ↓
Check regression
```

항상 Test를 만들 수 있는 것은 아니지만, 최소한 수정 전후를 비교할 수 있는 Evidence는 필요합니다.

## Smallest diff보다 smallest coherent change

"변경 줄 수를 최소화하라"는 지침도 그대로 사용하지 않았습니다.

Diff를 지나치게 줄이려고 기존 API를 비틀거나 비슷한 함수를 계속 추가하면 코드 구조가 오히려 나빠질 수 있습니다. 그래서 OpenForge에서는 **smallest coherent change**를 선호합니다.

요청과 관계없는 Cleanup은 하지 않되, 기능을 올바르게 완성하는 데 필요한 경계 안에서는 일관된 변경을 허용합니다.

## Agent Instruction도 표준의 일부가 됐다

이 구조를 여러 OSS에 적용하면서 `AGENTS.md` 존재 여부만 보는 것으로는 부족했습니다.

현재 Compliance Metric에서는 Evidence와 Convergence Rule이 실제 구조로 존재하는지도 평가합니다. 단순히 본문 어딘가에 `Evidence`라는 단어가 있다는 이유로 통과시키지 않도록 False Positive Test도 만들었습니다.

Agent Instruction은 Prompt 문서가 아니라 점점 **Repository Engineering Contract**에 가까워졌습니다.

다음 글에서는 이런 공통 규칙의 현재 상태만 남기는 것으로 부족했던 이유, 즉 **왜 그 결정을 했는지를 보존하기 위해 ADR을 도입한 과정**을 다룹니다.

## 관련 자료

- [OpenForge Agent Engineering Standard](https://github.com/dasomel/openforge/blob/main/docs/agent-engineering.md)
- [OpenForge ADR](https://github.com/dasomel/openforge/tree/main/docs/adr)

**이전 글:** 1/7 — 여러 OSS를 만들다 보니 표준을 만들게 됐다  
**다음 글:** 3/7 — OSS 프로젝트에서 코드는 남는데 의사결정은 왜 사라질까
