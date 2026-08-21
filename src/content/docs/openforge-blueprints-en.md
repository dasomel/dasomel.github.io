---
title: Blueprints
description: Opinionated architecture patterns assembled from OpenForge standards and templates.
project: OpenForge
path: openforge/blueprints
order: 1005
lastModified: 2026-08-21
---

# Blueprints

Blueprints combine multiple templates into a coherent deployment or engineering scenario.

## OSS service blueprint

```text
Repository
 → CI
 → SBOM / Security Gate
 → Container
 → Registry
 → Kubernetes / GitOps
 → OIDC / SSO
 → Observability
 → Backup / Restore
```

## Platform component blueprint

Add Kubernetes bootstrap, policy/admission, GitOps, identity, telemetry, persistent storage, and offline bundle only when required by the component.

## Design principle

Blueprints should be opinionated enough to reduce repeated decisions but explicit about assumptions and boundaries. They are not product-specific implementations.
