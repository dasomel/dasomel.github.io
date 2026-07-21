---
title: "Feature Guide"
description: "Guide to the automatic quota management, cleanup, trends, policies, and audit features provided by the NFS Quota Agent"
project: "NFS Quota Agent"
order: 402
lastModified: 2026-07-17
---

## Quota Monitoring (Quota)

Monitors the real-time disk usage and quota limits for all quota-enabled directories under the NFS export path (`--nfs-base-path`).

- **Usage Assessment (Status Badges)**: Classifies the current capacity usage percentage into three states:
  - **OK** (Green): Usage is under 90% of the limit.
  - **Warning** (Yellow): Usage is 90% or above, but under 100%.
  - **Exceeded** (Red): Usage has exceeded the 100% quota limit.
- **Metrics Monitoring**: Exports Prometheus-compatible status metrics (such as `nfs_disk_used_bytes`, `nfs_quota_used_percent`).

## Orphan Directory Cleanup (Orphans)

Identifies and manages 'orphaned' directories that persist on the filesystem after their corresponding PersistentVolumes have been removed from the Kubernetes cluster. (This feature is enabled via the `--enable-auto-cleanup` flag).

- **Grace Period**: To prevent accidental data loss, detected orphans are not deleted immediately but are kept for a default grace period of 24 hours.
- **Dry-Run and Live Mode**: In Dry-Run mode (`--cleanup-dry-run=true`), the agent merely detects orphans without deleting them. When Live mode (`false`) is set, actual deletion occurs. This can be executed directly from the UI or via the `cleanup` CLI subcommand.

## Usage Trends (Trends)

Periodically takes snapshots of quota usage to record storage consumption patterns and growth trends. (Requires `--enable-history`)

- Tracks usage changes over recent 24-hour (24H), 7-day (7D), and 30-day (30D) periods.
- Trends are visualized with arrows (↑, →, ↓), aiding administrators in predicting when capacity will run out and effectively planning for storage expansion.

## Namespace Policies (Policies)

Enforces quota limits according to prioritized rules based on cluster Namespace and PVC configurations. (Requires `--enable-policy`) The following flowchart illustrates the precedence order and how the final quota policy is determined.

<Mermaid chart={`flowchart TB
  START["Start Quota Evaluation"]
  CHK_LR{"Exists<br/>LimitRange Object?"}
  VAL_LR["Apply LimitRange<br/>(max, min, default)"]
  CHK_NS{"Exists Namespace<br/>Annotation?"}
  VAL_NS["Apply Annotation<br/>(nfs.io/default-quota)"]
  VAL_GLOB["Apply Global Default<br/>(--default-quota flag)"]
  END["Determine Final Quota Size"]

  START --> CHK_LR
  CHK_LR -->|"Yes"| VAL_LR
  CHK_LR -->|"No"| CHK_NS
  VAL_LR --> END
  CHK_NS -->|"Yes"| VAL_NS
  CHK_NS -->|"No"| VAL_GLOB
  VAL_NS --> END
  VAL_GLOB --> END

  style START fill:#f9fafb,stroke:#d1d5db,color:#111
  style CHK_LR fill:#f0fdf4,stroke:#059669,color:#111
  style CHK_NS fill:#f0fdf4,stroke:#059669,color:#111
  style VAL_LR fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style VAL_NS fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style VAL_GLOB fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style END fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

- **Resolution Priority**: `LimitRange > Namespace Annotation > Global Default`
  1. The agent first scans Kubernetes `LimitRange` objects (where `type: PersistentVolumeClaim`) to determine max, min, and default capacities.
  2. Next, it evaluates Namespace annotations (`nfs.io/default-quota`, `nfs.io/max-quota`).
  3. If no specific limits are found, the global agent flag `--default-quota` serves as the fallback.
- If a PVC violates these rules (e.g., requests exceed the `max`), it is reported as a policy violation.

## Audit Logs (Audit Logs)

Preserves a complete history of all quota-modifying actions made by the system. (Requires `--enable-audit`)

- Operations executed by the agent, such as `CREATE`, `UPDATE`, `DELETE`, and `CLEANUP`, are logged.
- The logs capture both successful and failed transactions, providing value for post-incident troubleshooting and compliance documentation. By default, logs are written to `/var/log/nfs-quota-agent/audit.log`.
