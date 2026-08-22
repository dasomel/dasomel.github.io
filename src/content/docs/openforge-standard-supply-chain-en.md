---
title: Supply Chain Security Standard
description: Controls for dependency, build input, artifact, and provenance risk.
project: OpenForge
path: openforge/standards/supply-chain
order: 1014
lastModified: 2026-08-22
---

# Supply Chain Security Standard

OpenForge treats dependency resolution, build inputs, workflow identities, artifacts, and release channels as a single supply-chain boundary.

## Core controls

- prefer immutable source and artifact identities
- pin security-sensitive workflow inputs where practical
- inspect dependency manifests and lockfiles
- separate build trust from release trust
- generate and retain SBOM/provenance evidence where practical
- retain a known-good rollback identity

## Evidence model

SBOMs, provenance, signatures, and checksums are evidence for verification, not proof of safety by themselves. Verification considers source, build inputs, workflow identity, artifact contents, and deployment context.

## Progressive adoption

Introduce stronger controls incrementally. Temporary exceptions require documented risk, owner, scope, and expiration.

## Canonical source

[OpenForge Supply Chain Standard](https://github.com/dasomel/openforge/blob/main/docs/supply-chain.md)