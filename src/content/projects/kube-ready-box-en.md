---
title: "Kube-Ready-Box"
description: "Kubernetes-optimized Ubuntu 24.04 LTS Vagrant Box"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Ubuntu", "Multi-Arch"]
order: 1
type: "own"
---

## Project Overview

Kube-Ready-Box is an **OS-level optimized Ubuntu 24.04 LTS Vagrant Box for Kubernetes deployments**.

Distributed on Vagrant Cloud as `dasomel/ubuntu-24.04`, it comes with pre-applied system tuning for container orchestration environments.

## Key Features

### Multi-Architecture & Provider Support

| Provider | AMD64 | ARM64 | Notes |
|----------|-------|-------|-------|
| VirtualBox | ✅ | ✅ | VirtualBox 7.1+ required for ARM64 |
| VMware Fusion | ✅ | ✅ | Apple Silicon supported |

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
# Initialize Vagrant
vagrant init dasomel/ubuntu-24.04

# Start VM (VirtualBox)
vagrant up

# Start VM (VMware)
vagrant up --provider=vmware_desktop
```

### Vagrantfile Example

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "dasomel/ubuntu-24.04"

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

# Build specific box
./build.sh vmware-arm64      # VMware ARM64
./build.sh virtualbox-arm64  # VirtualBox ARM64

# Build all boxes (4 boxes)
./build.sh all
```

## AI Collaboration Directory

This repository includes an `.agent/` directory for AI coding assistants:

- **AGENT.md**: Technical guide (Packer, K8s tuning, optimizations)
- **SECURITY.md**: Security guidelines
- **skills/**: AI agent skills (automated reviews)

## References

- **Vagrant Cloud**: [dasomel/ubuntu-24.04](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04)
- **GitHub**: [dasomel/kube-ready-box](https://github.com/dasomel/kube-ready-box)
- **Kubernetes Docs**: [kubernetes.io](https://kubernetes.io/)
