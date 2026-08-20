---
title: "🧭 7개 OSS를 하나의 Engineering Portfolio로 운영하기 — OpenForge로 공통 Engineering Standard 만들기"
description: "Narwhal, Beluga, KubeMetal, kube-ready-box, ldapium, nfs-quota-agent, OpenForge를 하나의 OSS Engineering Portfolio로 보고 실제 repository evidence를 기준으로 공통 Engineering/Supply-Chain Standard를 수립한 과정을 정리합니다."
pubDate: 2026-08-20
tags: ["Open Source", "Engineering", "Platform Engineering", "Kubernetes", "Cloud Native", "Supply Chain", "GitHub", "AI-assisted Development"]
featured: false
draft: false
---

## 들어가며

최근 몇 달 동안 여러 개의 오픈소스 프로젝트를 동시에 발전시키면서 한 가지 문제가 반복해서 보이기 시작했습니다.

처음에는 각각의 repository가 서로 다른 문제를 해결하는 독립된 프로젝트라고 생각했습니다.

하지만 프로젝트가 늘어나자 새로운 문제가 생겼습니다.

> **각 repository의 코드를 잘 만드는 것과, 여러 OSS를 지속적으로 운영 가능한 engineering portfolio로 만드는 것은 전혀 다른 문제다.**

어떤 프로젝트는 `Makefile`이 중심이고, 어떤 프로젝트는 `packer/build.sh`가 canonical entrypoint입니다. 어떤 프로젝트는 `SECURITY.md`와 private vulnerability reporting을 갖고 있고, 다른 프로젝트는 아직 보강 중입니다. 어떤 프로젝트는 SBOM과 provenance까지 release에 연결하지만, 다른 프로젝트는 license와 third-party attribution은 잘 갖추고 있어도 release evidence가 분리되어 있습니다.

처음에는 각각의 backlog에서 문제를 따로 해결했습니다.

그러다 같은 종류의 문제가 repository마다 반복되고 있다는 사실을 발견했습니다.

그래서 접근 방식을 바꿨습니다.

**여러 OSS를 하나의 Engineering Standard checklist로 놓고 실제 파일, GitHub Actions, Issue, release 문서, 공급망 evidence까지 대조하는 방식**으로 portfolio 전체를 바라보기 시작했습니다.

그리고 이 과정에서 또 하나의 프로젝트가 필요하다는 결론에 도달했습니다.

바로 **OpenForge**입니다.

OpenForge는 새로운 runtime이나 platform component가 아닙니다. repository structure, documentation, GitHub workflow, CI/CD, security, release, localization, development tooling, AI-assisted development, lifecycle practices를 반복 가능한 기준으로 묶는 **OSS Project Blueprint & Engineering Standards**입니다.

즉 기존 OSS들을 모두 같은 방식으로 만드는 것이 아니라, 서로 다른 프로젝트가 같은 engineering language를 사용할 수 있게 하는 표준화 계층입니다.

---

## 1. 현재 운영하고 있는 7개 OSS

이번 관점에서 portfolio를 다시 그리면 다음과 같습니다.

```text
                 OSS Engineering Portfolio
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
         OpenForge              Cloud / Platform OSS
              │                       │
              │          ┌────────────┼────────────┐
              │          ▼            ▼            ▼
              │       Narwhal       Beluga      KubeMetal
              │          │            │
              │          ▼            ▼
              │   Narwhal Portal   Data Platform
              │
              └──────────────┬────────────────────┘
                             │
                     Reusable Standards
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    kube-ready-box        ldapium        nfs-quota-agent
```

각 프로젝트는 다른 문제를 해결합니다.

### Narwhal

Kubernetes 기반 Internal Developer Platform(IDP)입니다.

GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway, Management Portal 등을 하나의 재현 가능한 플랫폼으로 통합합니다.

### Beluga

Kubernetes 위에서 CDC, Kafka, Flink, Iceberg, Trino, Superset, Airflow 등을 연결하는 데이터 플랫폼입니다.

Narwhal이 platform engineering의 중심이라면 Beluga는 data platform engineering의 실험장 역할을 합니다.

