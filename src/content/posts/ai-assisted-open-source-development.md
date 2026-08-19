---
title: "🤖 AI와 함께 오픈소스를 만드는 방법 — Narwhal을 개발하며"
description: "ChatGPT, Claude, Gemini, Copilot을 실제 오픈소스 개발에 함께 사용하면서 Narwhal과 여러 Cloud Native 프로젝트를 만들어 가는 과정과 생각을 정리합니다."
pubDate: 2026-08-19
tags: ["AI", "Open Source", "Narwhal", "Kubernetes", "Cloud Native", "Platform Engineering", "AI Agent"]
featured: false
draft: false
---

## 들어가며

최근 GeekNews에서 AI 시대의 개발 방식과 AI-first 소프트웨어 개발에 관한 글을 읽으면서 한 가지 생각이 들었습니다.

AI를 개발에 활용하는 방법에 대해서는 이미 많은 이야기가 나왔습니다.

Copilot으로 코드를 자동완성하고, Claude Code나 Gemini CLI로 여러 파일을 수정하고, ChatGPT에게 코드를 작성하게 하는 것은 이제 특별한 일이 아닙니다.

그런데 실제로 오픈소스 프로젝트를 몇 달 동안 계속 개발해 보면 조금 다른 문제가 보입니다.

> **AI가 코드를 얼마나 잘 작성하느냐보다, AI를 이용해서 어떤 소프트웨어를 계속 만들어 갈 것인가가 더 중요하다.**

저 역시 현재 ChatGPT, Claude, Gemini, GitHub Copilot을 함께 사용하고 있습니다.

그리고 이 도구들을 이용해 단순한 샘플 프로젝트가 아니라 실제로 계속 유지하고 발전시키는 오픈소스 프로젝트들을 만들고 있습니다.

대표적인 프로젝트가 Kubernetes 기반 Internal Developer Platform인 **Narwhal**입니다.

이 글에서는 특정 AI 도구의 성능을 비교하기보다, **AI를 실제 오픈소스 개발 workflow에 어떻게 넣고 있는지**, 그리고 그 과정에서 개발자의 역할이 어떻게 바뀌고 있는지를 정리해 보려고 합니다.

---

## 1. AI를 사용해서 무엇을 만들고 있는가?

