---
title: "Narwhal Portal"
description: "Management portal for the Narwhal Kubernetes Internal Developer Platform (IDP) cluster"
github: "https://github.com/dasomel/narwhal-portal"
tags: ["Next.js", "React", "Kubernetes", "IDP", "TypeScript", "Keycloak"]
order: 7
type: "own"
featured: true
problem: "A unified UI is needed to observe and control the status, application deployments, costs, and security of the Narwhal cluster at a glance"
solution: "Provides a custom Next.js-based unified management portal that consolidates cluster metrics, ArgoCD apps, and security scans into one place"
---

## Project Overview

**Narwhal Portal** is a management portal (Next.js) for the [Narwhal](/en/projects/narwhal) Kubernetes **Internal Developer Platform (IDP)** cluster. 

It acts as the web UI that operators and developers use to observe and operate the cluster. It is served in-cluster at `https://portal.local.narwhal.internal` via the cluster's APISIX gateway. It provides a unified interface for dashboards, application catalogs, cost visibility, security, and governance views.

## Key Features

| Menu | Function |
|------|----------|
| **Dashboard** | Cluster health, ArgoCD app status, alerts |
| **Onboarding** | kubeconfig issuance, getting-started guide |
| **Catalog / My Apps** | Deployed service catalog, per-user app view |
| **Nodes** | Cluster node inventory and status |
| **Cost** | Cost visibility and breakdown |
| **Security / Governance / Compliance** | Trivy vulnerability reports, scorecard, policies, RBAC, and audit views |
| **Architecture / Templates / Tools** | Node/namespace/service graph, scaffolding templates, platform tools grid |
| **Settings** | Users, routes, certificates, and policies management |

*(Note: Routes live under `src/app/(dashboard)/`; backing API routes under `src/app/api/`.)*

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Styling** | TailwindCSS 4 + shadcn/ui |
| **Data** | TanStack Query (server) + Zustand (client) |
| **Auth** | NextAuth 5 (beta) + Keycloak OIDC |
| **Cache** | Valkey (ioredis) |
| **Secrets** | OpenBao Agent Injector |
| **Package Manager** | pnpm (@10.27.0) |

## Architecture & Roles

The portal applies Role-Based Access Control (RBAC) based on 4 roles (`cluster-admin`, `developer`, `viewer`, `guest`) and uses Keycloak for OIDC integration. It also supports i18n (Korean/English) via cookie-based switching.

For detailed system design and component interactions, refer to the [Architecture documentation](/en/docs/narwhal-portal-architecture).

## Quick Start & Deployment

You can run the local development server with the following commands:

```bash
pnpm install
pnpm dev
```

It also provides an in-cluster HMR development loop (`pnpm run dev:skaffold`) utilizing Skaffold and Kaniko, which requires no local Docker. For the full development environment setup, check out the [Development guide](/en/docs/narwhal-portal-development). For the actual cluster deployment process, refer to the [Deployment guide](/en/docs/narwhal-portal-deployment).

## References

- **GitHub Repository**: [dasomel/narwhal-portal](https://github.com/dasomel/narwhal-portal)
- **Narwhal Cluster**: [IDP Cluster Project](/en/projects/narwhal)
- **Documentation**:
  - [Architecture](/en/docs/narwhal-portal-architecture)
  - [Development Guide](/en/docs/narwhal-portal-development)
  - [Deployment Guide](/en/docs/narwhal-portal-deployment)
