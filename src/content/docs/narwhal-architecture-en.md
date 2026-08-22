---
title: Cluster Architecture
description: 3M+3W node topology, HA control plane, and network packet flows.
project: Narwhal
path: narwhal/architecture
order: 1100
lastModified: 2026-08-23
---

# Cluster Architecture

Narwhal runs a high-availability topology consisting of 3 Control Plane nodes and 3 Worker nodes.

## Node Topology & Networks
- **API VIP**: `192.168.56.100` (kube-vip L2 HA)
- **Node IPs**: `192.168.56.10~12` (Control Plane), `192.168.56.21~23` (Workers)
- **Pod CIDR**: `10.244.0.0/16`
- **Service CIDR**: `10.96.0.0/12`
- **LoadBalancer Pool**: `192.168.56.200~220` (MetalLB L2)

## Related Links

- [Narwhal Repository](https://github.com/dasomel/narwhal)
- [Narwhal English Portal](/oss/en/narwhal/)
