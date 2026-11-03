---
title: "Kube-Ready-Box"
description: "Kubernetes-ready Ubuntu 24.04/26.04 LTS Vagrant Base Boxes for ARM64/AMD64, ext4/XFS, and local hypervisors"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Packer", "Ubuntu", "ARM64", "AMD64", "XFS", "ext4", "VMware", "VirtualBox"]
order: 9
type: "own"
featured: true
problem: "Local Kubernetes projects repeatedly rebuild the same OS, kernel, networking, storage, and diagnostic baseline across architectures and hypervisors"
solution: "Reproducible Ubuntu Vagrant base boxes built with Packer and distributed via GitHub Releases and a GitHub Pages catalog so higher-level Kubernetes projects can start from a consistent node-ready operating system"
---

## Project Overview

**Kube-Ready-Box** provides the operating-system baseline required before Kubernetes is installed on local VMs.

It deliberately does **not** include Kubernetes itself. Instead, it standardizes the repetitive work around kernel modules, networking, storage prerequisites, filesystem choices, diagnostics, time synchronization, and disk expansion so projects such as Narwhal and Beluga can focus on cluster bootstrap.

The project provides Ubuntu **24.04 LTS** and **26.04 LTS** variants for ext4 and XFS, with templates for ARM64 and AMD64 and common local hypervisors such as VirtualBox and VMware Fusion. The latest release (v0.3.1) ships the Ubuntu boxes for arm64 (`vmware_desktop`) and amd64 (`virtualbox`) (see [Current Status](#current-status)).

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

Besides Ubuntu, the same catalog also serves Rocky 9 (ext4/XFS, 0.1.1) and NixOS (`nixos-kube-ready`, 0.2.2, libvirt). Catalog (GitHub Pages) box names include:

```text
ubuntu-24.04-ext4   ubuntu-24.04-xfs
ubuntu-26.04-ext4   ubuntu-26.04-xfs
rocky-9-ext4        rocky-9-xfs
nixos-kube-ready
```

`.box` files are GitHub Release assets and the Vagrant catalog JSON is served from GitHub Pages. See [box-distribution.md](https://github.com/dasomel/kube-ready-box/blob/main/docs/box-distribution.md).

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
- automatic disk/partition/LVM/filesystem expansion (boxes are 1–2 GiB; the root LV is 16 GiB at install and grows to the full disk on first boot)

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
GitHub Release (.box) + GitHub Pages (catalog JSON)
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

Set the box name and catalog URL in your Vagrantfile:

```ruby
config.vm.box     = "dasomel/ubuntu-24.04-ext4"
config.vm.box_url = "https://dasomel.github.io/kube-ready-box/boxes/ubuntu-24.04-ext4.json"
```

```bash
vagrant up --provider=vmware_desktop
```

For the XFS / quota-oriented environment or Ubuntu 26.04, swap the box name and catalog JSON for `ubuntu-24.04-xfs`, `ubuntu-26.04-ext4`, and so on.

> If you previously pulled 1.1.0 from Vagrant Cloud, run `vagrant box remove dasomel/<box> --box-version 1.1.0` first: Vagrant ranks 1.1.0 above 0.3.x.

After boot, install the Kubernetes/runtime versions required by the consuming project.

## Verification

```bash
vagrant ssh -c "cat /etc/vagrant-box/info.json"
vagrant ssh -c "/bin/bash /etc/vagrant-box/check-tuning.sh"
```

The goal is to verify OS readiness, not merely whether the VM starts.

## Current Status

The latest release is [**v0.3.1**](https://github.com/dasomel/kube-ready-box/releases/tag/v0.3.1) (2026-11-02). It rebuilds only the Ubuntu boxes to remove the kernel arguments the installer left in GRUB (`autoinstall ds=nocloud-net;s=http://<build-host>/`) and the leftover installer kernel after the upgrade. A Trivy scan right after release again found 0 fixable CVEs on all four Ubuntu boxes. On 2026-11-03 the same v0.3.1 gained four Ubuntu VirtualBox amd64 boxes, built on GitHub's x86 runners and shipped only after they boot-verified with VirtualBox on the same runner; their scan also found 0 fixable CVEs.

The previous release, [v0.3.0](https://github.com/dasomel/kube-ready-box/releases/tag/v0.3.0) (2026-11-01), was a CVE rebuild: every box has 0 distro-fixable CVEs per Trivy at release (the previously shipped Rocky 9 0.1.0 line had 438, 5 critical; an unpublished Ubuntu 26.04 build had 1,141, 2 critical). Kernel CVE-2026-98432 has no Ubuntu/Rocky fix yet and is tracked in [security-response.md](https://github.com/dasomel/kube-ready-box/blob/main/docs/security-response.md).

Versions are Ubuntu boxes 0.3.1, Rocky 9 boxes 0.1.1, and NixOS 0.2.2 (libvirt). The Ubuntu version line was reset because 1.1.0 was a Vagrant Cloud-only upload. The security hardening, chrony migration, CSI/Longhorn prerequisites, and persistent bpffs mount described above are all still included.

HashiCorp is shutting down HCP Vagrant (Vagrant Cloud): new box/registry creation stopped on 2026-10-01, support ends 2026-11-02, and all hosted boxes are decommissioned on 2026-12-31 ([announcement](https://developer.hashicorp.com/hcp/docs/vagrant/hcp-vagrant-eol)). Distribution therefore moved to GitHub Releases and GitHub Pages.

| Provider | AMD64 | ARM64 | Notes |
|---|---|---|---|
| VirtualBox | ✅ (Ubuntu) | template only* | AMD64 built and boot-verified on GitHub's x86 runners; VirtualBox 7.1+ required for ARM64, *not shipped because VirtualBox SSH cannot be verified on the build host |
| VMware Fusion | template only* | ✅ | Apple Silicon supported; *AMD64 not shipped because the runners cannot run VMware (local builds still work) |

- Ubuntu ships `vmware_desktop` (arm64) and `virtualbox` (amd64), Rocky `vmware_desktop` (arm64), and NixOS `libvirt` (arm64). On Intel/AMD hosts use `vagrant up --provider virtualbox`.
- A declarative NixOS variant, `dasomel/nixos-kube-ready`, is distributed from the same catalog (libvirt/arm64; usable on Apple Silicon via `vagrant-qemu`).
- Building from source requires Packer 1.10+ (CI pins 1.15.4); build timeouts are `ssh_timeout` 1h (2h for `vmware-arm64`), with a 90-minute CI job timeout.

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [Box Overview](/oss/en/kube-ready-box/overview) | Goals and supported scope |
| Architecture | [System Architecture](/oss/en/kube-ready-box/architecture) | Packer → Box → Vagrant |
| Getting Started | [Usage Guide](/oss/en/kube-ready-box/getting-started) | Provider and filesystem selection |
| Operations | [Builds & Releases](/oss/en/kube-ready-box/operations) | Packer and GitHub Release/Pages distribution |
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
