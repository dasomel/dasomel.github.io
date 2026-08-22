---
title: Change Management & Impact Analysis
description: Full workflow impact analysis before dependency, runtime, or toolchain changes.
project: OpenForge
path: openforge/standards/change-management
order: 1021
lastModified: 2026-08-23
---

# Change Management & Impact Analysis

Software changes impact not only source code, but also runtimes, build pipelines, and supply-chain trust.

## Principles

- **No Blind Upgrades**: Newer releases are not adopted merely because they exist; stability and compatibility are proven first.
- **Workflow Impact Analysis**: Changes to runtimes, tools, or dependencies require impact analysis across all downstream workflows.
- **Incremental Rollout**: Large refactors and dependency upgrades are decoupled into verifiable stages.

## Canonical Source

- [Change Management & Impact Analysis](https://github.com/dasomel/openforge/blob/main/docs/change-management.md)
