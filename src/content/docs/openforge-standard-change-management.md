---
title: Change Management & Impact Analysis
description: Dependency, runtime, toolchain, workflow, and security change impact model.
project: OpenForge
path: openforge/standards/change-management
order: 1017
lastModified: 2026-08-22
---

# Change Management & Impact Analysis

OpenForge treats dependency, runtime, toolchain, workflow, and security-boundary changes as **workflow-wide changes** rather than isolated line edits.

## Impact surface

When a build tool, runtime, package manager, action, script, or release contract changes, inspect every workflow that can execute or consume it.

```text
Change
  ↓
Repository / Workflow Inventory
  ↓
Build / Test / Release / Deploy Impact
  ↓
Security / Supply Chain Impact
  ↓
Validation
  ↓
Rollback Identity
```

## Change classes

Low-risk documentation changes can remain lightweight. Runtime, dependency, CI, release, and security-boundary changes require broader validation and explicit evidence.

## Practical example

Installing Bun in one workflow does not make Bun available to another workflow. Each workflow is an independent execution contract and must install or provide the runtime it requires.

## Canonical source

[OpenForge Change Management](https://github.com/dasomel/openforge/blob/main/docs/change-management.md)