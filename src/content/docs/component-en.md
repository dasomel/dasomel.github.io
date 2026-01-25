---
title: "Components"
description: "K-PaaS Local Version Components"
order: 4
lastModified: 2024-07-03
---

## K-PaaS Local Version

![Components](/images/kpaas/component.png)

![Component Colors](/images/kpaas/component_color.png)

Components excluded from K-PaaS Local Version

## Components

### Core Features

| Component | Purpose | Notes |
|-----------|---------|-------|
| Kubernetes | Container Platform | |
| Portal | Platform Management UI | |
| Harbor | Container Image Storage | Used by Portal |
| Keycloak | SSO Login | Used by Portal |
| Vault | Platform Metrics Collection (Metrics-API) | Used by Portal |

### Excluded Components

| Component | Purpose | Notes |
|-----------|---------|-------|
| ceph | Can be replaced with NFS | High resource consumption |
| Pipeline | For CI/CD | Not required |
| Source Control | Source Management | Not required |
| Kubeflow | AI Features | Not required |
