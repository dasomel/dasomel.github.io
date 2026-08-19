---
title: "🧭 6개 OSS를 하나의 Engineering Portfolio로 운영하기 — 공통 Engineering Standard를 만들기까지"
description: "Narwhal, Beluga, KubeMetal, kube-ready-box, ldapium, nfs-quota-agent 6개 OSS를 실제 Issue와 repository evidence를 기준으로 점검하고 공통 Engineering/Supply-Chain Standard로 수렴시킨 과정을 정리합니다."
pubDate: 2026-08-20
tags: ["Open Source", "Engineering", "Platform Engineering", "Kubernetes", "Cloud Native", "Supply Chain", "GitHub", "AI-assisted Development"]
featured: false
draft: false
---

## 들어가며

최근 몇 달 동안 개인적으로 여러 개의 오픈소스 프로젝트를 동시에 발전시키고 있습니다.

처음에는 각각의 프로젝트가 서로 다른 문제를 해결하는 독립된 repository라고 생각했습니다.

하지만 프로젝트가 늘어나면서 조금 다른 문제가 보이기 시작했습니다.

> **프로젝트마다 코드를 잘 만드는 것과, 여러 OSS를 지속적으로 운영 가능한 engineering portfolio로 만드는 것은 전혀 다른 문제다.**

예를 들어 어떤 repository는 `Makefile`이 잘 정리되어 있고, 어떤 repository는 `packer/build.sh` 같은 별도의 canonical entrypoint를 사용합니다.

어떤 프로젝트는 `SECURITY.md`와 private vulnerability reporting이 이미 있고, 어떤 프로젝트는 그렇지 않습니다.

어떤 프로젝트는 container image에 SBOM과 provenance까지 붙이고 있지만, 다른 프로젝트는 license와 third-party attribution은 있어도 release evidence가 분리되어 있습니다.

처음에는 이런 차이를 각각의 repository backlog에서 따로 해결했습니다.

그런데 어느 순간부터는 같은 문제를 여러 repository에서 반복하고 있다는 것을 발견했습니다.

그래서 이번에는 방향을 바꿨습니다.

**6개 OSS 전체를 하나의 Engineering Standard checklist로 놓고, 실제 파일·GitHub Actions·Issue·release 문서까지 대조해서 빠진 것만 찾는 방식**으로 정리했습니다.

이 글은 그 과정을 기록한 것입니다.

---

## 1. 현재 운영하고 있는 6개 OSS

이번 점검의 대상은 다음 6개 repository입니다.

```text
                 OSS Engineering Portfolio
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   kube-ready-box     Narwhal         KubeMetal
        │                │                │
        │                ▼                │
        │          Narwhal Portal         │
        │                                  │
        └──────────────┬───────────────────┘
                       │
               Cloud Native / Platform
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
         Beluga             ldapium
             │
             ▼
      Data / Platform         nfs-quota-agent
```

프로젝트의 역할은 서로 다릅니다.

### Narwhal

Kubernetes 기반 Internal Developer Platform(IDP)입니다.

GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway, Management Portal 등을 하나의 재현 가능한 플랫폼으로 통합합니다.

현재 프로젝트 상태에서도 이 통합을 단순 기능이 아니라 제품의 핵심으로 보고 있습니다.

### Beluga

Kubernetes 위에 Kafka, CDC, Flink, Iceberg, Trino, Superset, Airflow 등을 연결하는 데이터 플랫폼입니다.

Narwhal이 플랫폼 영역을 담당한다면 Beluga는 데이터 플랫폼 영역의 실험장이 됩니다.

### KubeMetal

Apple Silicon에서 macOS host의 Metal/MLX compute와 Colima 기반 Kubernetes control plane을 연결하는 hybrid MLOps desktop application입니다.

### kube-ready-box

Kubernetes 개발·실습 환경의 기반이 되는 Ubuntu 기반 Vagrant Box 프로젝트입니다.

Packer로 이미지를 만들고, Kubernetes prerequisite와 OS tuning을 포함한 재현 가능한 VM 환경을 제공합니다.

### ldapium

OpenLDAP을 upstream source에서 직접 빌드하여 container image, UI, Helm chart까지 함께 제공하는 프로젝트입니다.

현재 6개 중 repository governance와 release/supply-chain 구조가 가장 잘 정리된 프로젝트 중 하나입니다.

