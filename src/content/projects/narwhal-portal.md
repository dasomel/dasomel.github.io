---
title: "Narwhal Portal"
description: "Narwhal Kubernetes Internal Developer Platform을 위한 운영·개발자 워크벤치"
github: "https://github.com/dasomel/narwhal-portal"
tags: ["Kubernetes", "IDP", "Next.js", "React", "TypeScript", "Keycloak", "GitOps", "Platform Engineering"]
order: 7
type: "own"
featured: true
problem: "Kubernetes IDP를 구성하는 GitOps, SSO, 모니터링, 스토리지, 보안 컴포넌트는 각각의 UI를 제공하지만 플랫폼 전체 상태와 사용자 작업 흐름을 하나의 운영 화면에서 이해하기 어려움"
solution: "Narwhal 클러스터의 상태·애플리케이션·노드·카탈로그·보안·비용·거버넌스 정보를 하나의 Next.js 기반 포털로 통합하고, 백엔드 API와 Kubernetes 환경을 통해 day-2 운영 경험을 단순화"
---

## 프로젝트 소개

**Narwhal Portal**은 Narwhal Kubernetes Internal Developer Platform을 위한 중앙 관리 포털입니다. Narwhal이 Kubernetes, GitOps, SSO, Observability, Storage, Security와 같은 플랫폼 구성요소를 제공한다면, Portal은 사용자가 그 플랫폼을 실제로 이해하고 운영하기 위한 **통합 운영면(Operational Surface)**을 제공합니다.

포털은 특정 OSS 화면을 복제하는 대신, 플랫폼의 여러 신호를 하나의 사용자 경험으로 묶는 데 초점을 둡니다. 클러스터 상태, Argo CD 애플리케이션, 노드, 보안, 비용, 거버넌스, 서비스 카탈로그와 같은 정보는 각각의 원천 시스템을 기준으로 하되, 사용자가 문제의 위치와 다음 행동을 빠르게 파악할 수 있도록 중앙화합니다.

### 핵심 기능

| 영역 | 역할 |
|---|---|
| Dashboard | 클러스터 건강 상태, Argo CD 앱 상태, Alert 등 플랫폼 전반 요약 |
| Onboarding | 사용자용 시작 가이드와 kubeconfig 발급 흐름 |
| Catalog / My Apps | 배포된 서비스 카탈로그와 사용자별 애플리케이션 관점 제공 |
| Nodes | 노드 목록과 상태, 리소스 현황 확인 |
| Cost | 네임스페이스 및 워크로드 비용 가시화 |
| Security / Compliance | 취약점, 보안 정책, RBAC 및 감사 관련 정보 확인 |
| Governance | Scorecard, DORA 및 운영 성숙도 관련 정보 |
| Architecture | 서비스/클러스터 관계와 구조를 시각적으로 탐색 |
| Templates / Tools | 반복적인 플랫폼 작업을 위한 개발자 도구 진입점 |
| Settings | 사용자, 라우트, 인증서, 정책 등 플랫폼 설정 관리 |

## 플랫폼 내 위치

<Mermaid chart={`flowchart TB
  IDP["Narwhal IDP\nKubernetes · GitOps · SSO · Observability · Storage · Security"]
  IDP -->|"platform APIs / cluster state"| PORTAL["Narwhal Portal\nNext.js + React"]
  PORTAL --> DASH["Dashboard"]
  PORTAL --> APPS["Catalog / My Apps"]
  PORTAL --> OPS["Nodes / Cost"]
  PORTAL --> SEC["Security / Governance"]
  PORTAL --> TOOLS["Architecture / Tools"]
  PORTAL -->|"day-2 experience"| USER["Developer / Operator"]`} />

Portal은 Narwhal 클러스터와 분리된 별도 제품이 아니라 **Narwhal 플랫폼의 day-2 운영 및 개발자 경험 계층**입니다. 따라서 Narwhal과 함께 사용할 때 가장 큰 가치가 발생합니다.

## 기술 스택

- **Next.js `^16.3.1` / React `19.2.8`** — App Router 기반 포털 애플리케이션
- **TypeScript `^6.0.3`** — UI와 API 경계의 타입 안전성
- **Tailwind CSS `4.3.3` / shadcn/ui** — 재사용 가능한 관리 화면 구성
- **TanStack Query / Zustand** — 서버 상태와 클라이언트 상태 관리
- **NextAuth `5.0.0-beta.30` + Keycloak OIDC** — 인증 및 플랫폼 사용자 세션 통합
- **Valkey** — 애플리케이션 캐시 계층 (전용 pub/sub 클라이언트로 fail-fast 캐시 클라이언트의 timeout/retry 제약을 분리)
- **OpenBao Agent Injector** — 런타임 Secret 주입
- **Skaffold / Kaniko** — Kubernetes 기반 inner-loop 개발과 클러스터 내부 이미지 빌드
- **Vitest** — CI에 연결된 unit/regression suite. Playwright 기반 browser-level e2e는 아직 계획 단계로, main 구현으로 주장하지 않음(`docs/IMPLEMENTATION-STATUS-ko.md`, 2026-09-14 기준)
- **pnpm `10.27.0`** (`packageManager`로 고정)

