---
title: Getting Started
description: Step-by-step roadmap for adopting OpenForge standards and templates in new or existing OSS projects.
project: OpenForge
path: openforge/getting-started
order: 1002
lastModified: 2026-08-23
---

# Getting Started

OpenForge recommends a progressive adoption path: starting from the smallest viable baseline and expanding coverage as empirical evidence accumulates.

## 4-Step Progressive Roadmap

```text
[Step 1] Repository Inventory Assessment
      ↓
[Step 2] Bootstrap Directory & GitHub Templates
      ↓
[Step 3] CI Quality Gates & Toolchain Automation
      ↓
[Step 4] Security Governance & Maturity Scorecard
```

---

## Step-by-Step Guide

### Step 1: Inventory Assessment

Audit the target repository's current state:

- Repository directory layout and root invariants (`LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`)
- Programming languages, runtime versions, package managers, and lockfile pinning
- GitHub Issue/PR templates and branch protection rules
- CI/CD pipelines (build, test, lint) and container build configurations

### Step 2: Template Adoption (Bootstrap)

Copy baseline templates into your repository:

```bash
# 1. Clone OpenForge
git clone https://github.com/dasomel/openforge.git

# 2. Copy GitHub Issue and PR templates
cp -r openforge/templates/github/ .github/

# 3. Adopt dual README templates
cp openforge/templates/design/README-template.md README.md
cp openforge/templates/design/README-template-ko.md README-ko.md
```

### Step 3: CI Toolchain & Quality Gating

Deploy language-specific linters and automated CI workflows:

```bash
# Copy CI workflow
cp openforge/templates/workflows/ci.yml .github/workflows/ci.yml
```

- **Go**: `gofumpt`, `staticcheck`, `golangci-lint`
- **TypeScript/Node**: `eslint`, `prettier`, `typescript`
- **Python**: `ruff`, `mypy`, `pytest`

### Step 4: Security Governance & Maturity Measurement

- Enable Dependabot and secret scanning
- Harden container builds with multi-stage files and non-root execution
- Evaluate against the [Reference Implementation Metrics](/oss/en/openforge/reference/metrics) scorecard
