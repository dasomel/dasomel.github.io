---
title: 포털 아키텍처
description: Next.js 16 App Router 구조, gRPC 클라이언트 통신 및 OIDC 인증 세션 모델.
project: Narwhal Portal
path: narwhal-portal/architecture
order: 1201
lastModified: 2026-08-23
---

# 포털 아키텍처

Narwhal Portal은 프론트엔드와 플랫폼 백엔드 간의 효율적인 데이터 교환을 위해 모던 웹 아키텍처를 채택했습니다.

## 기술 스택 계층

- **프론트엔드 프레임워크**: Next.js 16 (App Router), React 19, TypeScript
- **스타일링 & 컴포넌트**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **인증 (Authentication)**: NextAuth.js + Keycloak OIDC OpenID Connect Federation
- **백엔드 통신**: Protocol Buffers (`.proto`), gRPC-web, Envoy gRPC-JSON 트랜스코더

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
