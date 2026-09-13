---
title: 포털 아키텍처
description: Next.js 16 App Router 구조, gRPC 클라이언트 통신 및 OIDC 인증 세션 모델.
project: Narwhal Portal
path: narwhal-portal/architecture
order: 1201
lastModified: 2026-08-27
---

# 포털 아키텍처

Narwhal Portal은 프론트엔드와 플랫폼 백엔드 간의 효율적인 데이터 교환을 위해 모던 웹 아키텍처를 채택했습니다.

## 기술 스택 계층

- **프론트엔드 프레임워크**: Next.js 16 (App Router), React 19, TypeScript
- **스타일링 & 컴포넌트**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **인증 (Authentication)**: NextAuth.js + Keycloak OIDC OpenID Connect Federation
- **백엔드 통신**: Protocol Buffers (`.proto`), gRPC-web, Envoy gRPC-JSON 트랜스코더

<Mermaid chart={`flowchart TB
  BROWSER["Browser\nReact 19 Client Components"] -->|"HTTPS · session cookie"| NEXT["Next.js 16 Server\nApp Router · SSR"]
  KEYCLOAK["Keycloak OIDC"] -.->|"JWT / session verification"| NEXT
  NEXT -->|"gRPC-web / HTTP2"| GATEWAY["Envoy Gateway / APISIX\ngRPC transcoder"]
  GATEWAY -->|"native gRPC"| CORE["Narwhal Control Plane\nGo services · Kubernetes API"]
  CORE -.->|"platform state / operations"| NEXT`} />

이 구조에서 **Browser–Next.js 경계는 사용자 세션**, **Next.js–Gateway 경계는 웹 친화적 gRPC 통신**, **Gateway–Control Plane 경계는 native gRPC** 역할을 담당합니다. Keycloak은 데이터 경로가 아니라 인증 신뢰를 제공하는 identity plane으로 분리됩니다.
