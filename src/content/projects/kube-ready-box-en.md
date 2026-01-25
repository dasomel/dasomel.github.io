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
- **AMD64 / ARM64**: Both architectures supported
- **VirtualBox 7.1+**: For Intel/AMD-based systems
- **VMware Fusion**: Apple Silicon compatible (M1/M2/M3)

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
  config.vm.box_version = "1.0.0"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "4096"
    vb.cpus = 2
  end

  config.vm.provider "vmware_desktop" do |vmware|
    vmware.vmx["memsize"] = "4096"
    vmware.vmx["numvcpus"] = "2"
  end
end
```

### Verify Optimizations

```bash
# SSH into VM
vagrant ssh

# Check kernel parameters
sysctl net.ipv4.ip_forward
sysctl net.bridge.bridge-nf-call-iptables

# Check resource limits
ulimit -n
ulimit -u

# Verify swap is disabled
free -h
```

## Kubernetes Installation Example

After creating the box, install Kubernetes:

```bash
# Install Container Runtime (containerd)
sudo apt-get update
sudo apt-get install -y containerd

# Install Kubernetes
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Initialize cluster
sudo kubeadm init

# Install CNI plugin (e.g., Calico)
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

## Build Information

This box is built using [Packer](https://www.packer.io/):

```bash
# Packer build
packer build packer/ubuntu-24.04.pkr.hcl

# Upload to Vagrant Cloud
vagrant cloud publish dasomel/ubuntu-24.04 1.0.0 virtualbox \
  output/ubuntu-24.04-amd64-virtualbox.box
```

## AI Collaboration Directory

This repository includes an `.agent/` directory for AI-assisted development:

```
.agent/
├── context.md          # Project context
├── tasks/              # Task definitions
└── docs/               # Reference documentation
```

## References

- **Vagrant Cloud**: [dasomel/ubuntu-24.04](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04)
- **Documentation**: [GitHub Repository](https://github.com/dasomel/kube-ready-box)
- **Kubernetes Docs**: [kubernetes.io](https://kubernetes.io/)
