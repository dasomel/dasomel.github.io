---
title: Documentation Overview
description: OSS Project Blueprint, reusable engineering standards, templates, and reference practices.
project: OpenForge
path: openforge/overview
order: 1000
lastModified: 2026-08-23
---

# Documentation Overview

**OpenForge** is a shared **Project Blueprint + Engineering Standards + Reusable Templates** foundation for creating, evolving, deploying, operating, and maintaining high-quality open-source software.

It turns recurring OSS engineering foundations—repository structure, documentation guidelines, GitHub operations, CI/CD pipelines, supply chain security, release governance, and operational runbooks—into reusable standards and production-ready templates.

## Engineering Lifecycle Loop

```text
Project Definition (Purpose, scope, license definition)
      ↓
Repository Bootstrap (Directory layout, GitHub templates)
      ↓
Documentation / Architecture (README pairs, ADR structure, inventory)
      ↓
Standards + Templates (CI/CD, Docker, K8s, security baseline)
      ↓
Implementation / CI / Security (Language toolchain, build, security scan)
      ↓
Release / Operations (SemVer, SBOM, signing, observability, backup)
      ↓
Evidence / Lessons / Metrics (Maturity Scorecard evaluation)
      ↓
OpenForge Improvement (Feedback into shared standards and templates)
      ↺
```

OpenForge does not prescribe a specific programming language or application framework. Projects adapt the baseline to their own operational context and record intentional architectural deviations through [ADRs (Architecture Decision Records)](/oss/en/openforge/adr).

## What This Portal Adds

While the OpenForge GitHub repository serves as the **authoritative source of truth for implementation assets**, the `/oss/en/openforge/` web portal focuses on technical context:

- **Why a standard is necessary**: The fundamental engineering motivation behind each requirement
- **Adoption context**: When and in which architectural phases the standard should be applied
- **Engineering trade-offs**: Costs, operational overhead, and benefits introduced by the standard
- **Real-world adoption**: How standards are deployed and maintained across active OSS projects
- **Continuous learning**: Lessons codified from changes, incident reviews, and maturity scorecard metrics

## Core Documents

- **[Concepts](/oss/en/openforge/concepts)** — Three-tier model, trust boundaries, change model, and governance principles
- **[Getting Started](/oss/en/openforge/getting-started)** — Step-by-step adoption guide for existing and new OSS projects
- **[Standards Portfolio](/oss/en/openforge/standards)** — Complete index and directory of all 29 engineering standards
- **[Templates Catalog](/oss/en/openforge/templates)** — Reusable starting points for GitHub, CI/CD, Container, and Kubernetes assets
- **[Architecture Blueprints](/oss/en/openforge/blueprints)** — Combined architectural patterns across platform and service scenarios
- **[Operations Guide](/oss/en/openforge/operations)** — Post-deployment observability, health checks, backup/recovery, and incident runbooks
- **[Reference Map](/oss/en/openforge/reference)** — Authoritative source mapping across standards, templates, and evidence
- **[Maturity Metrics](/oss/en/openforge/reference/metrics)** — Maturity scorecard metrics and assessment checkpoints
- **[Troubleshooting](/oss/en/openforge/troubleshooting)** — Evidence-first symptom-cause-action debugging methodology
- **[Architecture Decision Records](/oss/en/openforge/adr)** — Key architectural decisions and design trade-offs

## Source of Truth

- **Implementation Repository**: [dasomel/openforge](https://github.com/dasomel/openforge)
- **Engineering Standards**: [docs/](https://github.com/dasomel/openforge/tree/main/docs)
- **Reusable Templates**: [templates/](https://github.com/dasomel/openforge/tree/main/templates)
- **Reference Implementations**: Narwhal, KubeMetal, nfs-quota-agent, Beluga Manager
