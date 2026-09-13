---
title: "Proving Completion in Agent-Assisted Open Source Engineering"
description: "An implementation-backed record of treating resolved invocation, CI, runtime evidence, post-state verification, and portfolio publication—not code generation or merge alone—as proof of OSS completion"
pubDate: 2026-09-09
tags: ["Open Source", "AI Agent", "OpenForge", "Security", "CI/CD", "Platform Engineering", "Evidence"]
featured: false
draft: false
---

AI coding agents make code production faster, but they do not remove the harder OSS question:

> **What proves that a change is actually complete?**

A diff, a merged PR, a green unit test, a successful build, and a real runtime verification are different evidence classes. Each is useful; none should silently claim properties stronger than it can demonstrate.

Across OpenForge and several related OSS projects, I converged on this lifecycle:

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

## Separate “code exists” from “behavior works”

| Evidence | Can prove | Does not prove |
| --- | --- | --- |
| Unit / stub | function logic, argument shape, deterministic rules | real kernel/cluster/tool behavior |
| Integration | interaction among components | every production-like property |
| Build / type check | compilation and packaging viability | successful side effects |
| Runtime / E2E | behavior on an exercised runtime path | every environment or future version |
| Post-state verification | the requested state actually changed | unrelated resource safety |

For example, nfs-quota-agent tests use a stubbed command runner to verify quota command construction and parsing. Those tests are valuable, but they cannot prove that a real `prjquota` filesystem enforced the requested limit. That property needs real filesystem evidence.

Making this distinction explicit in documentation and CI is the foundation of evidence-driven engineering.

## Tool capability is not execution authority

A model being able to select a tool must not automatically mean it has authority to execute it.

The OpenForge Agent Execution Security Contract uses this sequence:

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

The important change is approving the **resolved invocation that will actually execute**, not a vague natural-language intention.

### Narwhal Portal

On Narwhal Portal's privileged node Auto-Fix path, the server resolves target and arguments, creates a canonical digest, and presents that exact invocation for human approval. Before execution the server recomputes it and checks actor identity, digest, expiry, and replay state.

If target or arguments change after approval, the request fails before `runHostJob`.

That runtime binding was merged only after regression tests, TypeScript validation, and a Next.js production build passed.

## Put an authority ceiling in place before future automation

KubeMetal does not currently expose a general autonomous ChatOps mutation executor. Adding one merely to demonstrate a security standard would create unnecessary risk.

Instead, its Rust boundary defines what any future L3 execution must pass through:

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

L2 proposal-only work cannot receive executable authority, and the existing human-triggered Tauri mutations remain unchanged.

Security adoption therefore did **not** become an excuse to add autonomous execution.

## A read-only PoC should still fail closed

Beluga's first Operations Agent slice is deliberately read-only.

Executable argv is owned by code rather than injected by policy, and requests are divided into explicit risk classes:

- read-only diagnostics
- data mutation
- external egress
- privileged platform operations

The last three are non-executable in the PoC even if approval metadata is present. They are denied before subprocess execution, preventing “approval exists” from becoming an implicit privilege upgrade.

## Separate sandbox configuration from effective enforcement

kube-ready-box exposed another common false positive: committing a `RuntimeClass` manifest is not evidence that a Pod actually executed in the intended sandbox runtime.

Its sandbox evidence now distinguishes:

```text
declared
  → supported
  → effective
  → verified
```

CI can use a fake kubectl implementation to test the evidence producer's schema and control flow. That CI result is **not** labeled as real gVisor/kernel isolation evidence.

An `effective` result requires a real Kubernetes node, a Ready RuntimeClass Pod, effective seccomp/NoNewPrivs state, and negative probing.

## Do not add an agent runtime to every project

A portfolio-wide security standard does not mean every project should become an agent platform.

Reduced profiles were used where appropriate:

- **nfs-quota-agent** — privileged quota controller, validated command/path boundary, real filesystem verification class
- **LDAPium** — directory read/mutation/destructive/bulk/credential operation classes
- **ClusterDeck** — Rust `CommandRunner`, SSH/filesystem sink validation, managed-file boundaries

Each profile says that a future autonomous mutation surface must adopt exact resolved-operation authorization/approval, without adding such a surface today simply to satisfy a checklist.

## Separate merge from portfolio completion

Repository merge and portfolio completion are also different states.

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

OpenForge does not infer downstream completion from commit volume. The repository that owns the implementation publishes the state it actually verified.

The same portfolio model now also tracks maintenance lifecycle, blast radius, review cadence, and exit-path readiness rather than treating long-term ownership as an afterthought.

## Human responsibility moves; it does not disappear

As agents perform more implementation work, human responsibility shifts toward:

- architecture and product direction
- permission and risk boundaries
- evidence sufficiency
- maintainability and community fit
- exceptions and failure handling
- release and rollback decisions

The goal is not an autonomous repository. It is a repository where engineering intent can be executed efficiently while correctness and consequences remain evidence-backed and human-governed.

## Four rules I now use

1. **Implementation capability is not execution authority.**
2. **A completion claim is not evidence.**
3. **A lower evidence class must not claim a stronger runtime property.**
4. **Merged code is not portfolio completion until verified state is published.**

Connecting those rules to repository instructions, CI, runtime verification, execution evidence, and portfolio governance makes agent-assisted development faster without giving up long-term OSS trust and maintainability.

### Related material

- [OpenForge GitHub](https://github.com/dasomel/openforge)
- [OpenForge project page](/en/projects/openforge)
- [OSS Portfolio Dashboard](/oss)
