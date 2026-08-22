---
title: Portal Architecture
description: Next.js 16 App Router structure, gRPC communication, and OIDC session models.
project: Narwhal Portal
path: narwhal-portal/architecture
order: 1201
lastModified: 2026-08-23
---

# Portal Architecture

Narwhal Portal utilizes a modern web architecture ensuring tight integration with cluster control planes.

## Technology Stack

- **Frontend Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & Design System**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **Authentication**: NextAuth.js with Keycloak OpenID Connect federation
- **Backend Communication**: Protocol Buffers (`.proto`), gRPC-web, and Envoy gRPC-JSON transcoding

```text
Browser (React 19 Client Components)
             │
             ▼ HTTPS / Cookie
  ┌────────────────────────────────────────────────────────┐
  │  Next.js 16 Server (App Router / SSR)                  │
  │  - Keycloak JWT Session Verification                   │
  │  - Server Component Data Fetching                      │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼ gRPC-web / HTTP2
  ┌────────────────────────────────────────────────────────┐
  │  Envoy Gateway / APISIX gRPC Transcoder                │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼ Native gRPC
  ┌────────────────────────────────────────────────────────┐
  │  Narwhal Control Plane Core Services (Go / K8s API)    │
  └────────────────────────────────────────────────────────┘
```