### nfs-quota-agent

NFS 서버의 XFS/ext4/Btrfs project quota를 Kubernetes PersistentVolume과 연결하는 Kubernetes agent입니다.

Helm, multi-arch image, binary release, SBOM, vulnerability scan까지 연결되어 있습니다.

---

## 2. 왜 "공통 Engineering Standard"가 필요했나

각 프로젝트만 놓고 보면 크게 문제가 없어 보였습니다.

하지만 6개를 동시에 운영하면서 다음과 같은 질문이 계속 반복됐습니다.

```text
어떤 repo는 SECURITY.md가 있는가?

어떤 repo가 release artifact에 SBOM을 붙이는가?

어떤 repo는 Makefile이 canonical인가?

CI가 실제 local command와 같은 것을 실행하는가?

release 전에 smoke test를 하는가?

artifact가 source revision과 연결되는가?

license evidence와 SBOM의 release identity가 같은가?

offline 환경에서도 검증할 수 있는가?
```

처음에는 각각을 별도 Issue로 만들었습니다.

하지만 이것도 한계가 있었습니다.

예를 들어 `SECURITY.md`가 없는 프로젝트를 각각 찾아 수정하면 문제는 해결되지만, **무엇을 기준으로 "충분히 준비되었다"고 판단할 것인가**는 여전히 남습니다.

그래서 필요한 것은 새로운 기능이 아니라 **공통 vocabulary와 definition of done**였습니다.

---

## 3. 처음 만든 것은 기능 목록이 아니라 taxonomy였다

가장 먼저 한 일은 각 프로젝트의 backlog를 다시 보는 것이었습니다.

단순히

```text
feature
bug
docs
security
```

정도로 분류해서는 서로 다른 종류의 프로젝트를 비교하기 어렵습니다.

그래서 최종적으로 다음과 같은 portfolio taxonomy를 사용하게 되었습니다.

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

이 taxonomy의 목적은 모든 repository를 똑같이 만드는 것이 아닙니다.

오히려 반대입니다.

**서로 다른 repository를 서로 다른 방식으로 구현하더라도 동일한 engineering language로 비교할 수 있게 만드는 것**이 목적입니다.

---

## 4. 마지막에 만든 것은 11개 영역의 공통 checklist였다

2026년 8월 20일 기준으로 6개 OSS를 실제 repository state와 대조한 최종 checklist는 다음 11개 영역으로 정리했습니다.

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

이걸 단순 문서가 아니라 **실제 Issue의 audit index**로 사용했습니다.

---

## 5. Repository Governance

첫 번째 영역은 OSS 프로젝트가 기본적으로 신뢰할 수 있는 repository 구조를 갖고 있는가입니다.

최소 기준을 다음처럼 정의했습니다.

```text
LICENSE
NOTICE 또는 third-party attribution
SECURITY.md / private reporting
CONTRIBUTING.md 또는 equivalent
CHANGELOG.md
RELEASING.md 또는 reproducible release procedure
지원 버전 / EOL 정책
public repository security settings
```

이 기준을 적용하면서 재미있는 차이가 드러났습니다.

### ldapium

`LICENSE`, `NOTICE`, `SECURITY.md`, `CONTRIBUTING.md`, `RELEASING.md`까지 갖추고 있었습니다.

release workflow와 Makefile도 이 문서와 연결되어 있습니다.

### Narwhal

보안 정책과 공급망 문서는 상당히 강합니다.

반면 root-level `NOTICE`와 `CONTRIBUTING.md`는 별도로 보강할 여지가 있었습니다.

### Beluga / KubeMetal / nfs-quota-agent

기능 구현과 테스트는 상당히 진행되어 있지만 OSS contribution governance 문서는 프로젝트별로 편차가 있었습니다.

### kube-ready-box

OSS notice와 legal documentation은 잘 갖춰져 있었지만 build interface가 일반적인 Makefile이 아니라 `packer/build.sh`라는 특성이 있습니다.

여기서 중요한 교훈은 **standard가 반드시 동일한 파일명을 요구해서는 안 된다는 것**입니다.

`Makefile`이 없다고 품질이 낮은 것이 아니라, `packer/build.sh`가 명확한 canonical entrypoint라면 그것을 인정해야 합니다.

---

## 6. Build / Reproducibility

