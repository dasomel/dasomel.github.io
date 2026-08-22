---
title: Vagrantfile Guide
description: Multi-provider configuration and cluster provisioning guide.
project: Kube-Ready-Box
path: kube-ready-box/getting-started
order: 1400
lastModified: 2026-08-23
---

# Vagrantfile Guide

Executing Kube-Ready-Box across VMware Desktop, VirtualBox, and Libvirt.

## Vagrantfile Snippet
```ruby
config.vm.box = 'dasomel/ubuntu-26.04-xfs'
config.vm.network 'private_network', ip: '192.168.56.10'
```

## Related Links

- [Kube-Ready-Box Repository](https://github.com/dasomel/kube-ready-box)
- [English Project Home](/oss/en/kube-ready-box/)