## 현재 상태

**`dasomel/narwhal-portal` 저장소는 아카이브되었고, 포털 코드는 [`dasomel/narwhal`의 `portal/`](https://github.com/dasomel/narwhal/tree/main/portal) 디렉토리로 이동했습니다**(아카이브 저장소 README 기준: 커밋 415건 history를 `git-filter-repo`로 이관, 열린 이슈는 narwhal #356~#382로 이전). 버전은 narwhal 저장소의 `portal/vX.Y.Z` 태그로 관리되며, GitHub Release는 v1.1.1부터 "Portal v1.1.x" 제목으로 발행됩니다. 컨테이너 이미지 이름은 그대로 `ghcr.io/dasomel/narwhal-portal`입니다.

최신 릴리스는 **Portal v1.1.2**(`portal/v1.1.2`, 2026-10-26)입니다.

- **v1.1.2 (2026-10-26)**: 프로덕션에서 Architecture > Cluster infrastructure 화면이 노드·파드·네임스페이스 0건으로 보이던 문제 수정(in-cluster projected 서비스 계정 토큰 파일 사용, narwhal#475), `zod`·`undici`를 공개된 advisory 이후 버전으로 상향
- **v1.1.1 (2026-10-23)**: Auth.js(`next-auth` 5.0.0-beta.32, `@auth/core` ^0.41.3)를 critical advisory 이후 버전으로 올리는 보안 패치, Next.js 16.4.2 · React 19.3.1 반영. 롤아웃 중 진행 중이던 OAuth 로그인은 한 번 실패하므로 재시도가 필요
- **v1.1.0 (2026-10-15, 태그만 · GitHub Release 없음)**: monorepo 이관 후 첫 버전. 프로덕션 Valkey TLS 인증 필수화, OpenBao 인증 방식 명시, provider 실패를 정상으로 가리지 않도록 write route 결과 구분 등 운영 자세 하드닝. 태그 1.0.18·1.0.19는 푸시됐으나 GitHub Release로 발행되지 않았고 v1.1.0이 1.0.17 이후 변경을 모두 포함

이전 저장소의 마지막 릴리스는 v1.0.17(2026-08-09)입니다. narwhal v1.3.0 GitOps 차트는 포털 이미지를 `1.1.0`으로, main 차트는 `1.1.2`로 핀 고정하고 있습니다.

## 개발 및 배포 모델

```bash
# 로컬 개발
git clone https://github.com/dasomel/narwhal.git
cd narwhal/portal
pnpm install
pnpm dev
```

운영 환경에서는 Narwhal 클러스터 내부에서 APISIX Gateway를 통해 `https://portal.local.narwhal.internal`로 제공됩니다. 일반적인 배포는 로컬 Docker 데몬에 의존하지 않고 Gitea → Kaniko → Harbor 흐름을 사용할 수 있으며, Skaffold 기반 HMR 개발 경로도 제공합니다.

## 설계 원칙

### 1. 원천 시스템은 계속 authoritative

Argo CD, Kubernetes, Keycloak 등 각 시스템이 소유한 상태를 Portal이 복제해 새로운 source of truth로 만들지 않습니다. Portal은 원천 상태를 조회하고 사용자에게 필요한 상관관계와 운영 맥락을 제공합니다.

### 2. 플랫폼 용어로 묶기

사용자가 각각의 OSS 제품 이름을 이해해야만 플랫폼을 운영할 수 있도록 만들지 않고, Application, Node, Service, Catalog, Security, Governance 같은 플랫폼 개념으로 표현합니다.

### 3. 운영 경계를 UI에 노출

권한, 인증서, GitOps ownership, 정책 위반, 장애 상태와 같은 제약조건을 숨기지 않고 운영 화면에 드러내어 잘못된 조작을 줄입니다.

### 4. 개발자 경험과 운영자 경험의 결합

Portal은 단순 관리자 Dashboard가 아니라 Onboarding, Catalog, Templates, Tools를 포함해 **Day-0부터 Day-2까지 연결되는 IDP Workbench**를 지향합니다.

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [포털 개요](/oss/narwhal-portal/overview) | 사용자 시나리오와 플랫폼 내 역할 |
| Architecture | [포털 아키텍처](/oss/narwhal-portal/architecture) | 애플리케이션 구조와 데이터 흐름 |
| Getting Started | [개발 환경](/oss/narwhal-portal/getting-started) | pnpm, 환경 설정, Skaffold |
| Operations | [운영 가이드](/oss/narwhal-portal/operations) | 배포, 이미지 빌드, 상태 확인 |
| ADR | [아키텍처 결정 기록](/oss/narwhal-portal/adr) | 개발/배포 선택과 trade-off |

## 프로젝트 관계

<Mermaid chart={`flowchart TB
  READY["kube-ready-box"] --> CLUSTER["Narwhal Cluster"]
  CLUSTER --> PLATFORM["GitOps · SSO · Observability · Storage · Security"]
  CLUSTER --> PORTAL["Narwhal Portal"]
  PORTAL --> UX["Developer / Operator UX"]`} />
