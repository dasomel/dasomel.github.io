---
title: OpenForge Documentation
description: OSS Project Blueprint, reusable engineering standards, templates, and reference practices.
project: OpenForge
path: openforge/overview
order: 1000
lastModified: 2026-08-22
---

# OpenForge Documentation

**OpenForge** is a shared **Project Blueprint + Engineering Standards** for creating, evolving, and maintaining open-source projects.

It turns recurring OSS engineering foundations—repository structure, documentation, GitHub operations, CI/CD, security, supply chain, release, and operations—into reusable standards and implementation templates.

## Engineering Loop

```text
Project Definition
      ↓
Repository Bootstrap
      ↓
Documentation / Architecture
      ↓
Standards + Templates
      ↓
Implementation / CI / Security
      ↓
Release / Operations
      ↓
Evidence / Lessons / Metrics
      ↓
OpenForge Improvement
      ↺
```

OpenForge does not prescribe a programming language, cloud, runtime, or application architecture. Projects can adapt the baseline to their context and record important deviations through ADRs.

## What This Portal Adds

The OpenForge repository is the **source of truth for implementation assets**. The `/oss/en/openforge/` space focuses on engineering context:

- Why a standard is needed
- When it should be applied
- What trade-offs it introduces
- How it is applied to real OSS projects
- What changes, incidents, reviews, and metrics teach us

The goal is to explain how to apply the baseline rather than duplicate the repository README.

## Core Documents

- [Concepts](/oss/en/openforge/concepts) — Standard / Template / Evidence and the Trust, Change, and Governance Models
- [Getting Started](/oss/en/openforge/getting-started) — A practical starting path for existing OSS projects
- [Standards](/oss/en/openforge/standards) — Standards grouped by engineering concern
- [Templates](/oss/en/openforge/templates) — Reusable implementation starting points
- [Blueprints](/oss/en/openforge/blueprints) — Project lifecycle and adoption sequence
- [Operations](/oss/en/openforge/operations) — Operations, resilience, backup, and observability
- [Reference](/oss/en/openforge/reference) — Source-of-truth and evidence mapping
- [Troubleshooting](/oss/en/openforge/troubleshooting) — Problems encountered during adoption and their responses
- [ADR](/oss/en/openforge/adr) — Important engineering decisions behind OpenForge

## Source of Truth

- **Implementation**: [dasomel/openforge](https://github.com/dasomel/openforge)
- **Standards**: [docs/](https://github.com/dasomel/openforge/tree/main/docs)
- **Templates**: [templates/](https://github.com/dasomel/openforge/tree/main/templates)
- **Reference implementation**: the target OSS repository

> Korean documentation uses the same structure under `/oss/openforge/...`.
