---
title: "Can We Measure Whether Standards Are Actually Adopted?"
description: "How OpenForge uses 35 stable metrics and profile-based applicability to assess 14 OSS repositories and establish a 52.5% portfolio adoption baseline."
pubDate: 2026-08-28
tags: ["Compliance", "Open Source", "Engineering", "OpenForge", "Automation"]
featured: false
draft: true
---

> **OpenForge Engineering Series — 5/7**

As the standards corpus grew, a new question appeared:

**How much of it are the actual OSS repositories following?**

A README checklist drifts from reality. Once the portfolio grows beyond a handful of repositories, manually opening files and checking them repeatedly does not scale.

That led to the OpenForge Portfolio Compliance Audit.

## The first goal was visibility, not ranking

The audit engine was not designed to rank projects for its own sake.

The useful flow was:

```text
Requirement
    ↓
Evidence
    ↓
Score
    ↓
Gap
    ↓
Action / Issue / PR
```

The system needed to identify which standards apply, what evidence exists, and what remains missing in a repeatable way.

## 35 stable metrics

The prototype began as roughly thirty check functions. A comparable baseline required identifiers that would survive wording changes.

The formal `2026.08` metric set contains 35 stable IDs:

```text
DOC-001 ~ DOC-009       9
ARCH-001 ~ ARCH-004     4
GH-001 ~ GH-005         5
CI-001 ~ CI-006         6
SEC-001 ~ SEC-005       5
AGENT-001 ~ AGENT-003   3
DESIGN-001 ~ DESIGN-002 2
I18N-001                1
                       --
                       35
```

Applicable metrics are scored `0 / 1 / 2`; non-applicable metrics are `N/A`.

## Why N/A matters

A single denominator for every project would be simpler, but misleading. A documentation site should not automatically fail a container-security metric, and a headless CLI should not need UI design tokens.

Profiles and archetypes therefore determine applicability, with `N/A` excluded from the denominator.

```text
score = earned / possible applicable points
```

All current metric weights remain 1, while the metadata model leaves room for future weighting if evidence eventually justifies it.

## A standard tool cannot depend on one developer's Mac

The first audit script contained local workspace paths. That was convenient for personal use but inappropriate for a reusable OpenForge tool.

Portfolio definition moved into configuration, with support for:

```text
--config
--workspace-root
OPENFORGE_PORTFOLIO_CONFIG
OPENFORGE_WORKSPACE_ROOT
```

Public JSON and scorecards no longer expose paths such as `/Users/<name>/...`.

Ordering is deterministic so that the same commit and metric set produce equivalent results apart from intentionally non-deterministic metadata such as timestamps.

## The first official baseline was 52.5%

The first assessment of 14 active OSS repositories with the stable 35-metric set produced:

```text
Portfolio Adoption:          52.5% (468 / 892)
OpenForge Standard Maturity: 96.9% (62 / 64)
```

The 52.5% figure is **not OpenForge's implementation completeness**. It represents how much of the OpenForge standard was adopted across the 14-repository portfolio.

An earlier 52.6% prototype used 33 non-stable checks. Expanding to the stable metric set changed both numerator and denominator, so the two numbers are not treated as a regression of an identical metric model.

## Gaps matter more than the score

The audit does not end at a scorecard.

Gaps are grouped into areas such as documentation, architecture, CI, security, agent engineering, design system, and i18n, and can become GitHub issue drafts.

Baseline comparison distinguishes:

- new gaps;
- resolved gaps;
- regressions;
- repository score deltas; and
- portfolio delta.

That makes it possible to ask a more useful question than "which project has the lowest score?": **which change closes the most meaningful gaps across the portfolio?**

## Audit the audit engine

If the compliance tool produces incorrect scores, every downstream priority becomes distorted.

The engine therefore gained standard-library `unittest` fixtures for stable-ID integrity, legacy Korean filenames, unpaired ADRs, missing design contracts, N/A handling, malformed configuration, false positives, and baseline compatibility.

At the first completion gate, all 12 tests passed and deterministic output was verified for repeated equivalent inputs.

That led directly to the next question:

**Does measuring a standard make anyone follow it?**

The next article covers how selected rules became real CI checks and branch-protection requirements.

## References

- [OpenForge Portfolio Scorecard](https://github.com/dasomel/openforge/blob/main/docs/portfolio-scorecard.md)
- [OpenForge Reference Metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md)

**Previous:** 4/7 — A Design System That Does Not Make Every OSS Look the Same  
**Next:** 6/7 — From Documented Standards to CI-Enforced Standards
