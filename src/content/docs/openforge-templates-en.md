---
title: Templates Catalog
description: Catalog of reusable, production-tested implementation templates provided in OpenForge.
project: OpenForge
path: openforge/templates
order: 1004
lastModified: 2026-08-23
---

# Templates Catalog

Templates provide safe, conservative, and battle-tested starting points for OSS implementations. Customize versions, permissions, registries, and domain endpoints according to the target project's threat model before deployment.

## Directory Structure

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

---

## Key Template Categories

### 1. GitHub & Workflow Assets (`templates/github/`, `templates/workflows/`)
- **Issue Templates**: Structured formats for Bug Reports, Feature Proposals, and Architecture RFCs
- **PR Template**: Requirements for change descriptions, verification evidence, and quality checklists
- **CI Workflows**: Automated linting, test execution, container builds, and security scans
- **Release Workflows**: Tag-triggered automated artifact builds, changelog extraction, SBOM generation, and cryptographic signing

### 2. Container & Kubernetes Manifests (`templates/container/`, `templates/kubernetes/`)
- **Multi-stage Dockerfiles**: Separate build tooling from runtime environments to minimize attack surfaces
- **K8s Manifests**: Production-grade `Deployment`, `Service`, `Ingress`, `NetworkPolicy`, and `PodDisruptionBudget` manifests
- **Kustomize / Argo CD**: Multi-environment overlays and GitOps synchronization structures

### 3. Security & Governance Rules (`templates/policy/`, `templates/identity/`)
- **Dependency Review Policies**: Automated license compatibility and vulnerability threshold enforcement
- **OIDC Federation**: Token federation configurations for Keycloak and cloud IAM providers
- **Security Exception Waivers**: Formal templates for documenting time-bounded security exceptions
