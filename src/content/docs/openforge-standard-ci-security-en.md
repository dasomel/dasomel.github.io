---
title: CI/CD Security Standard
description: CI trust boundaries, permissions, runners, caches, and release isolation.
project: OpenForge
path: openforge/standards/ci-security
order: 1016
lastModified: 2026-08-22
---

# CI/CD Security Standard

CI is an execution environment, not a neutral automation layer. OpenForge treats workflows, runners, caches, artifacts, and credentials as security boundaries.

## Controls

- least-privilege workflow permissions
- separate untrusted fork execution from trusted release workflows
- never expose release secrets to untrusted code
- isolate caches and artifacts across trust boundaries
- prefer short-lived identities such as OIDC
- pin security-sensitive external actions and inputs

## Release boundary

Build, test, package, and release responsibilities should be separated where the threat model requires it. A passing build does not automatically grant publishing or deployment authority.

## Resilience

Security gates must fail safely during CI outages. Retry and fallback paths must not silently disable verification.

## Canonical source

[OpenForge CI/CD Security Standard](https://github.com/dasomel/openforge/blob/main/docs/ci-security.md)