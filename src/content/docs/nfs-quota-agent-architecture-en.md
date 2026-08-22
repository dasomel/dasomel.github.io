---
title: Storage Architecture
description: Linux XFS Project Quotas, gRPC daemon internals, and provisioning flows.
project: NFS Quota Agent
path: nfs-quota-agent/architecture
order: 1301
lastModified: 2026-08-23
---

# Storage Architecture

NFS Quota Agent runs as a lightweight, single-binary Go daemon on the NFS host server with root privileges.

## Architecture Diagram

```text
Kubernetes CSI Driver / Client
             │
             ▼ gRPC (:50051) / HTTP (:8080)
┌──────────────────────────────────────────────────────────┐
│  nfs-quota-agent Daemon (Go)                             │
│  ├─ gRPC Server (CreateQuota, SetQuota, DeleteQuota)    │
│  ├─ HTTP REST & Prometheus Metrics Exporter              │
│  ├─ Project ID Allocator (/etc/projects, /etc/projid)    │
│  └─ XFS Quota Controller (xfs_quota CLI / ioctl)         │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼ Linux Kernel VFS / XFS Engine
┌──────────────────────────────────────────────────────────┐
│  /srv/nfs Filesystem (Mounted with 'pquota')             │
│  ├─ /srv/nfs/pvc-aaaa (Project ID 1001, Limit: 10 GiB)   │
│  ├─ /srv/nfs/pvc-bbbb (Project ID 1002, Limit: 50 GiB)   │
│  └─ /srv/nfs/pvc-cccc (Project ID 1003, Limit: 5 GiB)    │
└──────────────────────────────────────────────────────────┘
```

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
