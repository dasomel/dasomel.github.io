---
title: Networking & Ingress
description: Cilium eBPF, MetalLB, APISIX routing, and internal DNS.
project: Narwhal
path: narwhal/networking
order: 1100
lastModified: 2026-08-23
---

# Networking & Ingress

Narwhal combines eBPF-powered container networking with cloud-native API routing.

## Network Stack
- **CNI**: Cilium (Kube-proxy replacement, eBPF host routing, NetworkPolicies)
- **Service Mesh**: Istio Ambient (ztunnel L4 mTLS encryption)
- **API Gateway**: Apache APISIX (OIDC authentication, rate limiting, dynamic upstream routing)
- **DNS**: dnsmasq resolving `*.local.narwhal.internal` wildcard domains

## Related Links

- [Narwhal Repository](https://github.com/dasomel/narwhal)
- [Narwhal English Portal](/oss/en/narwhal/)
