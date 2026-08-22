---
title: CI/CD Standard
description: Continuous integration, delivery pipelines, and validation quality gates.
project: OpenForge
path: openforge/standards/ci-cd
order: 1017
lastModified: 2026-08-23
---

# CI/CD Standard

CI/CD provides automated quality gates ensuring software correctness, security, and predictability.

## Mandatory Pipeline Stages

1. **Static Analysis & Linting**: Code style, security heuristics, and type checks
2. **Automated Testing**: Unit and integration test suites with race detection
3. **Build Validation**: Target binary and container compilation in clean environments
4. **Security Scanning**: Container vulnerability scanning and SBOM generation

## Canonical Source

- [CI/CD Standard](https://github.com/dasomel/openforge/blob/main/docs/ci-cd.md)