### KubeMetal

Apple Silicon의 macOS host compute와 Kubernetes control plane을 연결하는 hybrid MLOps desktop application입니다.

### kube-ready-box

Kubernetes 개발·실습 환경을 위한 Ubuntu 기반 Vagrant Box입니다.

Packer를 사용해 OS tuning과 Kubernetes prerequisite를 포함하는 재현 가능한 VM 환경을 만듭니다.

### ldapium

Upstream OpenLDAP을 직접 빌드하고 container image, UI, Helm chart까지 함께 제공하는 프로젝트입니다.

Repository governance와 release/supply-chain 구조를 실제 운영 수준으로 다듬는 좋은 reference가 되었습니다.

### nfs-quota-agent

NFS의 XFS/ext4/Btrfs project quota를 Kubernetes PersistentVolume과 연결하는 Kubernetes agent입니다.

Helm, multi-arch image, binary release, SBOM, vulnerability scan까지 공급망 흐름을 함께 다룹니다.

### OpenForge

OpenForge는 위 프로젝트들을 실행하는 또 하나의 runtime component가 아닙니다.

오히려 repository 자체를 어떻게 시작하고, 문서화하고, CI로 검증하고, security와 release evidence를 남기고, localization과 AI-assisted development를 운영할지를 정의하는 **공통 engineering foundation**입니다.

현재 OpenForge는 다음을 표준화합니다.

```text
Repository
Documentation
GitHub
Development
Tooling
Security
CI/CD
Release
Internationalization
OSS Compliance
Reference Practices
Reference Metrics
```

중요한 것은 **모든 repository가 OpenForge의 구현을 그대로 복사해야 하는 것은 아니라는 점**입니다.

OpenForge는 defaults와 vocabulary를 제공하고, 각 project는 필요한 부분만 채택하며 의도적인 차이는 ADR 등으로 설명합니다.

---

## 2. OpenForge를 추가하면서 바뀐 질문

6개 OSS만 놓고 보면 질문은 주로 다음과 같았습니다.

```text
어떤 repository가 SECURITY.md를 갖고 있는가?
어떤 repository가 SBOM을 생성하는가?
어떤 repository가 release evidence를 남기는가?
```

OpenForge를 함께 놓고 보니 질문이 한 단계 올라갑니다.

> **"각 repository에 이 기능이 있는가?"가 아니라 "이 기능을 portfolio 전체에서 어떤 기준으로 정의할 것인가?"**

예를 들어 `SECURITY.md` 파일 하나를 추가하는 것은 쉽습니다.

하지만 실제로 필요한 것은 다음입니다.

```text
Security policy
    ↓
Private reporting
    ↓
Credential protection
    ↓
Dependency / image scan
    ↓
Release integrity
    ↓
Known limitations
```

즉 파일 존재 여부가 아니라 engineering intent와 lifecycle 전체를 봐야 합니다.

OpenForge가 필요한 이유도 여기에 있습니다.

---

## 3. 기능 목록보다 먼저 taxonomy를 만들었다

처음부터 프로젝트별 기능을 늘리는 대신 portfolio 전체의 engineering language부터 정리했습니다.

```text
Foundation
Platform
Data
Security
Observability
Developer Experience
AI / MLOps
Supply Chain
Release
Documentation
Integration
```

이 taxonomy는 repository를 똑같이 만들기 위한 것이 아닙니다.

오히려 서로 다른 프로젝트를 동일한 기준으로 비교하고, 반복되는 backlog를 하나의 언어로 묶기 위한 것입니다.

OpenForge는 이 taxonomy를 실제 repository standard와 연결합니다.

---

## 4. 공통 checklist가 OpenForge로 바뀌었다

2026년 8월 20일 기준으로 portfolio audit의 핵심 영역은 다음 11개입니다.

```text
1. Repository Governance
2. Build / Dependency Reproducibility
3. Common Make / Command Vocabulary
4. GitHub Actions / CI
5. Security Engineering
6. License / Third-party Governance
7. SBOM / Provenance
8. Release Management
9. Test / Quality Conformance
10. Offline / Reproducibility
11. Cross-OSS Contract
```

