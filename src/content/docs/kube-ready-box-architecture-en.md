---
title: System Architecture
description: XFS partitioning, kernel sysctl tuning, and cgroupv2 baseline.
project: Kube-Ready-Box
path: kube-ready-box/architecture
order: 1400
lastModified: 2026-08-23
---

# System Architecture

System layout configured during Packer automated build stages.

## Key Configurations
- Filesystem: XFS formatted with `pquota` mount options
- Sysctl: `net.bridge.bridge-nf-call-iptables = 1`, `net.ipv4.ip_forward = 1`
- Resource Limits: `fs.inotify.max_user_watches = 524288`

## Related Links

- [Kube-Ready-Box Repository](https://github.com/dasomel/kube-ready-box)
- [English Project Home](/oss/en/kube-ready-box/)
