---
title: GitOps Workflow
description: Argo CD + Gitea App-of-Apps declarative delivery and Sync Waves ordering.
project: Narwhal
path: narwhal/gitops
order: 1102
lastModified: 2026-08-23
---

# GitOps Workflow

All infrastructure and 35 platform applications in Narwhal are managed declaratively via **Argo CD** and self-hosted **Gitea**.

## App-of-Apps Pattern

A single root application (`root-app`) recursively synchronizes all child application manifests under `gitops/applications/`.

```text
                      [ root-application ]
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼ (Wave 1: Core)        ▼ (Wave 2: Infra)       ▼ (Wave 3: Apps)
  - cilium                - keycloak              - narwhal-portal
  - kube-vip              - apisix                - demo-apps
  - cert-manager          - prometheus-stack      - user-workloads
  - nfs-csi-driver        - seaweedfs             - chaos-mesh
```

## Sync Waves Dependency Ordering

Bootstrap ordering is enforced strictly using `argocd.argoproj.io/sync-wave` annotations:

- **Wave -1**: Custom Resource Definitions (CRDs) and namespace creation
- **Wave 0**: CNI (Cilium), Certificate Manager (cert-manager), Storage Drivers (NFS CSI)
- **Wave 1**: IAM (Keycloak), Secrets Engine (OpenBao), API Gateway (APISIX)
- **Wave 2**: Telemetry (Prometheus, Loki, Tempo, Alloy) and Databases (CloudNativePG)
- **Wave 3**: Narwhal Portal, User Workloads, and Chaos Engineering tools

## GitOps Inspection Commands

```bash
# List all application sync states
kubectl get applications -n argocd

# Trigger manual synchronization with pruning
argocd app sync keycloak --prune

# Audit drift against Git source of truth
argocd app diff keycloak
```
