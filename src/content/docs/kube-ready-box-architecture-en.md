---
title: "Box Architecture & Build"
description: "Internal architecture, base OS, filesystem design, and Packer build pipeline of Kube-Ready-Box"
project: "Kube-Ready-Box"
order: 301
lastModified: 2026-07-21
---

## Architecture Overview

Kube-Ready-Box is a Vagrant Box based on Ubuntu LTS, pre-tuned at the OS level to enable seamless Kubernetes operations on a single instance. It is designed to serve as the base image for platform engineering and development environments, such as the Narwhal IDP cluster.

By default, it supports the following environments:
- **Base OS**: Ubuntu 24.04 LTS (default) and 26.04 LTS
- **Architecture**: AMD64, ARM64 (Apple Silicon support)
- **Provider**: VirtualBox, VMware Fusion

## Base OS (24.04 vs 26.04)

The core differences between the two versions lie in the kernel and cgroup management.

| | 24.04 LTS (Noble Numbat) | 26.04 LTS (Resolute Raccoon) |
|---|---|---|
| Kernel | 6.8 | 7.0 |
| init / cgroup | systemd 255, cgroup v2 default | systemd 259, cgroup v1 removed (v2-only) |
| Crypto | TLS 1.2+ | Post-quantum default (OpenSSL 3.5 / OpenSSH 10.2) |
| Stability | Maximum stability (default) | Latest LTS |

- Ubuntu 26.04 completely removes cgroup v1, operating strictly as v2-only. This plays a critical role during K8s tuning, specifically aligning with the `SystemdCgroup=true` configuration.

## Filesystem Design (XFS and prjquota)

Kube-Ready-Box offers two filesystem variants, `ext4` and `xfs`, tailored for different use cases. The disk is thin-provisioned to 1TB and automatically extends upon boot in the sequence of partition, PV, LV, and filesystem.

### Why XFS?
The XFS filesystem variant (e.g., `dasomel/ubuntu-26.04-xfs`) serves as an essential foundation for the Narwhal cluster and related projects like `nfs-quota-agent`. The following flowchart illustrates how the XFS filesystem ensures storage isolation for the Narwhal cluster.

