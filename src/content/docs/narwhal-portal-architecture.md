---
title: "포털 아키텍처"
description: "Narwhal IDP 포털의 프론트엔드 및 백엔드 아키텍처와 클러스터 통합 구조"
project: "Narwhal Portal"
order: 201
lastModified: 2026-07-17
---

## 핵심 스택 (Core Stack)

- **프레임워크**: Next.js 16 (App Router) + React 19
- **스타일링**: TailwindCSS 4 + shadcn/ui
- **데이터 레이어**: TanStack Query (서버 상태) + Zustand (클라이언트 상태)
- **인증**: NextAuth 5 (beta) + Keycloak OIDC
- **캐시**: Valkey (ioredis 기반)
- **패키지 매니저**: pnpm (`10.27.0` 버전으로 고정)

## 서버 및 클라이언트 컴포넌트 경계

- **기본값**: 모든 컴포넌트는 Server Component를 기본으로 사용합니다.
- **Client Component**: `useState`, `useEffect`, `onClick`과 같은 클라이언트 측 기능이 필수적인 경우에만 최상단에 `"use client"` 지시어를 선언합니다.

## 캐시 전략

모든 외부 API 호출은 성능 향상과 인프라 부하 감소를 위해 Valkey 캐시 레이어를 통과합니다.

<Mermaid chart={`flowchart TB
  REQ["페이지 / API 라우트"]
  CACHE(["Valkey 캐시<br/>{service}:{resource}"])
  API["클러스터 서비스<br/>Keycloak, ArgoCD 등"]
  RES["응답 반환"]

  REQ -->|"cacheGet"| CACHE
  CACHE -->|"HIT (캐시 존재)"| RES
  CACHE -.->|"MISS / 캐시 장애<br/>(Non-fatal)"| API
  API -->|"데이터 패치 및<br/>cacheSet"| RES

  style CACHE fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style REQ fill:#f0fdf4,stroke:#059669,color:#111
  style API fill:#f9fafb,stroke:#d1d5db,color:#111
  style RES fill:#f0fdf4,stroke:#059669,color:#111
`} />

- **캐시 흐름**: `cacheGet` 시도 → Miss 발생 시 외부 API fetch → 성공 시 `cacheSet`
- **장애 허용(Non-fatal failure)**: 캐시 서버 통신에 실패하더라도 애플리케이션 장애로 이어지지 않고, 직접 원본 API를 호출하도록 폴백(Fallback) 됩니다.
- **캐시 키 명명 규칙**: `{service}:{resource}` 형식을 따릅니다.
  ```text
  # 예시
  keycloak:users
  argocd:apps
  ```

## 인증 및 권한 통제 (RBAC)

포털 접근은 Keycloak 기반 OIDC 연동으로 이루어지며, 사용자는 4개의 권한(Role)으로 세분화됩니다. 각 권한은 `nav.tsx` 내 `menuItems[].roles` 구성 및 `tools.ts` 내 `PLATFORM_TOOLS[].roles` 구성과 일치하게 관리되어야 합니다.
- `cluster-admin`
- `developer`
- `viewer`
- `guest`

## 다국어 지원 (i18n)

포털 내 UI 텍스트는 하드코딩되지 않으며, 모두 i18n 시스템을 통해 렌더링됩니다.
- **지원 언어**: 한국어(`ko`), 영어(`en`) 딕셔너리(`src/lib/i18n.ts`)
- **로케일 관리**: 사용자 로케일 상태는 브라우저 쿠키(`locale`)에 저장되며, 기본값은 `ko`입니다.
- **Server Component 사용법**:
  ```typescript
  import { getLocale } from "@/lib/i18n-server";
  // ...
  t(locale, "key");
  ```
- **Client Component 사용법**:
  ```typescript
  import { useT } from "@/lib/i18n-client";
  // ...
  const t = useT();
  t("key");
  ```

## 라우트 및 디렉터리 구조

포털의 주요 뷰와 API는 다음 구조 하에 위치합니다.
- **UI 페이지 (`src/app/(dashboard)/`)**: 대시보드 기능을 담당하는 `alerts`, `architecture`, `argocd`, `catalog`, `cluster`, `compliance`, `cost`, `governance`, `metrics`, `my-apps`, `nodes`, `onboarding`, `security`, `settings`, `tools` 등의 경로를 포함합니다.
- **API 라우트 (`src/app/api/`)**: 백엔드 통합을 처리합니다. 클라이언트(프론트엔드)가 안전하게 소비할 수 있도록 모든 API 응답 형태(Response Shape)는 TypeScript 인터페이스 규약으로 정의됩니다.

## 클러스터 서비스 통합

포털은 단독으로 동작하지 않으며, 클러스터의 코어 플랫폼 도구들과 깊게 연동됩니다.

<Mermaid chart={`flowchart LR
  PORTAL(["Narwhal Portal<br/>허브"])
  
  subgraph SVCS["클러스터 서비스"]
    KC["Keycloak"]
    ARGO["ArgoCD"]
    APIX["APISIX"]
    BAO["OpenBao"]
    PROM["Prometheus &<br/>Alertmanager"]
    FALCO["Falco"]
  end

  PORTAL -->|"OIDC 인증 / 사용자"| KC
  PORTAL -->|"GitOps 앱 상태"| ARGO
  PORTAL -->|"게이트웨이 라우팅"| APIX
  PORTAL -->|"시크릿 주입"| BAO
  PORTAL -->|"메트릭 / 경고"| PROM
  PORTAL -->|"보안 정책 탐지"| FALCO

  style PORTAL fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style SVCS fill:#fafafa,stroke:#d1d5db,color:#374151
  style KC fill:#f9fafb,stroke:#d1d5db,color:#111
  style ARGO fill:#f9fafb,stroke:#d1d5db,color:#111
  style APIX fill:#f9fafb,stroke:#d1d5db,color:#111
  style BAO fill:#f9fafb,stroke:#d1d5db,color:#111
  style PROM fill:#f9fafb,stroke:#d1d5db,color:#111
  style FALCO fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

- **Keycloak**: OIDC 인증 인가 및 사용자/그룹 정보 연동.
- **ArgoCD**: GitOps 애플리케이션 상태 조회. (포털 개발 시 발생할 수 있는 매니페스트 드리프트는 `ignoreDifferences`로 처리되며, 기준 소스는 `gitops/charts/narwhal-apps/templates/`를 참조합니다)
- **APISIX**: API 게이트웨이 및 포털 인그레스 라우팅.
- **OpenBao**: Agent Injector를 통한 안전한 시크릿(Secret) 런타임 주입.
- **Prometheus & Alertmanager**: 실시간 클러스터 메트릭(PromQL) 쿼리 및 활성 경고 표출.
- **Falco**: 런타임 보안 정책 탐지 로그 연동.
