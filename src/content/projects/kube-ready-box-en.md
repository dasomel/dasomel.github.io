---
title: "Kube-Ready-Box"
description: "Kubernetes-optimized Ubuntu 24.04 / 26.04 LTS Vagrant Box"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Ubuntu", "Multi-Arch"]
order: 1
type: "own"
featured: true
problem: "Setting up Kubernetes dev/test environments requires repetitive manual work"
solution: "One-command local K8s cluster + essential tools auto-setup"
---

## Project Overview

Kube-Ready-Box is an **OS-level optimized Ubuntu LTS Vagrant Box for Kubernetes deployments**.

It supports both **24.04 LTS** (Noble Numbat, default) and **26.04 LTS** (Resolute Raccoon, kernel Linux 7.0), with pre-applied system tuning for container orchestration environments.

Distributed on Vagrant Cloud per version and filesystem:

- 24.04 ext4: `dasomel/ubuntu-24.04-ext4` / xfs: `dasomel/ubuntu-24.04-xfs`
- 26.04 ext4: `dasomel/ubuntu-26.04-ext4` / xfs: `dasomel/ubuntu-26.04-xfs`

## 24.04 vs 26.04

| | 24.04 LTS (Noble Numbat) | 26.04 LTS (Resolute Raccoon) |
|---|---|---|
| Kernel | 6.8 | **7.0** |
| init / cgroup | systemd 255, cgroup v2 default | systemd 259, **cgroup v1 removed (v2-only)** |
| Container runtime | containerd 1.7 | containerd 2.2 / runc 1.4 |
| Crypto | TLS 1.2+ | **Post-quantum default** (OpenSSL 3.5 / OpenSSH 10.2) |
| Core utilities | GNU coreutils, sudo | partial Rust rewrite (uutils, sudo-rs) |
| Choose when | Maximum stability (**default**) | Latest LTS, kernel 7.0 features |

> **K8s note**: 26.04 is cgroup v2-only, so set `SystemdCgroup=true` for kubelet/containerd. Both lines are tuned identically for Kubernetes.

## Key Features

### Multi-Architecture & Provider Support

| Provider | AMD64 | ARM64 | Notes |
|----------|-------|-------|-------|
| VirtualBox | ✅ | ✅ | VirtualBox 7.1+ required for ARM64 |
| VMware Fusion | ✅ | ✅ | Apple Silicon supported |

### Filesystem Selection (ext4 / xfs)

| | ext4 | xfs |
|---|---|---|
| **Best for** | General purpose | K8s workloads, large files |
| **K8s Quota** | No native support | `--local-storage-capacity-isolation` |
| **Online Shrink** | Supported | Not supported |
| **Box Size** | ~2.2GB | ~3.4GB |

### Large Disk & Auto-Extension

- **1TB Disk**: Large disk with thin provisioning (ext4 ~2.2GB, xfs ~3.4GB on disk)
- **Auto-Extension**: Disk auto-extends on boot (partition → PV → LV → filesystem)

### Kubernetes Optimizations

Pre-applied system tuning:

**Kernel Parameters**
```bash
# Network buffer optimization
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864

# Enable IP forwarding
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-iptables = 1
```

**Resource Limits**
```bash
# Process and file descriptor limits
* soft nofile 1048576
* hard nofile 1048576
* soft nproc 1048576
* hard nproc 1048576
```

**Disk I/O Scheduler**
- SSD: `none` (optimal performance)
- HDD: `mq-deadline` (throughput optimized)

**Swap Disabled**
- Completely removed to meet Kubernetes requirements

### Pre-installed Tools

| Category | Tools |
|----------|-------|
| **K8s Ecosystem** | jq, yq, bash-completion, nfs-common, sshpass |
| **Monitoring** | sysstat, iotop, iftop, nload, nethogs, dool |
| **Network Diag** | ipvsadm, ipset, conntrack, ethtool, tcpdump, nmap |
| **Performance** | linux-tools, bpfcc-tools, bpftrace |

