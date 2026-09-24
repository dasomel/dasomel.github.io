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

<Mermaid chart={`flowchart TB
  PVC["PVC"] --> PV["PersistentVolume"]
  PV --> NFS["NFS CSI / provisioner"]
  NFS --> EXPORT["NFS export + subdirectory"]
  EXPORT --> AGENT["NFS Quota Agent"]
  AGENT --> QUOTA["Filesystem Project Quota"]
  QUOTA --> LIMIT["Actual storage enforcement"]`} />

The agent supports native NFS PVs and CSI NFS PVs, including path mapping based on NFS share/subdirectory metadata.

## Filesystem Support

| Filesystem | Mechanism | Mount option | Min kernel | Notes |
|---|---|---|---|---|
| XFS | `xfs_quota` / project quota | `prjquota` | 2.6+ | Primary use case |
| ext4 | `setquota` + project attribute | `prjquota` | 4.5+ (e2fsprogs 1.43+) | Linux project quota support |
| Btrfs | qgroup quota (`btrfs quota enable`) | not needed | 3.4+ | Target directory must be a subvolume — the agent errors out otherwise |

> **ext4 security limitation**: ext4 project quota hard limits are not enforced for a writer holding `CAP_SYS_RESOURCE` (root) — the kernel's `ignore_hardlimit()` (`fs/quota/dquot.c`) waives the limit outright. Over NFS with `no_root_squash`, `knfsd` writes with credentials mapped from the client, so a root-owned tenant workload can silently bypass its ext4 quota. XFS and Btrfs enforce their limits regardless of the writer's privilege. For ext4 exports, use `root_squash` (the default) and run tenant workloads as non-root, or prefer XFS/Btrfs where root-owned or untrusted workloads are expected.

## Kubernetes Deployment Model

The agent runs as a **DaemonSet on the NFS server node** because quota operations must target the local filesystem rather than an NFS client mount.

<Mermaid chart={`flowchart TB
  subgraph NODE["NFS Server Node"]
    AGENT["nfs-quota-agent DaemonSet"]
    API["Kubernetes API"]
    HOST["hostPath:/data · /dev · /etc/projects · /etc/projid"]
    FS["Local XFS / ext4 / Btrfs"]
    AGENT --> API
    AGENT --> HOST
    HOST --> FS
  end`} />

This creates a larger privilege boundary than a normal Kubernetes controller, so node placement and hostPath scope are part of the security design.

## Operational Features

The project includes optional operational capabilities around the core enforcement engine:

- Prometheus metrics / ServiceMonitor, Grafana dashboard ConfigMap
- PrometheusRule alerts
- `events.k8s.io/v1` Kubernetes Events + retry metrics (opt-in, comes with an RBAC widening)
- audit logging
- usage history
- orphan cleanup with dry-run support
- namespace quota policy (advisory) plus a `QuotaPolicy` CRD for declarative enforcement
- optional web UI
- optional NetworkPolicy template
- air-gapped (offline bundle) install with cosign signature verification
- configurable sync interval
- Helm-based deployment and rolling upgrades

## Storage Policy

When policy support is enabled, Kubernetes-native resources can be used to express quota defaults and limits. This keeps storage governance close to the existing Kubernetes resource model instead of inventing a completely separate configuration language. This advisory policy view is informational only and does not change actual quota sizing — the `QuotaPolicy` CRD below is what actually enforces limits.

### Helm Values (selected)

| Key | Default | Description |
|---|---|---|
| `image.digest` | `""` | Pin the image by digest for air-gap installs (overrides `tag` when set) |
| `config.provisionerName` | `nfs.csi.k8s.io` | Provisioner to filter |
| `config.processAllNFS` | `false` | Process all NFS PVs regardless of provisioner |
| `config.syncInterval` | `30s` | Quota sync interval |
| `webUI.enabled` | `false` | Enable the web UI dashboard |
| `cleanup.enabled` / `cleanup.dryRun` | `false` / `true` | Auto orphan cleanup, dry-run by default |
| `policy.enabled` | `false` | Advisory namespace quota policy/violations views in the web UI (informational only) |
| `quotaPolicy.enabled` / `quotaPolicy.singleWriter` | `false` / `false` | Enable `QuotaPolicy` CRD enforcement; designate the single writer responsible for status write-back |
| `events.enabled` | `false` | Emit per-PV quota outcomes as Kubernetes Events (widens RBAC — review before enabling on multi-tenant clusters) |
| `dashboard.enabled` | `false` | Deploy the Grafana dashboard ConfigMap |
| `networkPolicy.enabled` | `false` | Enable the NetworkPolicy template |
| `nodeSelector` | `nfs-server: "true"` | Must not be empty — rejected at render time |
| `updateStrategy.rollingUpdate.maxUnavailable` | `1` | Nodes updated concurrently during a rolling update |

