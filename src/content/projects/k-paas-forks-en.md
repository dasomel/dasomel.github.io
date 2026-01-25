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

## Forked Components

### Portal Components
- **cp-portal-ui**: Container Platform Portal UI
- **cp-portal-api**: Container Platform Portal API
- **cp-portal-common-api**: Portal Common API

### Migration Components
- **cp-migration-ui**: Migration UI
- **cp-migration-api**: Migration API
- **cp-migration-auth-api**: Migration Authentication API

### Other Components
- **cp-catalog-api**: Application installation/management API using Helm charts
- **cp-metrics-api**: Metrics collection API
- **cp-remote-api**: Remote management API
- **cp-terraman**: Terraform-based infrastructure management
- **cp-chaos-api**: Chaos Engineering API
- **cp-chaos-collector**: Chaos Engineering monitoring and data collection

## Key Modifications

### Multi-Architecture Builds
- **Simultaneous AMD64/ARM64 builds**: Multi-platform image creation using Docker buildx
- **Unified Manifest**: Automatic architecture selection with a single image tag
- **ARM64 Optimization**: Support for Apple Silicon, AWS Graviton environments

### GitHub Actions Automation
- Automated build and deployment pipelines
- Image registry: GitHub Container Registry (ghcr.io)
- Automated version management and tagging

## Use Case

Enabling K-PaaS Container Platform to run on various architecture environments:
- Support for Apple Silicon (M1/M2/M3) based development environments
- Utilization of ARM64-based cloud instances like AWS Graviton
- Cost-effective infrastructure operations

## References

- **Organization**: [dasomel-k-pass](https://github.com/dasomel-k-pass)
- **Upstream Repository**: [K-PaaS](https://github.com/k-paas)
