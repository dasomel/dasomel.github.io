---
title: 클러스터 아키텍처
description: 3M+3W 노드 토폴로지, HA 컨트롤 플레인 및 네트워크 흐름.
project: Narwhal
path: narwhal/architecture
order: 1100
lastModified: 2026-08-23
---

# 클러스터 아키텍처

Narwhal은 3개의 Control Plane 노드와 3개의 Worker 노드로 구성된 고가용성(HA) 클러스터 아키텍처를 가집니다.

## 노드 구성 및 네트워크
- **API VIP**: `192.168.56.100` (kube-vip 기반 L2 고가용성)
- **Node IP**: `192.168.56.10~12` (Control Plane), `192.168.56.21~23` (Workers)
- **Pod CIDR**: `10.244.0.0/16`
- **Service CIDR**: `10.96.0.0/12`
- **LoadBalancer Pool**: `192.168.56.200~220` (MetalLB L2)

## 관련 링크

- [Narwhal 저장소](https://github.com/dasomel/narwhal)
- [Narwhal 포털](/oss/narwhal/)
