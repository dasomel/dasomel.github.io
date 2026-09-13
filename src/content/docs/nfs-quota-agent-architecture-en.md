---
title: Storage Architecture
description: Linux XFS Project Quotas, gRPC daemon internals, and provisioning flows.
project: NFS Quota Agent
path: nfs-quota-agent/architecture
order: 1301
lastModified: 2026-08-27
---

# Storage Architecture

NFS Quota Agent runs as a lightweight, single-binary Go daemon on the NFS host server with root privileges.

## Architecture Diagram

<Mermaid chart={`flowchart TB
  CSI["Kubernetes CSI Driver / Client"] -->|"gRPC :50051 / HTTP :8080"| AGENT["nfs-quota-agent Daemon · Go"]

  subgraph CAP["Agent capabilities"]
    GRPC["gRPC Server\nCreateQuota · SetQuota · DeleteQuota"]
    HTTP["HTTP REST + Prometheus metrics"]
    PID["Project ID Allocator\n/etc/projects · /etc/projid"]
    CTRL["XFS Quota Controller\nxfs_quota CLI / ioctl"]
  end

  AGENT --> GRPC
  AGENT --> HTTP
  AGENT --> PID
  AGENT --> CTRL
  CTRL -->|"Linux VFS / XFS enforcement"| FS["/srv/nfs filesystem\nmounted with pquota"]
  FS --> P1["pvc-aaaa · Project 1001 · 10 GiB"]
  FS --> P2["pvc-bbbb · Project 1002 · 50 GiB"]
  FS --> P3["pvc-cccc · Project 1003 · 5 GiB"]`} />

The diagram separates **Kubernetes requests → agent control logic → Linux/XFS kernel enforcement**. Capacity limits are ultimately enforced by XFS Project Quotas in the kernel rather than by application-level checks.

## XFS Project Quota Kernel Mechanics

1. **Mount Option**: The XFS filesystem must be mounted with the `pquota` (or `prjquota`) option.
2. **Directory Association**: When a new PVC is created, a unique `Project ID` is assigned and linked to the directory:
   ```bash
   xfs_quota -x -c 'project -s -p /srv/nfs/pvc-12345 101' /srv/nfs
   ```
3. **Limit Enforcement**: Hard and soft byte thresholds are established:
   ```bash
   xfs_quota -x -c 'limit -p bhard=10g 101' /srv/nfs
   ```
4. **Kernel-Level Blocking**: Any write attempting to exceed the 10GiB limit immediately fails with `EDQUOT (Disk quota exceeded)`.
