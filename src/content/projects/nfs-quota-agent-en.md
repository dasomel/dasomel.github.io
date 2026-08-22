---
title: "NFS Quota Agent"
description: "Kubernetes agent that enforces filesystem Project Quotas for NFS PersistentVolumes"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "Go", "Storage", "NFS", "XFS", "ext4", "Btrfs", "Quota", "Prometheus"]
order: 8
type: "own"
featured: true
problem: "Kubernetes NFS PersistentVolumes can expose requested capacity without enforcing an equivalent filesystem-level limit on the shared NFS storage"
solution: "A node-local agent that watches NFS PVs and applies filesystem Project Quotas on the actual NFS server using XFS, ext4, or Btrfs quota mechanisms"
---

## Project Overview

**NFS Quota Agent** closes the gap between Kubernetes storage objects and the filesystem that actually stores NFS data.

A PVC may request `10Gi`, but a normal NFS provisioner does not automatically turn that request into a hard limit on the NFS server directory. The agent watches NFS PersistentVolumes, maps them to their local export paths, and applies the appropriate filesystem quota.

This makes it a **Kubernetes + Linux filesystem enforcement component**, not merely another storage controller.

## Core Flow

```text
PVC
 ↓
PersistentVolume
 ↓
NFS CSI / provisioner
 ↓
NFS export + subdirectory
 ↓
NFS Quota Agent
 ↓
Filesystem Project Quota
 ↓
Actual storage enforcement
```

The agent supports native NFS PVs and CSI NFS PVs, including path mapping based on NFS share/subdirectory metadata.

## Filesystem Support

| Filesystem | Mechanism | Notes |
|---|---|---|
| XFS | `xfs_quota` / project quota | Primary use case |
| ext4 | `setquota` + project attribute | Linux project quota support |
| Btrfs | qgroup quota | Target directories must be subvolumes |

## Kubernetes Deployment Model

The agent runs as a **DaemonSet on the NFS server node** because quota operations must target the local filesystem rather than an NFS client mount.

```text
Kubernetes Node
┌─────────────────────────────────────┐
│ NFS Server Node                     │
│                                     │
│  nfs-quota-agent                    │
│       │                             │
│       ├── Kubernetes API            │
│       ├── hostPath:/data            │
│       ├── /dev                       │
│       └── /etc/projects / /etc/projid│
│               │                     │
│               ▼                     │
│        Local XFS/ext4/Btrfs         │
└─────────────────────────────────────┘
```

This creates a larger privilege boundary than a normal Kubernetes controller, so node placement and hostPath scope are part of the security design.

## Operational Features

The project includes optional operational capabilities around the core enforcement engine:

- Prometheus metrics / ServiceMonitor
- PrometheusRule alerts
- audit logging
- usage history
- orphan cleanup with dry-run support
- namespace quota policy
- optional web UI
- configurable sync interval
- Helm-based deployment and rolling upgrades

## Storage Policy

When policy support is enabled, Kubernetes-native resources can be used to express quota defaults and limits. This keeps storage governance close to the existing Kubernetes resource model instead of inventing a completely separate configuration language.

## Safety Boundaries

Because the agent changes real filesystem state:

1. schedule only on intended NFS server nodes
2. restrict hostPath to the actual export
3. keep destructive cleanup disabled or dry-run by default
4. expose quota state through annotations and metrics
5. review host access changes during Helm upgrades

## Getting Started

```bash
git clone https://github.com/dasomel/nfs-quota-agent.git
cd nfs-quota-agent
make build
```

Deploy to Kubernetes:

```bash
kubectl label node <nfs-server-node> nfs-server=true
helm install nfs-quota-agent ./charts/nfs-quota-agent \
  --namespace nfs-quota-agent --create-namespace
```

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [Agent Overview](/oss/en/nfs-quota-agent/overview) | Problem and enforcement model |
| Architecture | [Storage Architecture](/oss/en/nfs-quota-agent/architecture) | PV mapping and quota execution |
| Feature Guide | [Features](/oss/en/nfs-quota-agent/feature-guide) | Filesystems, policies, metrics |
| Getting Started | [Installation & Setup](/oss/en/nfs-quota-agent/getting-started) | Helm and host preparation |
| Features | [Feature Details](/oss/en/nfs-quota-agent/features) | Optional operational features |
| Operations | [Operations & Monitoring](/oss/en/nfs-quota-agent/operations) | Monitoring, cleanup, troubleshooting |
| Web UI | [Web UI](/oss/en/nfs-quota-agent/web-ui) | Storage administration surface |

## Project Relationship

```text
kube-ready-box / Linux filesystem
              ↓
         NFS Server
              ↓
      nfs-quota-agent
              ↓
      Kubernetes PV/PVC
              ↓
           Narwhal
```