두 번째 영역에서는 더 본질적인 질문을 했습니다.

> "새로운 사람이 repository를 clone하면 같은 build를 다시 만들 수 있는가?"

이를 위해 다음을 체크했습니다.

```text
canonical build entrypoint
help / usage
single source of truth
dependency pinning
clean checkout build
architecture matrix
artifact ↔ source revision
false-green 방지
local ↔ CI parity
```

이 과정에서 서로 다른 프로젝트의 방식이 꽤 선명하게 나뉘었습니다.

```text
ldapium / nfs-quota-agent / Beluga / Narwhal
                 │
                 └─ Make 중심

KubeMetal
  └─ Make + Cargo + pnpm

kube-ready-box
  └─ Packer + build.sh
```

따라서 portfolio standard에서는 `make` 자체를 강제하지 않았습니다.

대신 다음을 요구합니다.

> **한 저장소에는 canonical build interface가 하나 있어야 하고, 개발자와 CI가 같은 interface를 사용해야 한다.**

---

## 7. Common Make / Command Vocabulary

그 다음에는 command vocabulary를 통일하기로 했습니다.

모든 repository가 똑같은 구현을 해야 하는 것은 아니지만 가능하면 다음 명령을 공통 언어로 사용합니다.

```text
help
fmt
lint
validate
test
security
license
sbom
build
package
e2e
clean
release
attest
```

예를 들어 지금도 프로젝트마다 이름이 다릅니다.

ldapium은 `make check`가 매우 강력한 canonical gate이고, nfs-quota-agent는 `test`, `vet`, `lint`, `helm-lint` 등이 분리되어 있습니다.

KubeMetal은 `make verify`가 전체 gate 역할을 합니다.

Narwhal은 현재 `lint`, `validate`, `test` 중심입니다.

이것을 억지로 하나로 합치기보다는 alias와 documentation을 이용해 **공통 vocabulary를 맞추는 방향**으로 정했습니다.

---

## 8. CI도 같은 vocabulary로 본다

CI에서는 특히 다음 pipeline을 공통 모델로 정의했습니다.

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

모든 repository가 모든 stage를 구현해야 하는 것은 아닙니다.

VM image 프로젝트와 desktop app이 동일한 E2E를 가질 수는 없습니다.

중요한 것은 **해당 프로젝트에 필요한 stage가 어디에서 실행되는지 설명할 수 있는 것**입니다.

그리고 한 가지 규칙을 강하게 잡았습니다.

> **필수 sub-check가 실패했는데 전체 CI가 성공하면 안 된다.**

실제 audit에서 Beluga의 Makefile에 있는 `helm lint ... || true`는 이 기준에서 발견된 대표적인 개선점이었습니다.

문제가 발생했을 때 "왜 이 오류를 무시했는가"가 명확하지 않다면 결국 false-green의 원인이 될 수 있습니다.

---

## 9. Security Engineering

Security 영역은 코드 취약점만 보는 방식으로는 부족하다고 판단했습니다.

최종 checklist는 다음을 포함합니다.

```text
secret scanning / push protection
credential exposure 방지
dependency vulnerability scan
container/image scan
GitHub token least privilege
release integrity
private security reporting
known limitations
signed / attested release status
```

특히 **현재 구현과 목표 상태를 구분**하도록 했습니다.

예를 들어 Narwhal은 secret scanning, push protection, container SBOM, SLSA provenance, air-gap bundle SBOM까지 갖추고 있지만 signed release는 아직 목표 영역으로 명시하고 있습니다.

이런 식으로

```text
implemented
partial
planned
not applicable
```

를 구분하는 것이 중요합니다.

OSS의 신뢰성은 "모든 기능을 구현했다"보다 **현재 상태를 과장하지 않는 것**에서 더 크게 올라간다고 생각합니다.

---

## 10. License / Third-party Governance

6개 프로젝트를 함께 보면서 의외로 중요했던 영역이 license였습니다.

프로젝트마다 사용하는 third-party의 성격이 다르기 때문입니다.

예를 들어

```text
ldapium
  └─ OpenLDAP upstream source

kube-ready-box
  └─ Ubuntu packages / Packer / Vagrant ecosystem

Narwhal / Beluga
  └─ 수십 개의 upstream container/chart
```

따라서 단순히 root `LICENSE`가 있다고 끝나면 안 됩니다.