처음에는 이 checklist를 블로그 문서와 Issue로만 관리했습니다.

하지만 프로젝트가 늘어나자 기준 자체가 repository 밖에 머무르는 것이 불편해졌습니다.

그래서 OpenForge에 **Reference Practices Audit**과 **Reference Implementation Metrics**를 넣었습니다.

이제 standard가 단순 선언이 아니라 다음과 같은 feedback loop를 갖습니다.

```text
실제 OSS 프로젝트
      ↓
Issue / CI / Release evidence
      ↓
공통 Engineering Standard
      ↓
OpenForge
      ↓
새 프로젝트 bootstrap
      ↓
다시 실제 운영
      ↓
Standard 개선
```

즉 OpenForge도 고정된 헌장이 아니라 **실제 OSS에서 검증하며 계속 발전하는 표준**입니다.

---

## 5. Repository Governance

첫 번째 영역은 repository가 신뢰할 수 있는 OSS 프로젝트의 기본 구조를 갖고 있는가입니다.

최소 기준은 다음처럼 정의했습니다.

```text
LICENSE
NOTICE 또는 third-party attribution
SECURITY.md / private reporting
CONTRIBUTING.md 또는 equivalent
CHANGELOG.md
RELEASING.md 또는 reproducible release procedure
Supported versions / EOL policy
Public repository security settings
```

여기서 중요한 교훈은 **같은 파일명을 강제하는 것이 standard가 아니라는 것**입니다.

예를 들어 kube-ready-box는 일반적인 Go/Node project처럼 `Makefile` 하나를 중심으로 움직이지 않고 Packer와 `build.sh`가 명확한 canonical interface를 제공합니다.

OpenForge는 이런 차이를 허용합니다.

대신 "무엇이 canonical entrypoint인가", "CI와 local workflow가 같은가", "사용자가 어떻게 재현하는가"가 문서와 automation으로 설명되어 있어야 합니다.

---

## 6. Build / Reproducibility

가장 중요한 질문은 간단합니다.

> **새로운 사람이 repository를 clone하면 같은 build를 다시 만들 수 있는가?**

portfolio에서는 다음을 체크합니다.

```text
canonical build entrypoint
help / usage
single source of truth
dependency pinning
clean checkout build
architecture matrix
artifact ↔ source revision
false-green prevention
local ↔ CI parity
```

OpenForge는 여기서 `make` 자체를 강제하지 않습니다.

대신 repository마다 **명확한 canonical build interface 하나**를 요구합니다.

```text
ldapium / nfs-quota-agent / Beluga / Narwhal
                 │
                 └─ Make-oriented

KubeMetal
  └─ Make + Cargo + pnpm

kube-ready-box
  └─ Packer + build.sh
```

이런 다양성을 유지하면서 engineering intent를 통일하는 것이 portfolio standard의 핵심입니다.

---

## 7. CI / Security / Supply Chain

공통 CI 모델은 다음과 같습니다.

```text
validate
   ↓
test
   ↓
security
   ↓
license
   ↓
sbom
   ↓
build
   ↓
package
   ↓
e2e
   ↓
release
   ↓
attest
```

모든 프로젝트가 모든 단계를 구현할 필요는 없습니다.

대신 어떤 단계가 필수인지 설명할 수 있어야 합니다.

특히 다음 원칙을 강하게 유지합니다.

> **필수 sub-check가 실패했는데 전체 CI가 성공하면 안 된다.**

AI-assisted development가 빨라질수록 이 원칙은 더 중요해집니다. 변경 속도가 빨라지면 false-green 하나가 여러 repository로 퍼질 가능성도 커지기 때문입니다.

OpenForge의 Security / CI/CD / Release standard는 이 lifecycle을 repository 단위가 아니라 portfolio 전체에서 재사용하기 위한 기반입니다.

---

## 8. AI 시대에는 Engineering Standard가 더 중요해졌다

