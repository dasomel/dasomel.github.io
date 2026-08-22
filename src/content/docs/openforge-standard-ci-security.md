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

## Required thinking

- default workflow permissions to least privilege
- separate untrusted fork execution from trusted release workflows
- avoid sharing secrets with untrusted code
- isolate caches and artifacts across trust boundaries
- use short-lived identity such as OIDC where supported
- pin security-sensitive external actions and inputs

## Release boundary

Build, test, package, and release responsibilities should be separated where the threat model requires it. A successful build should not automatically imply permission to publish or deploy.

## Resilience

Security gates should fail safely during CI outages. Retry and fallback paths must not silently disable verification.

## Canonical source

[OpenForge CI/CD Security Standard](https://github.com/dasomel/openforge/blob/main/docs/ci-security.md)