---
title: "GitOps"
description: "Declarative infrastructure management using ArgoCD and Gitea with the App-of-Apps pattern"
project: "Narwhal"
order: 103
lastModified: 2026-07-17
---

## Narwhal GitOps Overview

Narwhal manages all platform components within the cluster (networking, service mesh, observability, storage, security, identity, and the developer portal) using the GitOps methodology. All configurations are declared as Kubernetes/Helm manifests and continuously reconciled by ArgoCD using an **App-of-Apps pattern**.

- **Single Source of Truth:** If a resource is not in the Git repository (`gitops/` directory), it does not run on the cluster.
- **Self-Heal:** If you make direct changes to the cluster using `kubectl apply`, ArgoCD's `selfHeal: true` policy will automatically revert them back to the state defined in Git within minutes.

## Repository Structure (App-of-Apps Pattern)

ArgoCD bootstraps the entire platform starting from a single root Application. The actual directory structure and roles are as follows:

<Mermaid chart={`flowchart TB
  ROOT["idp-apps<br/>(Root Application)"]
  APPS["narwhal-apps<br/>(Helm Chart)"]
  PLAT["narwhal-platform<br/>(Sub-Chart Meta App)"]
  
  G1["Networking<br/>APISIX, MetalLB, cert-manager"]
  G2["Observability<br/>Prometheus, Loki, Tempo"]
  G3["Storage & Security<br/>SeaweedFS, OpenBao, Kyverno"]
  G4["Service Mesh & DevTools<br/>Istio, Harbor, Headlamp"]
  
  M1["APISIX Routes"]
  M2["Narwhal Portal"]
  M3["Istio Policies & Keycloak CR"]
  
  ROOT -->|"watches gitops/apps"| APPS
  APPS -->|"generates"| G1
  APPS -->|"generates"| G2
  APPS -->|"generates"| G3
  APPS -->|"generates"| G4
  APPS -->|"generates"| PLAT
  
  PLAT -->|"generates"| M1
  PLAT -->|"generates"| M2
  PLAT -->|"generates"| M3

  style ROOT fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style APPS fill:#f0fdf4,stroke:#059669,color:#111
  style PLAT fill:#f0fdf4,stroke:#059669,color:#111
  style G1 fill:#f9fafb,stroke:#d1d5db,color:#111
  style G2 fill:#f9fafb,stroke:#d1d5db,color:#111
  style G3 fill:#f9fafb,stroke:#d1d5db,color:#111
  style G4 fill:#f9fafb,stroke:#d1d5db,color:#111
  style M1 fill:#f9fafb,stroke:#d1d5db,color:#111
  style M2 fill:#f9fafb,stroke:#d1d5db,color:#111
  style M3 fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

```text
gitops/
├── apps/
│   └── app-of-apps.yaml           # Root ArgoCD Application (entry point)
├── charts/
│   ├── narwhal-apps/              # Helm chart that renders an Application per platform component
│   │   └── templates/
│   │       ├── apisix.yaml, metallb.yaml, cert-manager.yaml
│   │       ├── istio-base.yaml, istiod.yaml, ztunnel.yaml
│   │       ├── prometheus-stack.yaml, loki.yaml, tempo.yaml
│   │       ├── harbor.yaml, headlamp.yaml, kyverno.yaml, openbao.yaml
│   │       ├── narwhal-platform.yaml  # Meta-app that renders the sub-chart
│   │       └── ... (other support components)
│   └── narwhal-platform/          # First-party manifest chart authored by Narwhal
│       └── templates/
│           ├── apisix-routes.yaml         # APISIX routing rules
│           ├── argocd-config.yaml         # ArgoCD OIDC/RBAC config
│           ├── istio-ambient-policies.yaml# mTLS and mesh policies
│           ├── keycloak-cr.yaml           # Keycloak CR and theme config
│           └── narwhal-portal-k8s.yaml    # Portal deployment config
└── resources/                     # Standalone YAML resources (NetworkPolicies, etc.)
```

This 3-level tree structure allows managing the lifecycle of individual components in an isolated yet unified way.

## Push-to-Deploy Process

The in-cluster ArgoCD points to the **Gitea repository deployed inside the cluster**, not your local environment or an external GitHub repository (`http://gitea-http.devtools.svc.cluster.local:3000/gitea-admin/narwhal-gitops.git`).

<Mermaid chart={`flowchart LR
  DEV["Developer<br/>(Edit gitops/ files)"]
  GIT["Gitea<br/>(In-cluster Git repo)"]
  ARGO["ArgoCD<br/>(automated sync)"]
  K8S["Kubernetes<br/>(Cluster State)"]

  DEV -->|"push-to-gitea.sh"| GIT
  GIT -->|"detects changes"| ARGO
  ARGO -->|"applies (selfHeal)"| K8S
  
  style DEV fill:#fff,stroke:#9ca3af,color:#111
  style GIT fill:#f0fdf4,stroke:#059669,color:#111
  style ARGO fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style K8S fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

Therefore, to modify configurations and apply them to the cluster, you must follow these steps:

1. **Modify files:** Edit resources under the `gitops/` directory. (e.g., `gitops/charts/narwhal-platform/templates/narwhal-portal-k8s.yaml`)
2. **Push to Gitea:** Push the changes to the internal Gitea repository in the cluster.
3. **ArgoCD Sync:** ArgoCD detects the pushed changes and applies them to the cluster via its `automated` sync policy.

You can use the provided script to automate this:

```bash
# Push only specific file changes to Gitea (recommended)
ARGOCD_APP=narwhal-portal scripts/gitops/push-to-gitea.sh \
  "fix(portal-rbac): grant metrics.k8s.io read" \
  charts/narwhal-platform/templates/narwhal-portal-k8s.yaml

# Sync the entire gitops/ directory
scripts/gitops/push-to-gitea.sh "chore: sync all gitops"
```

> **Note:** Just running `git commit` locally or pushing to an external repository will not deploy changes to the cluster. You must push to the internal Gitea using the provided script.

## GitOps Principles & Rules

- **SemVer Pinning:** Mutable tags like `:latest` are avoided. Image or chart versions must explicitly change for ArgoCD to detect a manifest text diff and trigger a sync.
- **GitOps-only changes:** Every persistent change must go through the `gitops/` repository. One-off `kubectl edit` commands used for troubleshooting will be overwritten on the next reconcile loop.
