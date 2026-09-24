---
title: "Narwhal Portal"
description: "Operations and developer workbench for the Narwhal Kubernetes Internal Developer Platform"
github: "https://github.com/dasomel/narwhal-portal"
tags: ["Kubernetes", "IDP", "Next.js", "React", "TypeScript", "Keycloak", "GitOps", "Platform Engineering"]
order: 7
type: "own"
featured: true
problem: "A Kubernetes IDP can expose dozens of independent dashboards while leaving platform-wide state, relationships, and operator workflows fragmented"
solution: "A unified Next.js portal that presents cluster, application, catalog, security, cost, governance, and onboarding workflows as one operational surface"
---

## Project Overview

**Narwhal Portal** is the management portal and developer workbench for the Narwhal Kubernetes Internal Developer Platform.

Narwhal provides the underlying GitOps, SSO, observability, storage, security, and platform services. The Portal provides the **day-2 operational surface** that makes those services understandable and usable as one platform.

The portal does not try to replace every upstream UI. Kubernetes, Argo CD, Keycloak, and other systems remain authoritative; the Portal aggregates platform signals and exposes them through platform-level concepts.

## Core Areas

| Area | Purpose |
|---|---|
| Dashboard | Cluster health, Argo CD applications, alerts, and overall platform status |
| Onboarding | Getting-started workflow and kubeconfig issuance |
| Catalog / My Apps | Service catalog and per-user application view |
| Nodes | Node inventory and status |
| Cost | Namespace/workload cost visibility |
| Security / Compliance | Security posture, policies, RBAC, and audit-related information |
| Governance | Scorecards, DORA-related information, and platform maturity signals |
| Architecture | Platform and service relationships |
| Templates / Tools | Developer-oriented platform utilities |
| Settings | Users, routes, certificates, and policy settings |

## Position in Narwhal

<Mermaid chart={`flowchart TB
  IDP["Narwhal IDP\nKubernetes · GitOps · SSO · Observability · Storage · Security"]
  IDP -->|"platform APIs / cluster state"| PORTAL["Narwhal Portal\nNext.js + React"]
  PORTAL --> DASH["Dashboard"]
  PORTAL --> APPS["Catalog / My Apps"]
  PORTAL --> OPS["Nodes / Cost"]
  PORTAL --> SEC["Security / Governance"]
  PORTAL --> TOOLS["Architecture / Tools"]
  PORTAL -->|"day-2 experience"| USER["Developer / Operator"]`} />

## Technology Stack

- **Next.js `^16.3.1` / React `19.2.8`** — App Router application
- **TypeScript `^6.0.3`** — typed frontend/API boundaries
- **Tailwind CSS `4.3.3` / shadcn/ui** — reusable admin UI
- **TanStack Query / Zustand** — server/client state
- **NextAuth `5.0.0-beta.30` + Keycloak OIDC** — authentication and sessions
- **Valkey** — application cache (a dedicated pub/sub client keeps long-lived subscriptions apart from the fail-fast cache client's short timeout/retry limits)
- **OpenBao Agent Injector** — runtime secrets injection
- **Skaffold / Kaniko** — Kubernetes inner-loop development and in-cluster image builds
- **Vitest** — unit/regression suite wired into CI. Playwright-based browser-level e2e coverage is still planned, not claimed as implemented on main (`docs/IMPLEMENTATION-STATUS.md`, last verified 2026-09-14)
- **pnpm `10.27.0`** (pinned via `packageManager`)

## Current Status

The latest tagged release is **v1.0.17** (2026-08-09). It made the platform-tool tile base domain configurable via `CLUSTER_BASE_DOMAIN`, derived node roles correctly from the Prometheus `kube_node_role` metric and K8s labels (both `control-plane` and the legacy `master` key), fixed compliance framework pass-rate scaling (0-1 ratios were rendering as 1%), and queried cluster-scoped `clusterinfraassessmentreports` alongside namespaced reports so trivy-operator node security findings are reflected. This release also introduced an automated GitHub Release workflow that publishes notes from `CHANGELOG.md` on tag push.

Since v1.0.17, main has accumulated substantial security hardening without a new tag yet (as of 2026-09-23, the repository has 300 commits total):

- Centralized role-string checks on `requireRole`/`requireAdmin` and enforced resource-scoping on the cost/security detail and trend APIs
- Switched OpenBao authentication from a static token to Kubernetes auth login, and replaced the long-lived K8s service-account token with a projected short-lived token
- Anchored the federated-logout redirect allowlist to close an open-redirect bypass
- Enforced production TLS for Keycloak/Gitea integrations and restricted the health endpoint to cluster-admin
- Applied an Agent Execution Security Contract to the privileged node-tuning path, with exact-invocation approval, server-side recomputation, and replay protection (PR #90)

This work is under verification on main for a future release and is not yet part of a published tag.

## Deployment Model

The production portal is served inside the Narwhal cluster at `https://portal.local.narwhal.internal` through the APISIX gateway.

A local development loop is available with:

```bash
git clone https://github.com/dasomel/narwhal-portal.git
cd narwhal-portal
pnpm install
pnpm dev
```

For cluster-based development, the project also supports Skaffold HMR. Production image workflows can use the in-cluster Gitea → Kaniko → Harbor path, avoiding a local Docker daemon for the normal deployment flow.

## Design Principles

### Preserve authoritative sources

Argo CD, Kubernetes, Keycloak, and other platform services keep ownership of their resources. The Portal is a user-facing integration layer, not a competing source of truth.

### Use platform domains

Users should not need to understand every upstream product to answer platform questions. Concepts such as Application, Service, Catalog, Security, and Governance create a consistent IDP vocabulary.

### Expose operational boundaries

GitOps ownership, policy violations, authentication state, certificate state, and failure conditions should be visible in the UI rather than hidden behind an upstream product boundary.

### Connect Day-0 and Day-2

Onboarding, Catalog, Templates, Tools, and operational dashboards are part of the same workbench so the portal spans from initial access to ongoing operations.

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [Portal Overview](/oss/en/narwhal-portal/overview) | Role and user scenarios |
| Architecture | [Portal Architecture](/oss/en/narwhal-portal/architecture) | Application/data flow |
| Getting Started | [Development Setup](/oss/en/narwhal-portal/getting-started) | pnpm, environment, Skaffold |
| Operations | [Deployment & Operations](/oss/en/narwhal-portal/operations) | Build, deployment, health |
| ADR | [Architecture Decision Records](/oss/en/narwhal-portal/adr) | Technical decisions and trade-offs |

## Project Relationship

<Mermaid chart={`flowchart TB
  READY["kube-ready-box"] --> CLUSTER["Narwhal Cluster"]
  CLUSTER --> PLATFORM["GitOps · SSO · Observability · Storage · Security"]
  CLUSTER --> PORTAL["Narwhal Portal"]
  PORTAL --> UX["Developer / Operator UX"]`} />
