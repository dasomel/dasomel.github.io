---
title: "OpenForge"
description: "OSS Blueprint를 넘어 Engineering Operating Model, Executable Governance, Agent Security와 Portfolio Control Plane을 제공하는 오픈소스 엔지니어링 기반"
github: "https://github.com/dasomel/openforge"
tags: ["Open Source", "Engineering Standards", "GitHub", "CI/CD", "Security", "Supply Chain", "AI", "Agent", "Portfolio Governance", "Templates", "Rust"]
order: 2
type: "own"
featured: true
problem: "OSS가 늘어날수록 repository별 문서·CI·보안·Agent 지침·릴리스·유지보수 상태가 서로 다른 방식으로 진화해 실제 구현 상태와 설명, 검증 근거가 쉽게 어긋남"
solution: "공통 Standards와 Templates에 더해 executable audit, evidence-driven agent workflow, lifecycle/maintenance registry와 downstream status publication을 결합해 engineering intent를 재현·검증·리뷰 가능한 시스템으로 운영"
---

## 프로젝트 소개

**OpenForge**는 오픈소스 프로젝트를 시작하기 위한 템플릿 모음에서 출발해, 현재는 여러 OSS의 엔지니어링 상태를 일관되게 정의하고 검증하는 **Blueprint + Engineering Standards + Evidence-driven Operating Model + Portfolio Control Plane**으로 발전하고 있습니다.

