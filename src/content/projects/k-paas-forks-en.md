---
title: "K-PaaS Portal Multi-Arch"
description: "K-PaaS Container Platform Portal with multi-architecture build support"
github: "https://github.com/dasomel-k-pass"
tags: ["K-PaaS", "Kubernetes", "Multi-Arch", "ARM64"]
order: 5
type: "fork"
---

## Project Overview

Forked Portal components from [K-PaaS Container Platform](https://github.com/k-paas) with added **multi-architecture (AMD64/ARM64) build support**.

## Forked Components

### Portal
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

## Key Modifications

### Multi-Architecture Builds
- **Simultaneous AMD64/ARM64 builds**: Multi-platform image creation using Docker buildx
- **Unified Manifest**: Automatic architecture selection with a single image tag
- **ARM64 Optimization**: Support for Apple Silicon, AWS Graviton environments

### GitHub Actions Automation
- Automated build and deployment pipelines
- Image registry: GitHub Container Registry (ghcr.io)

## References

- **Fork Organization**: [dasomel-k-pass](https://github.com/dasomel-k-pass)
- **Upstream Repository**: [K-PaaS](https://github.com/k-paas)
