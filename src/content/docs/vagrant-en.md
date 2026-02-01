---
title: "Vagrant"
description: "Vagrant Configuration and Tips"
order: 6
date: 2024-06-17
lastModified: 2026-02-02
---

## Provider Selection

### VirtualBox (x86/Intel)

```shell
brew install --cask virtualbox
vagrant up
```

### VMware (ARM64/Apple Silicon)

```shell
# Install VMware Fusion
brew install --cask vmware-fusion

# Install Vagrant VMware plugin
vagrant plugin install vagrant-vmware-desktop

# Run with VMware provider
vagrant up --provider=vmware_desktop
```

## Fixing Vagrant Connection Error

```shell
vb.customize ['modifyvm', :id, '--nictype1', 'virtio']
vb.customize ['modifyvm', :id, '--nictype2', 'virtio']
```

- Connection errors may occur if VirtualBox runs for a long time
- The above settings change the interface to fix this error

## Setting Master01 Node as Main

```shell
# Master Node
(1..2).reverse_each do |i|
```

- K-PaaS shell script is basically set to configure the 1st Master Node
- To save resources, set the ansible server and master01 server to be the same
- Using `reverse_each` setting, install the 2nd master node first and the 1st master node last
