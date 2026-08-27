---
title: "A Longer AGENTS.md Was Not the Answer"
description: "How OpenForge separates AI coding-agent contracts, coding standards, deterministic CI checks, and evidence-first convergence instead of putting every rule into AGENTS.md."
pubDate: 2026-08-28
tags: ["AI", "Coding Agent", "Engineering", "OpenForge", "AGENTS.md"]
featured: false
draft: true
---

> **OpenForge Engineering Series — 2/7**

As coding agents became better at implementation, a different class of problems became easier to see. They could build features quickly but also clean up unrelated code, generate excessive comments, or report completion without actually verifying the result.

The first solution looked simple: keep adding rules to `AGENTS.md`.

The problem is that every added rule also expands the context that is loaded for every task.

## Keep recurring review guidance in the repository

Some instructions clearly deserve to persist across sessions:

- Do not modify unrelated code.
- Extract meaningful repeated constants instead of scattering magic values.
- Preserve architecture boundaries.
- Treat visibility changes as design changes.
- Start bug fixes from reproducible failure evidence when possible.
- Verify the implementation with real tests, builds, or CI.

Repeating these instructions in every session is inefficient. Repository-level agent guidance has real value.

## But should every rule live in AGENTS.md?

This is where OpenForge changed direction.

A rule that a linter can enforce deterministically should usually be enforced by tooling, not by repeatedly asking a probabilistic agent to remember it. Architecture boundaries and stop conditions, on the other hand, may belong in the agent contract.

The responsibilities became:

```text
AGENTS.md
  Project contract / boundaries / verification
        ↓
Coding Standard
  Detailed engineering rules
        ↓
Lint / Test / CI / Policy
  Deterministic enforcement
        ↓
ADR
  Rationale when needed
```

The goal is not to make the agent read more text. It is to **keep the always-loaded signal small and relevant**.

## Evidence mattered more than another style rule

One of the riskiest phrases in agent-driven development is "done." Code may look complete even when it has not been built or when CI still fails.

OpenForge therefore moved toward evidence-first work:

```text
Change
  ↓
Verification
  ↓
Evidence
  ↓
Convergence decision
```

Substantial work should converge to one of three states:

- **A — Complete:** the intended behavior works on the real path and has verification evidence.
- **B — Meaningful progress:** the feature is incomplete, but one real blocker was removed and the next blocker is isolated with evidence.
- **C — Stop:** continuing would require a fragile workaround, excessive scope expansion, or an unsupported assumption.

The purpose is not to make agents overly conservative. It is to avoid confusing activity with progress.

## Bug fixes start with failure evidence

The same idea applies to bugs.

When possible, reproduce the problem first with a failing test or command. Apply the smallest coherent fix, run the same verification again, and check for regression.

```text
Reproduce failure
      ↓
Implement smallest coherent fix
      ↓
Run the same verification
      ↓
Check regression
```

Not every bug can have a new automated test, but there should still be evidence that distinguishes before from after.

## Smallest coherent change, not merely smallest diff

"Minimize changed lines" can also become counterproductive. An agent may preserve a tiny diff by distorting an existing API or adding a sequence of nearly identical methods.

OpenForge instead prefers the **smallest coherent change**: avoid unrelated cleanup, but make the changes necessary to leave the affected boundary internally consistent.

## Agent instructions became part of repository engineering

After applying this structure across OSS projects, merely checking whether `AGENTS.md` exists was no longer enough.

The compliance model now checks for actual evidence and convergence structure. False-positive fixtures distinguish a real Evidence section from a document that merely contains the word `Evidence` somewhere in prose.

Agent instructions are becoming less like prompt notes and more like a **repository engineering contract**.

The next article explains why even clear standards were not enough: OpenForge also needed to preserve **why durable decisions were made**, which led to ADRs.

## References

- [OpenForge Agent Engineering Standard](https://github.com/dasomel/openforge/blob/main/docs/agent-engineering.md)
- [OpenForge ADR](https://github.com/dasomel/openforge/tree/main/docs/adr)

**Previous:** 1/7 — Building Multiple OSS Projects Led Me to Build a Standard  
**Next:** 3/7 — Why Does Code Survive While Engineering Decisions Disappear?
