---
title: GitOps Workflow
description: Argo CD + Gitea App-of-Apps declarative delivery and Sync Waves ordering.
project: Narwhal
path: narwhal/gitops
order: 1102
lastModified: 2026-08-27
---

# GitOps Workflow

All infrastructure and 35 platform applications in Narwhal are managed declaratively via **Argo CD** and self-hosted **Gitea**.

## App-of-Apps Pattern

A single root application (`root-app`) recursively synchronizes all child application manifests under `gitops/applications/`.

<Mermaid chart={`flowchart TB
  ROOT["root-application\nApp-of-Apps"]
  ROOT --> CORE["Wave 1 · Core"]
  ROOT --> INFRA["Wave 2 · Infrastructure"]
  ROOT --> APPS["Wave 3 · Applications"]

  subgraph CORE_SET["Core foundation"]
    CILIUM["Cilium"]
    KVIP["kube-vip"]
    CERT["cert-manager"]
    NFS["NFS CSI driver"]
  end

  subgraph INFRA_SET["Platform infrastructure"]
    KEYCLOAK["Keycloak"]
    APISIX["APISIX"]
    OBS["Prometheus stack"]
    SEAWEED["SeaweedFS"]
  end

  subgraph APP_SET["Workloads"]
    PORTAL["Narwhal Portal"]
    DEMO["Demo apps"]
    USER["User workloads"]
    CHAOS["Chaos Mesh"]
  end

  CORE --> CILIUM
  CORE --> KVIP
  CORE --> CERT
  CORE --> NFS
  INFRA --> KEYCLOAK
  INFRA --> APISIX
  INFRA --> OBS
  INFRA --> SEAWEED
  APPS --> PORTAL
  APPS --> DEMO
  APPS --> USER
  APPS --> CHAOS`} />

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
