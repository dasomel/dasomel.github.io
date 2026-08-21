---
title: Getting Started
description: Apply OpenForge to an existing OSS repository in a controlled sequence.
project: OpenForge
path: openforge/getting-started
order: 1002
lastModified: 2026-08-21
---

# Getting Started

Start with the smallest useful baseline and expand by evidence.

## 1. Inventory

Identify:

- repository structure and documentation
- language/runtime/toolchain
- package managers and lockfiles
- CI/CD workflows
- container and deployment assets
- identity, observability, backup, and offline requirements

## 2. Adopt repository templates

Begin with GitHub, PR, security-sensitive paths, toolchain verification, and CI templates.

## 3. Adopt build and release controls

Add dependency policy, SBOM, immutable workflow actions, release verification, and rollback evidence.

## 4. Adopt deployment baselines

Use only the layers the project needs: Docker, Kubernetes/Kustomize, GitOps, OIDC/SSO, observability, backup/restore, or offline bundle.

## 5. Record deviations

A template is a starting point, not a universal drop-in configuration. Document project-specific exceptions, especially where they change security boundaries or operational behavior.

## 6. Link evidence

The project README should point to its documentation on cne.io.kr. Documentation should link back to the exact OpenForge template and the repository implementation.
