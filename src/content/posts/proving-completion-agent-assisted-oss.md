---
title: "AI 에이전트 시대 OSS에서 ‘완료’를 증명하는 방법"
description: "코드 생성이나 merge가 아니라 resolved invocation, CI, runtime evidence, post-state verification, portfolio status까지 연결해 OSS 변경의 완료를 증명한 OpenForge 적용 기록"
pubDate: 2026-09-09
tags: ["Open Source", "AI Agent", "OpenForge", "Security", "CI/CD", "Platform Engineering", "Evidence"]
featured: false
draft: false
---

AI coding agent를 쓰면 코드를 만드는 속도는 빨라집니다. 하지만 OSS를 운영하면서 더 어려운 질문은 그대로 남습니다.

> **“이 변경이 정말 완료됐다는 것을 무엇으로 증명할 것인가?”**

`git diff`가 생겼다는 사실, PR이 merge됐다는 사실, unit test가 green이라는 사실은 서로 다른 evidence입니다. 각각 유용하지만 더 강한 runtime property를 자동으로 증명하지는 않습니다.

OpenForge와 여러 OSS를 같이 개발하면서 이 문제를 다음 lifecycle로 정리했습니다.

```text
Intent
  ↓
Constraints
  ↓
Implementation
  ↓
Executable Checks
  ↓
Evidence
  ↓
Human Review
  ↓
Release / Rollback
  ↓
Portfolio State
```

## 1. “코드가 있다”와 “동작한다”를 분리한다

가장 먼저 evidence class를 구분해야 했습니다.

| Evidence | 증명할 수 있는 것 | 증명하지 못하는 것 |
| --- | --- | --- |
| Unit / Stub | 함수 로직, argument shape, deterministic rule | 실제 kernel/cluster/tool 동작 |
| Integration | 여러 component의 연결 | production-like 환경 전체 성질 |
| Build / Type check | 컴파일·패키징 가능성 | 실제 side effect 성공 |
| Runtime / E2E | 실제 실행 경로의 동작 | 모든 환경/미래 버전의 보장 |
| Post-state verification | 요청 후 실제 상태 변화 | unrelated resource의 안전성 |

예를 들어 nfs-quota-agent의 stubbed `CommandRunner` test가 green이어도 실제 `prjquota` filesystem이 quota를 enforce했다고 말할 수 없습니다. 반대로 real filesystem evidence는 그 runtime property를 직접 증명합니다.

이 차이를 문서와 CI에서 숨기지 않는 것이 evidence-driven engineering의 시작이었습니다.

## 2. Agent가 tool을 선택했다는 것과 실행 권한을 분리한다

LLM이 tool을 호출할 수 있다고 해서 그 tool을 실행할 권한까지 가져야 하는 것은 아닙니다.

OpenForge Agent Execution Security Contract는 다음 순서를 사용합니다.

```text
request
  ↓
resolve concrete tool + target + arguments once
  ↓
validate / authorize
  ↓
attenuate authority
  ↓
exact approval when required
  ↓
runtime revalidation
  ↓
execute
  ↓
post-state verification
  ↓
recomputable evidence
```

핵심은 자연어 의도를 승인하는 대신 **실제로 실행될 resolved invocation을 승인**하는 것입니다.

### Narwhal Portal

Narwhal Portal의 privileged node Auto-Fix에서는 server가 target/arguments를 resolve하고 canonical digest를 만든 뒤 human approval을 받습니다. 실행 직전 server가 다시 동일 invocation을 계산하고 actor, digest, expiry, replay를 검사합니다.

따라서 사용자가 승인한 뒤 target이나 argument가 바뀌면 `runHostJob` 전에 차단됩니다.

이 경로는 PR #90에서 unit regression, TypeScript check, Next.js build까지 검증한 뒤 merge했습니다.

## 3. 미래 기능에도 authority ceiling부터 만든다

KubeMetal에는 LLM이 임의 mutation을 실행하는 ChatOps runtime이 아직 없습니다. 여기서 보안 기능을 구현한다는 이유로 autonomous executor를 새로 만드는 것은 오히려 잘못된 방향입니다.

대신 future L3 execution이 생기면 반드시 통과해야 하는 Rust contract를 먼저 만들었습니다.

```text
Session Authority Ceiling
  ↓
Canonical Resolved Invocation
  ↓
Attenuated Child Grant
  ↓
Exact L3 Approval
  ↓
Expiry / Replay Guard
```

L2 proposal-only 작업은 executable authority를 받을 수 없게 했고, 기존 사람이 직접 누르는 Tauri mutation command는 그대로 유지했습니다.

즉 “보안 표준 적용”이 “자동 실행 기능 추가”를 의미하지 않도록 경계를 지켰습니다.

## 4. Read-only PoC도 fail-closed여야 한다

