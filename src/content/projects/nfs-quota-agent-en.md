---
title: "NFS Quota Agent"
description: "Agent that automatically enforces filesystem quotas on NFS PVs for Kubernetes with web dashboard monitoring"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "NFS", "Storage", "Quota", "Go", "Web UI", "Helm"]
order: 2
type: "own"
---

## Project Overview

NFS Quota Agent is an agent that **automatically applies filesystem-level quotas to NFS-based PersistentVolumes in Kubernetes and provides a web dashboard for monitoring**.

When using NFS storage in Kubernetes, PVC capacity requests are not actually enforced at the filesystem level. This agent runs on NFS server nodes, automatically sets up XFS/ext4 project quotas based on PV capacity, and provides integrated management including usage trends, orphan directory cleanup, and audit logging.

## Key Features

### Automatic Quota Management
- **PV Monitoring**: Automatically detects Kubernetes NFS PersistentVolumes (native NFS + CSI NFS)
- **Auto-apply Quotas**: Sets XFS/ext4 project quotas based on PV capacity
- **Status Tracking**: Monitors quota application status through PV annotations

### Web UI Dashboard
Integrated monitoring dashboard with 5 tabs:

![Quotas Dashboard](/images/nfs-quota-agent/01-dashboard-quotas.png)

| Tab | Description |
|-----|-------------|
| **Quotas** | Real-time disk usage, PV/PVC binding status, progress bars |
| **Orphans** | Orphan directory detection and cleanup (grace period, Dry-Run/Live mode) |
| **Trends** | 24h/7d/30d usage trends and growth analysis |
| **Policies** | Namespace-level LimitRange/ResourceQuota policies and violations |
| **Audit Logs** | Complete CREATE/UPDATE/DELETE/CLEANUP operation history |

#### Orphans - Directory Cleanup

![Orphans Tab](/images/nfs-quota-agent/02-orphans.png)

Detects directories remaining on NFS after PV deletion and safely cleans them up after a grace period.

#### Trends - Usage Analysis

![Trends Tab](/images/nfs-quota-agent/03-trends.png)

Tracks usage changes over 24h/7d/30d intervals for capacity planning.

#### Policies - Namespace Policies

![Policies Tab](/images/nfs-quota-agent/04-policies.png)

Displays namespace-level storage policies based on LimitRange and ResourceQuota, along with violation status.

#### Audit Logs - Operation History

![Audit Logs Tab](/images/nfs-quota-agent/05-audit-logs.png)

Records and filters the complete history of all quota CREATE/UPDATE/DELETE/CLEANUP operations.

### Multi-Provisioner Support
- **csi-driver-nfs**: CSI-based NFS driver (recommended)
- **nfs-subdir-external-provisioner**: NFS Subdir External Provisioner
- **Universal Mode**: Process all NFS PVs with `--process-all-nfs`

### Filesystem Support

| Filesystem | Quota Tool | Mount Option | Min Kernel |
|------------|------------|--------------|------------|
| XFS | `xfs_quota` | `prjquota` | 2.6+ |
| ext4 | `setquota` | `prjquota` | 4.5+ |

## Architecture

```
┌─────────────────┐     ┌─────────────────────────────────────────────────┐
│   Kubernetes    │     │              NFS Server Node                    │
│    API Server   │     │  ┌─────────────────────────────────────────────┐│
│                 │     │  │           nfs-quota-agent                   ││
│  ┌───────────┐  │     │  │  ┌───────────┐    ┌─────────────────────┐  ││
│  │    PV     │◄─┼─────┼──┼──│  Watcher  │    │  Quota Manager      │  ││
│  │ (NFS type)│  │     │  │  └───────────┘    │  (XFS / ext4)       │  ││
│  └───────────┘  │     │  │         │         └─────────────────────┘  ││
│                 │     │  │         ▼                    │             ││
└─────────────────┘     │  │  ┌───────────────────────────────────────┐ ││
                        │  │  │  Web UI · Metrics · Audit · History  │ ││
                        │  │  └───────────────────────────────────────┘ ││
                        │  └─────────────────────────────────────────────┘│
                        │                      │                          │
                        │                      ▼                          │
                        │  ┌──────────────────────────────────────────┐   │
                        │  │      XFS/ext4 Filesystem (/data)         │   │
                        │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
                        │  │  │ ns-pvc-1 │ │ ns-pvc-2 │ │ ns-pvc-3 │  │   │
                        │  │  │ quota:1G │ │ quota:5G │ │quota:10G │  │   │
                        │  │  └──────────┘ └──────────┘ └──────────┘  │   │
                        │  └──────────────────────────────────────────┘   │
                        └─────────────────────────────────────────────────┘
```

