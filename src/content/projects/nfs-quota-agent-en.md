---
title: "NFS Quota Agent"
description: "Kubernetes NFS PersistentVolume Storage Quota Enforcement Daemon"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "Go", "Storage", "NFS", "XFS", "Quota", "gRPC", "Prometheus"]
order: 8
type: "own"
featured: true
problem: "Standard Kubernetes NFS CSI drivers do not enforce physical storage quotas on PersistentVolumes, allowing rogue workloads to exhaust shared storage"
solution: "A lightweight Go daemon enforcing byte-accurate storage quotas on NFS subdirectories using Linux XFS Project Quotas and a QuotaPolicy CRD"
---

## Project Overview

**NFS Quota Agent** is a high-performance storage enforcement daemon that brings strict filesystem-level storage quotas to Kubernetes NFS PersistentVolumes.

It solves the fundamental lack of quota enforcement in standard NFS provisioners by leveraging Linux kernel **XFS Project Quotas (`xfs_quota`)**.

### Key Highlights

- **XFS Project Quota Engine**: Immutable project IDs and hard/soft byte limit enforcement per subdirectory
- **gRPC & HTTP APIs**: Low-latency RPC and REST endpoints for CSI provisioners and orchestrators
- **QuotaPolicy CRD**: Declarative storage policies defined natively in Kubernetes manifests
- **Prometheus Metrics**: Granular utilization metrics, remaining headroom, and quota violation alerts
- **Built-in Web UI**: Responsive storage administration dashboard with real-time inspection

---

## Architecture Diagram

```text
  Kubernetes Cluster               NFS Storage Host
┌─────────────────────┐          ┌───────────────────────────────────┐
│ PVC (Claim: 10Gi)   │          │  nfs-quota-agent Daemon (Go)      │
│         │           │          │  - gRPC Server (:50051)           │
│         ▼           │  gRPC    │  - HTTP API & Metrics (:8080)     │
│ NFS CSI Provisioner ├─────────►│  - Quota Controller               │
└─────────────────────┘          └─────────────────┬─────────────────┘
                                                   │
                                                   ▼ xfs_quota CLI / ioctl
                                 ┌───────────────────────────────────┐
                                 │  Linux XFS Filesystem             │
                                 │  /srv/nfs/pvc-12345 (ProjID: 101) │
                                 │  [Hard Limit: 10 GiB Enforced]    │
                                 └───────────────────────────────────┘
```

---

## Getting Started

```bash
# 1. Clone and compile
git clone https://github.com/dasomel/nfs-quota-agent.git
cd nfs-quota-agent
make build

# 2. Run daemon pointing to XFS mount
sudo ./bin/nfs-quota-agent --nfs-root=/srv/nfs --port=8080 --grpc-port=50051

# 3. Deploy via Helm to Kubernetes
helm install nfs-quota-agent ./charts/nfs-quota-agent -n storage --create-namespace
```

---

## Documentation Index

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [Agent Overview](/oss/en/nfs-quota-agent/overview) | XFS quota enforcement engine and design principles |
| **Architecture** | [Storage Architecture](/oss/en/nfs-quota-agent/architecture) | Linux XFS Project Quotas and daemon internals |
| **Feature Guide** | [Features & CRD](/oss/en/nfs-quota-agent/feature-guide) | QuotaPolicy CRD, dynamic provisioning, and metrics |
| **Getting Started** | [Installation & Setup](/oss/en/nfs-quota-agent/getting-started) | systemd service and Helm deployment guide |
| **Operations** | [Operations & Monitoring](/oss/en/nfs-quota-agent/operations) | Web UI administration, alerting, and troubleshooting |
