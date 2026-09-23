---
title: "OpenForge"
description: "An OSS engineering foundation combining a blueprint, Engineering Operating Model, executable governance, agent security, and a portfolio control plane"
github: "https://github.com/dasomel/openforge"
tags: ["Open Source", "Engineering Standards", "GitHub", "CI/CD", "Security", "Supply Chain", "AI", "Agent", "Portfolio Governance", "Templates", "Rust"]
order: 2
type: "own"
featured: true
problem: "As an OSS portfolio grows, repository documentation, CI, security, agent instructions, releases, and maintenance state evolve independently, making implementation claims and evidence drift apart"
solution: "Combine shared standards and templates with executable audits, evidence-driven agent workflows, lifecycle/maintenance registries, and downstream status publication so engineering intent remains reproducible, testable, and reviewable"
---

## Project Overview

**OpenForge** started as a reusable OSS project blueprint and now acts as a **Blueprint + Engineering Standards + Evidence-driven Operating Model + Portfolio Control Plane** for governing the engineering state of multiple open-source projects.

This page deliberately avoids copying fast-aging counts such as the number of standards or template categories. The source of truth for the current standards, templates, ADRs, and portfolio state is the [OpenForge GitHub repository](https://github.com/dasomel/openforge) and its canonical registries.

## Engineering Operating Model

The umbrella lifecycle is:

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

The key rule is that **generated or merged code is not completion by itself**. A change is complete only when intended behavior exists at the relevant boundary, appropriate verification has passed, evidence is retained, and release/recovery implications are understood.

## Implemented Shared Controls

### Executable engineering governance

OpenForge separates declarative rules, executable rules, and judgment. Deterministic requirements should have an executable owner—formatter/linter, test, schema/policy validator, or CI gate—while architecture fit and maintainability remain human-review concerns instead of being reduced to false-green automation.

Revision-bound agent/portfolio audits detect when repository instructions claim a deterministic rule without a corresponding executable owner. The audit's `swallowed_failure_detector` also catches validators whose failures are unconditionally discarded and echo-branch false-greens that fake success with an `echo` statement instead of a real check.

### Risk-Scaled Change Packages

Class C/D changes, and complex Class B changes, first go through a short-lived, review-gated Change Package before broad implementation. The Change Package captures requirements, acceptance scenarios, task traceability, and a verification plan, and is treated as a document with an intentionally short lifecycle once the change lands.

### Executable Maturity Assessment (Rust CLI)

OpenForge does not leave its standards as documentation only. It ships a standalone Rust CLI (`openforge`, Rust 2024 edition) that converts them into deterministic, evidence-based assessment results.

```bash
openforge assess . --format json
openforge assess . --run-execution --format json
openforge assess . --runtime --kube-context my-cluster --format json
openforge compare baseline.json current.json --fail-on-regression
```

The assessment layers are intentionally separated:

- **L1 Repository** — documentation, governance, security, CI/CD, release, platform and web-asset source evidence
- **L2 Execution** — trusted built-in build/test/lint probes for supported ecosystems
- **L3 Runtime** — read-only Kubernetes evidence for availability, policy coverage, RBAC/security, storage/CSI, certificates, backup/restore, observability and GitOps
- **Web runtime evidence** — explicit opt-in checks for immutable cache policy (`WEB-008`) and observable cache effectiveness (`WEB-009`)
- **Optional AI analysis** — AI may interpret a completed report, but never changes deterministic scores, PASS/FAIL status, or collected evidence

Profiles, applicability, time-bounded waivers, baselines, and comparison/regression gates are supported so unlike projects are not forced into the same scoring scope.

### Experimental Agent Harness Evaluation

The same model can behave differently when a coding harness changes its initial instructions, tool schemas, context management, retry behavior, or execution loop. OpenForge provides an experimental, non-normative harness dataset schema (`openforge-agent-harness-dataset/v1`), a neutral comparison CLI, and a bilingual pilot protocol for this. The profile does not recommend a default harness or provider, and only allows comparisons within a controlled cohort that fixes task, revision, provider, OS, and tool profile.

### Agent Execution Security

When an AI/agent can call tools or reach Kubernetes, hosts, directories, filesystems, or other side-effecting systems, repository instructions are not treated as an authorization boundary.

The shared lifecycle is:

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

Profiles have been applied at real or future execution boundaries including Narwhal Portal node Auto-Fix, KubeMetal's future L3 contract, Beluga's read-only Operations Agent, and kube-ready-box sandbox enforcement evidence.

### Portfolio Control Plane

OpenForge does not infer completion from GitHub activity alone.

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

The dashboard represents development/adoption, project relationships and impact, milestones, and maintenance intelligence such as lifecycle stage, blast radius, review cadence, and exit-path readiness.

The canonical portfolio state under `portfolio/` is structured as `projects.json`, `relationships.json`, `milestones.json`, `maintenance.json`, `capability-ownership.json`, `agent-audit.json`, and `legacy-evidence-catalog.json`. **Siqoq** is registered in this registry as well, with `category: Physical AI / Edge AI`, `role: experiment`, and `development_status: active` — showing that portfolio governance applies the same evidence contract to early-stage experimental projects, not only infrastructure projects like kube-ready-box.

A separate Python-based compliance audit engine, `templates/scripts/audit-portfolio.py`, generates reproducible scorecards, delta comparisons, and actionable GitHub gap issues against the shared engineering standards. The current [Portfolio Scorecard](https://github.com/dasomel/openforge/blob/main/docs/portfolio-scorecard.md) tracks adoption across 14 repositories, and [Reference Metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md) tracks 35 standard engineering/maturity metrics.

### Documentation Freshness

User capabilities, architecture, security boundaries, and runtime/platform support are part of the engineering evidence chain.

- distinguish `planned`, `experimental`, `implemented`, and `deprecated`
- bind implementation-status snapshots to the current default branch
- never use unit/mock evidence to overstate real cluster/filesystem/runtime behavior
- treat upstream OSS repositories as the source of truth for blog/project pages

## Maka / Multi-model Runtime Direction

Apache Maka's Runtime Host, durable Event Log, permission boundary, Agent Graph, and declarative Eval architecture contain useful patterns for OpenForge. OpenForge currently **partially adopts those architectural patterns while keeping Maka optional rather than a mandatory runtime dependency**.

Any future multi-model comparison should freeze repository revision, task, budget, and verifier across arms. OpenForge does not automate around provider login or credential controls merely to satisfy a benchmark checkbox.

## Current Role

OpenForge does not take implementation ownership away from downstream projects. Each repository owns its code and runtime evidence; OpenForge provides shared boundaries for:

- recording engineering intent and constraints
- repeatable build/test/security/release baselines
- evidence and convergence contracts for human/agent work
- cross-project status publication and portfolio governance
- maintenance lifecycle, ownership, and exit-path review

The goal is not to make every project identical. It is to preserve product identity and implementation freedom while making common engineering invariants verifiable.

## Links

- [GitHub Repository](https://github.com/dasomel/openforge)
- [/oss Portfolio Dashboard](/oss)
- [Proving Completion in Agent-Assisted Open Source Engineering](/en/posts/proving-completion-agent-assisted-oss)
