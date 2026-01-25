---
title: "Vagrant"
description: "Vagrant Configuration and Tips"
order: 6
date: 2024-06-17
lastModified: 2024-06-17
---

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
