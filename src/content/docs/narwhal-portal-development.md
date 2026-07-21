---
title: "포털 개발 워크플로우"
description: "Skaffold, Kaniko 및 pnpm을 활용한 in-cluster 포털 개발 환경 가이드"
project: "Narwhal Portal"
order: 202
lastModified: 2026-07-17
---

## 개발 워크플로우 디자인 근거 (ADR-001)

포털은 Istio ambient mesh (ztunnel), OpenBao, Keycloak, ArgoCD, Prometheus 등 6~8개의 클러스터 내부 인프라에 직접적으로 의존합니다. 로컬 Docker 실행을 배제하고 클러스터 내 빌드 및 배포 워크플로우를 채택한 이유는 다음과 같습니다.
- **Pod 관점 동작 재현**: Istio 쿠키 처리, Secret 마운트, 서비스 간 DNS 해석 등을 운영 환경과 동일하게 보장.
- **ArgoCD GitOps 공존**: Skaffold로 배포하는 임시 `dev` 이미지 및 환경변수 변경이 ArgoCD의 selfHeal로 인해 원복되는 현상을 방지하기 위해, `gitops/apps/idp-portal.yaml`에 `ignoreDifferences`를 추가하여 image와 env 필드의 diff를 무시합니다.
- **빠른 피드백(반복 속도)**: 파일 동기화 기능을 활용하여 코드 저장 시 재빌드 없이 컨테이너 내부로 덮어쓰며, 2~3초 내에 Next.js HMR이 즉시 반영됩니다.

## 실행 방식 및 HMR (Hot Module Replacement)

`pnpm`을 전용 패키지 매니저로 사용하며, `.env.local` 시크릿 셋업 이후 아래 명령어로 클러스터 내 라이브 개발 환경을 활성화합니다.

Skaffold를 통한 인클러스터 파일 동기화와 HMR 흐름은 다음과 같습니다.

<Mermaid chart={`flowchart TB
  DEV["로컬 파일 수정<br/>IDE"]
  SYNC["Skaffold 파일 동기화<br/>(sync.manual)"]
  REBUILD["Kaniko 이미지 재빌드<br/>(Harbor)"]
  POD(["클러스터 내<br/>실행 중인 컨테이너"])
  BROWSER["브라우저<br/>(HMR 적용)"]

  DEV -->|"파일 저장"| SYNC
  DEV -.->|"설정 변경 시<br/>전체 빌드"| REBUILD
  SYNC -->|"동적 덮어쓰기<br/>(재빌드 없음)"| POD
  REBUILD -.->|"파드 재시작"| POD
  POD -->|"포트 포워딩<br/>(2~3초 내 반영)"| BROWSER

  style POD fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style DEV fill:#fff,stroke:#9ca3af,color:#111
  style SYNC fill:#f0fdf4,stroke:#059669,color:#111
  style REBUILD fill:#f9fafb,stroke:#d1d5db,color:#111
  style BROWSER fill:#fff,stroke:#9ca3af,color:#111
`} />

```bash
pnpm run dev:skaffold
```

- **Kaniko 빌드 (클러스터 내부)**: 로컬 Docker 데몬 없이 `Dockerfile.dev`를 참조하여 클러스터 내부 Kaniko Pod이 빌드를 수행합니다. 베이스 이미지는 파일 동기화 도구(GNU tar)를 위해 데비안 기반의 `node:22-slim`을 사용합니다.
- **Skaffold 파일 동기화**: `skaffold.yaml`의 `sync.manual` 규칙에 따라 `src/**/*.{ts,tsx,js,jsx,css}`, `public/**`, `next.config.ts` 파일 변경 시 Harbor 이미지 재빌드 없이 실행 중인 컨테이너(`/app`)로 파일이 직접 복사됩니다.
- **포트 포워딩**: 실행 후 컨테이너의 3000번 포트가 호스트의 `localhost:3000`으로 자동 연결됩니다.

### ⚠️ 첫 빌드 시 Kaniko OOM 회피 팁

클린 설치 직후 첫 Kaniko 빌드 시, Harbor의 레이어 캐시가 없어 `node_modules` 전체 스냅샷을 생성하다가 노드(6GB) 제한으로 인해 전역 OOM(Out of Memory)이 발생할 수 있습니다.
- **해결 방안**: 캐시 워밍업을 위한 최초 빌드 한 번만 워커 노드 한 대(예: `narwhal-worker-2`)를 비우고(`kubectl drain`), `skaffold.yaml`의 `build.cluster` 설정에 `nodeSelector` 및 `tolerations`를 임시로 추가하여 Kaniko 빌드 파드가 자원을 독점하도록 강제합니다. 이후 캐시가 쌓이면 증분 빌드가 적용되므로 6GB 노드에서도 HMR 및 재실행이 정상 동작합니다.

## 디버깅 설정 (Node Inspector)

실행 중인 서버 컴포넌트나 API 라우트에 디버거를 연결하려면 디버깅 전용 프로필로 실행합니다.

```bash
pnpm run debug:skaffold
```

이 프로필은 `post-deploy` 훅을 사용하여 컨테이너 배포 직후 `NODE_OPTIONS=--inspect=0.0.0.0:9229` 환경변수를 주입하며, `9229` 포트를 로컬로 추가 포워딩합니다.
- **IntelliJ IDEA**: [Run] → [Edit Configurations] → [+] → [Attach to Node.js/Chrome] 선택 후 포트를 `9229`로 설정. (Cloud Code 플러그인 연동 권장)
- **VS Code**: `.vscode/launch.json` 파일에 `request: "attach"`, `port: 9229`, `remoteRoot: "/app"` 옵션 등을 추가하여 연동.

## 수동 운영 배포 플로우

정규 배포는 GitOps 및 사전 빌드 이미지를 활용하지만, Skaffold 미사용 시 로컬 시스템의 Docker 환경을 이용해 이미지를 빌드하고 롤아웃할 수 있습니다. (운영용 멀티 스테이지 `Dockerfile` 적용)

```bash
# 로컬 Docker를 활용하여 빌드 및 Harbor에 푸시 (:latest)
make all

# 수동으로 디플로이먼트 재시작 적용
kubectl -n devtools rollout restart deployment/idp-portal
```
