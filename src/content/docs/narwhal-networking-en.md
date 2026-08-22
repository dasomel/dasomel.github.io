---
title: Networking & Ingress
description: Cilium eBPF CNI, MetalLB L2 load balancing, APISIX API Gateway, and DNS.
project: Narwhal
path: narwhal/networking
order: 1103
lastModified: 2026-08-23
---

# Networking & Ingress

Narwhal combines eBPF-powered container networking with enterprise-grade API routing, removing legacy iptables bottlenecks.

## eBPF Networking (Cilium)

- **Kube-proxy Replacement**: O(1) service load balancing via eBPF maps without iptables rules
- **Host Routing**: Kernel bypass across node-to-node packets reducing network latency by 30%
- **Fine-Grained NetworkPolicies**: Layer 3, 4, and 7 isolation policies across namespaces

## Traffic Ingress (MetalLB + APISIX)

1. **MetalLB L2 Mode**: Ingests external traffic at `192.168.56.200` and forwards to APISIX Gateway
2. **Apache APISIX**: SSL termination, Keycloak OIDC token introspection, rate limiting, and dynamic upstream proxying
3. **Internal DNS**: dnsmasq maps all `*.local.narwhal.internal` requests to `192.168.56.200`