## CLI Subcommands

```bash
# Run quota enforcement agent (default)
nfs-quota-agent run --nfs-base-path=/export --provisioner-name=nfs.csi.k8s.io

# Show quota status and disk usage
nfs-quota-agent status --path=/data

# Show top directories by usage (watch mode supported)
nfs-quota-agent top --path=/data -n 10 --watch

# Generate report (json, yaml, csv)
nfs-quota-agent report --path=/data --format=json --output=report.json

# Cleanup orphaned quotas (dry-run by default)
nfs-quota-agent cleanup --path=/data --dry-run=false

# Start web UI dashboard
nfs-quota-agent ui --path=/data --addr=:8080

# Query audit logs
nfs-quota-agent audit --file=/var/log/nfs-quota-agent/audit.log --action=CREATE
```

## Helm Chart Installation

```bash
helm repo add nfs-quota-agent https://dasomel.github.io/nfs-quota-agent
helm install nfs-quota-agent nfs-quota-agent/nfs-quota-agent \
  --namespace nfs-quota-agent \
  --create-namespace \
  --set config.nfsBasePath=/export \
  --set config.nfsServerPath=/data \
  --set config.provisionerName=nfs.csi.k8s.io \
  --set webUI.enabled=true \
  --set audit.enabled=true
```

### Key Configuration Values

| Key | Default | Description |
|-----|---------|-------------|
| `config.provisionerName` | `nfs.csi.k8s.io` | Provisioner to filter |
| `config.syncInterval` | `30s` | Sync interval |
| `webUI.enabled` | `false` | Enable web UI |
| `audit.enabled` | `false` | Enable audit logging |
| `cleanup.enabled` | `false` | Enable auto orphan cleanup |
| `cleanup.gracePeriod` | `24h` | Grace period before deletion |
| `history.enabled` | `false` | Enable usage history tracking |
| `policy.enabled` | `false` | Enable namespace quota policy |

## Namespace Quota Policy

Policies are determined from three sources by priority:

**LimitRange > Namespace Annotation > Global Default**

```yaml
# LimitRange for PVC size limits
apiVersion: v1
kind: LimitRange
metadata:
  name: storage-limits
  namespace: team-a
spec:
  limits:
  - type: PersistentVolumeClaim
    max:
      storage: 50Gi
    min:
      storage: 1Gi
    default:
      storage: 5Gi
```

## Prometheus Metrics

Metrics are exposed at `:9090/metrics`:

```
nfs_disk_total_bytes{path="/data"} 1099511627776
nfs_disk_used_bytes{path="/data"} 698488954880
nfs_quota_used_bytes{directory="prod-data"} 10523566080
nfs_quota_limit_bytes{directory="prod-data"} 10737418240
nfs_quota_directories_total 45
nfs_quota_warning_count 3
nfs_quota_exceeded_count 1
```

## Critical Requirement

**Must Run on NFS Server Node**: Quota commands like `xfs_quota` and `setquota` only work on local filesystems, so the agent must run on the NFS server node.

For external NFS servers, the agent supports running as a binary, Docker container, or by adding the NFS server as a cluster node.

## Tech Stack

- **Language**: Go 1.24
- **Kubernetes**: client-go v0.29 (PV/PVC/Namespace watching)
- **Filesystem**: XFS, ext4 project quotas
- **Deployment**: Helm Chart, Multi-arch container images (amd64, arm64, armv7)
- **Security**: Trivy vulnerability scanning, SBOM generation, Provenance attestation
- **CI/CD**: GitHub Actions (automated build, test, release)

## Use Cases

### Multi-Tenancy Environment
Isolate and limit storage usage per team on shared NFS storage with namespace-level policies

### On-Premises Kubernetes
Automate quota management and web UI monitoring for on-premises NFS environments

### Operations Audit & Capacity Planning
Track all quota changes via audit logs and predict capacity expansion needs through usage trends

## References

- **GitHub**: [dasomel/nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
- **Helm Chart**: [nfs-quota-agent Charts](https://dasomel.github.io/nfs-quota-agent)
- **Feature Guide**: [Feature Guide (docs)](https://github.com/dasomel/nfs-quota-agent/tree/main/docs)
