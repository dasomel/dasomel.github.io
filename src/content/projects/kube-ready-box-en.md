---
title: "Kube-Ready-Box"
description: "Kubernetes-ready Ubuntu 24.04/26.04 LTS Vagrant Box (Multi-arch / Multi-provider)"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Packer", "Ubuntu", "XFS", "cgroupv2", "containerd", "ARM64"]
order: 9
type: "own"
featured: true
problem: "Bootstrapping local multi-node Kubernetes clusters takes 15+ minutes per run due to repetitive OS package installs, kernel tuning, and quota setup"
solution: "Pre-baked, production-tuned Ubuntu Vagrant boxes with XFS Project Quotas, containerd v2, and cgroupv2 built automatically via Packer"
---

## Project Overview

**Kube-Ready-Box** provides pre-optimized Ubuntu 24.04 / 26.04 LTS Vagrant base boxes designed for instantaneous local Kubernetes cluster provisioning.

Built deterministically via HashiCorp Packer, boxes support VMware Desktop, VirtualBox, and Libvirt across Apple Silicon (ARM64) and Intel/AMD (AMD64) architectures.

### Key Highlights

- **XFS Project Quotas Pre-enabled**: Root and data mounts formatted with `pquota` for instant directory-level quotas
- **cgroup v2 & containerd v2**: Modern container execution baseline fully compliant with Kubernetes v1.35+
- **Kernel sysctl Tuning**: Pre-configured `br_netfilter`, `overlay`, `ip_forward`, and expanded user watches
- **Automated Packer Pipeline**: Multi-provider builds published directly to Vagrant Cloud (`dasomel/ubuntu-26.04-xfs`)
- **Node Readiness Attestation**: 30+ automated system and kernel module integrity checks upon boot

---

## Architecture Diagram

```text
  Packer Build Pipeline
┌────────────────────────────────────────────────────────┐
│  Ubuntu 26.04 LTS Base ISO                             │
│  ├─ XFS Partitioning (pquota enabled)                  │
│  ├─ Kernel sysctl.d Tuning (br_netfilter, ip_forward)  │
│  ├─ containerd v2 & runc Setup                         │
│  └─ Security Hardening & Zero-Key Invariants           │
└───────────────────────────┬────────────────────────────┘
                            │ Multi-Provider Packaging
                            ▼
  Vagrant Cloud (dasomel/ubuntu-26.04-xfs)
  - VMware Desktop (ARM64 / AMD64)
  - VirtualBox (AMD64)
  - Libvirt / KVM
                            │
                            ▼ vagrant up (0-sec bootstrap)
  Narwhal / Beluga Local Kubernetes Clusters
```

---

## Getting Started

```ruby
# Example Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "dasomel/ubuntu-26.04-xfs"
  config.vm.box_version = ">= 1.2.0"
  
  config.vm.provider "vmware_desktop" do |v|
    v.cpus = 2
    v.memory = 4096
  end
end
```

```bash
# 1. Boot box
vagrant up --provider=vmware_desktop

# 2. Check XFS quota mount and IP forwarding
vagrant ssh -c "mount | grep xfs; sysctl net.ipv4.ip_forward"
```

---

## Documentation Index

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [Box Overview](/oss/en/kube-ready-box/overview) | Optimization goals and architecture support |
| **Architecture** | [System Architecture](/oss/en/kube-ready-box/architecture) | XFS partitioning, kernel sysctl, and cgroupv2 |
| **Getting Started** | [Vagrantfile Guide](/oss/en/kube-ready-box/getting-started) | Multi-provider configs and cluster provisioning |
| **Operations** | [Packer Builds & Releases](/oss/en/kube-ready-box/operations) | Vagrant Cloud pipeline and versioning discipline |
| **Verification** | [Node Verification](/oss/en/kube-ready-box/verification) | Node Readiness Attestation and 30 integrity checks |
