---
title: "Kube-Ready-Box"
description: "Kubernetes-ready Ubuntu 24.04/26.04 LTS Vagrant Base Boxes for ARM64/AMD64, ext4/XFS, and local hypervisors"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Packer", "Ubuntu", "ARM64", "AMD64", "XFS", "ext4", "VMware", "VirtualBox"]
order: 9
type: "own"
featured: true
problem: "Local Kubernetes projects repeatedly rebuild the same OS, kernel, networking, storage, and diagnostic baseline across architectures and hypervisors"
solution: "Reproducible Ubuntu Vagrant base boxes built with Packer so higher-level Kubernetes projects can start from a consistent node-ready operating system"
---

## Project Overview

**Kube-Ready-Box** provides the operating-system baseline required before Kubernetes is installed on local VMs.

It deliberately does **not** include Kubernetes itself. Instead, it standardizes the repetitive work around kernel modules, networking, storage prerequisites, filesystem choices, diagnostics, time synchronization, and disk expansion so projects such as Narwhal and Beluga can focus on cluster bootstrap.

The project publishes Ubuntu **24.04 LTS** and **26.04 LTS** variants for ext4 and XFS, with ARM64 and AMD64 support and common local hypervisors such as VirtualBox and VMware Fusion.

## Why the Layer Exists

```text
Ubuntu Cloud Image
      ↓
filesystem / disk setup
      ↓
kernel modules / sysctl
      ↓
network / conntrack / buffers
      ↓
CSI / iSCSI / NFS prerequisites
      ↓
time synchronization / diagnostics
      ↓
Kubernetes bootstrap
```

Kube-Ready-Box standardizes the left side of this boundary and leaves Kubernetes version and runtime selection to the consuming project.

## Published Variants

| Ubuntu | Filesystem | Typical use |
|---|---|---|
| 24.04 LTS | ext4 | Stable general-purpose Kubernetes nodes |
| 24.04 LTS | XFS | Storage/quota and large-file workloads |
| 26.04 LTS | ext4 | Latest LTS / cgroup v2-only environment |
| 26.04 LTS | XFS | Latest LTS with project quota use cases |

Vagrant Cloud names include:

```text
dasomel/ubuntu-24.04-ext4
dasomel/ubuntu-24.04-xfs
dasomel/ubuntu-26.04-ext4
dasomel/ubuntu-26.04-xfs
```

## Kubernetes Readiness Baseline

The boxes include OS-level preparation such as:

- disabled swap
- Kubernetes kernel modules (`br_netfilter`, `overlay`, `iscsi_tcp`)
- IP forwarding and bridge networking
- conntrack and network buffer tuning
- persistent `/sys/fs/bpf` mount (keeps Cilium eBPF resources across reboots)
- `open-iscsi` (with `iscsid` enabled), `cryptsetup`, `dmsetup` for Longhorn V1 · `nfs-common`
- `chrony` time synchronization — replaces the `systemd-timesyncd` default on Ubuntu 25.10+/26.04, with Korean NTP servers preconfigured (`/etc/chrony/sources.d/kr-ntp.sources`) for etcd's clock-skew sensitivity
- security hardening: `needrestart` removed (addresses 5 Qualys local-privilege-escalation CVEs), `unattended-upgrades` fully purged (avoids conflicting with kubelet Graceful Node Shutdown), `auditd` installed but disabled by default (CIS-ready, bounded I/O), `apparmor-utils` added
- Kubernetes/network/performance CLI utilities
- automatic disk/partition/LVM/filesystem expansion (1TB thin-provisioned disk; box size is ~2.2GB for ext4 and ~3.4GB for XFS)

Container runtimes and Kubernetes packages are intentionally left to the consumer project.

## 24.04 vs 26.04

Ubuntu 26.04 is a cgroup v2-only environment. Kubernetes installations using it should explicitly configure systemd cgroup integration for the chosen runtime. Ubuntu 24.04 remains the more conservative default when stability is the priority.

| Item | Ubuntu 24.04 | Ubuntu 26.04 |
|---|---|---|
| Kernel | 6.8 | 7.0 |
| cgroup | v2 default | v2-only |
| Focus | Stability | New LTS / newer kernel |
| Kubernetes note | Standard setup | Verify `SystemdCgroup=true` |

## Build and Release Model

```text
Ubuntu Cloud Image
       ↓
     Packer
       ↓
OS configuration + filesystem tuning
       ↓
provider / architecture validation
       ↓
Vagrant Box
       ↓
Vagrant Cloud
       ↓
Narwhal / Beluga / local Kubernetes
```

Packer defines the image construction process, while CI validates and publishes the provider/architecture combinations.

## Filesystem Choice

### ext4
A broad default for general Kubernetes development, with familiar Linux tooling and online operations appropriate to common workloads.

### XFS
Useful for large files and filesystem quota scenarios. It is also the natural companion for NFS Quota Agent when XFS project quotas are required.

## Getting Started

```bash
# Stable default
vagrant init dasomel/ubuntu-24.04-ext4
vagrant up --provider=vmware_desktop

# XFS / quota-oriented environment
vagrant init dasomel/ubuntu-24.04-xfs
vagrant up --provider=vmware_desktop

# Ubuntu 26.04
vagrant init dasomel/ubuntu-26.04-ext4
vagrant up --provider=vmware_desktop
```

After boot, install the Kubernetes/runtime versions required by the consuming project.

## Verification

```bash
vagrant ssh -c "cat /etc/vagrant-box/info.json"
vagrant ssh -c "/bin/bash /etc/vagrant-box/check-tuning.sh"
```

The goal is to verify OS readiness, not merely whether the VM starts.

## Current Status

The latest release is **v1.1.0** (2026-07-19). It is the first tagged release to ship Ubuntu 26.04 LTS (Resolute Raccoon, kernel 7.0) alongside 24.04 LTS (Noble Numbat, the default), and it introduced the security hardening, chrony migration, CSI/Longhorn prerequisites, and persistent bpffs mount described above.

| Provider | AMD64 | ARM64 | Notes |
|---|---|---|---|
| VirtualBox | ✅ | ✅ | VirtualBox 7.1+ required for ARM64 |
| VMware Fusion | ✅* | ✅ | Apple Silicon supported; *AMD64 is local-build only — Vagrant Cloud publishes ARM64 only due to CI runner limitations |

- A declarative NixOS variant, `dasomel/nixos-kube-ready`, is published separately (libvirt/arm64; usable on Apple Silicon via `vagrant-qemu`).
- Building from source requires Packer 1.10+ (CI pins 1.15.4); build timeouts are `ssh_timeout` 1h (2h for `vmware-arm64`), with a 90-minute CI job timeout.

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [Box Overview](/oss/en/kube-ready-box/overview) | Goals and supported scope |
| Architecture | [System Architecture](/oss/en/kube-ready-box/architecture) | Packer → Box → Vagrant |
| Getting Started | [Usage Guide](/oss/en/kube-ready-box/getting-started) | Provider and filesystem selection |
| Operations | [Builds & Releases](/oss/en/kube-ready-box/operations) | Packer and Vagrant Cloud |
| Verification | [Node Verification](/oss/en/kube-ready-box/verification) | Readiness checks and release validation |

## Project Relationship

```text
kube-ready-box
       ↓
local Kubernetes node baseline
       ├── Narwhal
       ├── Beluga
       └── other local K8s projects
```
