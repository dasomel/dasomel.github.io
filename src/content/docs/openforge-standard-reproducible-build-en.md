---
title: Reproducible Build Standard
description: Deterministic build artifacts, pinned environments, and verification discipline.
project: OpenForge
path: openforge/standards/reproducible-build
order: 1020
lastModified: 2026-08-23
---

# Reproducible Build Standard

Builds executed from the same source commit must produce bit-for-bit identical binary artifacts.

## Reproducibility Invariants

- **Pinned Environments**: Compiler versions and container base images pinned by SHA256 digest.
- **Normalized Timestamps**: `SOURCE_DATE_EPOCH` used to ensure deterministic artifact timestamps.
- **Strict Lockfiles**: Lockfiles with cryptographic checksums enforced via `--frozen-lockfile` in CI.

## Canonical Source

- [Reproducible Build Standard](https://github.com/dasomel/openforge/blob/main/docs/reproducible-build.md)
