---
title: Platform Overview
description: Narwhal IDP architectural philosophy, three-tier integration model, and 35 components.
project: Narwhal
path: narwhal/overview
order: 1100
lastModified: 2026-08-27
---

# Platform Overview

**Narwhal** is an open-source **Internal Developer Platform (IDP)** built on Kubernetes v1.35, integrating GitOps, IAM/SSO, Service Mesh, Observability, Artifact Registry, Storage, Backup, Policy, API Gateway, and a Management Portal into a single reproducible unit.

## Core Engineering Philosophy

1. **Integration as a Product**: Rather than installing disparate tools separately, Narwhal resolves integration seam complexities (TLS, DNS, OIDC authentication, network routing) upfront.
2. **Knowledge Codification**: 263 incident lessons documented in `lessons-log.md` are directly linked to 51 automated CI regression checks, preventing regression across upgrades.
3. **Environment-Agnostic Reproducibility**: Runs identically across local developer workstations (Vagrant + Kube-Ready-Box), public cloud (Kakao Cloud AMD64), and air-gapped disconnected environments.

## Three-Tier Architecture Model

<Mermaid chart={`flowchart TB
  L3["L3 · Management & Developer Experience\nNarwhal Portal · Self-Service Workbenches · Release Tracking"]
  L2["L2 · Platform Services & Governance\nArgo CD + Gitea · Keycloak + APISIX · Prometheus/Grafana/Loki/Tempo · NFS/SeaweedFS · OpenBao/Kyverno"]
  L1["L1 · Infrastructure & Core Networking\nKubernetes v1.35 HA · kube-vip · Cilium · Istio Ambient · Kube-Ready-Box"]
  L3 -->|"platform APIs / identity / telemetry"| L2
  L2 -->|"cluster services / policy / storage / networking"| L1`} />

This is not just a stack inventory. It separates responsibilities into **experience → platform services → infrastructure**, so higher layers consume stable platform contracts instead of exposing every implementation detail.

## Baseline Specifications

- **Kubernetes**: v1.35 HA Control Plane (etcd 3-node quorum)
- **Node Allocation**: 3 Masters (2 vCPU, 4GB RAM) + 3 Workers (4 vCPU, 8GB RAM)
- **Network CIDRs**: Node (`192.168.56.0/24`), Pod (`10.244.0.0/16`), Service (`10.96.0.0/12`), LoadBalancer (`192.168.56.200~220`)
- **DNS Standard**: `*.local.narwhal.internal` (built-in dnsmasq resolution)