AI 에이전트는 repository 하나의 코드만 빠르게 만들 수 있는 것이 아닙니다.

여러 파일을 동시에 수정하고, Issue를 만들고, workflow를 추가하고, release 문서를 바꾸고, dependency를 업데이트할 수도 있습니다.

즉 **한 번의 AI-assisted 작업이 여러 repository에 동시에 영향을 줄 수 있습니다.**

그래서 이제는 단순한 coding guideline만으로 부족합니다.

```text
AGENTS.md / project instructions
            ↓
repository-local policy
            ↓
implementation
            ↓
CI / security / release validation
            ↓
evidence
```

OpenForge가 AI-assisted development를 별도 engineering tooling 영역으로 다루는 이유도 여기에 있습니다.

AI를 표준화한다는 뜻이 아니라, **AI를 사용하더라도 repository의 engineering discipline이 흔들리지 않도록 경계를 명확하게 만든다**는 의미입니다.

---

## 9. OpenForge는 또 하나의 프로젝트가 아니라 표준의 저장소다

처음에는 OpenForge도 그냥 하나의 OSS repository라고 생각했습니다.

하지만 지금은 역할이 조금 다르게 보입니다.

Narwhal은 platform을 만들고,

Beluga는 data platform을 만들고,

KubeMetal은 local MLOps environment를 만들고,

kube-ready-box는 infrastructure foundation을 만들고,

ldapium은 identity component를 만들고,

nfs-quota-agent는 storage integration을 만들고,

**OpenForge는 이 모든 프로젝트에서 반복되는 engineering practice를 표준화합니다.**

그래서 OpenForge의 성공 기준도 GitHub stars나 기능 수만으로 판단하면 안 됩니다.

더 중요한 질문은 다음입니다.

```text
이 standard가 실제 repository에서 사용되는가?

실제로 반복 작업이 줄어드는가?

CI 품질이 좋아지는가?

release evidence가 일관되는가?

새 프로젝트를 bootstrap하는 시간이 줄어드는가?

실제 프로젝트의 feedback이 다시 standard를 개선하는가?
```

이렇게 보면 OpenForge는 **OSS portfolio의 engineering control plane**에 가깝습니다.

---

## 10. 앞으로의 방향

앞으로는 OpenForge 자체를 완성된 framework로 만들기보다, 실제 프로젝트에서 계속 검증하는 방향으로 가져가려고 합니다.

```text
OpenForge
   ↓
Bootstrap / Standard
   ↓
Narwhal / Beluga / KubeMetal / ...
   ↓
Actual Issues / CI / Releases
   ↓
Audit / Metrics
   ↓
OpenForge improvement
```

이렇게 하면 새로운 프로젝트가 추가될 때마다 같은 repository governance, CI/CD, security, release, localization 문제를 처음부터 다시 풀 필요가 없습니다.

반대로 실제 프로젝트가 새로운 문제를 발견하면 그 경험을 다시 OpenForge standard로 되돌릴 수 있습니다.

---

## 결론

이번 작업을 하면서 가장 크게 바뀐 생각은 **"여러 OSS를 운영한다"는 것이 단순히 repository 숫자가 늘어나는 것이 아니라 engineering system을 운영하는 것**이라는 점입니다.

7개의 repository를 똑같이 만드는 것은 목표가 아닙니다.

오히려 각 프로젝트의 architecture와 목적은 최대한 자유롭게 유지하면서,

- 무엇을 repository quality라고 부를지
- 어떻게 CI를 신뢰할지
- release evidence를 어떻게 남길지
- security와 supply chain을 어떻게 검증할지
- AI-assisted development를 어떤 경계 안에서 사용할지

에 대해서는 공통의 언어를 갖는 것이 중요했습니다.

OpenForge는 그 공통 언어를 repository와 실제 engineering workflow 사이에 연결하는 역할을 시작했습니다.

그리고 앞으로의 OSS portfolio에서는 **더 많은 코드를 만드는 것보다, 이미 만든 코드를 반복 가능하고 검증 가능하게 운영하는 능력**이 더 중요해질 것이라고 생각합니다.
