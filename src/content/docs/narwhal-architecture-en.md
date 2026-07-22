---
title: "Architecture"
description: "Overall architecture and HA control plane design of the Vagrant-based Kubernetes IDP cluster"
project: "Narwhal"
order: 101
lastModified: 2026-07-17
---

## Infrastructure Overview

Narwhal is a Vagrant-based Kubernetes Internal Developer Platform (IDP) cluster that provides a production-grade platform stack in a single cluster. It utilizes a High Availability (HA) architecture consisting of 3 master nodes and 3 worker nodes.

### Base Box

- **Image**: `dasomel/ubuntu-26.04-xfs` (Based on Ubuntu 26.04 LTS, Kernel 7.0)
- **Features**: Uses the XFS filesystem with project quota (prjquota) enabled to support `nfs-quota-agent`.
- **Provider**: Supports both VirtualBox and VMware Desktop environments.

## Node Layout

All nodes operate on the `192.168.56.0/24` private network. Masters get 6 GiB for the control plane plus DaemonSet headroom; workers get 6 GiB to run platform apps.

| Node | IP Address | Role | CPU | Memory | Notes |
|---|---|---|---|---|---|
| `narwhal-master-1` | `192.168.56.10` | Control Plane | 2 | 6 GiB | NFS Server, dnsmasq |
| `narwhal-master-2` | `192.168.56.11` | Control Plane | 2 | 6 GiB | dnsmasq |
| `narwhal-master-3` | `192.168.56.12` | Control Plane | 2 | 6 GiB | dnsmasq |
| `narwhal-worker-1` | `192.168.56.21` | Worker | 2 | 6 GiB | Runs platform apps |
| `narwhal-worker-2` | `192.168.56.22` | Worker | 2 | 6 GiB | Runs platform apps |
| `narwhal-worker-3` | `192.168.56.23` | Worker | 2 | 6 GiB | Runs platform apps |

- **Storage**: A minimum of 30GB disk space per VM is recommended for a full IDP deployment.

## HA Control Plane Design

Built on Kubernetes v1.35.5, it provides high availability and 1 fault tolerance through 3 master nodes.

- **kube-vip (v1.1.2)**: Uses the address `192.168.56.100` as the Control Plane VIP. It ensures stable API server access via ARP-based leader election.
- **etcd**: Configured as a 3-node quorum (quorum=2/3), ensuring normal operation even if 1 master node fails.

<Mermaid chart={`flowchart TB
  KC["kubectl / ArgoCD"]
  VIP(["kube-vip VIP<br/>192.168.56.100<br/>(ARP leader election)"])
  M1["master-1 · .10<br/>apiserver + etcd<br/>NFS · dnsmasq"]
  M2["master-2 · .11<br/>apiserver + etcd"]
  M3["master-3 · .12<br/>apiserver + etcd"]
  W1["worker-1 · .21"]
  W2["worker-2 · .22"]
  W3["worker-3 · .23"]

  KC -->|":6443"| VIP
  VIP -.->|"VIP held by leader only"| M1
  VIP -.-> M2
  VIP -.-> M3
  M1 <-->|"etcd raft (quorum 2/3)"| M2
  M2 <--> M3
  M3 <--> M1
  M1 --> W1
  M1 --> W2
  M1 --> W3

  style VIP fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style M1 fill:#f0fdf4,stroke:#059669,color:#111
  style M2 fill:#f0fdf4,stroke:#059669,color:#111
  style M3 fill:#f0fdf4,stroke:#059669,color:#111
  style W1 fill:#f9fafb,stroke:#d1d5db,color:#111
  style W2 fill:#f9fafb,stroke:#d1d5db,color:#111
  style W3 fill:#f9fafb,stroke:#d1d5db,color:#111
  style KC fill:#fff,stroke:#9ca3af,color:#111
`} />

## Network CIDRs

| Purpose | Network CIDR |
|---|---|
| Node Network | `192.168.56.0/24` |
| Pod Network | `10.244.0.0/16` |
| Service Network | `10.96.0.0/12` |
| MetalLB LoadBalancer Pool | `192.168.56.200` ~ `192.168.56.220` |

## Component Topology Summary

Cluster provisioning happens sequentially. Phase 2 platform services are deployed only after all master and worker node joins are fully completed. User requests flow through DNS resolution → MetalLB → the APISIX gateway before reaching workloads inside the mesh.

<Mermaid chart={`flowchart TB
  U["Browser<br/>*.local.narwhal.internal"]
  DNS["dnsmasq · masters<br/>192.168.56.10:53"]
  LB(["MetalLB L2<br/>192.168.56.200"])
  GW["APISIX<br/>API Gateway + OIDC plugin"]
  KEY["Keycloak<br/>OIDC authentication"]

  subgraph MESH["Istio ambient mode · ztunnel mTLS (no sidecars)"]
    GIT["Gitea"]
    ARGO["ArgoCD"]
    HAR["Harbor"]
    PROM["Prometheus · Grafana<br/>Loki · Tempo"]
    PORTAL["Narwhal Portal"]
  end

  U -->|"① resolve name"| DNS
  DNS -->|"② → .200"| U
  U -->|"③ HTTPS"| LB
  LB --> GW
  GW -.->|"④ redirect if unauthenticated"| KEY
  GW -->|"⑤ route (ApisixRoute)"| MESH

  style LB fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style GW fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style DNS fill:#f0fdf4,stroke:#059669,color:#111
  style KEY fill:#f0fdf4,stroke:#059669,color:#111
  style U fill:#fff,stroke:#9ca3af,color:#111
  style MESH fill:#fafafa,stroke:#d1d5db,color:#374151
  style GIT fill:#f9fafb,stroke:#d1d5db,color:#111
  style ARGO fill:#f9fafb,stroke:#d1d5db,color:#111
  style HAR fill:#f9fafb,stroke:#d1d5db,color:#111
  style PROM fill:#f9fafb,stroke:#d1d5db,color:#111
  style PORTAL fill:#f9fafb,stroke:#d1d5db,color:#111
`} />
