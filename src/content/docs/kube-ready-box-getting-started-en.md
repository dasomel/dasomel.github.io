---
title: Vagrantfile Guide
description: Multi-provider configuration, resource allocation, and provisioning guide.
project: Kube-Ready-Box
path: kube-ready-box/getting-started
order: 1402
lastModified: 2026-11-03
---

# Vagrantfile Guide

Guide to defining multi-node Kubernetes clusters with Kube-Ready-Box.

## Baseline Vagrantfile

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "dasomel/ubuntu-26.04-xfs"
  config.vm.box_url = "https://dasomel.github.io/kube-ready-box/boxes/ubuntu-26.04-xfs.json"
  config.vm.box_version = ">= 0.3.0"
  # Ubuntu 0.3.1: vmware_desktop (arm64) on Apple Silicon, virtualbox (amd64) on Intel/AMD

  # VMware Desktop Provider
  config.vm.provider "vmware_desktop" do |v|
    v.cpus = 4
    v.memory = 8192
    v.gui = false
  end

  # VirtualBox Provider (amd64 hosts)
  config.vm.provider "virtualbox" do |vb|
    vb.cpus = 4
    vb.memory = 8192
  end

  config.vm.network "private_network", ip: "192.168.56.10"
end
```
