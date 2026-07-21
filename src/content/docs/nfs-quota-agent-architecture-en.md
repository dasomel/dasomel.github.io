---
title: "Agent Architecture"
description: "Detailed architecture of the NFS Quota Agent's internal structure, quota enforcement mechanism, and deployment shape"
project: "NFS Quota Agent"
order: 401
lastModified: 2026-07-17
---

## Architecture Overview

The NFS Quota Agent is a daemon that automatically manages filesystem-level (XFS, ext4) project quotas for NFS-based PersistentVolumes (PVs) in Kubernetes. The agent watches the Kubernetes API and applies quota settings to the local filesystem in accordance with the provisioned PV capacity. (You can view the storage configuration of the Narwhal IDP cluster in the [storage documentation](/en/docs/narwhal-storage).)

## Operation Mechanism (Reconcile Loop)

The following flowchart illustrates the entire reconcile loop, from watching PV events to applying filesystem quotas.

<Mermaid chart={`flowchart TB
  subgraph K8S["Kubernetes API"]
    WATCH["Watch Bound PVs"]
  end
  
  subgraph AGENT["Reconcile Loop"]
    MATCH["Match NFS Path<br/>(Check Base Path)"]
    POL["Resolve Quota Policy<br/>(LimitRange / Annotation)"]
    APP["Apply XFS/ext4 Quota<br/>(Set prjquota)"]
    ORP["Detect Orphans<br/>(Directories without PVs)"]
    AUD["Write Audit Log"]
  end

  WATCH --> MATCH
  MATCH --> POL
  POL --> APP
  APP --> ORP
  ORP --> AUD

  style WATCH fill:#f0fdf4,stroke:#059669,color:#111
  style MATCH fill:#f0fdf4,stroke:#059669,color:#111
  style POL fill:#f0fdf4,stroke:#059669,color:#111
  style APP fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style ORP fill:#f9fafb,stroke:#d1d5db,color:#111
  style AUD fill:#f9fafb,stroke:#d1d5db,color:#111
  style K8S fill:#fff,stroke:#9ca3af,color:#111
  style AGENT fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

1. **Filesystem Detection**: Upon startup, the agent automatically identifies the filesystem type as either XFS or ext4.
2. **PV Watcher**: Utilizing `client-go v0.29.0`, it watches for NFS PVs in the `Bound` state.
   - It supports both native NFS PVs (`pv.Spec.NFS`) and CSI NFS PVs (`nfs.csi.k8s.io`).
   - The watch targets can be filtered by a specific provisioner via `--provisioner-name`, or configured to target all NFS PVs using the `--process-all-nfs` flag.
3. **Path Mapping**: Converts the NFS server export path into a local mount path within the container.
4. **Project ID Generation**: Uses an FNV hash to generate a unique project ID derived from the PV name.
5. **Quota Application (Quota Manager)**:
   - **XFS**: Uses the `xfs_quota` command to initialize the project and set block capacity limits (`bhard`).
   - **ext4**: Uses `chattr` to set project attributes, then uses the `setquota` command to restrict capacity.
   - The agent maintains the `/etc/projects` and `/etc/projid` mapping files.
6. **Status Reporting**: The quota enforcement status (`pending`, `applied`, `failed`) is recorded in the PV's `nfs.io/quota-status` annotation.

## Module and Package Layout

The agent is compiled in a Go 1.25 environment and is modularized under the `internal` directory for separation of concerns.

- `cmd/nfs-quota-agent/`: The CLI entry point. Responsible for flag parsing and routing for subcommands (`run`, `status`, `top`, `report`, `cleanup`, `ui`, `audit`, `completion`, `version`).
- `internal/agent/`: Core agent logic. Contains the `QuotaAgent` struct, the PV watch loop (`watch.go`), quota synchronization, and orphan detection mechanisms.
- `internal/quota/`: Filesystem quota command implementation. Encapsulates OS-dependent commands (XFS: `xfs.go`, ext4: `ext4.go`) and project ID management (`project.go`).
- `internal/policy/`: Analyzes Kubernetes LimitRange and Namespace resources to apply storage quota policy priorities.
- `internal/audit/`: Logs all quota actions, such as `CREATE`, `UPDATE`, `DELETE`, and `CLEANUP`.
- `internal/history/`: Periodically records snapshots of disk usage to track storage trends (`store.go`).
- `internal/metrics/`: Exposes Prometheus-compatible metrics (e.g., `nfs_quota_used_bytes`) at the `:9090/metrics` endpoint.
- `internal/status/`, `internal/cleanup/`, `internal/ui/`, `internal/completion/`, `internal/util/`: Auxiliary modules handling status printing, standalone cleanup, the embedded web dashboard, shell completion script generation, and shared format utilities.

## Deployment Shape (Helm Chart)

Because the agent executes local filesystem commands (`xfs_quota`, `setquota`), it **must be deployed on the node running the NFS server**.

- **Node Selector**: Scheduling is constrained to the NFS server node using `nodeSelector: nfs-server: "true"`.
- **Permissions and Volumes**:
  - Requires access to the host's PID namespace (`hostPID: true`).
  - The container mounts the host's NFS export directory via `hostPath`, along with `/dev` for block device access, and quota mapping files like `/etc/projects` and `/etc/projid`.
- **Provisioning Configuration Support**:
  - The target provisioner can be specified in the Helm `values.yaml` via `config.provisionerName` (e.g., `nfs.csi.k8s.io`).
  - Individual feature modules are toggled using settings like `webUI.enabled`, `audit.enabled`, `cleanup.enabled`, `history.enabled`, and `policy.enabled`.
