---
title: "OpenForge"
description: "An open-source project blueprint, engineering standards, and reusable templates for building, deploying, and operating high-quality OSS projects"
github: "https://github.com/dasomel/openforge"
tags: ["Open Source", "Engineering Standards", "GitHub", "CI/CD", "Security", "Supply Chain", "AI", "Developer Tools", "Kubernetes", "Templates"]
order: 2
type: "own"
featured: true
problem: "Every new OSS project tends to rebuild repository structures, documentation guidelines, GitHub workflows, CI/CD pipelines, supply chain security, AI engineering safety, and release governance from scratch"
solution: "A proven, repeatable engineering foundation providing a standardized blueprint, 29 engineering standards, 15 categories of reusable implementation templates, and a maturity scorecard based on active OSS practices"
---

## Project Overview

**OpenForge** is a reusable **Blueprint + Engineering Standards + Reusable Templates** foundation for creating, evolving, deploying, operating, and maintaining high-quality open-source software.

Instead of reinventing repository structures, documentation conventions, CI/CD pipelines, supply chain security, and release governance for every new repository, OpenForge provides a battle-tested baseline derived from active production OSS projects.

Without imposing a specific programming language, runtime, or application framework, OpenForge establishes a **practical engineering baseline** that preserves project autonomy while maintaining platform-wide quality invariants.

### Three-Tier Model

OpenForge separates **Policy**, **Implementation**, and **Evidence** into three distinct layers:

| Layer | Responsibility | Artifacts & Examples |
|---|---|---|
| **[Standards](/oss/en/openforge/standards)** | Defines expected engineering outcomes and principles | Documentation, Supply Chain Security, CI/CD Resilience, AI Security |
| **[Templates](/oss/en/openforge/templates)** | Provides safe, conservative, and ready-to-use starting assets | GitHub Workflows, Multi-stage Dockerfile, K8s Manifests, Policy Rules |
| **[Reference Implementation](/oss/en/openforge/reference)** | Real-world OSS adoption, trade-offs, and empirical metrics | Narwhal, KubeMetal, nfs-quota-agent, Beluga Manager |

---

## Core Principles

All OpenForge standards and templates adhere to these foundational principles:

- **Dual-Language Documentation Policy**: English is the canonical project language; Korean is a first-class translation. User-facing Markdown follows the `<name>.md` and `<name>-ko.md` pairing rule.
- **Secure & Reproducible by Default**: Projects must be reproducible, documented, testable, observable, accessible, and secure by default.
- **Transparent Change Management & ADRs**: GitHub Issues and Pull Requests serve as the primary change-management mechanism. Critical architectural decisions are recorded as [ADRs (Architecture Decision Records)](/oss/en/openforge/adr).
- **CI Quality Gating**: All changes must pass build, test, lint, and security checks in CI before merging.
- **Supply Chain Governance & Impact Analysis**: Dependency compatibility alone does not justify immediate adoption of new releases. Runtime, toolchain, and dependency changes require workflow-wide impact analysis per [Change Management](/oss/en/openforge/standards/change-management).
- **Trust Boundaries for AI Agents & Local Instructions**: AI agents and repository-local instructions (`AGENTS.md`, `CLAUDE.md`) are treated as potentially untrusted execution inputs with explicit permission and sandbox boundaries per [AI Engineering Security](/oss/en/openforge/standards/ai-engineering-security).
- **Risk-Based Governance & CI Resilience**: Even single-maintainer projects maintain automated governance controls without excessive manual overhead. CI outages must never force maintainers to bypass security gates blindly.
- **Time-Bounded Security Exceptions**: Intentional deviations from the baseline must be documented with rationale, scope, and expiration dates.

---

## Project Lifecycle Model

OpenForge follows a closed-loop lifecycle from inception to operations, incident learning, and continuous standards improvement:

