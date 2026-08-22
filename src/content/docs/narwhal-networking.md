---
title: 네트워크 및 Ingress
description: Cilium eBPF, MetalLB, APISIX 라우팅 및 DNS.
project: Narwhal
path: narwhal/networking
order: 1100
lastModified: 2026-08-23
---

# 네트워크 및 Ingress

Narwhal은 eBPF 기반 고성능 네트워킹과 API Gateway를 결합합니다.

## 네트워크 스택
- **CNI**: Cilium (Kube-proxy replacement, eBPF Host Routing, NetworkPolicy)
- **Service Mesh**: Istio Ambient (ztunnel 기반 L4 mTLS 암호화)
- **API Gateway**: Apache APISIX (OIDC 인증, Rate Limiting, 동적 업스트림 라우팅)
- **DNS**: dnsmasq 기반 `*.local.narwhal.internal` 로컬 도메인 자동 확인

## 관련 링크

- [Narwhal 저장소](https://github.com/dasomel/narwhal)
- [Narwhal 포털](/oss/narwhal/)
