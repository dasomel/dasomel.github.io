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

- **Next.js 16 / React 19** — App Router application
- **TypeScript** — typed frontend/API boundaries
- **Tailwind CSS 4 / shadcn/ui** — reusable admin UI
- **TanStack Query / Zustand** — server/client state
- **Keycloak OIDC** — authentication and sessions
- **Valkey** — application cache
- **OpenBao Agent Injector** — runtime secrets injection
- **Skaffold / Kaniko** — Kubernetes inner-loop development and in-cluster image builds

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
