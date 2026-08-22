---
title: "Narwhal"
description: "A reproducible, verifiable Kubernetes Internal Developer Platform (IDP)"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio", "ArgoCD", "Cilium", "Air-Gap", "Keycloak"]
order: 6
type: "own"
featured: true
problem: "Integrating dozens of cloud-native components on Kubernetes causes recurring DNS, TLS, SSO, network, and version-compatibility failures"
solution: "A unified GitOps platform managing 35 applications, codifying 263 incident lessons into 51 automated regression tests with air-gap bundling"
---

## Project Overview

**Narwhal** is an open-source **Internal Developer Platform (IDP)** built on Kubernetes v1.35, integrating GitOps, IAM/SSO, Service Mesh, Observability, Artifact Registry, Storage, Backup, Policy, API Gateway, and a Management Portal into a single reproducible unit.

Rather than acting as a simple installer, Narwhal treats component integration seams as core engineering assets.

### Platform Highlights

- **Kubernetes v1.35 HA**: 3 Control Plane + 3 Worker node topology with kube-vip API VIP
- **35 GitOps Applications**: Declarative lifecycle management via Argo CD and Gitea
- **263 Incident Lessons**: Root causes and discriminators codified in `lessons-log.md`
- **51 CI Regression Checks**: Automated gating preventing past bugs from recurring
- **Air-Gap Bundle Support**: Pre-verified image, Helm chart, and OS package bundles for ARM64/AMD64
- **Kube-Ready-Box Base**: Tuned Ubuntu 26.04 LTS base images with XFS Project Quota

---

## Architecture Topology

```text
                     Kubernetes v1.35 HA Cluster
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
      Cilium eBPF             kube-vip (VIP)            MetalLB
         │                                                 │
    Istio Ambient                                       APISIX (API Gateway)
         │                                                 │
   ┌─────┴─────────────────────────────────────────────────┴─────┐
   │ GitOps · SSO · Observability · Storage · Backup · Security  │
   │ ArgoCD / Gitea · Keycloak OIDC · Prometheus / Grafana / Loki│
   │ NFS CSI / SeaweedFS S3 · Velero / CNPG · OpenBao / Kyverno  │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
                          Narwhal Portal (UI)
```

---

## 35 Integrated Components Matrix

| Domain | Key Components | Core Responsibilities |
|---|---|---|
| **Orchestration** | Kubernetes v1.35, kube-vip | 3-node HA control plane, etcd quorum, high-availability API VIP |
| **Networking & Ingress** | Cilium eBPF, MetalLB, Apache APISIX | BGP/L2 load balancing, high-performance API routing, OIDC plugins |
| **GitOps Engine** | Argo CD, Gitea | App-of-Apps declarative synchronization, self-hosted Git repository |
| **IAM & SSO** | Keycloak, OAuth2 Proxy | Centralized directory, OIDC federation, cross-service SSO |
| **Service Mesh** | Istio Ambient, ztunnel | Sidecar-less mTLS, zero-trust L4/L7 policies, Hubble telemetry |
| **Observability** | Prometheus, Grafana, Loki, Tempo, Alloy | Metric collection, distributed tracing, centralized logs |
| **Storage & Data** | NFS CSI, SeaweedFS S3, nfs-quota-agent, CloudNativePG | XFS quota-enforced PVs, S3 object storage, HA PostgreSQL |
| **Security & Policy** | cert-manager, OpenBao, Kyverno | Automated certificate lifecycle, secret management, policy engine |
| **Backup & DR** | Velero, Barman | Full cluster backups, S3 snapshots, point-in-time database recovery |
| **Management UI** | Narwhal Portal | Platform inspection, release status, developer workbench |

---

## Getting Started

```bash
# 1. Clone repository
git clone https://github.com/dasomel/narwhal.git
cd narwhal

# 2. Boot local HA cluster (VMware / VirtualBox)
vagrant up --provider=vmware_desktop

# 3. Verify node readiness
vagrant ssh master-1 -c "kubectl get nodes -o wide"

# 4. Check GitOps synchronization status
vagrant ssh master-1 -c "kubectl get applications -n argocd"
```

---

## Documentation Index

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [Platform Overview](/oss/en/narwhal/overview) | Narwhal IDP philosophy and three-tier integration model |
| **Architecture** | [Cluster Architecture](/oss/en/narwhal/architecture) | 3M+3W node topology, HA control plane, and packet flows |
| **GitOps** | [GitOps Workflow](/oss/en/narwhal/gitops) | Argo CD + Gitea App-of-Apps declarative delivery |
| **Networking** | [Networking & Ingress](/oss/en/narwhal/networking) | Cilium eBPF, MetalLB, APISIX routing, and DNS |
| **Security** | [Security & SSO](/oss/en/narwhal/security) | Keycloak OIDC, OpenBao secrets, and Kyverno policies |
| **Observability** | [Monitoring & Logs](/oss/en/narwhal/observability) | Prometheus, Grafana, Loki, Tempo, and Hubble |
| **Storage** | [Storage & Databases](/oss/en/narwhal/storage) | NFS CSI, SeaweedFS S3, nfs-quota-agent, CNPG |
| **Operations** | [Day-2 Operations & DR](/oss/en/narwhal/operations) | Velero backup, air-gap offline bundles, and maintenance |
| **Testing** | [Regression Testing & Chaos](/oss/en/narwhal/testing) | 263 incident lessons codified into 51 CI checks & Chaos Mesh |