<Mermaid chart={`flowchart LR
  OS["Kube-Ready-Box<br/>(XFS prjquota)"]
  DIR["Directory-tree Quotas"]
  AGT["nfs-quota-agent<br/>(Per-PV Quotas)"]
  NW["Narwhal Cluster<br/>(Storage Isolation)"]

  OS -->|"enables"| DIR
  DIR -->|"enforces"| AGT
  AGT -->|"relies on"| NW

  style OS fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style DIR fill:#f0fdf4,stroke:#059669,color:#111
  style AGT fill:#f0fdf4,stroke:#059669,color:#111
  style NW fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

- **Project Quota (prjquota)**: XFS supports project quotas, which limit capacity at the directory tree level. Kubernetes leverages this to accurately implement `ephemeral-storage` capacity isolation (`--local-storage-capacity-isolation`) for Pods.
- **Compared to ext4**: The ext4 variant supports online shrinking and is lighter (approx. 2.2GB), making it suitable for general purposes. However, for native K8s Quota support, the XFS variant (approx. 3.4GB) is recommended.

## Pre-installed Packages and OS Tuning

Container runtimes (like containerd) and K8s components (such as kubelet) are intentionally **omitted** to leave the choice to the user. Instead, the OS is highly optimized for running K8s.

- **Kernel Parameters**: IP forwarding enabled, network/memory/filesystem tuned.
- **Resource Limits**: Swap completely disabled; limits on file descriptors and processes removed.
- **Pre-installed Tools**: Essential utilities like `jq`, `yq`, `bash-completion`, `nfs-common`, `sshpass`, and various performance analysis tools (`sysstat`, `bpftrace`, `tcpdump`, etc.).

## Security Hardening & K8s Prerequisites (v1.1.0)

The v1.1.0 update focuses on security hardening and fulfilling Kubernetes (K8s) prerequisites.

### Security Hardening

- **Removed `needrestart` (Purge)**: Completely removed the package to mitigate five local privilege escalation vulnerabilities (CVE-2024-48990, CVE-2024-48991, CVE-2024-48992, CVE-2024-10224, CVE-2024-11003) via defense-in-depth.
- **Purged `unattended-upgrades`**: Changed from `remove` to `purge` to also clear lingering drop-in configs (like `logind InhibitDelayMaxSec=30`).
- **Installed but Disabled `auditd`**: Installed to meet CIS benchmark readiness (aligning with EKS/GKE/AKS node image practices), but disabled by default (`systemctl disable --now auditd`) to avoid I/O overhead. (Configured with: `max_log_file=50`, `max_log_file_action=ROTATE`, `disk_full_action=SUSPEND`). Enable with: `systemctl enable --now auditd`.
- **Added `apparmor-utils`**: Included in the K8s-ecosystem package set as per the K8s official security checklist.
- **Retained Security-Critical Upgrades**: Explicitly kept critical patches for OpenSSH (CVE-2025-26465/26466), sudo (CVE-2025-32462/32463), and kernel/AppArmor (CVE-2026-23xxx).

### K8s/CSI Prerequisites

- **Longhorn CSI Storage Support**: Installed `open-iscsi`, `cryptsetup`, and `dmsetup` (hard requirements for Longhorn V1 engine). Also loaded the `iscsi_tcp` kernel module via `/etc/modules-load.d/iscsi.conf` and enabled `iscsid`.
- **Persistent Cilium eBPF Mount**: Added `bpffs /sys/fs/bpf bpf defaults 0 0` to `/etc/fstab` to ensure eBPF resources persist across reboots.

### OS Tuning Enhancements

- **`vm.max_map_count`**: Set to `1048576` (K8s recommendation), which also aligns with the Ubuntu 26.04 systemd default to prevent silent downgrades.
- **Removed Invalid EEVDF Tunables**: Removed CFS scheduler tunables (`kernel.sched_min_granularity_ns`, `sched_wakeup_granularity_ns`) which became silent no-ops after the EEVDF scheduler (kernel 6.6+) moved them to debugfs. Also, `ubuntu-tuning.sh` now auto-detects the version from `/etc/os-release`.
- **Time Sync (`chrony`)**: Switched from `systemd-timesyncd` to `chrony` (Ubuntu 25.10+ default daemon; recommended for K8s/etcd clock stability). Korean NTP servers are configured in `/etc/chrony/sources.d/kr-ntp.sources`.

## Packer Build Pipeline

All Box images are built declaratively using Packer, controlled via the `packer/build.sh` script. This pipeline handles multiple versions and filesystems within a single unified process.

<Mermaid chart={`flowchart LR
  ISO["Ubuntu ISO<br/>+ autoinstall (ext4 / xfs)"]
  subgraph MATRIX["Shared Pipeline"]
    TPL["Packer Templates<br/>(VirtualBox / VMware)"]
    PROV["Provisioning Scripts<br/>(01-base ~ 04-k8s)"]
  end
  BOX(["Box Artifacts<br/>(24.04 / 26.04 x ext4 / xfs)"])

  ISO -->|"input"| TPL
  TPL -->|"execute"| PROV
  PROV -->|"generate"| BOX

  style ISO fill:#fff,stroke:#9ca3af,color:#111
  style TPL fill:#f0fdf4,stroke:#059669,color:#111
  style PROV fill:#f0fdf4,stroke:#059669,color:#111
  style BOX fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style MATRIX fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

```bash
# Build 24.04 (default ext4)
./build.sh vmware-arm64

# Build 26.04 (xfs)
./build.sh vmware-arm64 --version=26.04 --fs=xfs

# Build all (4 boxes in parallel)
./build.sh all
```

### Build Stages (Provisioning Scripts)

The build process executes numbered scripts in order:
- `01-base.sh`: Update packages
- `02-os-tuning.sh`: Optimize kernel parameters and resources
- `03-os-packages.sh`: Install K8s prerequisite tools
- `04-k8s-prereq.sh`: Remove swap and load essential kernel modules
- Execute remaining network and disk I/O optimization scripts before finishing the build.

For Apple Silicon (ARM64) environments, VMware Fusion is recommended. If using VirtualBox, version 7.2.6 or higher is required to resolve known Scancode issues.
