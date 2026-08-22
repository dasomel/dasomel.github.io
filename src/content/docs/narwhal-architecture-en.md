---
title: Cluster Architecture
description: Narwhal 3M+3W node topology, HA control plane, and integration seams.
project: Narwhal
path: narwhal/architecture
order: 1101
lastModified: 2026-08-23
---

# Cluster Architecture

Narwhal adopts a resilient 6-node high-availability (HA) topology designed with zero single points of failure.

## Node Topology & IP Allocation

| Node Name | Role | vCPU / RAM | IP Address | Core Running Services |
|---|---|---|---|---|
| **master-1** | Control Plane, NFS Host | 2 CPU / 4 GiB | `192.168.56.10` | etcd, kube-apiserver, kube-vip, NFS Server, dnsmasq |
| **master-2** | Control Plane | 2 CPU / 4 GiB | `192.168.56.11` | etcd, kube-apiserver, kube-vip, dnsmasq |
| **master-3** | Control Plane | 2 CPU / 4 GiB | `192.168.56.12` | etcd, kube-apiserver, kube-vip |
| **worker-1** | Platform Infrastructure | 4 CPU / 8 GiB | `192.168.56.21` | Cilium, APISIX, MetalLB, Keycloak, ArgoCD |
| **worker-2** | Telemetry & Observability | 4 CPU / 8 GiB | `192.168.56.22` | Prometheus, Grafana, Loki, Tempo, OpenBao |
| **worker-3** | Storage & User Workloads | 4 CPU / 8 GiB | `192.168.56.23` | SeaweedFS S3, CloudNativePG, Narwhal Portal |

## HA Control Plane (kube-vip + etcd)

kube-vip manages a virtual IP (`192.168.56.100`) floating across the three master nodes. In the event of a master node failure, the VIP transitions within 1 second to ensure uninterrupted API operations.

```text
               kubectl / Argo CD / CI Workflows
                              │
                              ▼
                 192.168.56.100 (kube-vip VIP)
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼ (Active)            ▼ (Standby)           ▼ (Standby)
   [ master-1 ]          [ master-2 ]          [ master-3 ]
   - kube-apiserver      - kube-apiserver      - kube-apiserver
   - etcd member 1       - etcd member 2       - etcd member 3
```

## XFS Project Quota Node Storage

All nodes run on **Kube-Ready-Box (`dasomel/ubuntu-26.04-xfs`)** with XFS Project Quotas enabled across `/srv/nfs` and container storage partitions, preventing storage exhaustion at the kernel level.
