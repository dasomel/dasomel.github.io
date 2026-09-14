---
title: Deployment & Operations
description: Operational and deployment-readiness criteria for an early control-plane design with no release artifact yet.
project: Beluga Manager
path: beluga-manager/operations
order: 1603
lastModified: 2026-09-14
---

# Deployment & Operations

Beluga Manager currently has no container image, Helm chart, or Kubernetes manifest. Examples such as `ghcr.io/dasomel/beluga-manager:v1.0.0` are not published artifacts and must not be used.

## Conditions for deployability

- selected application architecture and an accepted ADR
- a versioned image that passes real build and test gates
- SBOM, provenance, and a published digest
- read-only service account and least privilege for every adapter
- health/readiness probes and explicit dependency-failure states
- image and manifest inventories for air-gapped environments
- integration evidence against a real Beluga environment

Until then, only documentation and CI/repository-verification workflows are operational assets in this repository.
