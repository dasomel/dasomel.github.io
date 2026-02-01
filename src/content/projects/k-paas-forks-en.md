---
title: "K-PaaS Container Platform"
description: "K-PaaS Container Platform with multi-architecture build support (13 component forks)"
github: "https://github.com/dasomel-k-pass"
tags: ["K-PaaS", "Kubernetes", "Multi-Arch", "Platform"]
order: 5
type: "fork"
---

## Project Overview

A collection of forked repositories from [K-PaaS Container Platform](https://github.com/k-paas) with added **multi-architecture (AMD64/ARM64) build support**.

## K-PaaS Lite Installation Tool

[K-PaaS Lite](https://github.com/dasomel/k-paas) is a lightweight K-PaaS installation tool based on Vagrant.

### Key Features
- **Fully Automated Deployment**: One-click installation via Vagrant (VirtualBox, VMware support)
- **ARM64 Support**: Run on Apple Silicon environments with VMware Fusion
- **Cloud Deployment**: Kakao Cloud Terraform 3-Layer deployment support

### Version Compatibility

| Installer | K-PaaS CP | Kubernetes | Ubuntu | Architecture |
|-----------|-----------|------------|--------|--------------|
| 2.2.0 | v1.7.0 | v1.33.5 | 24.04 | amd64, arm64 |

### Installation

```bash
# Vagrant (Local)
vagrant up --provider=vmware_desktop

# Kakao Cloud (Terraform)
cd csp/kakao-cloud/terraform-layered
./deploy.sh
```

## Forked Components

### Portal Components
- **cp-portal-ui**: Container Platform Portal UI
- **cp-portal-api**: Container Platform Portal API
- **cp-portal-common-api**: Portal Common API
- **cp-catalog-api**: Application installation/management API using Helm charts
- **cp-metrics-api**: Metrics collection API

### Chaos Engineering
- **cp-chaos-api**: Chaos Engineering API
- **cp-chaos-collector**: Chaos Engineering monitoring and data collection

### Infrastructure Management
- **cp-terraman**: Terraform-based infrastructure management
- **cp-remote-api**: Remote management API

### Migration Components
- **cp-migration-ui**: Migration UI
- **cp-migration-api**: Migration API
- **cp-migration-auth-api**: Migration Authentication API

## Key Modifications

### Multi-Architecture Builds
- **Simultaneous AMD64/ARM64 builds**: Multi-platform image creation using Docker buildx
- **Unified Manifest**: Automatic architecture selection with a single image tag
- **ARM64 Optimization**: Support for Apple Silicon, AWS Graviton environments

### Software Supply Chain Security
- **Cosign Signing**: Container image signing support
- **SBOM (SPDX)**: Software Bill of Materials generation

### Standard Framework Sample
- **egovframe-web-sample**: Multi-architecture build support (amd64/arm64)

## References

- **K-PaaS Lite**: [dasomel/k-paas](https://github.com/dasomel/k-paas)
- **Fork Organization**: [dasomel-k-pass](https://github.com/dasomel-k-pass)
- **Upstream Repository**: [K-PaaS](https://github.com/k-paas)
