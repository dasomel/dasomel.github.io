---
title: "Release Note"
description: "K-PaaS Lite Release Notes"
order: 99
lastModified: 2026-02-02
---

## v2.2.0

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v2.2.0)

**Release Date**: January 31, 2026

### K-PaaS v1.7.0 Support

### Key Changes

#### ARM64 Support
- `ghcr.io/dasomel-k-pass` ARM64 Portal image support
  - All components including cp-portal-ui, cp-portal-api, cp-catalog-api, cp-metrics-api
- `ghcr.io/dasomel/goharbor` ARM64 Harbor image support
  - Automatic hotfix application for registry-photon, harbor-registryctl images

#### Kakao Cloud Deployment
- `terraform-layered/` 3-Layer architecture (Network → LoadBalancer → Cluster)
- Fixed IP-based LB Target configuration
- `deploy.sh` unified deployment script
- CoreDNS custom hosts configuration automation

#### Infrastructure Automation
- Init container SSL certificate injection (no image rebuild required)
- Keycloak Bitnami Helm chart deployment automation
- OpenBao unseal key automatic management

#### Standard Framework Sample
- egovframe-web-sample multi-architecture build support (amd64/arm64)
- Container image signing (cosign) support
- SBOM (SPDX) generation support

### Version Compatibility

| Installer | K-PaaS CP | Kubernetes | Ubuntu | Architecture |
|-----------|-----------|------------|--------|--------------|
| 2.2.0 | v1.7.0 | v1.33.5 | 24.04 | amd64, arm64 |

## v2.1.0

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v2.1.0)

**Release Date**: December 1, 2025

- Support for K-PaaS v1.6.2
- Improved ARM-based CPU support
- Enhanced installation process automation
- Improved troubleshooting guide

## v2.0.0

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v2.0.0)

**Release Date**: September 9, 2025

- ARM-based CPU support (Apple Silicon)
- Vagrant + VirtualBox based installation
- Kubernetes deployment using Kubespray
- Ansible-based infrastructure automation

## v1.0.1

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v1.0.1)

**Release Date**: June 9, 2025

- Bug fixes and stability improvements

## v1.0.0

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v1.0.0)

**Release Date**: July 3, 2024

- Support for K-PaaS v1.5.1
- All-in-one installation version
- Multi-master node support
- Lightweight shell script provided
- Low dependency as no direct modification to source (K-PaaS)
