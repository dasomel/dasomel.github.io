---
title: "💬 ChatGPT로 안전하게 리포지토리를 개발하는 방법 — Luna Chat Coder 적용기"
description: "ChatGPT의 일반 대화에서 리포지토리 개발을 안정적으로 수행하기 위해 Luna Chat Coder를 실제 기술 블로그에 적용한 과정과 설계 원칙을 정리합니다."
pubDate: 2026-08-19
tags: ["Luna Chat Coder", "ChatGPT", "AI Agent", "GitHub", "Developer Experience", "Cloud Native"]
featured: false
draft: false
---

## 들어가며

최근에는 코드를 작성하는 방법보다 **AI에게 리포지토리를 어떻게 안전하게 맡길 것인가**가 더 중요한 문제가 되고 있습니다.

특히 ChatGPT 같은 일반적인 대화형 AI를 개발에 사용하면 자연스럽게 이런 요구가 생깁니다.

> "이 리포지토리 보고 수정해줘. 테스트하고 GitHub에 반영까지 해줘."

문제는 일반적인 대화만으로는 `의도(intent)`와 `정확한 소스 상태(source state)`, `실행 환경(execution environment)`, `결과의 영속성(durability)`을 모두 보장하기 어렵다는 점입니다.

대화 컨텍스트가 사라질 수도 있고, 샌드박스가 초기화될 수도 있으며, GitHub API나 Actions 사용에 제약이 있을 수도 있습니다. 반대로 이런 제약이 있다고 해서 모든 작업을 GitHub Actions에서 실행하도록 만들면 불필요한 원격 실행 비용과 복잡성이 생깁니다.

