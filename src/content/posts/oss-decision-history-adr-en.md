---
title: "Why Does Code Survive While Engineering Decisions Disappear?"
description: "Why I introduced ADRs while managing shared OSS engineering standards in OpenForge, and how ADR → Standard → Automation → Adoption keeps decisions traceable."
pubDate: 2026-08-27
tags: ["Open Source", "ADR", "Architecture", "Engineering", "OpenForge"]
featured: false
draft: false
---

When you develop several open-source projects at the same time, the same decisions appear repeatedly.

How should CI/CD be structured? When should a dependency be upgraded? How much security governance is appropriate for a small OSS? What instructions should a coding agent always load? How much of a UI design system should be shared?

At first, README files, issues, commits, and pull requests seem sufficient. They preserve implementation history well.

Over time, a different problem appears.

**You can see the current rule, but it becomes difficult to find why that rule exists.**

## The more standards you have, the more important `why` becomes

I created [OpenForge](https://github.com/dasomel/openforge) to collect engineering practices that repeat across the OSS projects I build and maintain.

It now covers repository structure, documentation, CI/CD, security, supply chain, releases, upgrade and compatibility engineering, AI-assisted development, and UI/UX design systems.

As these rules began to affect multiple repositories, some changes stopped being simple implementation details.

Examples include:

- Use English as the canonical language while maintaining Korean as a first-class translation.
- Do not upgrade only because a dependency is newer; verify workflow-wide impact.
- Choose OSS security controls by risk rather than maintainer count.
- Keep root `AGENTS.md` context small and move detailed rules to coding standards and deterministic tooling.
- Standardize design semantics and accessibility without forcing every OSS to have the same product identity.
- Do not turn a CI service outage into an automatic security-gate bypass.

These are not merely implementation choices.

They are **engineering decisions made among credible alternatives**.

## Git history was not enough

Git preserves what changed. Issues and pull requests can preserve discussion.

Months later, however, the useful questions are different:

> Why did we choose this approach?
>
> Which alternatives were considered?
>
> What trade-offs were accepted?
>
> Which standards and downstream projects would be affected if this decision changed?

Searching old commits and issues every time does not scale well.

That is why I introduced a formal ADR (Architecture Decision Record) layer in OpenForge.

## ADRs are separate from standards

I did not move every rule into ADRs.

OpenForge separates the responsibilities like this:

```text
ADR
  Why does this durable decision exist?
       ↓
Standard
  What is the current normative rule?
       ↓
Template / CI / Policy
  How is it reused or enforced?
       ↓
Adoption Record / Issue / PR
  Where and when was it applied?
```

This separation matters.

If every historical discussion accumulates inside a standard, the current rule becomes harder to read. If ADRs never lead to standards or automation, they become documentation overhead.

The ADR owns **Why**, the standard owns **What**, templates and CI own **How**, and adoption records own **Where/When**.

## Not every change deserves an ADR

ADR volume can become its own maintenance problem.

OpenForge therefore uses ADRs selectively, for decisions that:

- change a rule inherited by multiple repositories;
- establish long-lived architecture, security, supply-chain, release, or compatibility policy;
- deliberately select one credible alternative over another;
- change a trust or permission boundary;
- create migration or compatibility obligations; or
- are likely to be revisited and need historical rationale.

Typos, wording changes, and routine dependency updates without policy impact do not need ADRs.

## Accepted ADRs are not rewritten

Another rule is to avoid rewriting history when current thinking changes.

ADR states include `Proposed`, `Accepted`, `Superseded`, `Deprecated`, and `Rejected`.

If an accepted decision changes materially, I create a new ADR and mark the previous one as superseded instead of editing the old rationale to match the new decision.

That makes the evolution of engineering judgment visible.

## I also captured existing decisions retrospectively

When the ADR system was introduced, I did not limit it to future decisions.

I reviewed the existing OpenForge standards and captured high-impact decisions that were already being applied across projects.

The initial ADR set includes:

- cross-project decision management;
- English/Korean documentation policy;
- risk-based OSS security and governance;
- trust treatment for AI instructions and plugins;
- workflow-wide upgrade impact analysis;
- lifecycle security and supply-chain controls;
- design-system standardization boundaries;
- context-efficient coding-agent instructions;
- evidence-first agent verification;
- reusable-template policy;
- CI resilience versus security bypass; and
- intentional exception governance.

The interesting part of this exercise was realizing that many decisions had already been made, but **their outcomes lived in standards while their reasoning was scattered across history**.

## Decision records may matter even more with coding agents

Coding agents increasingly read repository instructions and implement changes directly.

Clear standards help, but putting every historical explanation into `AGENTS.md` is not necessarily better. Large always-loaded context can weaken the signal of the constraints that matter for the current task.

A more useful structure is:

```text
AGENTS.md
  ↓
Project-specific constraints
  ↓
OpenForge Standard
  ↓
ADR when rationale is needed
```

The goal is not to give an AI more documentation. The goal is to make the right documentation discoverable at the right time.

## From template repository to engineering knowledge base

OpenForge originally focused on reducing repeated repository setup, CI/CD, documentation, and engineering bootstrap work.

As experience accumulates across multiple projects, its role is expanding.

```text
Reference OSS
    ↓
Real problems and operating experience
    ↓
Decision / ADR
    ↓
OpenForge Standard
    ↓
Template / Automation
    ↓
Adoption by other OSS
    ↓
New feedback
```

If that loop continues, OpenForge can become more than a template repository. It can become an **OSS engineering decision and practice knowledge base**.

The goal is not to create more rules. It is to preserve rules that repeatedly prove useful in real projects, together with the reasons they exist.

## References

- [OpenForge](https://github.com/dasomel/openforge)
- [OpenForge ADR Decision History](https://github.com/dasomel/openforge/tree/main/docs/adr)
- [OpenForge Agent Engineering Standard](https://github.com/dasomel/openforge/blob/main/docs/agent-engineering.md)
- [OpenForge OSS Design System](https://github.com/dasomel/openforge/blob/main/docs/design-system.md)