See `charts/nfs-quota-agent/values.yaml` in the repository for the full list.

### QuotaPolicy CRD (declarative filesystem quota policy)

`QuotaPolicy` (`quota.nfs.io/v1alpha1`, disabled by default) declares filesystem quota bounds as a Kubernetes object instead of relying only on each PVC's requested capacity. It layers on top of `ResourceQuota`/`LimitRange` rather than replacing them.

```yaml
# Every PVC in "team-a" gets a 5Gi default, hard-capped at 20Gi via enforceMax
apiVersion: quota.nfs.io/v1alpha1
kind: QuotaPolicy
metadata:
  name: team-a-default
  namespace: team-a
spec:
  selector: {}
  priority: 100
  defaultQuota: 5Gi
  maxQuota: 20Gi
  enforceMax: true
```

`selector` supports `pvcName` (most specific, wins regardless of priority), `labelSelector`, and `storageClassNames` (read only from the bound PV's spec, ANDed with other selectors). `status.conditions` reports `Ready`, `Applied`, `Degraded`, `Drifted`, `LimitRangeConflict`, and `StorageClassBinding`.

### CLI Commands

```bash
nfs-quota-agent run --nfs-base-path=/export --provisioner-name=nfs.csi.k8s.io   # run the agent (default)
nfs-quota-agent status --path=/data                                             # quota/usage status
nfs-quota-agent top --path=/data -n 10 --watch                                  # top directories by usage
nfs-quota-agent report --path=/data --format=json|yaml|csv                      # generate a report
nfs-quota-agent cleanup --path=/data --kubeconfig=~/.kube/config [--dry-run=false] [--force]
nfs-quota-agent ui --path=/data --addr=:8080                                    # web UI
```

### Prometheus Metrics

`:9090/metrics` exposes `nfs_disk_total_bytes`, `nfs_disk_used_bytes`, `nfs_disk_available_bytes`, per-directory `nfs_quota_used_bytes` / `nfs_quota_limit_bytes` / `nfs_quota_used_percent`, and summary counters `nfs_quota_directories_total`, `nfs_quota_warning_count`, `nfs_quota_exceeded_count`.

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

Every tagged release also publishes `nfs-quota-agent-<version>-offline.tar.gz` for clusters with zero outbound network access (multi-arch image OCI archive + Helm chart + `hack/verify-release.py` + compatibility matrix), and both the manifest and the bundle are cosign-signed.

## Current Status

The latest release is **v0.5.0** (2026-09-22), and the project is at **Beta**. Core quota enforcement for XFS, ext4, and Btrfs is complete and exercised against real kernels in CI, and releases are signed and reproducible — but the `QuotaPolicy` CRD is still `v1alpha1` and may change incompatibly before v1.0, so production use should pin a chart version.

- **v0.5.0**: Grafana dashboard ConfigMap and a metric-name lint, `events.k8s.io/v1` Events plus retry metrics (`events.enabled`), an opt-in NetworkPolicy template, fixes to ext4 repquota project-selector resolution and validation, a real-kernel ext4/btrfs quota-enforcement E2E matrix, an OpenSSF Scorecard workflow, and Trivy image scanning.
- **v0.4.0–v0.4.3**: focused on stabilizing release signing — v0.4.0 shipped as a partial release because cosign failed to log in to GHCR when signing the Helm chart OCI artifact (the container image, binaries, and SBOMs published fine, but signatures, `release-manifest.json`, and the offline bundle did not), and v0.4.1–v0.4.3 fixed the login and stabilized egress-block mode into a complete release.

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

<Mermaid chart={`flowchart TB
  READY["kube-ready-box / Linux filesystem"] --> SERVER["NFS Server"]
  SERVER --> AGENT["nfs-quota-agent"]
  AGENT --> PV["Kubernetes PV / PVC"]
  PV --> NARWHAL["Narwhal"]`} />