```text
Idea
  ↓
Project Definition (Purpose, scope, license definition)
  ↓
Repository Bootstrap (Directory layout, GitHub templates)
  ↓
Documentation + Architecture (README pairs, ADR structure, inventory)
  ↓
Standards + Template Adoption (CI/CD, Docker, K8s, security baseline)
  ↓
Implementation (Language tooling, code intelligence, Makefile)
  ↓
Change Impact / Supply Chain Review (Dependency validation, version pinning)
  ↓
CI / Security / Testing (Static analysis, unit/E2E tests, container scans)
  ↓
Release / Publish Verification (SemVer, Changelog, SBOM, signature validation)
  ↓
Operations / Observability (Health checks, metrics, logs, backup runbooks)
  ↓
Maintenance / Incident Learning (Lessons log, regression testing)
  ↓
Lessons / Metrics (Maturity scorecard evaluation)
  ↓
OpenForge Improvement (Feedback into shared standards and templates)
```

> **Continuous Improvement Loop**: `Standard → Apply → Measure → Learn → Improve → Standardize`

---

## Engineering Standards Portfolio

OpenForge defines **29 granular engineering standards** covering the full spectrum of open-source software engineering:

### 1. Core & Repository Management

- **[Repository Standard](/oss/en/openforge/standards/repository)**: Standard directory layout, root-level invariants (`LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`).
- **[Documentation Standard](/oss/en/openforge/standards/documentation)**: Dual-language pairing, documentation models, glossary, and architecture diagram conventions.
- **[GitHub Standard](/oss/en/openforge/standards/github)**: Issue Templates (Bug, Feature, Architecture), PR Templates, CODEOWNERS, labeling, and branch protection rules.
- **[Development Standard](/oss/en/openforge/standards/development)**: Language-specific tooling baselines (Go: `gofumpt`/`staticcheck`, Node/TS: ESLint/Prettier, Python: Ruff), unified Makefile task automation.
- **[Engineering Tooling Standard](/oss/en/openforge/standards/tooling)** / **[Tooling Matrix](/oss/en/openforge/standards/tooling-matrix)**: Toolchain selection, configuration management, and language tool matrix.
- **[CI/CD Standard](/oss/en/openforge/standards/ci-cd)**: Continuous integration and deployment pipelines and pre-merge validation quality gates.
- **[Internationalization Standard](/oss/en/openforge/standards/i18n)**: UI multilingual resource structure and translation key management standard.

### 2. Security & Supply Chain Governance

- **[Security Standard](/oss/en/openforge/standards/security)**: Multi-stage builds, non-root users, read-only root filesystems, NetworkPolicies, PDBs, and Seccomp profiles.
- **[Supply Chain Security](/oss/en/openforge/standards/supply-chain)**: Immutable package identity verification, signature and checksum validation, untrusted registry isolation.
- **[Package & Artifact Identity](/oss/en/openforge/standards/package-identity)**: Immutable package provenance, checksum, signature, and metadata verification.
- **[Plugin Supply-Chain Intake](/oss/en/openforge/standards/plugin-supply-chain)**: Integrity verification, runtime capability constraints, and plugin intake pipelines.
- **[CI/CD Security](/oss/en/openforge/standards/ci-security)**: Principle of least privilege for CI tokens, immutable GitHub Actions SHA pinning, release isolation.
- **[CI/CD Resilience](/oss/en/openforge/standards/ci-resilience)**: Safe fallback strategies and risk mitigation during CI platform outages.
- **[Developer Environment Security](/oss/en/openforge/standards/developer-environment-security)**: Local workstation boundaries, credential isolation, and secure tool execution.
- **[AI-Assisted Engineering Security](/oss/en/openforge/standards/ai-engineering-security)**: Local execution permission boundaries, prompt injection defense, and sandboxed AI agent execution.
- **[Container, Kubernetes & IaC Security](/oss/en/openforge/standards/container-iac-security)**: Container image hardening, non-root execution, NetworkPolicy, and IaC security.
- **[Secrets & Machine Identity](/oss/en/openforge/standards/secrets-identity)**: OIDC-based cloud federation, short-lived tokens, secret scanning, and zero hardcoded credentials.
- **[Vulnerability Management](/oss/en/openforge/standards/vulnerability-management)**: Vulnerability triage procedures, security patch workflows, and prevention via `lessons-log.md`.
- **[Security & Incident Response](/oss/en/openforge/standards/incident-response)**: Incident triage, mitigation procedures, and lessons-learned test codification.
- **[Security Exceptions & Waivers](/oss/en/openforge/standards/security-exceptions)**: Time-bounded exception handling, risk ownership, and expiration auditing.

