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
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Terraform Cloud/Enterprise

## Architecture

<Mermaid chart={`graph LR
  A["🖥️ Browser<br/>(Vue.js)"] -->|HTTP| B["⚙️ Terraboard<br/>(Go API)"]
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
