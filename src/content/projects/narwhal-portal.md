---
title: "Narwhal Portal"
description: "Narwhal IDP를 위한 클라우드 네이티브 통합 관리 포털 (Next.js 16 + React 19)"
github: "https://github.com/dasomel/narwhal-portal"
tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "IDP", "gRPC", "Keycloak"]
order: 7
type: "own"
featured: true
problem: "수십 개 플랫폼 컴포넌트의 상태, 릴리스, 사용자 권한 및 리소스를 개별 대시보드로 관리하는 데 따른 운영 분절"
solution: "Next.js 16과 gRPC 백엔드 기반으로 IDP 전반의 가시성과 운영 워크벤치를 제공하는 중앙 통합 포털 구축"
---

## 프로젝트 소개

**Narwhal Portal**은 Narwhal Kubernetes IDP의 중앙 제어 플레인과 개발자 워크벤치를 제공하는 현대적인 관리 포털 애플리케이션입니다.

Next.js 16, React 19, TypeScript 및 Tailwind CSS를 기반으로 구축되었으며, Keycloak OIDC 통합 인증과 gRPC/Protocol Buffers 기반의 고성능 플랫폼 백엔드 통신을 지원합니다.

### 핵심 기술 및 특징

- **Next.js 16 & React 19**: Server Components와 클라이언트 인터랙션이 조화된 고성능 아키텍처
- **Keycloak OIDC 연동**: 포털 접근 권한 및 플랫폼 API 요청에 대한 토큰 기반 보안 인가
- **gRPC / Protocol Buffers**: 마이크로서비스 및 플랫폼 에이전트 간의 타입 안전한 초고속 통신
- **Skaffold 개발 워크플로**: 로컬 쿠버네티스 환경에서의 컨테이너 실시간 핫리로딩 지원
- **선언적 컴포넌트 시스템**: Radix UI 및 Tailwind CSS 기반의 반응형 엔지니어링 대시보드

---

## 아키텍처 다이어그램

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

## 시작하기 (Quickstart)

```bash
# 1. 저장소 클론
git clone https://github.com/dasomel/narwhal-portal.git
cd narwhal-portal

# 2. 의존성 설치
pnpm install

# 3. 로컬 개발 서버 실행
pnpm dev

# 또는 Skaffold로 쿠버네티스에 실시간 핫리로딩 배포
skaffold dev
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 설명 |
|---|---|---|
| **개요 (Overview)** | [포털 개요](/oss/narwhal-portal/overview) | Narwhal Portal의 아키텍처 철학과 사용자 시나리오 |
| **아키텍처 (Architecture)** | [포털 아키텍처](/oss/narwhal-portal/architecture) | Next.js 16 구조, gRPC 클라이언트 및 OIDC 흐름 |
| **시작하기 (Getting Started)** | [개발 환경 설정](/oss/narwhal-portal/getting-started) | pnpm, 로컬 환경변수 및 Skaffold 실행 가이드 |
| **운영 가이드 (Operations)** | [배포 및 운영](/oss/narwhal-portal/operations) | Multi-stage 컨테이너 빌드, 헬스체크 및 환경변수 |
| **의사결정 기록 (ADR)** | [아키텍처 결정 기록](/oss/narwhal-portal/adr) | Skaffold 개발 워크플로 및 비용 최적화 ADR |
