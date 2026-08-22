---
title: "Narwhal"
description: "A reproducible, verifiable Kubernetes Internal Developer Platform (IDP)"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio", "ArgoCD", "Cilium", "Air-Gap", "Keycloak", "Alloy"]
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

- **Kubernetes v1.35 HA**: 3 Control Plane + 3 Worker node topology with kube-vip API VIP (`192.168.56.100`)
- **35 GitOps Applications**: Declarative lifecycle management via Argo CD and Gitea with Sync Waves dependency control
- **263 Incident Lessons**: Root causes and discriminators codified in `lessons-log.md`
- **51 CI Regression Checks**: Automated gating preventing past bugs from recurring across upgrades
- **Air-Gap Bundle Support**: Pre-verified image, Helm chart, and OS package bundles for ARM64/AMD64
- **Kube-Ready-Box Base**: Tuned Ubuntu 26.04 LTS base images with XFS Project Quota

---

## 35 Integrated Components Matrix

| Domain | Component | Version | Role & Integration Seam |
|---|---|---|---|
| **Control Plane** | Kubernetes | v1.35 | 3-node HA etcd quorum, high-availability API servers |
| **HA VIP** | kube-vip | v1.1.x | Virtual IP management for control plane (`192.168.56.100`) |
| **CNI** | Cilium | v1.17+ | eBPF host routing, kube-proxy replacement, NetworkPolicies |
| **Service Mesh** | Istio Ambient | v1.24+ | ztunnel L4 mTLS encryption, sidecar-less zero-trust mesh |
| **Load Balancer** | MetalLB | v0.14+ | L2 mode IP pool allocation (`192.168.56.200~220`) |
| **API Gateway** | Apache APISIX | v3.11+ | OIDC authentication plugins, dynamic routing, rate limiting |
| **GitOps** | Argo CD | v2.13+ | App-of-Apps pattern, continuous drift detection and reconciliation |
| **Git Engine** | Gitea | v1.23+ | Self-hosted Git repository with automated webhook sync triggers |
| **IAM / SSO** | Keycloak | v26+ | Centralized identity provider, OIDC federation, role-based access |
| **Metrics** | Prometheus | v2.55+ | Cluster metric collection and Alertmanager routing |
| **Dashboards** | Grafana | v11+ | Pre-configured unified operations and telemetry dashboards |
| **Logs** | Grafana Loki | v3.3+ | Multi-tenant log aggregation and live log streaming |
| **Log Agent** | Grafana Alloy | v1.5+ | eBPF and container log forwarding daemon |
| **Traces** | Grafana Tempo | v2.6+ | OpenTelemetry-compatible distributed tracing backend |
| **Network Flow** | Cilium Hubble | v1.17+ | eBPF real-time service dependency and flow inspection |
| **File Storage** | NFS CSI + Quota | v4.9+ | XFS Project Quota storage volume limiting (`nfs-quota-agent`) |
| **Object Store** | SeaweedFS S3 | v3.79+ | Distributed high-performance S3-compatible storage tier |
| **Relational DB** | CloudNativePG | v1.25+ | Production HA PostgreSQL clusters with Barman backup automation |
| **Secrets** | OpenBao | v2.1+ | Encrypted secret storage and dynamic credential generation |
| **Policy** | Kyverno | v1.13+ | Pod Security Standards (PSS) admission validation |
| **Certificates** | cert-manager | v1.16+ | Automated internal CA and Let's Encrypt renewal |
| **Backup / DR** | Velero | v1.15+ | Cluster resource and volume snapshot backup and restore |
| **Chaos** | Chaos Mesh | v2.6+ | Chaos engineering experiments (network delay, packet drop, node loss) |
| **UI Portal** | Narwhal Portal | Next.js 16 | Platform inspection, release status, and developer workbench |

---

## Getting Started

```bash
# 1. Clone repository
git clone https://github.com/dasomel/narwhal.git
cd narwhal

# 2. Boot local 6-node HA cluster (VMware Desktop / VirtualBox)
vagrant up --provider=vmware_desktop

# 3. Verify node readiness
vagrant ssh master-1 -c "kubectl get nodes -o wide"

# 4. Check GitOps synchronization status
vagrant ssh master-1 -c "kubectl get applications -n argocd"

# 5. Run full platform verification suite (120+ checks)
vagrant ssh master-1 -c "/opt/narwhal/scripts/verify-cluster.sh"
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
