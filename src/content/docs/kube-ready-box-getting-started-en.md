---
title: Vagrantfile Guide
description: Multi-provider configuration, resource allocation, and provisioning guide.
project: Kube-Ready-Box
path: kube-ready-box/getting-started
order: 1402
lastModified: 2026-08-23
---

# Vagrantfile Guide

Guide to defining multi-node Kubernetes clusters with Kube-Ready-Box.

## Baseline Vagrantfile

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "dasomel/ubuntu-26.04-xfs"
  config.vm.box_version = ">= 1.2.0"

  # VMware Desktop Provider
  config.vm.provider "vmware_desktop" do |v|
    v.cpus = 4
    v.memory = 8192
    v.gui = false
  end

  # VirtualBox Provider
  config.vm.provider "virtualbox" do |vb|
    vb.cpus = 4
    vb.memory = 8192
  end

  config.vm.network "private_network", ip: "192.168.56.10"
end
```