최종 기준은 다음으로 확장했습니다.

```text
repository license
third-party attribution
machine-readable license policy
allowed / review / forbidden
upstream-specific attribution
release license evidence
SBOM ↔ license report 동일 release identity
```

이 영역에서는 kube-ready-box의 `NOTICE`, license policy gate와 ldapium의 third-party license generation 구조가 좋은 사례가 되었습니다.

---

## 11. SBOM / Provenance를 하나의 release evidence로 보기

이번 작업에서 가장 중요하게 느낀 부분 중 하나입니다.

SBOM을 단순히 "파일 하나 생성했다"로 보지 않고 **release identity와 연결된 evidence**로 보기로 했습니다.

최소 metadata도 정의했습니다.

```text
artifact
artifact_digest
source
source_revision / commit_sha
version
license
supplier
build_id
workflow_run
platform / arch
provenance
created_at
```

그리고 repository 특성에 따라 다음을 구분합니다.

```text
source artifact
container image
binary/package
VM / box
bundle-level inventory
```

예를 들어 kube-ready-box는 VM/box 수준의 inventory가 핵심이고, nfs-quota-agent는 binary와 container image 양쪽이 중요합니다.

Narwhal은 air-gapped bundle 자체가 supply chain artifact이기 때문에 bundle-level SBOM을 별도로 생성합니다.

이때 중요한 것은 **SBOM의 범위를 정확히 명시하는 것**입니다.

package-level SBOM인지, bundle-level inventory인지 숨기지 않아야 합니다.

---

## 12. Release Management

release도 이제 단순히 `git tag`를 찍는 문제가 아니라고 판단했습니다.

최종 release evidence는 다음을 하나의 chain으로 봅니다.

```text
source
  ↓
commit
  ↓
workflow
  ↓
artifact
  ↓
digest / checksum
  ↓
SBOM
  ↓
license evidence
  ↓
provenance / attestation
  ↓
release
```

여기에 smoke test와 실제 published artifact pull/install verification까지 포함합니다.

특히 컨테이너나 Helm chart는 "빌드가 성공했다"만으로 충분하지 않습니다.

실제 registry에서 pull하고 설치하거나, 실제 실행 상태를 확인해야 합니다.

ldapium의 release documentation과 nfs-quota-agent의 multi-arch release workflow를 보면 이 방향이 이미 상당 부분 적용되어 있습니다.

---

## 13. Test / Quality Conformance

테스트도 단순히 unit test 개수로 비교하지 않았습니다.

repository 특성에 따라 다음을 선택적으로 봅니다.

```text
unit
integration
E2E
upgrade / rollback
negative test
failure injection
offline / air-gap
performance / benchmark
compatibility matrix
regression evidence
machine-readable result
```

Narwhal은 특히 이 부분에서 방향이 명확합니다.

현재 integration incident를 `lessons-log.md`에 기록하고, 실제 회귀 테스트와 연결하는 구조를 갖고 있습니다.

즉,

```text
Incident
   ↓
Lesson
   ↓
Discriminator
   ↓
Regression Test
```

라는 연결입니다.

이 방식은 단순히 테스트를 많이 만드는 것보다 훨씬 가치가 있다고 생각합니다.

---

## 14. Offline / Reproducibility

제가 다루는 프로젝트 중 상당수가 Kubernetes, VM, air-gap, local cluster와 연관되어 있기 때문에 offline을 별도의 영역으로 떼었습니다.

최소 기준은 다음과 같습니다.

```text
required build input enumerable
hidden internet dependency 없음
generated bundle manifest
checksum
offline verification
architecture distinction
transfer 이후 independent verification
```

이 영역은 Narwhal과 kube-ready-box에서 특히 중요합니다.

Narwhal은 실제 air-gapped install을 위해 image뿐 아니라 Helm chart, binary, remote manifest, OS package까지 bundle에 포함시키는 방향으로 발전했습니다.

kube-ready-box는 OS image 자체를 reproducible하게 만드는 역할을 합니다.

---

## 15. Cross-OSS Contract

마지막 영역이 이번 작업에서 가장 portfolio다운 부분입니다.

여기서는 개별 repository가 아니라 **repository 사이의 관계**를 봅니다.

