---
title: Portal Architecture
description: Next.js 16 App Router structure, gRPC communication, and OIDC session models.
project: Narwhal Portal
path: narwhal-portal/architecture
order: 1201
lastModified: 2026-08-27
---

# Portal Architecture

Narwhal Portal utilizes a modern web architecture ensuring tight integration with cluster control planes.

## Technology Stack

- **Frontend Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & Design System**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **Authentication**: NextAuth.js with Keycloak OpenID Connect federation
- **Backend Communication**: Protocol Buffers (`.proto`), gRPC-web, and Envoy gRPC-JSON transcoding

<Mermaid chart={`flowchart TB
  BROWSER["Browser\nReact 19 Client Components"] -->|"HTTPS · session cookie"| NEXT["Next.js 16 Server\nApp Router · SSR"]
  KEYCLOAK["Keycloak OIDC"] -.->|"JWT / session verification"| NEXT
  NEXT -->|"gRPC-web / HTTP2"| GATEWAY["Envoy Gateway / APISIX\ngRPC transcoder"]
  GATEWAY -->|"native gRPC"| CORE["Narwhal Control Plane\nGo services · Kubernetes API"]
  CORE -.->|"platform state / operations"| NEXT`} />

In this design the **Browser–Next.js boundary owns the user session**, **Next.js–Gateway carries web-friendly gRPC traffic**, and **Gateway–Control Plane uses native gRPC**. Keycloak is modeled separately as the identity plane rather than as part of the primary data path.
