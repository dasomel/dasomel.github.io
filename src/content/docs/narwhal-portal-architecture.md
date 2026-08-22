---
title: 포털 아키텍처
description: Next.js 16 구조, gRPC 클라이언트 및 OIDC 흐름.
project: Narwhal Portal
path: narwhal-portal/architecture
order: 1200
lastModified: 2026-08-23
---

# 포털 아키텍처

Next.js App Router를 기반으로 서버 사이드 렌더링(SSR)과 클라이언트 상태 관리를 결합합니다.

## 기술 계층
- **Frontend**: Next.js 16, React 19, Tailwind CSS, Lucide Icons
- **Auth**: NextAuth / Keycloak OIDC OpenID Connect Federation
- **Backend Communication**: Protocol Buffers 컴파일된 gRPC-web 및 REST Gateway

## 관련 링크

- [Narwhal Portal 저장소](https://github.com/dasomel/narwhal-portal)
- [포털 홈](/oss/narwhal-portal/)