표준의 개수처럼 쉽게 낡는 숫자를 이 페이지에 복제하지 않습니다. 현재 standards, templates, ADR, portfolio 상태의 source of truth는 항상 [OpenForge GitHub 저장소](https://github.com/dasomel/openforge)와 그 안의 canonical registry입니다.

## Engineering Operating Model

OpenForge의 상위 lifecycle은 다음과 같습니다.

```text
Intent
  ↓
Constraints / Repository Context
  ↓
Human or Agent Implementation
  ↓
Executable Checks
  ↓
Evidence
  ↓
Human Review / Stewardship
  ↓
Release / Rollback
  ↓
Observe / Learn / Improve
```

핵심은 **코드가 생성됐거나 merge됐다는 사실을 완료로 보지 않는 것**입니다. 해당 변경이 의도한 경계에서 실제로 동작하고, 적절한 evidence class의 검증을 통과하며, release와 rollback 영향까지 이해됐을 때 완료로 취급합니다.

## 현재 구현된 공통 제어

### Executable engineering governance

OpenForge는 문서 규칙과 실행 가능한 규칙을 분리합니다. Formatter/linter, test, schema/policy validator, CI gate처럼 결정론적으로 검사할 수 있는 것은 executable owner를 갖게 하고, architecture fit이나 maintainability처럼 사람의 판단이 필요한 항목은 억지로 false-green 자동화로 바꾸지 않습니다.

Agent Engineering Audit과 revision-bound portfolio matrix는 repository의 `AGENTS.md` 지침이 실제 executable check와 연결됐는지 점검합니다. 이 audit은 `swallowed_failure_detector`를 통해 validator의 실패가 조건 없이 삼켜지는 패턴과, echo만으로 성공을 위장하는 echo-branch false-green 패턴을 함께 탐지합니다.

### 리스크 기반 Change Package

Class C/D처럼 영향 범위가 큰 변경과 복잡한 Class B 변경은, 넓은 구현 전에 짧게 유지되는 review-gated Change Package를 먼저 거칩니다. 이 Change Package는 requirements, acceptance scenario, task traceability, verification plan을 포함하며, 승인 이후 단명(short-lived)하는 문서로 취급됩니다.

### Executable Maturity Assessment (Rust CLI)

OpenForge는 standards를 문서로만 두지 않고, deterministic하고 evidence-based한 assessment 결과로 변환하는 독립 Rust CLI(`openforge`, Rust 2024 edition)를 제공합니다.

```bash
openforge assess . --format json
openforge assess . --run-execution --format json
openforge assess . --runtime --kube-context my-cluster --format json
openforge compare baseline.json current.json --fail-on-regression
```

Assessment는 의도적으로 계층을 분리합니다.

- **L1 Repository** — 문서, governance, security, CI/CD, release, platform/web-asset evidence
- **L2 Execution** — 지원 생태계별 내장 build/test/lint probe
- **L3 Runtime** — availability, policy coverage, RBAC/security, storage/CSI, certificate, backup/restore, observability, GitOps에 대한 read-only Kubernetes evidence
- **Web runtime evidence** — 불변 cache policy(`WEB-008`)와 관측 가능한 cache 효과(`WEB-009`)에 대한 명시적 opt-in 체크
- **Optional AI 분석** — AI는 완료된 report를 해석할 수 있지만 deterministic score, PASS/FAIL 상태, 수집된 evidence를 바꾸지 않음

Profile, applicability, time-bounded waiver, baseline, comparison/regression gate를 지원해 성격이 다른 프로젝트를 동일한 scoring scope로 강제하지 않습니다.

### Experimental Agent Harness Evaluation

같은 model이라도 coding harness의 초기 instruction, tool schema, context 관리, retry 동작, execution loop가 다르면 결과가 달라질 수 있습니다. OpenForge는 이를 위해 실험적이고 non-normative한 harness dataset schema(`openforge-agent-harness-dataset/v1`), neutral comparison CLI, bilingual pilot protocol을 제공합니다. 이 profile은 기본 harness나 provider를 추천하지 않으며, task/revision/provider/OS/tool profile을 고정한 controlled cohort 안에서만 결과를 비교하도록 강제합니다.

### Agent Execution Security

AI/agent가 tool, Kubernetes, host, directory, filesystem 같은 side effect 경로에 접근하는 경우 repository instruction만으로 authorization을 대신하지 않습니다.

OpenForge의 공통 계약은 다음 lifecycle을 사용합니다.

```text
resolve concrete invocation once
  → validate / authorize
  → attenuate authority
  → exact approval when required
  → runtime revalidation
  → enforce / execute
  → post-state verification
  → recomputable evidence
```

이 계약은 Narwhal Portal의 node Auto-Fix, KubeMetal의 future L3 execution contract, Beluga의 read-only Operations Agent, kube-ready-box의 sandbox enforcement evidence provider 등 각 프로젝트의 실제 boundary에 맞는 profile로 적용됐습니다.

### Portfolio Control Plane

각 프로젝트의 개발 완료 여부를 OpenForge가 GitHub commit 수로 추측하지 않습니다.

```text
Downstream implementation
        ↓
CI / verification
        ↓
project status payload
        ↓
OpenForge status PR
        ↓
validation + merge
        ↓
canonical portfolio state
        ↓
/oss dashboard
```

Portfolio dashboard는 development status, adoption, relationship/impact, milestone뿐 아니라 maintenance lifecycle과 blast radius, review/exit-path readiness도 함께 표현합니다.

Canonical portfolio state는 `portfolio/` 아래 `projects.json`, `relationships.json`, `milestones.json`, `maintenance.json`, `capability-ownership.json`, `agent-audit.json`, `legacy-evidence-catalog.json`으로 구조화돼 있습니다. 이 registry에는 **Siqoq**도 `category: Physical AI / Edge AI`, `role: experiment`, `development_status: active`로 등록되어 있어, portfolio governance가 kube-ready-box류의 인프라 프로젝트뿐 아니라 초기 단계의 실험적 프로젝트도 같은 evidence 계약으로 다룬다는 것을 보여줍니다.

별도로 Python 기반 `templates/scripts/audit-portfolio.py` compliance audit engine이 존재해, 공유 엔지니어링 standards를 기준으로 reproducible scorecard와 delta comparison, actionable GitHub gap issue를 생성합니다. 현재 [Portfolio Scorecard](https://github.com/dasomel/openforge/blob/main/docs/portfolio-scorecard.md)는 14개 저장소의 adoption 상태를, [Reference Metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md)는 35개 표준 엔지니어링/성숙도 지표를 추적합니다.

### Documentation Freshness

사용자 기능, architecture, security boundary, runtime/platform 지원이 바뀌면 구현과 문서를 같은 engineering evidence chain에서 다룹니다.

- `planned` / `experimental` / `implemented` / `deprecated` 상태를 구분
- implementation-status snapshot을 `main` revision 기준으로 유지
- unit/mock evidence로 real cluster/filesystem/runtime 동작을 과장하지 않음
- blog/project page는 upstream OSS가 source of truth

## Maka / Multi-model runtime 방향

Apache Maka의 Runtime Host, durable Event Log, permission boundary, Agent Graph, declarative Eval 구조는 OpenForge와 잘 맞는 부분이 있습니다. 하지만 OpenForge는 특정 model/runtime이나 provider credential에 종속되지 않도록 **아키텍처 패턴만 부분 차용하고 Maka를 필수 dependency로 두지 않는 방향**을 선택했습니다.

Model 비교가 필요할 경우 동일한 repository revision, task, budget, verifier를 고정한 reproducible experiment로 수행하며, 사용자 provider login이나 credential을 우회하지 않습니다.

## 프로젝트의 현재 역할

OpenForge는 개별 OSS 구현을 대신하는 control plane이 아닙니다. 각 repository가 자신의 code와 runtime evidence를 소유하고, OpenForge는 다음 공통 경계를 제공합니다.

- engineering intent와 constraints를 기록하는 방법
- 반복 가능한 build/test/security/release baseline
- agent/human 작업의 evidence와 convergence contract
- cross-project 상태 publication과 portfolio governance
- maintenance lifecycle과 장기 소유권/exit-path review

이 구조의 목표는 모든 프로젝트를 똑같이 만드는 것이 아니라, **프로젝트별 정체성과 구현 선택을 유지하면서 공통 품질 불변식은 검증 가능하게 만드는 것**입니다.

## Links

- [GitHub Repository](https://github.com/dasomel/openforge)
- [/oss Portfolio Dashboard](/oss)
- [AI 에이전트 시대 OSS에서 완료를 증명하는 방법](/posts/proving-completion-agent-assisted-oss)
