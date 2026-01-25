---
title: "Terraboard"
description: "Web dashboard for visualizing and querying Terraform state (Fork)"
github: "https://github.com/dasomel/terraboard"
tags: ["Terraform", "IaC", "Dashboard", "DevOps"]
order: 3
type: "contributing"
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

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Terraboard │────▶│   Backend   │
│   (Vue.js)  │     │   (Go API)  │     │ (S3/GCS/TC) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  PostgreSQL │
                    └─────────────┘
```

## References

- **Original Repository**: [camptocamp/terraboard](https://github.com/camptocamp/terraboard)
- **Official Documentation**: [Terraboard Documentation](https://github.com/camptocamp/terraboard#readme)
