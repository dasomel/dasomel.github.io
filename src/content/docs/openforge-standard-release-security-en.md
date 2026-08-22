---
title: Release Security
description: Cryptographic signing, SBOM generation, provenance attestations, and distribution trust.
project: OpenForge
path: openforge/standards/release-security
order: 1034
lastModified: 2026-08-23
---

# Release Security

Release artifacts must provide cryptographic proof of authenticity and tamper-resistance.

## Requirements

- **Digital Signatures**: Binaries and container images signed with verifiable public keys.
- **SBOM Inclusion**: SPDX or CycloneDX SBOM manifests published alongside releases.
- **Build Provenance**: Verifiable SLSA build attestations proving generation in secure CI pipelines.

## Canonical Source

- [Release Security](https://github.com/dasomel/openforge/blob/main/docs/release-security.md)
