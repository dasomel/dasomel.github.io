---
title: "Cilium and Istio Ambient Integration Strategy"
event: "OpenInfra Days Korea 2025"
date: 2025-08-26
slides: ""
tags: ["Cilium", "Istio", "ServiceMesh", "eBPF"]
---

## Presentation Overview

At OpenInfra Days Korea 2025, we present the latest strategies for integrating eBPF-based Cilium and the sidecar-less Istio Ambient mode into a container-based test environment.

## Key Topics

### The Need for Service Mesh

As complexity and scalability of cloud-native infrastructure become increasingly important, service mesh architecture has established itself as a key solution for providing secure and observable networking between microservices.

### Introduction to Cilium
- High-performance network policies based on eBPF
- Excellent observability
- Real-time network monitoring with Hubble

### Istio Ambient Mode
- Lightweight sidecar-less mesh architecture
- L4 traffic handling based on ztunnel
- L7 policy enforcement via Waypoint Proxy
- Reduced resource consumption compared to traditional Sidecar mode

### Cilium + Istio Ambient Integration Strategy
- Container-based test environment setup
- Role division and complementarity between the two technologies
- Network policy layering strategy
- Considerations and troubleshooting during integration

## Target Audience

- Engineers interested in advanced Kubernetes networking
- Teams evaluating service mesh adoption
- Developers interested in eBPF and cloud-native technologies