```text
standalone operation
shared source of truth
API / event / schema contract
circular dependency 없음
compatibility matrix
correlation / evidence ID
upgrade compatibility
supported / partial / unavailable / N/A semantics
```

예를 들어 Narwhal과 kube-ready-box는 밀접하지만 서로의 repository를 runtime dependency로 묶지는 않습니다.

Narwhal이 사용하는 기반 box는 명시적인 artifact contract로 연결하고, KubeMetal이 Narwhal GitOps에 편입될 때도 Gitea credentials나 repository structure를 직접 종속시키지 않는 경계를 유지합니다.

이런 구조가 있어야 **각 OSS가 독립적인 프로젝트로 존재하면서도 하나의 engineering portfolio로 움직일 수 있습니다.**

---

## 16. 실제 audit 결과

이번에는 문서를 보고 추측하지 않았습니다.

실제 repository의 다음을 하나씩 대조했습니다.

```text
Repository files
GitHub Actions
Makefile / build entrypoint
README
SECURITY / CONTRIBUTING / RELEASING
LICENSE / NOTICE
SBOM / license scripts
release workflow
existing Issues
```

그 결과는 다음처럼 정리됐습니다.

| Repository | 현재 상태 | 주요 남은 영역 |
|---|---|---|
| Narwhal | 🟢 강함 | NOTICE, CONTRIBUTING, common vocabulary, signing decision |
| Beluga | 🟡 | SECURITY, CONTRIBUTING, CHANGELOG, Make gate 정리 |
| KubeMetal | 🟡 | SECURITY, CONTRIBUTING, NOTICE, dependency reproducibility 확인 |
| kube-ready-box | 🟡 | Make wrapper/equivalent, SECURITY, CONTRIBUTING |
| ldapium | 🟢 가장 성숙 | common vocabulary / portfolio metadata 정렬 |
| nfs-quota-agent | 🟡 | SECURITY, NOTICE, common vocabulary / release evidence 정렬 |

여기서 중요한 것은 **대부분의 프로젝트가 처음부터 다시 만들어야 하는 상태가 아니라는 점**입니다.

이미 좋은 구조를 갖고 있고, 남은 것은 공통 표준에 맞춰 서로 다른 부분을 정렬하는 작업에 가깝습니다.

---

## 17. 그래서 Issue 구조도 바뀌었다

이전에는 프로젝트별로 기능을 계속 추가했습니다.

지금은 다음 구조로 정리했습니다.

```text
Portfolio Taxonomy
        │
        ├── Engineering Standard
        │
        ├── Supply Chain Standard
        │
        ├── Cross-OSS Contract
        │
        └── Repository-specific implementation
```

