---
title: "Narwhal"
description: "Vagrant-based Kubernetes Internal Developer Platform (IDP) cluster"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio", "ArgoCD", "Cilium"]
order: 6
type: "own"
featured: true
problem: "Setting up a production-grade Kubernetes IDP locally requires manually installing and integrating dozens of components"
solution: "A single `vagrant up` automatically provisions a full IDP cluster with HA control plane, GitOps, SSO, Observability, and Service Mesh"
---

## Project Overview

**Narwhal** is a Vagrant-based Kubernetes **Internal Developer Platform (IDP)** cluster.

Like the narwhal — the "unicorn of the sea" — it delivers a powerful full platform in a single cluster. Built on the [kube-ready-box](https://github.com/dasomel/kube-ready-box) `dasomel/ubuntu-26.04-xfs` Box, it fully automates provisioning of a Kubernetes v1.35 HA cluster with GitOps, SSO, Observability, Service Mesh, Storage, and Backup.

## Key Components

| Layer | Components |
|-------|------------|
| **Orchestration** | Kubernetes v1.35 (HA: 3 masters, 3 workers) |
| **Networking** | Cilium CNI, MetalLB, kube-vip (VIP HA), APISIX API Gateway |
| **GitOps** | ArgoCD + Gitea (App-of-Apps pattern) |
| **SSO** | Keycloak OIDC (ArgoCD, Grafana, Gitea, Harbor, Headlamp) |
| **Observability** | Prometheus, Grafana, Loki, Tempo, Hubble |
| **Storage** | NFS (Block) + SeaweedFS (Object/S3) + nfs-quota-agent |
| **Service Mesh** | Istio ambient mode (mTLS, ztunnel, zero sidecars) |
| **Security** | cert-manager, OpenBao (Secrets), Kyverno (Policy) |
| **Backup** | Velero + CNPG barman |

## Architecture

```
┌──────────────────────────────────────────────────┐
│                  Vagrant VMs                     │
├──────────────────┬─────────────┬─────────────────┤
│  master-1        │ master-2/3  │ worker-1/2/3    │
│  192.168.56.10   │ .11 / .12   │ .21 / .22 / .23 │
│  2 CPU, 4GB      │ 2 CPU, 4GB  │ 2 CPU, 6GB      │
│  NFS, dnsmasq    │ dnsmasq     │                 │
└──────────────────┴─────────────┴─────────────────┘
                   VIP: 192.168.56.100 (kube-vip)
                   LB:  192.168.56.200 (MetalLB/APISIX)
                   DNS: *.local.narwhal.internal
```

## Requirements

- Vagrant 2.4+
- VirtualBox 7.1+ or VMware Fusion 26H1
- 32GB+ RAM (40GB+ recommended)
- 30GB+ Disk per VM

## Quick Start

```bash
git clone https://github.com/dasomel/narwhal.git
cd narwhal

# Create cluster (all components auto-provisioned)
vagrant up --provider=vmware_desktop

# Check node status
vagrant ssh master-1 -c "kubectl get nodes"

# Destroy cluster
vagrant destroy -f
```

## References

- **GitHub**: [dasomel/narwhal](https://github.com/dasomel/narwhal)
- **Base Box**: [dasomel/kube-ready-box](https://github.com/dasomel/kube-ready-box)
- **nfs-quota-agent**: [dasomel/nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
