---
title: "NFS Quota Agent"
description: "Agent that automatically enforces filesystem quotas on NFS PVs for Kubernetes"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "NFS", "Storage", "Quota", "Go"]
order: 2
type: "own"
---

## Project Overview

NFS Quota Agent is an agent that **automatically applies filesystem-level quotas to NFS-based PersistentVolumes in Kubernetes**.

It solves the problem where storage capacity requests in Kubernetes are not actually enforced on NFS. The agent runs on NFS server nodes and automatically sets up project quotas based on PV capacity.

## Key Features

### Automatic Quota Management
- **PV Monitoring**: Automatically detects Kubernetes NFS PersistentVolumes
- **Auto-apply Quotas**: Sets filesystem project quotas based on PV capacity
- **Status Tracking**: Monitors quota application status through PV annotations

### Filesystem Support
- **XFS**: XFS project quotas (`xfs_quota`)
- **ext4**: ext4 project quotas (`setquota`)

### Multi-Provisioner Support
- **csi-driver-nfs**: CSI-based NFS driver
- **nfs-subdir-external-provisioner**: NFS Subdir External Provisioner
- **Universal Mode**: Option to process all NFS PVs

### Management Tools
- **Quota Status Check**: Query currently applied quotas
- **Disk Usage Analysis**: Check disk usage per project
- **Orphan Quota Cleanup**: Remove residual quotas from deleted PVs
- **Web UI Dashboard**: Visualize quota status

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│  │    Pod    │  │    Pod    │  │    Pod    │            │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘            │
│        │              │              │                  │
│        └──────────────┴──────────────┘                  │
│                       │                                 │
│              ┌────────▼─────────┐                       │
│              │  PersistentVolume│                       │
│              │   (NFS Storage)  │                       │
│              └────────┬─────────┘                       │
└───────────────────────┼─────────────────────────────────┘
                        │ NFS Mount
                        ▼
         ┌──────────────────────────────┐
         │       NFS Server Node        │
         │  ┌────────────────────────┐  │
         │  │  NFS Quota Agent       │  │
         │  │  - Watch PVs           │  │
         │  │  - Apply quotas        │  │
         │  │  - Monitor status      │  │
         │  └────────────────────────┘  │
         │              │               │
         │              ▼               │
         │  ┌────────────────────────┐  │
         │  │  Filesystem (XFS/ext4) │  │
         │  │  - Project Quotas      │  │
         │  └────────────────────────┘  │
         └──────────────────────────────┘
```

## Critical Requirement

**Must Run on NFS Server Node**: Quota commands like `xfs_quota` and `setquota` only work on local filesystems, so the agent must run on the NFS server node.

## Usage Examples

### Helm Installation

```bash
helm repo add nfs-quota-agent https://dasomel.github.io/nfs-quota-agent
helm install nfs-quota-agent nfs-quota-agent/nfs-quota-agent \
  --set nfsServerPath=/exports/nfs \
  --set provisioner=csi-driver-nfs
```

### Check Quota Status

```bash
# Query all project quotas
nfs-quota-agent status

# Analyze disk usage
nfs-quota-agent disk-usage

# Cleanup orphaned quotas
nfs-quota-agent cleanup-orphans
```

### PV Annotations

When quotas are applied, annotations are added to the PV:

```yaml
metadata:
  annotations:
    nfs-quota-agent.io/quota-status: "applied"
    nfs-quota-agent.io/project-id: "1001"
```

## Tech Stack

- **Language**: Go
- **Kubernetes**: PV monitoring using client-go
- **Filesystem**: XFS, ext4 project quotas
- **Deployment**: Helm Chart, Container images

## Use Cases

### Multi-Tenancy Environment
Isolate and limit storage usage for each team on shared NFS storage

### Dev/Test Environments
Prevent uncontrolled storage usage by developers and reduce costs

### On-Premises Kubernetes
Automate quota management in environments using on-premises NFS instead of cloud storage

## References

- **GitHub**: [dasomel/nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
- **Helm Chart**: [nfs-quota-agent Charts](https://dasomel.github.io/nfs-quota-agent)
