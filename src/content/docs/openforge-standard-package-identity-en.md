---
title: Package & Artifact Identity
description: Immutable package provenance, checksum, signature, and metadata verification.
project: OpenForge
path: openforge/standards/package-identity
order: 1025
lastModified: 2026-08-23
---

# Package & Artifact Identity

Packages and distribution artifacts must maintain immutable identities and cryptographic integrity.

## Invariants

- **Cryptographic Checksums**: SHA256 checksums generated and verified for all distribution artifacts.
- **Immutable Digests**: Container references resolve to immutable `@sha256:...` digests rather than mutable tags.
- **Digital Signatures**: Binaries and images signed using tools like Cosign.

## Canonical Source

- [Package & Artifact Identity](https://github.com/dasomel/openforge/blob/main/docs/package-identity.md)