현재 가장 큰 프로젝트는 [Narwhal](https://github.com/dasomel/narwhal)입니다.

Narwhal은 Kubernetes 위에 GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway, Management Portal 등을 통합한 **오픈소스 Kubernetes Internal Developer Platform**입니다.

중요한 것은 단순히 Kubernetes를 설치하는 프로젝트가 아니라는 점입니다.

```text
Kubernetes
    +
GitOps
SSO / IAM
API Gateway
Service Mesh
Observability
Registry
Storage
Backup
Security / Policy
Management Portal
        ↓
    하나의 플랫폼
```

실제 플랫폼에서는 Kubernetes 설치 자체보다 그 위에서 서로 다른 프로젝트가 어떻게 연결되는지가 더 어렵습니다.

예를 들어 다음과 같은 문제가 발생합니다.

```text
Kubernetes
   ↕
Keycloak
   ↕
APISIX
   ↕
Istio
   ↕
ArgoCD
   ↕
Grafana / Gitea / Harbor / Headlamp
```

각각은 독립적으로 잘 동작하더라도 서로 연결되는 순간 문제가 생깁니다.

인증 claim이 맞지 않거나,

TLS 체인이 다르거나,

Service Mesh가 예상하지 못한 방식으로 트래픽을 처리하거나,

특정 chart 버전의 변경으로 기존 configuration이 깨지거나,

air-gapped 환경에서 당연하게 보였던 외부 dependency가 사라지기도 합니다.

Narwhal은 이런 **integration 자체를 제품의 일부로 보고 있습니다.**

---

## 2. Narwhal에서 중요한 것은 코드보다 통합 지식이다

Narwhal을 개발하면서 가장 많이 배운 것은 모든 문제를 코드로 해결할 수 있는 것은 아니라는 점입니다.

어떤 문제는 Kubernetes 문제이고,

어떤 문제는 Helm chart 문제이며,

어떤 문제는 Keycloak configuration 문제이고,

또 어떤 문제는 두 시스템 사이의 compatibility 문제입니다.

그래서 Narwhal에는 발생했던 문제를 단순한 issue로 끝내지 않고 기록하는 구조를 만들었습니다.

현재 `lessons-log.md`에는 **263건의 날짜별 incident**가 기록되어 있습니다.

그리고 하나의 문제를 다음과 같은 흐름으로 관리합니다.

```text
Incident
   ↓
Lesson
   ↓
Discriminator
   ↓
Regression Test
```

즉,

> "이 문제는 이렇게 고쳤다."

에서 끝나는 것이 아니라,

> "다음에 비슷한 문제가 발생했을 때 이전 문제와 어떻게 구분할 것인가?"

까지 기록합니다.

그리고 그 지식을 테스트로 연결합니다.

이 방식은 AI를 사용하는 개발에서도 매우 중요하다고 생각합니다.

AI에게 단순히 코드를 생성시키는 것보다 **과거의 실패와 해결 방법을 repository에 남겨두는 것**이 훨씬 강력하기 때문입니다.

---

## 3. AI에게 코드를 맡기는 것과 AI와 함께 개발하는 것은 다르다

AI coding을 처음 사용할 때는 보통 이렇게 생각합니다.

```text
문제 설명
    ↓
AI가 코드 작성
    ↓
실행
    ↓
오류 발생
    ↓
다시 AI에게 수정 요청
```

이것도 어느 정도는 동작합니다.

하지만 프로젝트가 커지면 곧 한계가 옵니다.

파일이 수십 개가 되고,

GitHub Actions가 여러 개 존재하고,

Kubernetes manifest와 Helm chart가 연결되고,

기존 장애를 재현하는 테스트가 존재하고,

이미 다른 사람이 만들어 놓은 운영 규칙이 있다면

AI에게 매번 처음부터 설명하는 방식은 오래 갈 수 없습니다.

그래서 제가 만든 **Luna Chat Coder**도 같은 문제의식에서 출발했습니다.

AI가 무엇을 하느냐보다

```text
어떤 repository state를 기준으로 하는가?
어디에서 작업하는가?
무엇을 변경해도 되는가?
어떻게 검증하는가?
어떻게 복구하는가?
```

를 repository 자체에 남기는 것입니다.

---

## 4. 여러 AI를 함께 사용한다

현재 저는 하나의 AI 도구만 사용하지 않습니다.

```text
ChatGPT
Claude
Gemini
GitHub Copilot
```

그리고 이들을 경쟁 관계라기보다 서로 다른 작업을 수행하는 개발 도구로 보고 있습니다.

예를 들어 하나의 프로젝트를 개발할 때도

```text
아이디어 / 설계
     ↓
여러 AI에게 검토
     ↓
코드 작성
     ↓
테스트
     ↓
문제 분석
     ↓
다른 모델의 재검토
     ↓
GitHub 반영
```

같은 workflow를 사용합니다.

중요한 것은 **어느 모델이 코드를 작성했는가가 최종 결과를 결정하지 않는다는 것**입니다.

결국 source of truth는 Git repository이고,

최종 판단은 테스트와 실제 동작이 합니다.

이런 구조에서는 오히려 여러 모델을 사용하는 것이 장점이 될 수 있습니다.

하나의 모델이 놓친 문제를 다른 모델이 발견할 수 있기 때문입니다.

---

## 5. Narwhal을 개발하면서 AI의 역할이 달라지고 있다

Narwhal처럼 여러 프로젝트를 통합하는 시스템에서는 AI에게 단순한 코드 생성만 맡기기 어렵습니다.

예를 들어 다음과 같은 작업이 있습니다.

```text
Kubernetes 버전 변경
       ↓
Cilium 변경
       ↓
Istio compatibility 확인
       ↓
APISIX / cert-manager 영향 확인
       ↓
Keycloak OIDC 확인
       ↓
ArgoCD / Grafana / Gitea / Harbor 확인
       ↓
회귀 테스트 실행
```

한 군데의 변경이 여러 프로젝트에 영향을 줄 수 있습니다.

이런 상황에서 AI의 가장 큰 장점은 **프로젝트 전체를 탐색하고 변경의 범위를 빠르게 추적하는 것**이라고 느끼고 있습니다.

예전에는 사람이

```text
grep
kubectl
git diff
grep
문서 검색
GitHub 검색
```

을 반복해서 확인했다면,

지금은 AI에게

> "이 버전 변경이 전체 플랫폼에 어떤 영향을 주는지 확인해라."

라고 작업 범위를 줄 수 있습니다.

물론 AI의 판단을 그대로 신뢰하지는 않습니다.

AI가 찾아낸 dependency graph를 다시 실제 manifest, script, test, cluster state로 확인합니다.

즉,

> **AI는 탐색 속도를 높이고, 검증은 시스템이 담당한다.**

라는 원칙에 가깝습니다.

---

## 6. Narwhal Portal도 AI-assisted development로 만들고 있다

Narwhal 자체만으로도 상당히 큰 프로젝트이기 때문에 관리 포털도 별도의 프로젝트로 분리했습니다.

[Narwhal Portal](https://github.com/dasomel/narwhal-portal)은 Next.js 16 + React 19 기반의 관리 포털입니다.

단순한 대시보드가 아니라 다음과 같은 기능을 포함합니다.

```text
Dashboard
Onboarding
Catalog / My Apps
Nodes
Cost
Compliance
Security
Governance
Architecture
Templates
Tools
Settings
```

즉 Kubernetes 관리자와 플랫폼 사용자가 실제로 사용하는 **Day-2 운영 interface**를 만드는 프로젝트입니다.

여기에서도 AI의 역할은 단순히 React 코드를 작성하는 것이 아닙니다.

예를 들어

```text
Kubernetes API
    ↓
Backend API
    ↓
TanStack Query
    ↓
React UI
    ↓
사용자 권한 / Keycloak
```

같은 흐름을 이해하고 변경해야 합니다.

그래서 AI를 사용하면서도 repository 안에 architecture, conventions, security rules, development workflow를 계속 남겨두고 있습니다.

---

## 7. kube-ready-box도 하나의 퍼즐이다

Narwhal을 계속 개발하다 보면 또 하나의 문제가 생깁니다.

> "그 환경 자체를 어떻게 reproducible하게 만들 것인가?"

그래서 [kube-ready-box](https://github.com/dasomel/kube-ready-box)도 함께 개발하고 있습니다.

이 프로젝트는 Kubernetes에 필요한 구성 요소가 미리 준비된 Ubuntu 기반 Vagrant Box를 만드는 프로젝트입니다.

Narwhal의 기반 환경을 보면

```text
Packer
  ↓
Ubuntu
  ↓
Kubernetes prerequisites
  ↓
Vagrant
  ↓
Narwhal cluster
```

라는 연결이 생깁니다.

결국 개별 repository는 독립된 프로젝트라기보다 하나의 개발 ecosystem을 구성합니다.

```text
kube-ready-box
       ↓
    Narwhal
       ↓
Narwhal Portal
       ↓
 Kubernetes IDP
```

그리고 이 전체 ecosystem을 여러 AI를 이용해 계속 발전시키고 있습니다.

---

## 8. AI 시대의 오픈소스 개발은 "코드 생성"보다 "시스템 유지"가 중요하다

AI를 이용하면 첫 번째 버전을 만드는 속도는 확실히 빨라집니다.

하지만 오픈소스 프로젝트에서 진짜 어려운 것은 첫 번째 버전이 아닙니다.

어려운 것은

```text
v0.1
 ↓
v0.2
 ↓
v1.0
 ↓
Kubernetes upgrade
 ↓
dependency upgrade
 ↓
새로운 architecture
 ↓
새로운 요구사항
```

을 계속 유지하는 것입니다.

Narwhal에서 제가 중요하게 보고 있는 것도 바로 이 부분입니다.

현재 프로젝트는 Kubernetes v1.35를 기반으로 하고 있으며 GitOps로 35개 애플리케이션을 관리합니다.

그리고 단순히 많은 컴포넌트를 묶는 것이 아니라 통합 과정에서 발생한 incident를 계속 회귀 테스트로 연결하고 있습니다.

즉 오픈소스 프로젝트를 만드는 방식 자체가

```text
Code
  +
Configuration
  +
Documentation
  +
Tests
  +
Incident history
  +
Automation
```

의 결합으로 바뀌고 있습니다.

AI가 발전할수록 이 구조는 더 중요해질 것이라고 생각합니다.

---

## 9. 개발자의 역할도 달라지고 있다

AI가 코드 작성 능력을 빠르게 가져오면서 개발자의 역할도 변하고 있습니다.

예전에는

```text
무엇을 구현할 것인가?
        ↓
어떻게 구현할 것인가?
        ↓
코드를 작성한다
```

가 주요 과정이었다면,

지금은 점점

```text
무엇을 만들 것인가?
        ↓
어떤 구조로 만들 것인가?
        ↓
AI에게 어떻게 작업을 분해할 것인가?
        ↓
AI의 결과를 어떻게 검증할 것인가?
        ↓
어떤 지식을 repository에 남길 것인가?
```

가 더 중요해지고 있습니다.

결국 AI 시대의 개발자는 코드를 작성하는 사람인 동시에

**AI가 제대로 일할 수 있는 개발 환경을 설계하는 사람**

이 되어가는 것 같습니다.

---

## 10. 그래서 AI를 위한 "개발 환경" 자체를 만들고 있다

이런 생각이 이어지면서 제가 만들고 있는 것이 Luna Chat Coder입니다.

Narwhal처럼 복잡한 프로젝트를 여러 AI가 함께 수정하다 보면 자연스럽게 이런 질문이 생깁니다.

```text
AI가 바뀌면 workflow도 바뀌어야 하는가?
```

저는 아니라고 생각합니다.

모델은 바뀔 수 있습니다.

도구도 바뀔 수 있습니다.

하지만 다음은 repository에 남아 있어야 합니다.

```text
Engineering Rules
    +
Architecture
    +
Tests
    +
Operational Knowledge
    +
Recovery Rules
```

Luna는 이 부분을 repository-local skill이라는 형태로 정리하려는 시도입니다.

그래서 현재 개발하고 있는 프로젝트들이 서로 따로 떨어져 있지 않습니다.

```text
AI Tools
 ├─ ChatGPT
 ├─ Claude
 ├─ Gemini
 └─ Copilot
       │
       ▼
Luna Chat Coder
       │
       ├───────────────┐
       ▼               ▼
   Narwhal        Narwhal Portal
       │
       ▼
kube-ready-box
       │
       ▼
 Kubernetes IDP
```

---

## 11. 지금의 개발 방식은 "AI-assisted"에서 "AI-native"로 가는 과정일지도 모른다

지금은 보통 AI-assisted development라는 표현을 사용합니다.

하지만 제가 실제 프로젝트를 개발하면서 느끼는 것은 조금 다릅니다.

처음에는

> 사람이 개발하고 AI가 도와준다.

였다면,

이제는

> 사람이 시스템의 방향과 품질 기준을 정하고 여러 AI가 구현과 탐색을 함께 수행한다.

에 가까워지고 있습니다.

그리고 다음 단계에서는 아마

> **AI가 처음부터 참여하는 것을 전제로 repository와 development workflow 자체를 설계한다.**

가 될지도 모르겠습니다.

Narwhal을 개발하면서 incident를 테스트로 남기고,

Luna를 개발하면서 AI workflow를 repository에 남기고,

Portal을 개발하면서 architecture와 conventions를 AI가 이해할 수 있도록 구조화하는 것도 결국 같은 방향이라고 생각합니다.

---

## 마무리

AI 시대에 오픈소스를 만드는 방법도 바뀌고 있습니다.

예전에는 혼자서 코드를 작성하고 GitHub에 올리는 것이 중심이었다면,

지금은 여러 AI 도구를 적극적으로 활용하면서도

```text
Repository
Architecture
Tests
Documentation
Operational Knowledge
AI Workflow
```

를 하나의 시스템으로 만들어야 한다고 생각합니다.

현재 제가 개발하고 있는 **Narwhal, Narwhal Portal, kube-ready-box, Luna Chat Coder**도 각각 독립적인 프로젝트처럼 보이지만 실제로는 하나의 개발 방향에서 출발하고 있습니다.

> **AI를 이용해 더 많은 코드를 만드는 것이 아니라, AI를 이용해 더 큰 시스템을 지속적으로 만들어 갈 수 있는 개발 환경을 만드는 것.**

지금은 그 방법을 직접 실험하고 있는 단계입니다.

관련 프로젝트:

- [Narwhal](https://github.com/dasomel/narwhal)
- [Narwhal IDP Portal](https://github.com/dasomel/narwhal-portal)
- [kube-ready-box](https://github.com/dasomel/kube-ready-box)
- [Luna Chat Coder](https://github.com/Osteoporosis/luna-chat-coder)
- 참고: [GeekNews](https://news.hada.io/topic?id=32569)
