---
title: "August 2026 OSS Implementation Update — What Is Actually on main"
description: "A main-branch, evidence-based update on Narwhal, NFS Quota Agent, KubeMetal, ldapium and OpenForge as of August 2026."
pubDate: 2026-08-28
tags: ["Open Source", "Kubernetes", "Platform Engineering", "MLOps", "OpenLDAP", "AI Engineering"]
featured: false
draft: false
---

## Why this update

Several of my OSS projects are moving faster than their surrounding documentation. When code, README pages and blog posts describe different stages of the same project, it becomes hard to tell what is actually usable today.

For this update I used a simple rule: only capabilities merged to the default branch with a reproducible evidence path count as implemented.

```text
Implementation
   ↓
Evidence / Test
   ↓
OSS Documentation
   ↓
Blog / Storytelling
```

Roadmap items and issue-only ideas are intentionally excluded from the implemented scope below.

## Narwhal

[Narwhal](https://github.com/dasomel/narwhal) has evolved from a collection of cloud-native components into an integration-first Kubernetes IDP.

The current repository records:

- 35 GitOps-managed applications
- 51 CI regression checks
- 120+ live cluster verification checks
- 49 SSO verification checks
- 263 integration incident records
- an architecture-specific air-gap bundle containing 104 container images and 27 Helm charts

The central maintenance loop is:

```text
Incident → Lesson → Discriminator → Regression Check → Upgrade Gate
```

The implemented platform combines Kubernetes v1.35 HA, Cilium/Hubble, kube-vip, MetalLB, APISIX, Argo CD/Gitea, Keycloak, Istio Ambient, Prometheus/Grafana/Loki/Tempo, Harbor, OpenBao, Kyverno, SeaweedFS, Velero, CloudNative-PG and Narwhal Portal.

Current snapshot: [Narwhal IMPLEMENTATION-STATUS](https://github.com/dasomel/narwhal/blob/main/docs/IMPLEMENTATION-STATUS.md)

## NFS Quota Agent

[NFS Quota Agent](https://github.com/dasomel/nfs-quota-agent) closes a specific storage-control gap: a Kubernetes PVC capacity value does not automatically become a filesystem quota on an NFS server.

Implemented scope now includes XFS, ext4 and Btrfs quota backends; CSI/native NFS path mapping; PV status annotations; a server-node DaemonSet; Prometheus/ServiceMonitor/PrometheusRule integration; Web UI; audit/history; orphan cleanup; and advisory namespace policy views.

The project has also hardened CI network behavior with explicit egress allowlisting.

Current snapshot: [NFS Quota Agent IMPLEMENTATION-STATUS](https://github.com/dasomel/nfs-quota-agent/blob/main/docs/IMPLEMENTATION-STATUS.md)

## KubeMetal

[KubeMetal](https://github.com/dasomel/kubemetal) is built around control/compute separation on Apple Silicon.

```text
Colima / K3s → MLflow / SeaweedFS / control-plane services
macOS Host   → MLX / Metal / fine-tuning / serving
```

The desktop app currently exposes eight workspaces: Dashboard, kagent Ops, Pipeline, Model Hub, MLX Studio, Data, Access Console and Air-Gap Management.

The implemented flow covers model discovery/download, host-native MLX LoRA fine-tuning, MLflow registration and serving. Existing Kubernetes clusters use agent-only integration by default, with full-stack deployment kept as an explicit opt-in path guarded by preflight checks.

Code signing is treated as a runtime boundary because packaged-app LAN access depends on a stable macOS local-network permission identity.

Current snapshot: [KubeMetal IMPLEMENTATION-STATUS](https://github.com/dasomel/kubemetal/blob/main/docs/IMPLEMENTATION-STATUS.md)

## ldapium

[ldapium](https://github.com/dasomel/ldapium) has expanded substantially beyond its original OpenLDAP packaging goal.

The current main branch now includes TLS 1.2 and cipher baselines, certificate-expiry/rotation tests, two-step CA rotation, StartTLS verification, optional mTLS/SASL EXTERNAL, ACL negative tests, auditlog/accesslog evidence, failed-bind auditing, HTTP error redaction, DIT password-hash redaction, 3-node DR, real-version rolling upgrades, network-partition chaos, same-entry replication conflict tests, offline installation with `imagePullPolicy=Never`, cn=config drift detection, kubeconform validation, scale benchmark tooling and Playwright browser E2E.

The important shift is that ldapium is becoming less of an "OpenLDAP image" and more of a tested directory-operations contract.

Current snapshot: [ldapium IMPLEMENTATION-STATUS](https://github.com/dasomel/ldapium/blob/main/docs/IMPLEMENTATION-STATUS.md)

## OpenForge

[OpenForge](https://github.com/dasomel/openforge) has moved from prose-only engineering guidance toward executable portfolio governance.

Implemented capabilities now include repository/documentation/CI/security/supply-chain standards, Agent Engineering guidance, ADR governance, a shared OSS design-system contract with Figma reference, branch-protection guidance, reusable project templates and a portable compliance audit engine.

The audit engine supports stable metric IDs, portfolio and single-repository assessment, baseline comparison, scorecard/delta output and actionable gap-issue generation. The current reference scorecard spans 14 repositories and 35 engineering/maturity metrics, with a 61.6% adoption snapshot after the first rollout wave.

Current snapshot: [OpenForge IMPLEMENTATION-STATUS](https://github.com/dasomel/openforge/blob/main/docs/IMPLEMENTATION-STATUS.md)

## The common change

Across these projects the development model is converging on the same pattern:

```text
Implementation
  ↓
negative / live / regression test
  ↓
operational boundary
  ↓
README / architecture / operations docs
  ↓
blog
```

Future posts will continue to focus on what has actually landed, what failed during implementation, and what evidence makes a capability safe to describe as implemented.
