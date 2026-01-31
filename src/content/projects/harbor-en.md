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
- **ARM64 Optimization**: Support for Apple Silicon, AWS Graviton, Raspberry Pi

### Software Supply Chain Security
- **SBOM (Software Bill of Materials)**: Container image component list generation using Syft
- **SLSA Build Attestation**: Build process integrity proof via GitHub Actions
- **Cosign OIDC Keyless Signing**: Keyless image signing using GitHub OIDC

### CI/CD Improvements
- **GitHub Actions Workflow Optimization**: Build triggers based on release tags
- **Automatic Upstream Sync**: Auto-resolve merge conflicts for fork-specific files
- **ghcr.io Image Registry**: Using GitHub Container Registry instead of Docker Hub

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

Images follow the official Helm chart compatible naming convention.

```bash
# Pull Harbor images (architecture auto-selected)
docker pull ghcr.io/dasomel/goharbor/harbor-core:v2.12.0
docker pull ghcr.io/dasomel/goharbor/harbor-portal:v2.12.0
docker pull ghcr.io/dasomel/goharbor/harbor-registryctl:v2.12.0
docker pull ghcr.io/dasomel/goharbor/harbor-jobservice:v2.12.0

# Trivy adapter
docker pull ghcr.io/dasomel/goharbor/trivy-adapter-photon:v2.12.0
```

## Upstream Synchronization

This fork is automatically synchronized with the official Harbor repository. Upstream changes are synced automatically, while fork-specific modifications are managed separately.

| Version | AMD64 | ARM64 | Upstream |
|---------|-------|-------|----------|
| v2.12.x | ✅ | ✅ | goharbor/harbor v2.12 |
| v2.11.x | ✅ | ✅ | goharbor/harbor v2.11 |
| v2.10.x | ✅ | ✅ | goharbor/harbor v2.10 |

## Change History

For detailed change history, see [FORK_CHANGES.md](https://github.com/dasomel/harbor/blob/main/FORK_CHANGES.md).

## Contributing & Issues

- Please report bugs or feature requests in [Issues](https://github.com/dasomel/harbor/issues)
- For ARM64-related issues, use this fork; for general Harbor issues, use the [official repository](https://github.com/goharbor/harbor)