그리고 6개 OSS에 대한 최종 conformance checklist를 [Narwhal #162](https://github.com/dasomel/narwhal/issues/162)로 등록했습니다.

이 Issue의 역할은 새로운 기능 backlog가 아닙니다.

**6개 repository가 공통 Engineering Standard를 어디까지 만족하고 있는지를 계속 추적하는 audit index**입니다.

각 repository의 실제 작업은 기존 engineering issue에 연결합니다.

```text
Narwhal       → #161
Beluga        → #100
KubeMetal     → #35
kube-ready-box→ #28
ldapium       → #36
nfs-quota-agent→ #16
```

즉, portfolio-wide 기준과 repository-specific 작업을 분리했습니다.

---

## 18. 이번 정리에서 가장 중요했던 것: "모두 같게 만들지 않는다"

이 작업을 하면서 가장 경계했던 것은 표준화가 곧 획일화가 되는 것입니다.

예를 들어

```text
KubeMetal → Rust + Tauri + pnpm
ldapium   → Go + React + Helm
nfs-quota-agent → Go + Helm
Narwhal   → Bash + YAML + Helm + Vagrant
Beluga    → Vagrant + Helm + GitOps + Python
kube-ready-box → Packer + Ubuntu + Vagrant
```

인데 모든 프로젝트에 같은 build command, 같은 test model, 같은 artifact model을 강제하는 것은 오히려 품질을 떨어뜨릴 수 있습니다.

그래서 이번 standard는 implementation을 통일하는 것이 아니라

> **공통된 질문과 공통된 evidence를 통일하는 것**

으로 정의했습니다.

예를 들어

```text
"Makefile이 있는가?"
```

보다

```text
"canonical build entrypoint가 있는가?"
```

가 더 좋은 질문입니다.

또

```text
"SPDX SBOM인가?"
```

보다

```text
"release artifact를 독립적으로 검증할 수 있는 machine-readable SBOM이 있는가?"
```

가 더 좋은 기준입니다.

---

## 19. AI-assisted development와도 연결된다

이 작업은 앞서 작성한 [AI와 함께 오픈소스를 만드는 방법](./ai-assisted-open-source-development)과도 자연스럽게 연결됩니다.

여러 AI를 이용하면서 가장 중요한 것은 어떤 모델이 어떤 파일을 수정했는지가 아닙니다.

중요한 것은 repository가 다음을 가지고 있는가입니다.

```text
Architecture
Engineering Rules
Tests
Operational Knowledge
Supply-chain Evidence
Recovery Rules
```

AI는 이 구조 위에서 동작합니다.

그리고 이번 6개 OSS engineering standard는 다시 말하면 **AI가 프로젝트를 지속적으로 다룰 수 있게 만드는 repository contract**이기도 합니다.

AI가 더 많은 코드를 만들수록 사람에게 필요한 것은 모든 코드를 직접 작성하는 능력보다

```text
경계 설정
source of truth 정의
검증 기준 정의
실패를 evidence로 남기는 것
```

이 될 가능성이 높다고 생각합니다.

---

## 20. 앞으로의 진행 방식

이번 작업으로 새로운 기능 Issue를 무한히 추가하는 방식은 일단 멈추기로 했습니다.

앞으로는 다음 순서로 진행할 생각입니다.

```text
1. Portfolio Standard 확인
        ↓
2. Repository-specific gap 확인
        ↓
3. 실제 파일 / workflow / test 확인
        ↓
4. 필요한 변경만 구현
        ↓
5. CI / release evidence 검증
        ↓
6. checklist 업데이트
```

즉 **"무엇을 더 만들까?"보다 "현재 만든 것이 engineering적으로 얼마나 완성됐는가?"를 먼저 보겠습니다.**

이 방식은 프로젝트가 커질수록 더 중요해질 것 같습니다.

---

## 마무리

이번에 6개 OSS를 한 번에 돌아보면서 가장 크게 느낀 것은 프로젝트 수가 많아지는 것 자체가 중요한 것이 아니라는 점입니다.

중요한 것은 각각의 프로젝트가 서로 다른 목적을 가지면서도

```text
같은 Engineering Language
같은 Quality Vocabulary
같은 Release Evidence Model
같은 Supply-chain Principles
```

을 공유할 수 있는가였습니다.

그래서 지금 제 OSS portfolio는 단순히

```text
Narwhal
Beluga
KubeMetal
kube-ready-box
ldapium
nfs-quota-agent
```

이라는 6개의 repository가 아니라,

```text
                 Engineering Standard
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Platform OSS      Data OSS       Desktop / Infra OSS
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                  Shared Evidence
                         │
                         ▼
                 Reproducible OSS
```

를 만드는 실험에 더 가깝습니다.

그리고 이것이 AI-assisted development가 확산될수록 더 중요한 기반이 될 것이라고 생각합니다.

> **AI로 더 많은 코드를 만드는 것이 목표가 아니라, 여러 프로젝트를 더 오래 유지할 수 있는 engineering system을 만드는 것이 목표다.**

이번 [Narwhal #162](https://github.com/dasomel/narwhal/issues/162)는 그 시스템을 코드 밖에서 처음으로 하나의 checklist로 묶은 기록입니다.

---

## 관련 프로젝트

- [Narwhal](https://github.com/dasomel/narwhal)
- [Beluga](https://github.com/dasomel/beluga)
- [KubeMetal](https://github.com/dasomel/kubemetal)
- [kube-ready-box](https://github.com/dasomel/kube-ready-box)
- [ldapium](https://github.com/dasomel/ldapium)
- [nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
- [Narwhal IDP Portal](https://github.com/dasomel/narwhal-portal)
- [Luna Chat Coder](https://github.com/Osteoporosis/luna-chat-coder)
- [Narwhal #161 — Portfolio Engineering/Supply-Chain Standard](https://github.com/dasomel/narwhal/issues/161)
- [Narwhal #162 — Final OSS Engineering Standard Conformance Checklist](https://github.com/dasomel/narwhal/issues/162)
