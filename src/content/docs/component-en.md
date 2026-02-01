---
title: "Components"
description: "K-PaaS Lite Components"
order: 4
lastModified: 2026-02-02
---

## K-PaaS Lite Components

![Components](/images/kpaas/component.png)

![Component Colors](/images/kpaas/component_color.png)

Components excluded from K-PaaS Lite

## Components

### Core Features

| Component | Purpose | Notes |
|-----------|---------|-------|
| Kubernetes | Container Platform | v1.33.5 |
| Portal | Platform Management UI | |
| Harbor | Container Image Storage | Used by Portal |
| Keycloak | SSO Login | Bitnami Helm chart |
| OpenBao | Platform Metrics Collection (Metrics-API) | Used by Portal |

### Excluded Components

| Component | Purpose | Notes |
|-----------|---------|-------|
| ceph | Can be replaced with NFS | High resource consumption |
| Pipeline | For CI/CD | Not required |
| Source Control | Source Management | Not required |
| Kubeflow | AI Features | Not required |
