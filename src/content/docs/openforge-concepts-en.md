---
title: Concepts
description: Core ideas and adoption principles behind the OpenForge engineering model.
project: OpenForge
path: openforge/concepts
order: 1001
lastModified: 2026-08-22
---

# Concepts

OpenForge separates **policy**, **implementation**, and **evidence**, then connects them through the project lifecycle.

## Three Layers

| Layer | Purpose | Example |
|---|---|---|
| Standard | Defines the expected engineering outcome | Supply Chain Security Standard |
| Template | Provides a reusable implementation starting point | Kubernetes Deployment baseline |
| Reference implementation | Shows real project adaptation and trade-offs | Narwhal / KubeMetal |

This separation prevents a project-specific implementation from being mistaken for a universal standard.

## Trust Model

Provenance, signatures, and SBOMs are **evidence for verification**, not declarations that an artifact is safe.

Verification should consider:

```text
Source
  + Build Inputs
  + Workflow Identity
  + Artifact Content
  + Deployment Context
      ↓
Verification
```

## Change Model

Dependency, runtime, and toolchain changes are treated as **workflow-wide changes**, not isolated file edits.

For example, when a build command starts using Bun, every workflow and script that can execute that command should be reviewed together with install steps, caching, and release paths.

OpenForge's Change Management and Upgrade & Compatibility guidance makes this impact analysis part of the lifecycle.

## Governance Model

Single-maintainer and multi-maintainer OSS should not be forced into the same fixed people-count rule.

```text
Change Risk
    ↓
Required Controls
    ↓
Automation / Review / Evidence
```

Governance scales with change risk and automated controls rather than requiring a fixed number of maintainers.

## Template Model

Templates are **implementation starting points**, not universal drop-in configuration.

Versions, permissions, paths, images, domains, identities, and ecosystem-specific security controls must be adapted to the target repository and threat model.

## Lifecycle Model

OpenForge continuously learns from real project operation.

```text
Define
  ↓
Bootstrap
  ↓
Implement
  ↓
Validate
  ↓
Release / Operate
  ↓
Incident / Review / Metrics
  ↓
Improve Standard
```
