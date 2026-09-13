---
title: "OpenForge"
description: "An OSS engineering foundation combining a blueprint, Engineering Operating Model, executable governance, agent security, and a portfolio control plane"
github: "https://github.com/dasomel/openforge"
tags: ["Open Source", "Engineering Standards", "GitHub", "CI/CD", "Security", "Supply Chain", "AI", "Agent", "Portfolio Governance", "Templates"]
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

Revision-bound agent/portfolio audits detect when repository instructions claim a deterministic rule without a corresponding executable owner.

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
