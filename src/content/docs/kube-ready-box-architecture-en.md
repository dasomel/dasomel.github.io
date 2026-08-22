---
title: System Architecture
description: XFS partitioning, kernel sysctl tuning, containerd v2, and cgroupv2 baselines.
project: Kube-Ready-Box
path: kube-ready-box/architecture
order: 1401
lastModified: 2026-08-23
---

# System Architecture

System and kernel optimization specifications configured during automated Packer builds.

## Kernel & Network Parameters (`/etc/sysctl.d/99-kubernetes-cri.conf`)

```ini
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
fs.inotify.max_user_watches         = 524288
fs.inotify.max_user_instances       = 8192
vm.max_map_count                    = 262144
```

## Storage & Container Runtime

- **XFS Mount Flags**: `pquota,prjquota,noatime` applied in `/etc/fstab`
- **containerd v2**: Configured with `SystemdCgroup = true`
- **cgroup v2**: Enforced via `systemd.unified_cgroup_hierarchy=1`
