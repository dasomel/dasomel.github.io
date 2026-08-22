---
title: CI/CD Security Standard
description: CI trust boundaries, permissions, runners, caches, and release isolation.
project: OpenForge
path: openforge/standards/ci-security
order: 1018
lastModified: 2026-08-23
---

# CI/CD Security Standard

CI is an execution environment that represents a critical security boundary.

## Security Controls

- **Principle of Least Privilege**: Default workflow permissions restricted to `contents: read`.
- **Fork Secret Isolation**: Secrets are never passed to untrusted pull request workflows.
- **Immutable Action SHA Pinning**: Third-party GitHub Actions are pinned to full commit SHAs.
- **OIDC Authentication**: Short-lived OIDC tokens replace long-lived static credentials.

## Canonical Source

- [CI/CD Security Standard](https://github.com/dasomel/openforge/blob/main/docs/ci-security.md)