### 3. Change Management, Release & Compliance

- **[Change Management & Impact Analysis](/oss/en/openforge/standards/change-management)**: Full workflow impact analysis before updating runtimes, dependencies, or build tools.
- **[Upgrade & Compatibility Engineering](/oss/en/openforge/standards/upgrade-compatibility)**: Backward-compatibility testing, version support windows, and drift prevention.
- **[Reproducible Build](/oss/en/openforge/standards/reproducible-build)**: Environment and timestamp pinning for deterministic build artifacts.
- **[Release Standard](/oss/en/openforge/standards/release)** / **[Release Security](/oss/en/openforge/standards/release-security)**: SemVer, Keep a Changelog format, SBOM generation, and cryptographic artifact signing.
- **[Maintainer Governance](/oss/en/openforge/standards/maintainer-governance)**: Risk-based automated governance and approval workflows for single-maintainer and multi-maintainer repositories.
- **[OSS Compliance](/oss/en/openforge/standards/oss-compliance)**: Apache 2.0 licensing, standardized SPDX headers, and dependency license compatibility audits.
- **[Reference Practices Audit](/oss/en/openforge/standards/reference-practices)**: Extracting, codifying, and validating repeatable patterns from real OSS projects.

---

## Reusable Templates Catalog

The [`templates/`](https://github.com/dasomel/openforge/tree/main/templates) directory in the OpenForge repository provides ready-to-use implementation templates:

```text
templates/
├── github/          # Issue / PR templates, CODEOWNERS patterns
├── workflows/       # CI, release, SBOM, supply chain validation workflows
├── scripts/         # Toolchain verification, lockfile sanity checks, helper scripts
├── policy/          # Dependency review policies, plugin intake rules, waiver formats
├── container/       # Minimal multi-stage Dockerfile baselines
├── kubernetes/      # Deployment, Service, Ingress, NetworkPolicy, PDB, Kustomize
├── gitops/          # Argo CD App-of-Apps and GitOps deployment blueprints
├── identity/        # OIDC / Keycloak / OAuth2 integration contracts
├── observability/   # /healthz, /readyz, Prometheus metrics, OpenTelemetry contracts
├── backup/          # Backup and disaster recovery verification runbooks
├── offline/         # Air-gap bundle manifests and trusted plugin catalogs
└── design/          # README designs, architecture diagrams, status badges
```

> **Template Usage Principle**: Templates are conservative starting points, not universal drop-in configurations. Always customize paths, permissions, domain names, image registries, and versions according to the target repository's threat model.

---

## Reference Implementation Metrics

OpenForge provides a practical **[Maturity Scorecard](/oss/en/openforge/reference/metrics)** to evaluate repository engineering quality and standards compliance:

### Scoring System

- **`2`**: Fully implemented and automated via CI/CD where applicable
- **`1`**: Partially implemented or manually maintained
- **`0`**: Missing or non-compliant
- **`N/A`**: Not applicable to the specific project type (e.g., UI i18n for CLI tools)

### Key Evaluation Areas

| Area | Core Checkpoints | Target State |
|---|---|---|
| **Documentation** | Dual README pair, architecture docs, development guide, lessons log | 1:1 EN/KO completeness, cumulative incident logs |
| **Architecture** | Architecture Decision Record (ADR) system | Active `docs/adr/` index and records |
| **GitHub** | Issue/PR templates, CODEOWNERS, labeling scheme | Structured, template-driven change management |
| **CI / Validation** | Automated build, test, format, and documentation checks | Mandatory pre-merge automated gates |
| **Security** | Dependabot, container scanning, secret detection, SECURITY policy | Automated scheduled scans and SBOM generation |
| **Development** | Language formatters (`gofumpt`), Makefile task runner | Single-command local test and build execution |
| **Release** | SemVer, CHANGELOG, release workflows, artifact signing | Tag-triggered automated build and signed releases |
| **Configuration** | `.env.example`, clear configuration boundaries | Clean separation of secrets from configurations |
| **Localization** | Multilingual UI resources (`en-US`, `ko-KR`) | Structured, modular i18n resource bundles |

---

## Reference Implementations

OpenForge standards and templates are extracted from and validated against active production open-source projects:

| Project | Description | Key OpenForge Patterns Incorporated |
|---|---|---|
| **[Narwhal](/en/projects/narwhal)** | Kubernetes-based Internal Developer Platform (IDP) | 35 GitOps apps, 263 incident lessons codified into regression tests, air-gap bundle |
| **[Narwhal Portal](/en/projects/narwhal-portal)** | Cloud-native management portal | Next.js/Tailwind architecture, ADR governance, Keycloak OIDC integration |
| **[nfs-quota-agent](/en/projects/nfs-quota-agent)** | Linux XFS Project Quota gRPC/HTTP daemon | Go `gofumpt` lint standards, systemd service templates, integration tests |
| **[Kube-Ready-Box](/en/projects/kube-ready-box)** | Pre-tuned base OS images for Kubernetes nodes | Kernel parameter tuning, automated storage quotas, Vagrant/Packer builds |
| **[KubeMetal](/en/projects/kubemetal)** | Bare-metal Kubernetes cluster lifecycle engine | Makefile task runner, release automation, hardware compatibility matrix |
| **[ldapium](/en/projects/ldapium)** | OpenLDAP directory services integration | `.env.example` standard, GitHub Scorecard and Dependabot security governance |
| **[Beluga Manager](/en/projects/beluga-manager)** | Multi-cluster orchestration & edge UI | UI i18n (`en-US` / `ko-KR`), REST API contracts, container security baseline |

---

## Getting Started

A step-by-step roadmap for adopting OpenForge in new or existing projects:

```bash
# 1. Clone OpenForge and inspect templates
git clone https://github.com/dasomel/openforge.git

# 2. Copy base repository layout and GitHub templates
cp -r openforge/templates/github/ .github/
cp openforge/templates/design/README-template.md README.md
cp openforge/templates/design/README-template-ko.md README-ko.md

# 3. Add language toolchain and CI workflows
cp openforge/templates/workflows/ci.yml .github/workflows/ci.yml

# 4. Customize permissions, paths, and versions for your environment
```

For detailed guidance, see the [Getting Started Guide](/oss/en/openforge/getting-started).

---

## Documentation Index

Explore detailed technical documentation on the OpenForge portal:

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [Documentation Overview](/oss/en/openforge/overview) | Documentation model, Source of Truth, portal navigation |
| **Concepts** | [Core Concepts](/oss/en/openforge/concepts) | Three-tier model, trust model, change model, governance |
| **Getting Started** | [Getting Started](/oss/en/openforge/getting-started) | Inventory assessment, template adoption, phased standardization |
| **Standards** | [Standards Portfolio](/oss/en/openforge/standards) | Comprehensive list of Core, Security, and Engineering standards |
| **Templates** | [Templates Catalog](/oss/en/openforge/templates) | CI/CD, Container, Kubernetes, and Policy template details |
| **Blueprints** | [Architecture Blueprints](/oss/en/openforge/blueprints) | Platform and application architecture patterns |
| **Operations** | [Operations Guide](/oss/en/openforge/operations) | Observability, health checks, backup/restore, incident handling |
| **Reference** | [Reference Map](/oss/en/openforge/reference) | Authoritative source mapping for standards, templates, and evidence |
| **Metrics** | [Maturity Metrics](/oss/en/openforge/reference/metrics) | Repository Maturity Scorecard and assessment checkpoints |
| **Troubleshooting** | [Troubleshooting](/oss/en/openforge/troubleshooting) | Symptom → Evidence → Root cause → Fix debugging model |
| **ADR** | [Architecture Decision Records](/oss/en/openforge/adr) | Key architectural decisions, trade-offs, and design records |

---

## Links

- **GitHub Repository**: [dasomel/openforge](https://github.com/dasomel/openforge)
- **Engineering Standards**: [OpenForge Docs on GitHub](https://github.com/dasomel/openforge/tree/main/docs)
- **Reusable Templates**: [OpenForge Templates on GitHub](https://github.com/dasomel/openforge/tree/main/templates)
- **Korean Documentation**: [OpenForge Korean Portal](/oss/openforge/)

