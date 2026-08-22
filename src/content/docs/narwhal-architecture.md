---
title: 클러스터 아키텍처
description: Narwhal 3M+3W 노드 토폴로지, HA 컨트롤 플레인 및 결합 구조.
project: Narwhal
path: narwhal/architecture
order: 1101
lastModified: 2026-08-23
---

# 클러스터 아키텍처

Narwhal은 단일 장애점(SPOF)이 없는 견고한 6노드 고가용성(HA) 클러스터 아키텍처를 기본 토폴로지로 채택합니다.

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

kube-vip을 통해 가상 IP(`192.168.56.100`)를 3개의 마스터 노드 간에 부동(Floating) IP로 관리합니다. 마스터 노드 1대가 장애로 중단되더라도 1초 이내에 다른 마스터 노드가 VIP를 인수하여 무중단 API 요청을 보장합니다.

```text
               kubectl / Argo CD / CI 워크플로
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

## XFS Project Quota 기반 노드 스토리지

모든 노드는 **Kube-Ready-Box (`dasomel/ubuntu-26.04-xfs`)** 베이스 이미지를 기반으로 부팅되며, `/srv/nfs` 및 컨테이너 데이터 파티션에 XFS Project Quota가 활성화되어 있습니다. 이를 통해 컨테이너 I/O 및 PV 사용량이 노드의 호스트 디스크를 고갈시키는 사고를 물리적으로 차단합니다.
