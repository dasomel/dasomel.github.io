---
title: 클러스터 아키텍처
description: Narwhal 3M+3W 노드 토폴로지, HA 컨트롤 플레인 및 결합 구조.
project: Narwhal
path: narwhal/architecture
order: 1101
lastModified: 2026-08-27
---

# 클러스터 아키텍처

Narwhal은 단일 장애점(SPOF)을 줄이기 위해 3개의 Control Plane과 3개의 Worker로 구성된 6노드 고가용성(HA) 토폴로지를 사용합니다.

## 노드 토폴로지 및 IP 할당표

| 노드 이름 | 역할 | vCPU / RAM | IP 주소 | 주요 구동 서비스 |
|---|---|---|---|---|
| **master-1** | Control Plane, NFS Host | 2 CPU / 4 GiB | `192.168.56.10` | etcd, kube-apiserver, kube-vip, NFS Server, dnsmasq |
| **master-2** | Control Plane | 2 CPU / 4 GiB | `192.168.56.11` | etcd, kube-apiserver, kube-vip, dnsmasq |
| **master-3** | Control Plane | 2 CPU / 4 GiB | `192.168.56.12` | etcd, kube-apiserver, kube-vip |
| **worker-1** | Platform Infrastructure | 4 CPU / 8 GiB | `192.168.56.21` | Cilium, APISIX, MetalLB, Keycloak, ArgoCD |
| **worker-2** | Telemetry & Observability | 4 CPU / 8 GiB | `192.168.56.22` | Prometheus, Grafana, Loki, Tempo, OpenBao |
| **worker-3** | Storage & User Workloads | 4 CPU / 8 GiB | `192.168.56.23` | SeaweedFS S3, CloudNativePG, Narwhal Portal |

## HA Control Plane (kube-vip + etcd)

클라이언트는 개별 master IP가 아니라 `192.168.56.100`의 kube-vip Virtual IP를 Kubernetes API endpoint로 사용합니다. VIP는 한 시점에 하나의 Control Plane 노드가 소유하며, 해당 노드에 장애가 발생하면 다른 Control Plane 노드가 VIP를 인계합니다. 세 master의 etcd는 각각 독립 member로 quorum을 구성합니다.

아래 그림은 **master-1이 현재 VIP를 소유하고 있는 예시 상태**입니다. `master-2`, `master-3`은 API endpoint의 failover 후보이며, 세 노드 모두 kube-apiserver와 etcd member를 실행합니다.

<Mermaid chart={`flowchart TB
  CLIENT["kubectl · Argo CD · CI workflow"] --> VIP["Kubernetes API endpoint\n192.168.56.100 · kube-vip VIP"]
  VIP -->|"current VIP owner"| M1["master-1\nControl Plane\nkube-apiserver · etcd member 1"]
  VIP -.->|"failover candidate"| M2["master-2\nControl Plane\nkube-apiserver · etcd member 2"]
  VIP -.->|"failover candidate"| M3["master-3\nControl Plane\nkube-apiserver · etcd member 3"]
  M1 --- QUORUM["etcd quorum"]
  M2 --- QUORUM
  M3 --- QUORUM`} />

이 구조에서 API endpoint와 etcd quorum은 서로 다른 역할을 담당합니다. kube-vip은 **API endpoint의 연속성**을 제공하고, 3-member etcd는 **Control Plane 상태 저장소의 quorum과 내결함성**을 제공합니다.

## XFS Project Quota 기반 노드 스토리지

모든 노드는 **Kube-Ready-Box (`dasomel/ubuntu-26.04-xfs`)** 베이스 이미지를 기반으로 부팅되며, `/srv/nfs` 및 컨테이너 데이터 파티션에 XFS Project Quota가 활성화되어 있습니다. 이를 통해 컨테이너 I/O 및 PV 사용량이 노드의 호스트 디스크를 고갈시키는 사고를 물리적으로 차단합니다.
