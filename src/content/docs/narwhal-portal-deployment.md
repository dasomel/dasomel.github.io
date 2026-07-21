---
title: "포털 배포 & 보안"
description: "Narwhal IDP 포털의 배포 전략과 클린 설치 시크릿 하드닝 절차"
project: "Narwhal Portal"
order: 203
lastModified: 2026-07-17
---

## 배포 전략

포털은 Harbor 레지스트리로 푸시되는 인-클러스터 Kaniko 빌드 파이프라인을 내장하고 있지만, 프로덕션 환경(iter20 버전부터 검증 완료)에서는 **사전 빌드된 핀(Pin) 고정 외부 이미지**를 사용하여 배포됩니다. Kaniko 빌드 루프는 선택적인 로컬 개발 도구로 격하되었습니다.

<Mermaid chart={`flowchart LR
  SRC["소스 코드"]
  
  subgraph DEV["선택적 개발 경로 (Kaniko)"]
    GITEA["In-cluster Gitea"]
    KAN["Kaniko Job"]
    HAR["harbor.local.narwhal.internal"]
  end

  subgraph PROD["실제 프로덕션 배포 경로 (GitOps)"]
    GHCR(["ghcr.io/dasomel/narwhal-portal:1.0.15<br/>(Pinned GHCR)"])
    ARGO["ArgoCD GitOps"]
    DEPLOY(["클러스터 배포"])
  end

  SRC -.->|"로컬 / 푸시"| GITEA
  GITEA -.->|"빌드"| KAN
  KAN -.->|"푸시"| HAR
  
  SRC -->|"CI/CD 퍼블리싱"| GHCR
  GHCR -->|"이미지 풀(Pull)"| ARGO
  ARGO -->|"Sync"| DEPLOY

  style GHCR fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style DEPLOY fill:#f0fdf4,stroke:#059669,color:#111
  style ARGO fill:#f0fdf4,stroke:#059669,color:#111
  style DEV fill:#fafafa,stroke:#d1d5db,color:#374151
  style PROD fill:#fafafa,stroke:#d1d5db,color:#374151
  style SRC fill:#fff,stroke:#9ca3af,color:#111
  style GITEA fill:#f9fafb,stroke:#d1d5db,color:#111
  style KAN fill:#f9fafb,stroke:#d1d5db,color:#111
  style HAR fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

- **배포 이미지**: `ghcr.io/dasomel/narwhal-portal:1.0.15`
- **인-클러스터 빌드 불필요**: 클러스터 내 리소스 소모 없이 직접 GHCR(GitHub Container Registry)에서 이미지를 풀(Pull) 받아 구동합니다.
- **베이스 이미지 핀 고정**: 자체 이미지를 빌드할 경우에도 Supply Chain 공격을 방지하기 위해 `Dockerfile` 내 `node:22-alpine` 및 `oven/bun:1.3.13-alpine` 베이스 이미지 선언부에 `@sha256:` 다이제스트 핀 고정을 필수적으로 적용해야 합니다.

## 시크릿 부트스트랩 (Clean Install)

클러스터 클린 설치 시 포털 기동에 필요한 `.env.local` 구성을 위해 전용 자동화 스크립트를 사용합니다.

```bash
./scripts/bootstrap-secrets.sh
```

- **자동 생성 키**: 안전하게 렌덤 생성되어 즉시 기록되는 시크릿입니다.
  - `AUTH_SECRET`
  - `VALKEY_PASSWORD`
  - `LIVE_INGEST_SECRET`
- **수동 입력 필요 키**: 생성된 `.env.local` 파일에 플레이스홀더(Placeholder)로 남아있으며, 인프라 관리자가 직접 콘솔에서 발급받아 환경변수를 치환해야 합니다.
  - `OIDC_CLIENT_SECRET` (Keycloak 포털 연동 OIDC 클라이언트)
  - `KEYCLOAK_ADMIN_CLIENT_SECRET` (Keycloak Service Account 용 클라이언트)
  - `OPENBAO_TOKEN` (OpenBao AppRole 접근 토큰)
  - `ARGOCD_TOKEN` (ArgoCD API 엑세스 토큰)
  - `K8S_SA_TOKEN` (클러스터 권한용 단기 SA 토큰)
  - `APISIX_API_KEY` (APISIX 게이트웨이 어드민 접근 키)

## 보안 하드닝 및 운영 설정

프로덕션 수준의 포털 운영을 만족하기 위한 필수 보안 감사 조치 내역입니다.

### 1. Keycloak OIDC 및 API 인증
- **OIDC 클라이언트**: 포털 사용자 로그인을 위해 `narwhal-portal` 클라이언트를 구성하며, Scopes는 `openid email profile groups`로 엄격히 제한합니다.
- **어드민 API 연동 (Service Account)**: 포털 백엔드가 사용자 목록 조회 등을 수행할 때는 일반 유저 자격 증명이 아닌 `idp-portal-admin` Service Account 클라이언트를 생성하여 `client_credentials` 방식으로 통신합니다. (보안 감사 결과에 따라 ROPC 그랜트 방식은 절대 사용을 금지합니다)

### 2. 통신 암호화 (TLS & HTTPS 강제)
- **Valkey (캐시)**: 평문 통신을 원천 차단합니다. 포털 코드는 환경변수 `VALKEY_TLS=true` 여부를 검사하며, `VALKEY_URL`에 TLS 스킴인 `rediss://`를 강제하고 `VALKEY_PASSWORD` 파라미터로 AUTH 인증 절차를 필수로 수행합니다.
- **OpenBao**: API 호출 시 `https://` (`OPENBAO_ADDR`) 통신이 강제 설정되며 HTTP 프로토콜을 이용한 시크릿 조회를 차단합니다.

### 3. 리소스 제어 및 권한 축소
- **ArgoCD 프로젝트 화이트리스트 제한**: 쉼표로 구분된 환경변수 `ARGOCD_DEVELOPER_PROJECTS` 값을 지정하여, `developer` 권한을 가진 사용자가 포털에서 Sync나 Rollback을 수행할 수 있는 대상 애플리케이션 프로젝트 스코프를 제한합니다.
- **단기 수명 토큰 적용 (TokenRequest API)**: 클러스터 API 인증 시, 만료 기한이 수 십 년(2036년 등)에 달하는 레거시 장기 토큰의 사용을 지양합니다. `expirationSeconds: 3600`이 지정된 Projected Volume 토큰을 읽어 들이거나, 임시로 `kubectl create token` 명령을 통해 발급한 1시간 만료 단기 토큰을 환경변수 에 주입하여 사용합니다.
- **Tuning Job 다이제스트 검증**: 클러스터 노드 관리를 위해 특권(privileged) 컨테이너로 스폰되는 튜닝 Job 이미지는 런타임 공격 방지를 위해 `TUNING_JOB_IMAGE=...@sha256:<64hex>` 형식의 엄격한 다이제스트 핀 검증을 거치며, 위반 시 실행이 거부됩니다.