그래서 최근 [Luna Chat Coder](https://github.com/Osteoporosis/luna-chat-coder)를 만들고, 실제 운영 중인 제 기술 블로그 저장소인 [dasomel.github.io](https://github.com/dasomel/dasomel.github.io)에 적용해 보았습니다.

이 글에서는 Luna 자체의 사용법보다 **왜 이런 구조를 만들었고, 실제 리포지토리에 어떻게 적용했는지**를 기록합니다.

---

## 1. Luna Chat Coder란?

Luna Chat Coder는 ChatGPT의 일반적인 대화 환경에서 리포지토리 개발을 수행할 때 사용할 수 있도록 만든 **repository-local agent skill**입니다.

핵심 목표는 단순합니다.

```text
Chat
  ↓
Sandbox-first development
  ↓
정확한 GitHub state 확인
  ↓
필요할 때만 GitHub Actions fallback
  ↓
검증된 결과를 가장 단순한 경로로 게시
```

즉, AI에게 별도의 거대한 개발 플랫폼을 제공하는 것이 아니라, **대화형 개발 과정에서 반복해서 발생하는 실패 패턴을 저장소 자체의 정책으로 고정**하는 접근입니다.

Luna의 기본 원칙은 다음과 같습니다.

- **Discover early, activate late** — skill은 먼저 발견하되 Actions는 필요할 때만 사용
- **Exact state first** — 작업 전에 정확한 commit/PR/branch 상태를 식별
- **Sandbox first** — 일반적인 수정·빌드·테스트는 disposable sandbox에서 수행
- **Capability inventory** — 새 도구나 의존성을 가져오기 전에 현재 환경의 capability 확인
- **GitHub as durable source of truth** — 대화 내용보다 실제 Git state를 우선
- **Exact publication** — 변경 규모와 특성에 따라 가장 단순하고 정확한 게시 경로 선택
- **Evidence-based completion** — 실제 실행한 검증만 완료 결과로 보고

Luna는 특정 프로젝트의 빌드 시스템이나 개발 방법을 대신 결정하지 않습니다. 오히려 **프로젝트가 이미 가진 규칙을 최대한 충실하게 실행하기 위한 continuity/fallback layer**에 가깝습니다.

---

## 2. 왜 기존 리포지토리에 적용했는가?

제가 운영하는 `dasomel.github.io`는 단순한 Markdown 저장소가 아닙니다.

현재 Next.js 15 + next-intl 기반의 static site이며 GitHub Pages를 통해 `cne.io.kr`로 배포됩니다. 콘텐츠는 `app/[locale]/{posts,projects,docs,seminars,events}/[slug]` 경로를 사용하고, `npm run build`와 `npm run lint`라는 기존 검증 흐름도 있습니다.

또한 이 저장소에는 이미 `CLAUDE.md`를 비롯한 프로젝트 고유 운영 규칙과 여러 GitHub Actions workflow가 존재합니다.

따라서 새로운 AI 개발 규칙을 도입하면서 가장 경계한 것은 **기존 workflow를 덮어쓰는 것**이었습니다.

실제로 Luna를 적용할 때도 다음과 같이 역할을 분리했습니다.

```text
CLAUDE.md
  └─ 프로젝트 고유 운영 지식

AGENTS.md
  └─ ChatGPT/agent가 Luna를 발견하도록 하는 짧은 entry point

.agents/skills/luna-chat-coder/SKILL.md
  └─ 공통적인 chat-based development policy

기존 project tooling / workflow
  └─ 실제 빌드·lint·배포 규칙
```

이 구조를 사용하면 Luna가 프로젝트의 규칙을 대체하는 것이 아니라, **기존 규칙을 지키면서 대화형 개발을 수행하는 방법만 추가**할 수 있습니다.

현재 저장소의 `AGENTS.md`에도 이 원칙이 명시되어 있습니다. Luna는 continuity/fallback layer이고 기존 `CLAUDE.md` workflow를 대체하지 않습니다.

---

## 3. 실제로 추가한 구조

현재 저장소의 핵심 추가 구조는 매우 작습니다.

```text
AGENTS.md

.agents/
└── skills/
    └── luna-chat-coder/
        ├── SKILL.md
        └── references/
            ├── actions-missions.md
            ├── recovery.md
            └── design-rationale.md
```

여기서 중요한 것은 **top-level entry point와 상세 정책을 분리한 것**입니다.

### AGENTS.md

AI가 저장소에 들어왔을 때 가장 먼저 읽을 수 있는 작은 진입점입니다.

역할은 "이 저장소에서는 Luna skill을 먼저 확인하라" 정도로 제한합니다.

프로젝트의 빌드 명령, 콘텐츠 규칙, 배포 방식 등은 여기에 함께 적을 수 있지만, Luna 자체의 상세 동작을 모두 넣지는 않습니다.

### SKILL.md

여기가 실제 Luna의 canonical policy입니다.

예를 들면 다음과 같은 규칙이 들어 있습니다.

```text
1. exact commit 확인
2. sandbox 우선
3. 기존 capability 조사
4. project-defined tooling 준수
5. GitHub state를 durable source로 취급
6. 실패 원인 진단 후 retry
7. 가장 단순한 exact publication path 선택
8. 실제 실행한 검증만 보고
```

이 정책을 repository-local skill로 넣어 두면 새로운 대화가 시작되어도 동일한 개발 원칙을 다시 설명할 필요가 줄어듭니다.

---

## 4. 가장 중요한 원칙: Sandbox First

Luna를 만들면서 가장 중요하게 본 부분입니다.

AI agent가 GitHub를 직접 조작할 수 있다고 해서 모든 작업을 GitHub Actions에서 수행해야 하는 것은 아닙니다.

대부분의 작업은 다음 정도로 충분합니다.

```text
Repository checkout
       ↓
Sandbox에서 파일 탐색
       ↓
수정
       ↓
Build / Test / Lint
       ↓
정확한 diff 확인
       ↓
GitHub에 게시
```

GitHub Actions는 이 정상 경로를 대체하는 **기본 개발 환경이 아니라 fallback execution boundary**로 사용합니다.

이렇게 하는 이유는 명확합니다.

첫째, 일반적인 개발 작업은 sandbox가 더 빠르고 단순합니다.

둘째, Actions를 매 작업마다 사용하면 workflow startup, artifact, cleanup 등의 운영 부담이 생깁니다.

셋째, 원격 실행은 실패했을 때 원인을 추적해야 할 정보가 더 많습니다.

따라서 Luna에서는 **실제 capability gap이 있을 때만 Actions를 사용**합니다.

---

## 5. 그렇다면 Actions는 언제 사용하는가?

Luna에서는 Actions를 크게 세 가지 경우로 봅니다.

### Supply

sandbox는 코드 수정 자체는 할 수 있지만 필요한 외부 input을 가져올 수 없는 경우입니다.

예를 들어 특정 SDK, native library, generated input 또는 외부 dependency가 필요한 경우입니다.

### Exact transport

변경량이 크거나 binary, mode-sensitive 변경이 포함되어 일반적인 API file write보다 patch/bundle 또는 Git object transport가 더 안전한 경우입니다.

### Degraded remote execution

sandbox 자체를 사용할 수 없거나 사용량·시간·리소스 제한으로 정상적인 작업을 계속할 수 없는 경우입니다.

중요한 점은 **Actions를 무조건 쓰지 않는 것**이 아니라 **왜 쓰는지 설명할 수 있어야 한다는 것**입니다.

---

## 6. GitHub의 정확한 상태를 우선한다

Chat 기반 개발에서 가장 위험한 상황 중 하나는 대화 내용만 가지고 프로젝트 상태를 추측하는 것입니다.

예를 들어 이런 흐름이 가능합니다.

```text
대화에서 파일 내용을 설명함
        ↓
샌드박스가 초기화됨
        ↓
GitHub에는 이미 다른 commit이 존재
        ↓
AI가 이전 대화 내용을 바탕으로 파일을 재구성
        ↓
의도하지 않은 변경 발생
```

Luna는 이런 상황을 피하기 위해 recovery 우선순위를 명확하게 둡니다.

```text
commit / PR head
    > immutable Git 또는 Actions artifact
    > 살아있는 sandbox working tree
    > conversation reconstruction
```

즉 **정확한 source byte가 Git에 존재한다면 대화 내용을 source로 사용하지 않습니다.**

이 원칙은 일반적인 GitOps나 CI/CD에서도 익숙한 모델이지만, conversational coding 환경에서는 특히 중요합니다.

---

## 7. 실제 저장소에도 이런 문제를 적용했다

이번 적용 시점의 저장소에는 이미 Luna 도입을 위한 변경이 반영되어 있습니다.

현재 commit은 다음과 같습니다.

```text
chore: adopt Luna Chat Coder workflow

Adopt Luna Chat Coder workflow and repair recent daily digest enrichment
```

그리고 이 commit에 의해 `AGENTS.md`와 `.agents/skills/luna-chat-coder/` 구조가 저장소에 들어갔습니다.

특히 `AGENTS.md`에서는 이 프로젝트가 지켜야 할 불변 조건도 같이 정의했습니다.

```text
Next.js 15 + next-intl
output: export
GitHub Pages deployment
npm run build
npm run lint
기존 lockfile 유지
기존 GitHub Actions publication behavior 유지
```

이렇게 하면 AI가 "더 편한 방법"을 이유로 프로젝트의 런타임이나 dependency, 배포 구조를 임의로 바꾸는 것을 줄일 수 있습니다.

---

## 8. ChatGPT Web에서 GitHub 연결을 두 개 사용하는 이유

Luna 문서를 작성하면서 이 부분도 명확하게 정리했습니다.

ChatGPT Web workflow에서는 서로 다른 두 계층이 존재합니다.

### GitHub Plugin

ChatGPT 쪽에서 GitHub 리포지토리를 다루기 위한 workflow/tool capability입니다.

### ChatGPT Codex Connector

GitHub 쪽에서 실제 target repository access를 부여하는 authorization boundary입니다.

둘은 같은 기능이 아닙니다.

개념적으로 보면 다음과 같습니다.

```text
ChatGPT
  │
  ├── GitHub Plugin
  │      └── tool/workflow capability
  │
  └── Codex Connector
         └── repository authorization
```

이 둘을 구분하지 않으면 "GitHub가 연결되어 있는데 왜 이 저장소는 수정하지 못하지?" 같은 문제를 해결하기가 어렵습니다.

---

## 9. 기존 리포지토리를 위한 적용 방식

Luna의 장점은 기존 프로젝트에 큰 구조 변경 없이 넣을 수 있다는 점입니다.

기본적으로 다음 skill directory를 추가합니다.

```text
.agents/skills/luna-chat-coder/
```

그 다음 기존 `AGENTS.md` 또는 agent instruction이 있다면 Luna의 짧은 entry-point를 프로젝트 규칙과 합칩니다.

여기서 중요한 것은 **기존 프로젝트 규칙을 삭제하지 않는 것**입니다.

예를 들어 기존 프로젝트에 다음이 있다면 그대로 유지합니다.

```text
CLAUDE.md
CONTRIBUTING.md
개발 규칙
빌드 규칙
테스트 규칙
배포 규칙
```

Luna는 그 위에서 대화형 개발의 continuity와 fallback만 담당합니다.

---

## 10. 이번 적용에서 느낀 가장 큰 변화

처음에는 Luna를 단순한 "AI coding instruction" 정도로 생각했습니다.

그런데 실제 저장소에 적용해 보니 핵심은 **프롬프트가 아니라 운영 경계(boundary)를 정의하는 것**에 더 가깝다는 생각이 들었습니다.

예를 들어 다음 질문을 명확하게 정리할 수 있게 됩니다.

```text
어디에서 코드를 수정하는가?
→ sandbox

무엇을 source of truth로 보는가?
→ Git commit / PR head

언제 원격 실행을 하는가?
→ 실제 capability gap이 있을 때

어떤 상태를 복구 가능한 것으로 보는가?
→ durable Git / artifact 우선

언제 작업 완료라고 말할 수 있는가?
→ 실제 검증을 수행했을 때
```

이런 기준이 없으면 AI agent는 기술적으로 똑똑하더라도 실행 환경의 우연한 상태에 의존하게 됩니다.

반대로 이런 경계를 명시하면 모델이 바뀌거나 대화가 끊겨도 어느 정도 일관된 workflow를 유지할 수 있습니다.

---

## 11. 앞으로의 방향

이번에는 기술 블로그 저장소에 먼저 적용했습니다.

다음 단계는 제가 운영하는 다른 개발 리포지토리에도 같은 패턴을 적용해 보는 것입니다.

특히 Kubernetes와 Cloud Native 프로젝트처럼 다음 요소가 많은 저장소에서 효과를 더 확인할 수 있을 것 같습니다.

- 복잡한 CI/CD
- 여러 개의 GitHub Actions workflow
- Helm/Kustomize와 같은 선언적 구성
- 긴 빌드/테스트 시간
- 여러 agent가 동시에 작업할 가능성
- 대규모 multi-file 변경
- offline 또는 restricted network 환경

결국 Luna의 목표는 AI가 개발자를 대신하는 것이 아니라, **AI가 개발에 참여하더라도 소프트웨어 엔지니어링의 기본 원칙인 재현성, 추적성, 복구 가능성을 잃지 않도록 하는 것**입니다.

---

## 마무리

ChatGPT 같은 대화형 AI가 개발에 깊숙하게 들어오면서 "AI가 코드를 잘 작성하는가"라는 질문은 이미 어느 정도 답을 얻고 있습니다.

이제 더 중요한 질문은 다음일 수 있습니다.

> **AI가 만든 변경을 우리가 얼마나 안전하게 검증하고, 복구하고, 재현할 수 있는가?**

Luna Chat Coder는 이 문제를 거창한 플랫폼으로 해결하기보다 **repository-local policy + sandbox-first + durable Git state + bounded Actions fallback**이라는 작은 모델로 풀어보려는 시도입니다.

이번 `dasomel.github.io` 적용은 그 모델을 실제 운영 저장소에 적용한 첫 번째 사례입니다.

관련 프로젝트:

- [Luna Chat Coder](https://github.com/Osteoporosis/luna-chat-coder)
- [dasomel.github.io](https://github.com/dasomel/dasomel.github.io)

