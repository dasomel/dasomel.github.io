---
title: "Harbor Multi-Arch"
description: "Forked Harbor container registry with multi-architecture (AMD64/ARM64) build support"
github: "https://github.com/dasomel/harbor"
tags: ["Container Registry", "Multi-Arch", "ARM64", "Security"]
order: 3
type: "fork"
---

## Project Overview

[Harbor](https://goharbor.io/) is a CNCF Graduated project, an open-source registry for storing and distributing container images.

This project is a **fork of the official Harbor repository** with added multi-architecture (AMD64/ARM64) builds and software supply chain security features.

## Why This Fork?

The official Harbor only officially supports AMD64 architecture, making it difficult to use in ARM64-based environments (Apple Silicon, AWS Graviton, etc.). This fork aims to:

- Enable Harbor to run on various platforms with native ARM64 support
- Apply latest security standards (SBOM, SLSA, Cosign)
- Maintain continuous synchronization with official releases

## Key Modifications

### Multi-Architecture Builds
- **Simultaneous AMD64/ARM64 builds**: Multi-platform image creation using Docker buildx
- **Unified Manifest**: Automatic architecture selection with a single image tag
- **ARM64 Optimization**: Support for Apple Silicon (M1/M2/M3), AWS Graviton, Raspberry Pi

### Software Supply Chain Security
- **SBOM (Software Bill of Materials)**: Container image component list generation using Syft
- **SLSA Build Attestation**: Build process integrity proof via GitHub Actions
- **Cosign OIDC Keyless Signing**: Keyless image signing using GitHub OIDC

## Build Pipeline

```yaml
# GitHub Actions workflow
- name: Build and Push
  steps:
    - Docker buildx (AMD64 + ARM64)
    - Trivy vulnerability scanning
    - Syft SBOM generation
    - Cosign signing
    - SLSA Provenance generation
```

## Usage

```bash
# Pull Harbor images (architecture auto-selected)
docker pull ghcr.io/dasomel/harbor-core:latest
docker pull ghcr.io/dasomel/harbor-portal:latest
docker pull ghcr.io/dasomel/harbor-registry:latest
docker pull ghcr.io/dasomel/harbor-jobservice:latest
```

## Upstream Synchronization

This fork is regularly synchronized with the official Harbor repository:

| Version | AMD64 | ARM64 | Upstream |
|---------|-------|-------|----------|
| v2.11.x | ✅ | ✅ | goharbor/harbor v2.11 |
| v2.10.x | ✅ | ✅ | goharbor/harbor v2.10 |
| v2.9.x | ✅ | ✅ | goharbor/harbor v2.9 |

## Contributing & Issues

- Please report bugs or feature requests in [Issues](https://github.com/dasomel/harbor/issues)
- For ARM64-related issues, use this fork; for general Harbor issues, use the [official repository](https://github.com/goharbor/harbor)
