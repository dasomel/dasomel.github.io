---
title: Repository Standard
description: OSS repository structure, required root files, and maintainability baseline.
project: OpenForge
path: openforge/standards/repository
order: 1011
lastModified: 2026-08-23
---

# Repository Standard

Repository structure is the foundational engineering contract of an open-source project. New contributors should immediately understand how to build, test, secure, and govern the project without reverse-engineering implicit conventions.

## Baseline Requirements

- **Predictable Layout**: Clean separation of source code, documentation, CI workflows, and deployment assets.
- **Root Invariant Files**: Required files present at the root: `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `README.md`, and `README-ko.md`.
- **Issue & PR Templates**: Structured templates under `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md`.
- **Explicit Ownership Model**: Maintained `CODEOWNERS` defining clear domain responsibilities.
- **Zero Secret Ingestion**: Only `.env.example` templates committed; zero credentials in source control.

## Change Discipline

Repository-wide configuration is executable software behavior. Modifications to CI workflows, manifests, or tooling configs require full impact analysis across all consuming workflows.

## Single-Maintainer Scaling

Controls scale according to automated coverage and change risk rather than requiring an arbitrary team size.

## Canonical Source

- [Repository Standard](https://github.com/dasomel/openforge/blob/main/docs/repository.md)