Beluga Operations Agent의 첫 PoC는 read-only diagnostic으로 제한했습니다.

Policy 파일이 임의 shell command나 argument를 주입할 수 없게 executable argv를 code-owned fixed set으로 두고, 요청을 다음 risk class로 분류했습니다.

- read-only diagnostics
- data mutation
- external egress
- privileged platform operation

현재 PoC에서 뒤의 세 class는 approval metadata가 있어도 실행되지 않습니다. Executor에 도달하기 전에 차단합니다.

이렇게 하면 “approval이 있으니 실행 가능”이라는 잘못된 privilege upgrade를 방지할 수 있습니다.

## 5. Sandbox 존재와 실제 enforcement도 분리한다

kube-ready-box에서는 또 다른 false-green이 생길 수 있습니다.

`RuntimeClass` YAML이 repository에 있다는 사실과 실제 sandbox runtime에서 Pod가 실행됐다는 사실은 다릅니다.

그래서 `kube-ready-sandbox/v1` evidence를 다음 상태로 분리했습니다.

```text
declared
  → supported
  → effective
  → verified
```

CI에서는 fake kubectl을 사용해 evidence producer의 schema와 control flow를 검증할 수 있습니다. 하지만 이 결과를 실제 gVisor/kernel isolation evidence라고 부르지 않습니다.

실제 `effective` evidence는 real Kubernetes node에서 RuntimeClass Pod가 Ready가 되고 seccomp/NoNewPrivs와 negative probe가 통과했을 때만 성립합니다.

## 6. 모든 프로젝트에 같은 Agent Runtime을 넣지 않는다

Agent security 표준을 portfolio 전체에 적용하면서 중요한 결론이 하나 더 있었습니다.

**Agent가 없는 프로젝트에 Agent를 새로 넣지 않는다.**

nfs-quota-agent, LDAPium, ClusterDeck은 현재 제품의 실제 execution boundary를 기준으로 reduced profile을 정의했습니다.

- nfs-quota-agent: privileged quota controller / validated argv / real filesystem evidence
- LDAPium: directory read/mutation/destructive/bulk/credential operation class
- ClusterDeck: Rust `CommandRunner`, SSH/filesystem sink validation, managed-file boundary

향후 AI/autonomous mutation이 추가되면 exact resolved-operation approval chain을 적용하도록 계약을 남겼지만, checkbox를 채우기 위해 지금 불필요한 agent runtime을 추가하지는 않았습니다.

## 7. Merge와 개발 완료도 분리한다

마지막으로 repository 하나의 PR merge와 portfolio 관점의 완료를 분리했습니다.

```text
Implementation
  ↓
Repository CI / Verification
  ↓
Project Status Payload
  ↓
OpenForge Status PR
  ↓
Portfolio Validation
  ↓
Merge
  ↓
Canonical Portfolio State
  ↓
/oss Dashboard
```

이 모델에서 OpenForge는 commit 수나 issue 상태를 보고 downstream 프로젝트가 완료됐다고 추측하지 않습니다. 각 repository가 자신이 검증한 상태와 evidence를 publication contract로 전달합니다.

Portfolio에는 development/adoption뿐 아니라 maintenance lifecycle, blast radius, owner/review cadence, exit-path readiness도 같이 관리합니다.

## 8. AI 시대에 사람이 맡는 일

Agent가 구현을 많이 수행할수록 human responsibility가 없어지는 것이 아니라 위치가 바뀝니다.

사람이 계속 소유해야 하는 것은 다음과 같습니다.

- architecture와 product direction
- permission/risk boundary
- evidence가 충분한지에 대한 판단
- maintainability와 community fit
- exception과 failure 처리
- release/rollback decision

OpenForge의 목표는 autonomous repository가 아닙니다.

> **Engineering intent를 agent와 automation이 실행할 수 있게 만들되, 그 결과가 올바른지 evidence로 검증하고 책임 있는 human stewardship 아래 운영하는 것**입니다.

## 정리

AI-assisted OSS에서 좋은 workflow는 “더 많은 코드를 더 빨리 생성하는 것”만으로 완성되지 않습니다.

제가 현재 사용하는 기준은 다음 네 문장으로 줄일 수 있습니다.

1. **Implementation capability is not execution authority.**
2. **A completion claim is not evidence.**
3. **A lower evidence class must not claim a stronger runtime property.**
4. **Merged code is not portfolio completion until verified state is published.**

이 네 가지를 repository instruction, CI, runtime verification, execution evidence, portfolio control plane까지 연결하면 Agent의 속도를 활용하면서도 OSS의 장기 유지보수성과 신뢰성을 같이 높일 수 있습니다.

### 관련 자료

- [OpenForge GitHub](https://github.com/dasomel/openforge)
- [OpenForge 프로젝트 페이지](/projects/openforge)
- [OSS Portfolio Dashboard](/oss)
