---
title: "Narwhal Portal"
description: "Narwhal Kubernetes Internal Developer Platform (IDP) 클러스터를 위한 관리 포탈"
github: "https://github.com/dasomel/narwhal-portal"
tags: ["Next.js", "React", "Kubernetes", "IDP", "TypeScript", "Keycloak"]
order: 7
type: "own"
featured: true
problem: "Narwhal 클러스터의 상태, 앱 배포, 비용, 보안 등을 한눈에 파악하고 제어할 수 있는 통합 UI가 필요함"
solution: "클러스터 메트릭, ArgoCD, 보안 스캔 등을 한 곳에 모은 자체 제작 Next.js 기반의 통합 관리 포탈 제공"
---

## 프로젝트 소개

**Narwhal Portal**은 [Narwhal](/ko/projects/narwhal) Kubernetes **Internal Developer Platform (IDP)** 클러스터를 위한 관리 포탈(Next.js)입니다. 

운영자와 개발자가 클러스터를 관찰하고 운영하는 데 사용하는 웹 UI로, 클러스터의 APISIX 게이트웨이를 통해 클러스터 내부에서 `https://portal.local.narwhal.internal` 주소로 서비스됩니다. 대시보드, 카탈로그, 비용 관리, 보안 및 거버넌스 뷰 등을 단일 인터페이스에서 통합 제공합니다.

## 주요 기능

| 메뉴 | 기능 |
|------|------|
| **Dashboard** | 클러스터 헬스, ArgoCD 앱 상태, 경고/알림 |
| **Onboarding** | kubeconfig 발급, 시작 가이드 |
| **Catalog / My Apps** | 배포된 서비스 카탈로그, 사용자별 앱 뷰 |
| **Nodes** | 클러스터 노드 인벤토리 및 상태 |
| **Cost** | 비용 시각화 및 가시성 |
| **Security / Governance / Compliance** | Trivy 취약점 리포트, 스코어카드, 정책, RBAC 및 감사 뷰 |
| **Architecture / Templates / Tools** | 노드·네임스페이스·서비스 그래프, 템플릿, 플랫폼 도구 그리드 |
| **Settings** | 사용자, 라우트, 인증서, 정책 관리 |

*(참고: 라우트는 `src/app/(dashboard)/` 아래에 위치하며, API 라우트는 `src/app/api/` 아래에 구현되어 있습니다.)*

## 기술 스택

| 레이어 | 기술 |
|-------|------------|
| **프레임워크** | Next.js 16 (App Router) + React 19 |
| **스타일링** | TailwindCSS 4 + shadcn/ui |
| **데이터** | TanStack Query (서버) + Zustand (클라이언트) |
| **인증** | NextAuth 5 (베타) + Keycloak OIDC |
| **캐시** | Valkey (ioredis) |
| **시크릿** | OpenBao Agent Injector |
| **패키지 매니저** | pnpm (@10.27.0) |

## 아키텍처 및 역할

포탈은 4가지 역할(`cluster-admin`, `developer`, `viewer`, `guest`)에 기반한 RBAC 접근 제어를 적용하며, OIDC 연동은 Keycloak을 사용합니다. 다국어(i18n)도 지원하여 쿠키를 통해 한국어/영어 전환이 가능합니다. 

자세한 시스템 설계와 컴포넌트 간 상호작용은 [아키텍처 문서](/ko/docs/narwhal-portal-architecture)를 참조하세요.

## 시작하기 및 배포

로컬 개발 환경에서는 아래의 명령어로 실행할 수 있습니다.

```bash
pnpm install
pnpm dev
```

Skaffold와 Kaniko를 활용하여 로컬 Docker 없이 클러스터 내부에서 핫 리로드를 지원하는 HMR 개발 루프(`pnpm run dev:skaffold`)도 제공합니다. 전체 개발 환경 구성은 [개발 문서](/ko/docs/narwhal-portal-development)를, 실제 클러스터 배포 과정은 [배포 문서](/ko/docs/narwhal-portal-deployment)를 참고하세요.

## 참고 링크

- **GitHub Repository**: [dasomel/narwhal-portal](https://github.com/dasomel/narwhal-portal)
- **Narwhal 클러스터**: [IDP 클러스터 프로젝트](/ko/projects/narwhal)
- **문서 가이드**:
  - [아키텍처](/ko/docs/narwhal-portal-architecture)
  - [개발 가이드](/ko/docs/narwhal-portal-development)
  - [배포 가이드](/ko/docs/narwhal-portal-deployment)
