---
title: Cluster Architecture
description: Narwhal 3M+3W node topology, HA control plane, and integration seams.
project: Narwhal
path: narwhal/architecture
order: 1101
lastModified: 2026-08-27
---

# Cluster Architecture

Narwhal uses a six-node high-availability (HA) topology with three Control Plane nodes and three Worker nodes to reduce single points of failure.

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

Clients use the kube-vip virtual IP at `192.168.56.100` as the Kubernetes API endpoint instead of targeting an individual master address. At any point in time, one Control Plane node owns the VIP. If that node fails, another Control Plane node takes ownership. The three masters also run independent etcd members that form the cluster quorum.

The diagram below shows an **example state where master-1 currently owns the VIP**. `master-2` and `master-3` are failover candidates for the API endpoint, while all three nodes run both kube-apiserver and an etcd member.

<Mermaid chart={`flowchart TB
  CLIENT["kubectl · Argo CD · CI workflow"] --> VIP["Kubernetes API endpoint\n192.168.56.100 · kube-vip VIP"]
  VIP -->|"current VIP owner"| M1["master-1\nControl Plane\nkube-apiserver · etcd member 1"]
  VIP -.->|"failover candidate"| M2["master-2\nControl Plane\nkube-apiserver · etcd member 2"]
  VIP -.->|"failover candidate"| M3["master-3\nControl Plane\nkube-apiserver · etcd member 3"]
  M1 --- QUORUM["etcd quorum"]
  M2 --- QUORUM
  M3 --- QUORUM`} />

The two HA mechanisms serve different purposes. kube-vip provides **continuity of the API endpoint**, while the three-member etcd cluster provides **quorum and fault tolerance for Control Plane state**.

## XFS Project Quota Node Storage

All nodes run on **Kube-Ready-Box (`dasomel/ubuntu-26.04-xfs`)** with XFS Project Quotas enabled across `/srv/nfs` and container storage partitions, preventing storage exhaustion at the kernel level.
