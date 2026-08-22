---
title: Core Concepts
description: Core concepts, three-tier architecture, trust models, and governance principles in OpenForge.
project: OpenForge
path: openforge/concepts
order: 1001
lastModified: 2026-08-23
---

# Core Concepts

OpenForge cleanly separates **Policy**, **Implementation**, and **Evidence**, linking them directly to the continuous project lifecycle.

## Three-Tier Model

| Layer | Responsibility | Artifacts & Examples |
|---|---|---|
| **[Standards](/oss/en/openforge/standards)** | Defines expected engineering outcomes and principles | Supply Chain Security Standard, CI/CD Resilience Standard |
| **[Templates](/oss/en/openforge/templates)** | Provides safe, conservative, and ready-to-use starting assets | Multi-stage Dockerfiles, GitHub Workflows, K8s Manifests |
| **[Reference Implementation](/oss/en/openforge/reference)** | Real-world OSS adoption, trade-offs, and empirical metrics | Narwhal, KubeMetal, nfs-quota-agent, Beluga Manager |

---

## 8 Foundational Principles

1. **Dual-Language Documentation Policy**: English is the canonical project language; Korean is a first-class translation. User-facing Markdown follows the `<name>.md` and `<name>-ko.md` pairing rule.
2. **Secure & Reproducible by Default**: Projects must be reproducible, documented, testable, observable, accessible, and secure by default.
3. **Transparent Change Management & ADRs**: GitHub Issues and Pull Requests serve as the primary change-management mechanism. Critical architectural decisions are recorded as [ADRs](/oss/en/openforge/adr).
4. **CI Quality Gating**: All changes must pass build, test, lint, and security checks in CI before merging.
5. **Supply Chain Governance & Impact Analysis**: Dependency compatibility alone does not justify immediate adoption of new releases. Changes require workflow-wide impact analysis.
6. **Trust Boundaries for AI Agents & Local Instructions**: AI agents and repository-local instructions (`AGENTS.md`, `CLAUDE.md`) are treated as potentially untrusted execution inputs with explicit permission and sandbox boundaries.
7. **Risk-Based Governance & CI Resilience**: Even single-maintainer projects maintain automated governance controls without excessive manual overhead. CI outages must never force maintainers to bypass security gates blindly.
8. **Time-Bounded Security Exceptions**: Intentional deviations from the baseline must be documented with rationale, scope, and expiration dates.

---

## Trust Boundary Model

OpenForge divides development and runtime environments into distinct trust domains:

- **Source Code & PRs**: External contributions and AI-generated code are treated as untrusted inputs until validated.
- **CI Runners**: Untrusted fork PR workflows run in isolated environments without access to release secrets.
- **Publishing & Release Credentials**: Short-lived OIDC tokens replace static long-lived credentials.
- **Runtime Containers**: Workloads execute with non-root users, read-only root filesystems, and strict NetworkPolicies.