### What's NOT Included

Intentionally excluded components (user choice):
- Container Runtime (containerd, CRI-O, etc.)
- Kubernetes components (kubelet, kubeadm, kubectl)
- CNI plugins (Calico, Cilium, etc.)

## Getting Started

### Requirements

- Vagrant 2.3+
- VirtualBox 7.1+ or VMware Fusion

### Basic Usage

```bash
# 24.04 ext4 (default, stable, general purpose)
vagrant init dasomel/ubuntu-24.04-ext4
vagrant up --provider=vmware_desktop

# 24.04 xfs (better for K8s ephemeral storage quota, large files)
vagrant init dasomel/ubuntu-24.04-xfs
vagrant up --provider=vmware_desktop

# 26.04 (Resolute Raccoon, kernel Linux 7.0)
vagrant init dasomel/ubuntu-26.04-ext4
vagrant up --provider=vmware_desktop
```

### Vagrantfile Example

```ruby
Vagrant.configure("2") do |config|
  # 24.04: "dasomel/ubuntu-24.04-ext4" or "dasomel/ubuntu-24.04-xfs"
  # 26.04: "dasomel/ubuntu-26.04-ext4" or "dasomel/ubuntu-26.04-xfs"
  config.vm.box = "dasomel/ubuntu-24.04-ext4"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 4096
    vb.cpus = 2
  end

  config.vm.provider "vmware_desktop" do |v|
    v.vmx["memsize"] = "4096"
    v.vmx["numvcpus"] = "2"
  end

  config.vm.hostname = "k8s-node"
  config.vm.network "private_network", ip: "192.168.56.10"
end
```

### Verify Optimizations

```bash
# Check box info
vagrant ssh -c "cat /etc/vagrant-box/info.json"

# Run tuning verification script
vagrant ssh -c "/bin/bash /etc/vagrant-box/check-tuning.sh"
```

## Kubernetes Installation Example

After creating the box, install Kubernetes:

```bash
# 1. Install and configure containerd
sudo apt-get update && sudo apt-get install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd && sudo systemctl enable containerd

# 2. Install Kubernetes (choose version)
K8S_VERSION="v1.31"
curl -fsSL "https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/Release.key" | \
  sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/ /" | \
  sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update && sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# 3. Initialize cluster (master node)
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

## Build Information

This box is built using [Packer](https://www.packer.io/):

```bash
cd packer

# Initialize Packer plugins
./build.sh init

# Build 24.04 (default)
./build.sh vmware-arm64
./build.sh vmware-arm64 --fs=xfs

# Build 26.04
./build.sh vmware-arm64 --version=26.04
./build.sh vmware-arm64 --version=26.04 --fs=xfs

# Build all boxes
./build.sh all                  # 24.04 ext4
./build.sh all --version=26.04  # 26.04 ext4
```

> **CI**: Use the `ubuntu_version` input in the GitHub Actions `workflow_dispatch` trigger to select 24.04 or 26.04.

## AI Collaboration Directory

This repository includes an `.agent/` directory for AI coding assistants:

- **AGENT.md**: Technical guide (Packer, K8s tuning, optimizations)
- **SECURITY.md**: Security guidelines
- **skills/**: AI agent skills (automated reviews)

## References

- **Vagrant Cloud (24.04)**: [ext4](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04-ext4) / [xfs](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04-xfs)
- **Vagrant Cloud (26.04)**: [ext4](https://app.vagrantup.com/dasomel/boxes/ubuntu-26.04-ext4) / [xfs](https://app.vagrantup.com/dasomel/boxes/ubuntu-26.04-xfs)
- **GitHub**: [dasomel/kube-ready-box](https://github.com/dasomel/kube-ready-box)
- **Kubernetes Docs**: [kubernetes.io](https://kubernetes.io/)
