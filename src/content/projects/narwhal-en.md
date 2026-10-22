---
title: "Narwhal"
description: "A reproducible and verifiable Kubernetes Internal Developer Platform"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio Ambient", "Argo CD", "Cilium", "Air-Gap", "Keycloak", "Observability"]
order: 6
type: "own"
featured: true
problem: "Integrating dozens of cloud-native components creates recurring DNS, TLS, identity, networking, startup-order, and version-compatibility failures that must be re-proven after upgrades"
solution: "Integrate 35 GitOps-managed applications into one reproducible IDP and turn 440 documented incidents into 393 regression checks plus live cluster verification"
---

## Project Overview

**Narwhal** is an open-source **Internal Developer Platform (IDP)** built around Kubernetes. It combines GitOps, IAM/SSO, service mesh, observability, registry, storage, backup, policy, API gateway, and management portal capabilities into one reproducible platform unit.

Narwhal is not primarily a Kubernetes installer. Its product boundary is the **integration seam between independently developed projects**.

## Current Scale

| Metric | Current state |
|---|---|
| Activity | 1,207 commits since 2026-02-08 (as of v1.3.0), 5 releases, latest v1.3.0 |
| Integration | 35 GitOps-managed applications |
| Regression | 393 checks (`regression-check-kakao.sh`); a 51-check suite runs in CI on every push |
| Live verification | 120+ cluster checks, 49 SSO checks |
| Integration knowledge | 440 documented incidents |
| Deployment | Vagrant ARM64, Kakao Cloud AMD64, air-gapped |
| Offline bundle | 104 images, 27 Helm charts, binaries, manifests, and OS packages per architecture |

These numbers are engineering evidence of repeated integration and verification, not simply activity metrics.

## Current Status

The latest release is **v1.3.0** (2026-10-22), a **hardening release** that rolls up the security work accumulated on main since v1.2.0. It adds an integrity chain to the air-gapped and offline upgrade bundles, tightens the trust boundaries between components, and pins them with static CI gates.

- **Air-gap bundle integrity chain**: a save-time per-image digest inventory (`images.digests.json`), OCI layout byte verification, and image-config `os/architecture` checks, all enforced fail-closed by the `09` gate
- **Offline upgrade bundle pipeline**: JSON schema, verifier, approval-based promotion gate, dry-run diff, and bundle age/provenance checks; cert-manager is the first orchestration pilot
- **Tighter trust boundaries**: exact per-client Keycloak `webOrigins`, least-privilege Velero and Portal RBAC, default-deny ingress for `database`, the APISIX Admin API limited to the pod CIDR, the gateway no longer trusting a client-supplied `X-WEBAUTH-USER`, and `root_squash` NFS exports
- **Supply-chain CI gates**: mutable image tags and package installs rejected, pip hashes required, a license policy gate, and a CycloneDX SBOM for the offline bundle
- **Service mesh static gates** (R242–R244): `PeerAuthentication` PERMISSIVE exceptions pinned to a reviewed allowlist
- **Encrypted OpenBao raft snapshots** for Velero — not yet enabled on any cluster, and live behavior is unverified
- Components: Kubernetes 1.35.7, nfs-quota-agent 0.5.0, Portal image 1.1.0

The release notes' known issues still apply: the Kyverno image-signature policy is `Audit`-only and blocks nothing yet, and a mesh-wide PERMISSIVE policy stays in effect during bootstrap until ArgoCD reconciles. Existing clusters and bundles need the operator actions in the upgrade notes (for example, a bundle saved before the digest inventory must re-run `02` to pass `09`).

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

The incident log records not only what fixed an incident, but also how to distinguish it from similar failures and which tempting fixes do not work. This knowledge base is connected to the regression suite, producing 440 documented incidents and 393 regression checks.

## Verification Model

Narwhal validates different layers for different questions.

| Layer | Scope | Question |
|---|---:|---|
| Cluster verification | 120+ | Is the cluster and platform actually healthy? |
| SSO verification | 49 | Does identity work end to end across integrated apps? |
| Regression | 393 | Have known integration failures returned? |

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
