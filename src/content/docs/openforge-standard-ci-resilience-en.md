---
title: CI/CD Resilience Standard
description: Safe fallback strategies and failure mitigation during CI platform outages.
project: OpenForge
path: openforge/standards/ci-resilience
order: 1019
lastModified: 2026-08-23
---

# CI/CD Resilience Standard

CI workflows depend on external cloud platforms; resilience strategies must maintain security guarantees even during outages.

## Resilience Principles

- **Fail-Safe by Default**: Outages must fail closed, preventing automated deployment without verification.
- **Emergency Release SOP**: Documented fallback procedures requiring signed local evidence.
- **Registry Independence**: Caching and mirroring strategies mitigate upstream registry downtimes.

## Canonical Source

- [CI/CD Resilience Standard](https://github.com/dasomel/openforge/blob/main/docs/ci-resilience.md)
