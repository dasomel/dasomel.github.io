---
title: "Portal Architecture"
description: "Frontend and backend architecture of the Narwhal IDP Portal and its cluster integration"
project: "Narwhal Portal"
order: 201
lastModified: 2026-07-17
---

## Core Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Data Layer**: TanStack Query (server state) + Zustand (client state)
- **Authentication**: NextAuth 5 (beta) + Keycloak OIDC
- **Cache**: Valkey (based on ioredis)
- **Package Manager**: pnpm (pinned to version `10.27.0`)

## Server & Client Component Boundary

- **Default**: All components are Server Components by default.
- **Client Component**: The `"use client"` directive should be declared at the top level only when client-side features such as `useState`, `useEffect`, or `onClick` are strictly necessary.

## Cache Strategy

All external API calls pass through the Valkey cache layer to improve performance and reduce infrastructure load.

<Mermaid chart={`flowchart TB
  REQ["Page / API Route"]
  CACHE(["Valkey Cache<br/>{service}:{resource}"])
  API["Cluster Service<br/>Keycloak, ArgoCD, etc."]
  RES["Return Response"]

  REQ -->|"cacheGet"| CACHE
  CACHE -->|"HIT (Cached)"| RES
  CACHE -.->|"MISS / Cache Failure<br/>(Non-fatal)"| API
  API -->|"Fetch Data &<br/>cacheSet"| RES

  style CACHE fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style REQ fill:#f0fdf4,stroke:#059669,color:#111
  style API fill:#f9fafb,stroke:#d1d5db,color:#111
  style RES fill:#f0fdf4,stroke:#059669,color:#111
`} />

- **Cache Flow**: Attempt `cacheGet` → on miss, fetch from external API → on success, execute `cacheSet`
- **Non-fatal failure**: If communication with the cache server fails, the application does not crash; it automatically falls back to making the direct API call.
- **Cache Key Naming Convention**: Follows the `{service}:{resource}` format.
  ```text
  # Example
  keycloak:users
  argocd:apps
  ```

## Authentication & Role-Based Access Control (RBAC)

Portal access is authenticated via Keycloak OIDC, and users are categorized into four distinct roles. These roles must be strictly mapped and maintained consistently within the `menuItems[].roles` configuration in `nav.tsx` and the `PLATFORM_TOOLS[].roles` in `tools.ts`.
- `cluster-admin`
- `developer`
- `viewer`
- `guest`

## Internationalization (i18n)

UI text within the portal is never hardcoded and is exclusively rendered via the i18n system.
- **Supported Languages**: Korean (`ko`) and English (`en`) dictionaries (`src/lib/i18n.ts`)
- **Locale Management**: The user's locale state is stored in a browser cookie (`locale`), with `ko` as the default value.
- **Usage in Server Components**:
  ```typescript
  import { getLocale } from "@/lib/i18n-server";
  // ...
  t(locale, "key");
  ```
- **Usage in Client Components**:
  ```typescript
  import { useT } from "@/lib/i18n-client";
  // ...
  const t = useT();
  t("key");
  ```

## Route and Directory Structure

The primary views and APIs of the portal are located in the following structures:
- **UI Pages (`src/app/(dashboard)/`)**: Contains routes responsible for dashboard features such as `alerts`, `architecture`, `argocd`, `catalog`, `cluster`, `compliance`, `cost`, `governance`, `metrics`, `my-apps`, `nodes`, `onboarding`, `security`, `settings`, and `tools`.
- **API Routes (`src/app/api/`)**: Handles backend integrations. Every API response shape is defined by a strict TypeScript interface contract to ensure safe consumption by the client (frontend).

## Cluster Service Integration

The portal does not operate in isolation; it integrates deeply with the core platform tools within the cluster.

<Mermaid chart={`flowchart LR
  PORTAL(["Narwhal Portal<br/>Hub"])
  
  subgraph SVCS["Cluster Services"]
    KC["Keycloak"]
    ARGO["ArgoCD"]
    APIX["APISIX"]
    BAO["OpenBao"]
    PROM["Prometheus &<br/>Alertmanager"]
    FALCO["Falco"]
  end

  PORTAL -->|"OIDC Auth / Users"| KC
  PORTAL -->|"GitOps App Status"| ARGO
  PORTAL -->|"Gateway Routing"| APIX
  PORTAL -->|"Secret Injection"| BAO
  PORTAL -->|"Metrics / Alerts"| PROM
  PORTAL -->|"Security Detection"| FALCO

  style PORTAL fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style SVCS fill:#fafafa,stroke:#d1d5db,color:#374151
  style KC fill:#f9fafb,stroke:#d1d5db,color:#111
  style ARGO fill:#f9fafb,stroke:#d1d5db,color:#111
  style APIX fill:#f9fafb,stroke:#d1d5db,color:#111
  style BAO fill:#f9fafb,stroke:#d1d5db,color:#111
  style PROM fill:#f9fafb,stroke:#d1d5db,color:#111
  style FALCO fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

- **Keycloak**: OIDC authentication authorization and user/group information mapping.
- **ArgoCD**: Fetches GitOps application statuses. (Manifest drift during portal development is bypassed using `ignoreDifferences`, and the source of truth points to `gitops/charts/narwhal-apps/templates/`).
- **APISIX**: Functions as the API gateway and handles portal ingress routing.
- **OpenBao**: Safely injects runtime secrets via the Agent Injector.
- **Prometheus & Alertmanager**: Exposes real-time cluster metrics via PromQL queries and active alerts.
- **Falco**: Integrates threat detection event logs based on runtime security policies.
