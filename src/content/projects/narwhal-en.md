---
title: "Narwhal"
description: "A reproducible and verifiable Kubernetes Internal Developer Platform"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio Ambient", "Argo CD", "Cilium", "Air-Gap", "Keycloak", "Observability"]
order: 6
type: "own"
featured: true
problem: "Integrating dozens of cloud-native components creates recurring DNS, TLS, identity, networking, startup-order, and version-compatibility failures that must be re-proven after upgrades"
solution: "Integrate 35 GitOps-managed applications into one reproducible IDP and turn 263 documented incidents into 51 CI regression checks plus live cluster verification"
---

## Project Overview

**Narwhal** is an open-source **Internal Developer Platform (IDP)** built around Kubernetes. It combines GitOps, IAM/SSO, service mesh, observability, registry, storage, backup, policy, API gateway, and management portal capabilities into one reproducible platform unit.

Narwhal is not primarily a Kubernetes installer. Its product boundary is the **integration seam between independently developed projects**.

## Current Scale

| Metric | Current state |
|---|---|
| Activity | 483 commits since 2026-02-08, 4 releases, latest v1.2.0 |
| Integration | 35 GitOps-managed applications |
| CI regression | 51 checks |
| Live verification | 120+ cluster checks, 49 SSO checks |
| Integration knowledge | 263 documented incidents |
| Deployment | Vagrant ARM64, Kakao Cloud AMD64, air-gapped |
| Offline bundle | 104 images, 27 Helm charts, binaries, manifests, and OS packages per architecture |

These numbers are engineering evidence of repeated integration and verification, not simply activity metrics.

## Platform Components

### Kubernetes and networking

- Kubernetes **v1.35**
- Cilium **v1.19.x**
- Hubble **v1.19.x**
- kube-vip **v1.1.x**
- MetalLB **v0.16.x**
- Apache APISIX **3.15.x**

### GitOps and identity

- Argo CD **v3.4.x**
- Gitea **v1.26.x**
- Keycloak **26.5.x**

### Observability

- Prometheus Stack **v0.91.x**
- Loki **3.7.x**
- Grafana Alloy **v1.17.x**
- Tempo **2.9.x**
- Hubble

### Platform services

- Harbor **v2.15.x**
- OpenBao **v2.5.x**
- Kyverno **v1.18.x**
- Headlamp **v0.42.x**
- SeaweedFS **v4.34.x**
- Velero **v1.18.x**
- CloudNative-PG **v1.29.x**
- Istio **v1.30.x** in ambient mode

## Integration Seams as Product

A typical identity-to-application path crosses several independent systems:

```text
Keycloak OIDC
      ↓
APISIX authentication
      ↓
service routing
      ↓
Istio ambient / ztunnel
      ↓
Kubernetes workload
```

Narwhal records the assumptions at these boundaries as documentation, scripts, health checks, and regression checks so they can be revalidated during upgrades.

## Knowledge as Tests

The core maintenance loop is:

```text
Incident
   ↓
Root Cause
   ↓
Discriminator
   ↓
Regression Check
   ↓
Upgrade Gate
```

The incident log records not only what fixed an incident, but also how to distinguish it from similar failures and which tempting fixes do not work. This knowledge base is connected to the regression suite, producing 263 documented incidents and 51 CI checks.

## Verification Model

Narwhal validates different layers for different questions.

| Layer | Scope | Question |
|---|---:|---|
| Cluster verification | 120+ | Is the cluster and platform actually healthy? |
| SSO verification | 49 | Does identity work end to end across integrated apps? |
| CI regression | 51 | Have known integration failures returned? |

This separation keeps fast CI regression checks independent from deeper live-cluster validation.

## Air-Gapped Installation

Disconnected installation is a first-class deployment target.

```text
Online build
   ↓
images / charts / binaries / manifests / packages
   ↓
architecture-specific offline bundle
   ↓
verification
   ↓
install without live Internet
```

The bundle contains the artifacts required to reproduce the platform without reaching upstream registries during installation.

## Management Portal

Narwhal Portal provides the day-2 user experience for the platform: dashboard, applications, security, cost, governance, catalog, and architecture views.

The product boundary is therefore:

```text
Narwhal = platform integration + operation
Portal  = developer / operator experience
```

## Getting Started

```bash
git clone https://github.com/dasomel/narwhal.git
cd narwhal
vagrant up --provider=vmware_desktop
vagrant ssh master-1 -c "kubectl get nodes"
vagrant ssh master-1 -c "kubectl get applications -A"
vagrant ssh master-1 -c "bash /home/vagrant/scripts/test/verify-cluster.sh"
```

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [Platform Overview](/oss/en/narwhal/overview) | IDP scope and integration philosophy |
| Architecture | [Cluster Architecture](/oss/en/narwhal/architecture) | HA control plane, networking, service layout |
| GitOps | [GitOps Workflow](/oss/en/narwhal/gitops) | Argo CD + Gitea App-of-Apps |
| Networking | [Networking & Ingress](/oss/en/narwhal/networking) | Cilium, MetalLB, APISIX, DNS |
| Security | [Security & SSO](/oss/en/narwhal/security) | Keycloak, OpenBao, Kyverno, TLS |
| Observability | [Monitoring & Logs](/oss/en/narwhal/observability) | Prometheus, Grafana, Loki, Tempo, Hubble |
| Storage | [Storage & Databases](/oss/en/narwhal/storage) | NFS CSI, SeaweedFS, quota, PostgreSQL |
| Operations | [Day-2 Operations & DR](/oss/en/narwhal/operations) | Backup, restore, upgrades, air-gap |
| Testing | [Regression Testing & Chaos](/oss/en/narwhal/testing) | Live verification and regression practice |

## Project Relationship

```text
kube-ready-box
       ↓
   Narwhal IDP
   ├── nfs-quota-agent
   ├── ldapium
   └── Narwhal Portal

OpenForge
   └── shared engineering / supply-chain practices
```
