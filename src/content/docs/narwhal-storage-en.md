---
title: "Storage & Database"
description: "Persistent storage and database infrastructure configuration for the Narwhal cluster"
project: "Narwhal"
order: 106
lastModified: 2026-07-17
---

The Narwhal project provides a tiered storage architecture consisting of block storage, S3 object storage, and a High Availability (HA) relational database to ensure reliable data management.

## Storage Architecture

The following diagram illustrates the storage hierarchy, from the primary block storage provisioner up to the S3-compatible object store.

<Mermaid chart={`flowchart TB
  PVC["PersistentVolumeClaim<br/>(Pod Storage Request)"]
  CSI["csi-driver-nfs<br/>(StorageClass: nfs-csi)"]
  
  subgraph MASTER1["master-1 Node"]
    NFS["NFS Server<br/>(/srv/nfs/k8s)"]
    XFS["XFS Filesystem<br/>(prjquota enabled)"]
    NFS --> XFS
  end
  
  QUOTA["nfs-quota-agent<br/>(Enforces Project Quotas)"]
  
  S3["SeaweedFS<br/>(S3-compatible Object Store)"]
  
  PVC -->|"Dynamic Provisioning"| CSI
  CSI -->|"Mounts"| NFS
  QUOTA -.->|"Monitors PVs & Applies Limits"| XFS
  
  PVC -.->|"Alternative: S3 API"| S3

  style XFS fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style S3 fill:#f0fdf4,stroke:#059669,color:#111
  style NFS fill:#f0fdf4,stroke:#059669,color:#111
  style CSI fill:#f9fafb,stroke:#d1d5db,color:#111
  style QUOTA fill:#f9fafb,stroke:#d1d5db,color:#111
  style PVC fill:#fff,stroke:#9ca3af,color:#111
  style MASTER1 fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

### 1. NFS Block Storage (Base Storage)

All cluster data is ultimately backed by the NFS server (`/srv/nfs/k8s`) located on the `narwhal-master-1` node.

- **StorageClass**: `nfs-csi` (Configured as the default StorageClass)
- **CSI Driver**: `csi-driver-nfs` (v4.13.2)
- **Filesystem**: Configured with an XFS filesystem with `prjquota` (project quotas) enabled to strictly enforce storage limits.

### 2. Storage Quota Enforcement (nfs-quota-agent)

Kubernetes native NFS PersistentVolumes lack the ability to physically enforce the requested capacity (`resources.requests.storage`) on the underlying disk. To solve this limitation, Narwhal integrates the custom-built **[NFS Quota Agent](/en/projects/nfs-quota-agent)** (v0.2.1).

- **Capacity Enforcement**: Automatically monitors PV creations and applies XFS project quotas to ensure PVCs cannot exceed their requested storage size.
- **Key Features**: Cleans up orphaned directories, tracks usage trends, and provides an integrated web UI dashboard for monitoring.

### 3. S3-Compatible Object Storage (SeaweedFS)

**SeaweedFS** (v4.34, chart 4.34.0), a distributed storage system, is deployed to provide S3-compatible object storage APIs within the cluster. All SeaweedFS data is persisted on top of the `nfs-csi` StorageClass.

- **Capacity Allocations**: Master 1Gi, Filer 5Gi, Volume 50Gi
- **Endpoint**: `http://seaweedfs-s3.storage.svc.cluster.local:8333` (Credentials: admin/admin)
- **Use Cases**:
  - **Velero**: Repository for full cluster backups and restorations (`velero` bucket)
  - **Loki**: Storage for log chunks and indexes (`loki` bucket)
  - **Tempo**: Storage for distributed tracing data (`tempo` bucket)
  - **PostgreSQL**: Destination for WAL archiving and full database backups

## Database Layer (CloudNativePG)

Instead of provisioning independent databases for each application, Narwhal leverages the **CloudNative-PG** (v1.29.1) operator to run a single, unified **PostgreSQL 18.3 HA Cluster**. This approach drastically improves resource efficiency and simplifies database administration.

### Cluster Configuration (`narwhal-db`)

| Component | Configuration Detail |
|---|---|
| **Namespace** | `database` |
| **Instances** | 2 Nodes (1 Primary + 1 Replica) |
| **Storage Allocation** | 20Gi per instance (40Gi total, backed by `nfs-csi`) |
| **Automatic Failover** | The replica is automatically promoted to Primary if the primary fails |
| **Connection Pooling** | **PgBouncer** (Transaction mode, up to 1000 pooled connections) |

### Unified Databases

| Database Name | Owner Role | Target Application |
|---|---|---|
| `keycloak` | `keycloak` | Keycloak (IAM/SSO) |
| `harbor` | `harbor` | Harbor (Container Registry) |
| `gitea` | `gitea` | Gitea (Git Server) |

### Database Connectivity

Applications connect to the database via the PgBouncer pooler to ensure performance and stability.

- **Pooler Endpoint**: `narwhal-db-pooler-rw.database.svc.cluster.local:5432`
- **Short DNS Names**: `ExternalName` services are configured in each application's namespace, allowing them to connect using a localized, short DNS name like `keycloak-db-rw:5432`.

### Database Backup Strategy

- **CNPG Barman Backups**: Continuous WAL archiving and full daily backups (at 00:00) are streamed to **SeaweedFS S3** (Retention: 7 days, Point-in-Time Recovery supported).
- **Snapshot Backups**: Velero executes a PVC snapshot of the database volumes every day at 02:00.
