---
title: "Usage"
description: "Vagrantfile configuration, provider selection, and K8s post-installation guide for Kube-Ready-Box"
project: "Kube-Ready-Box"
order: 302
lastModified: 2026-07-17
---

## Vagrantfile Configuration and Usage

Kube-Ready-Box is designed to be highly suitable for both single-node and multi-node Kubernetes cluster environments.

### Single Node Example

When setting up a single node, selecting the appropriate Provider according to the host machine's architecture (Intel/AMD or Apple Silicon) is essential.

```ruby
Vagrant.configure("2") do |config|
  # Select OS and filesystem variant (e.g., 24.04 ext4)
  config.vm.box = "dasomel/ubuntu-24.04-ext4"

  host_arch = `uname -m`.strip

  if host_arch == "arm64" || host_arch == "aarch64"
    config.vm.provider "vmware_desktop" do |v|
      v.vmx["memsize"] = "4096"
      v.vmx["numvcpus"] = "2"
    end
  else
    config.vm.provider "virtualbox" do |vb|
      vb.memory = 4096
      vb.cpus = 2
      # Apply virtio for better network performance
      vb.customize ["modifyvm", :id, "--nictype1", "virtio"]
    end
  end

  config.vm.hostname = "k8s-node"
  config.vm.network "private_network", ip: "192.168.56.10"
end
```

### Basic Commands

- `vagrant up`: Download the Box and boot the VM
- `vagrant ssh`: Connect to the VM
- `vagrant halt`: Stop the VM
- `vagrant destroy -f`: Force delete the VM

## Provider Specific Tips

### VirtualBox
Used primarily in Intel/AMD-based environments. Changing the network interface type to `virtio` greatly improves throughput.
- Tip: `vb.customize ["modifyvm", :id, "--nictype1", "virtio"]`

### VMware Fusion
Provides optimal performance on Apple Silicon (ARM64) environments. (If using VirtualBox on ARM, version 7.2.6 or higher is strictly required.)

## K8s Post-Install

Kube-Ready-Box does not package Kubernetes itself, allowing the user to install their desired version.

### 1. Configure cgroup driver (Mandatory)
Ubuntu 26.04 is strictly cgroup v2-only. You must unify the cgroup driver for both containerd and kubelet to `systemd`.

```bash
# Enable systemd cgroup in containerd
sudo apt-get update && sudo apt-get install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd && sudo systemctl enable containerd
```

### 2. Install Kubelet and Control Plane

```bash
# Set your desired Kubernetes version
K8S_VERSION="v1.31"
curl -fsSL "https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/Release.key" | \
  sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/ /" | \
  sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update && sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Initialize cluster (Master Node)
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

### 3. Apply CNI
After initialization is complete, install your preferred CNI plugin. (You can utilize eBPF-based Cilium, or Flannel for a simple setup.)

```bash
# Example applying Flannel
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

## Troubleshooting Tips

- **Box Download Cache Issues**: After running `vagrant box remove`, manually delete the `~/.vagrant.d/boxes/` cache folder and try again.
- **Network Connection Fails**: Inside the VM, check via `ip addr` to ensure the `192.168.56.x` subnet is correctly assigned.
