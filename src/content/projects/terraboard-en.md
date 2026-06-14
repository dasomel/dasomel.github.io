---
title: "Terraboard"
description: "Web dashboard for visualizing and querying Terraform state (Fork)"
github: "https://github.com/dasomel/terraboard"
tags: ["Terraform", "IaC", "Dashboard", "DevOps"]
order: 4
type: "fork"
---

## Project Overview

Terraboard is a web-based dashboard for visualizing and exploring Terraform state files.

This is a fork of [Camptocamp/terraboard](https://github.com/camptocamp/terraboard).

## Key Features

### State Visualization
- **Resource Tree View**: Display all resources in Terraform state hierarchically
- **State History**: Track state changes over time
- **Version Comparison**: Compare differences between different state versions

### Search and Filtering
- **Full-text Search**: Search by resource names and attribute values
- **Resource Type Filter**: Filter by specific resource types
- **Module Grouping**: Group resources by module

### Backend Support
- AWS S3 (state) + DynamoDB (lock)
- S3-compatible backends (e.g. MinIO)
- Google Cloud Storage
- Terraform Cloud (remote)
- GitLab

Multiple buckets/providers can be configured at once, and a PostgreSQL database is required to store Terraboard's internal dataset.

## What This Fork Adds

This fork modernizes the container build and release pipeline.

- **Multi-architecture images**: amd64/arm64 Docker images published to GHCR
- **Supply chain security**: SBOM generation, SLSA provenance attestation, and Cosign keyless signing with verification
- **Updated toolchain**: Go 1.23, upgraded to Terraform 1.13.5 internal packages (removing the hashicorp/terraform dependency)
- **Automated releases**: automatic GitHub Release creation and refined OCI labels/annotations
- Latest version: v2.5.1

## Architecture

<Mermaid chart={`graph LR
  A["🖥️ Browser<br/>(AngularJS)"] -->|HTTP| B["⚙️ Terraboard<br/>(Go API)"]
  B -->|Query| C["☁️ Backend<br/>(S3 / GCS / TC)"]
  B -->|Read/Write| D["🗄️ PostgreSQL"]
  style A fill:#f0fdf4,stroke:#059669,color:#111
  style B fill:#f0fdf4,stroke:#059669,color:#111
  style C fill:#f9fafb,stroke:#d1d5db,color:#111
  style D fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

## References

- **Original Repository**: [camptocamp/terraboard](https://github.com/camptocamp/terraboard)
- **Official Documentation**: [Terraboard Documentation](https://github.com/camptocamp/terraboard#readme)
