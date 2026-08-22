---
title: "Narwhal Portal"
description: "Cloud-native unified management portal for Narwhal IDP (Next.js 16 + React 19)"
github: "https://github.com/dasomel/narwhal-portal"
tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "IDP", "gRPC", "Keycloak"]
order: 7
type: "own"
featured: true
problem: "Managing dozens of disparate component dashboards causes operational fragmentation and poor developer UX"
solution: "A unified management portal built with Next.js 16 and gRPC providing centralized visibility and operational control"
---

## Project Overview

**Narwhal Portal** is the central control plane UI and developer workbench for the Narwhal Kubernetes IDP.

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS, it seamlessly integrates Keycloak OIDC authentication with type-safe gRPC backend communications.

### Key Highlights

- **Next.js 16 & React 19**: Modern architecture combining Server Components with responsive client UI
- **Keycloak OIDC Federation**: Enterprise identity integration and token-based RBAC
- **gRPC / Protocol Buffers**: High-performance, type-safe communication with cluster services
- **Skaffold Live Reload**: Rapid inner-loop container development on local Kubernetes
- **Design System**: Accessible UI built with Radix primitives and Tailwind CSS

---

## Architecture Diagram

```text
  Browser (Developer / Admin)
             │
             ▼ HTTPS / OIDC
  ┌───────────────────────────────────────────────┐
  │  Narwhal Portal (Next.js 16 App Router)       │
  │  - Keycloak Auth Session Verification         │
  │  - Dashboard Server Components                │
  │  - Developer Workbench Client UI              │
  └──────────────────────┬────────────────────────┘
                         │
                         ▼ gRPC / Proto
  ┌───────────────────────────────────────────────┐
  │  Narwhal IDP Backend & Control Plane Services │
  │  (Kubernetes API · Gitea · ArgoCD · Keycloak) │
  └───────────────────────────────────────────────┘
```

---

## Getting Started

```bash
# 1. Clone repository
git clone https://github.com/dasomel/narwhal-portal.git
cd narwhal-portal

# 2. Install dependencies
pnpm install

# 3. Start local development server
pnpm dev

# Or run with Skaffold live reload on Kubernetes
skaffold dev
```

---

## Documentation Index

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [Portal Overview](/oss/en/narwhal-portal/overview) | Architectural philosophy and developer workflows |
| **Architecture** | [Portal Architecture](/oss/en/narwhal-portal/architecture) | Next.js 16 layout, gRPC clients, and OIDC sessions |
| **Getting Started** | [Development Setup](/oss/en/narwhal-portal/getting-started) | pnpm setup, environment variables, and Skaffold |
| **Operations** | [Deployment & Operations](/oss/en/narwhal-portal/operations) | Multi-stage Docker builds, health probes, and config |
| **ADRs** | [Architecture Decision Records](/oss/en/narwhal-portal/adr) | Skaffold dev workflow and cost-basis decisions |
