---
title: Reference Implementation Metrics
description: Repository maturity scorecard and evidence model for OpenForge standards compliance.
project: OpenForge
path: openforge/reference/metrics
order: 1030
lastModified: 2026-08-23
---

# Reference Implementation Metrics

OpenForge provides a practical **Maturity Scorecard** to evaluate repository engineering quality and standards compliance.

## Scoring Rubric

| Score | Status | Description |
|---|---|---|
| **`2`** | Automated | Fully implemented and automated via CI/CD where practical |
| **`1`** | Manual | Partially implemented or manually maintained |
| **`0`** | Missing | Missing or non-compliant with standard baseline |
| **`N/A`** | Not Applicable | Not applicable to the project type (e.g. UI localization for CLI tools) |

---

## 9 Core Assessment Domains

| Domain | Core Checkpoints | Target State |
|---|---|---|
| **Documentation** | Dual README pair, architecture docs, development guide, lessons log | Complete 1:1 EN/KO parity, active lessons log |
| **Architecture** | Architecture Decision Record (ADR) system | Maintained `docs/adr/` index and records |
| **GitHub** | Issue/PR templates, CODEOWNERS, labeling taxonomy | Structured, template-driven change management |
| **CI / Validation** | Automated build, test, format, and documentation checks | Mandatory pre-merge automated gates |
| **Security** | Dependabot, container scanning, secret detection, SECURITY policy | Automated scheduled scans and SBOM generation |
| **Development** | Language formatters (`gofumpt`), Makefile task automation | Single-command local build and verification |
| **Release** | SemVer, CHANGELOG, release workflows, cryptographic signing | Tag-triggered automated signed distribution |
| **Configuration** | `.env.example`, clean configuration boundaries | Clean separation of secrets from configuration |
| **Localization** | Multilingual UI resources (`en-US`, `ko-KR`) | Structured, modular i18n resource bundles |
