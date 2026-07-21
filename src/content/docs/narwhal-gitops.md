---
title: "GitOps"
description: "ArgoCD와 Gitea를 활용한 App-of-Apps 패턴 기반의 선언적 인프라 관리"
project: "Narwhal"
order: 103
lastModified: 2026-07-17
---

## Narwhal GitOps 개요

Narwhal은 클러스터 내의 모든 플랫폼 컴포넌트(네트워킹, 서비스 메시, 관측성, 스토리지, 보안, 인증 및 개발자 포털 등)를 GitOps 방식으로 관리합니다. 모든 설정은 Kubernetes/Helm 매니페스트로 선언되며, ArgoCD의 **App-of-Apps 패턴**을 통해 지속적으로 동기화됩니다.

- **단일 진실 공급원 (Single Source of Truth):** Git 저장소(`gitops/` 디렉터리)에 없는 리소스는 클러스터에서 실행되지 않습니다.
- **자동 복구 (Self-Heal):** `kubectl apply`를 통해 클러스터에 직접 변경을 가하면, ArgoCD의 `selfHeal: true` 정책에 의해 몇 분 내에 Git의 상태로 자동 복구(Revert)됩니다.

## 저장소 구조 (App-of-Apps 패턴)

ArgoCD는 단일 루트 Application에서 시작하여 전체 플랫폼을 배포합니다. 실제 디렉터리 구조와 역할은 다음과 같습니다.

<Mermaid chart={`flowchart TB
  ROOT["idp-apps<br/>(Root Application)"]
  APPS["narwhal-apps<br/>(Helm Chart)"]
  PLAT["narwhal-platform<br/>(Sub-Chart Meta App)"]
  
  G1["Networking<br/>APISIX, MetalLB, cert-manager"]
  G2["Observability<br/>Prometheus, Loki, Tempo"]
  G3["Storage & Security<br/>SeaweedFS, OpenBao, Kyverno"]
  G4["Service Mesh & DevTools<br/>Istio, Harbor, Headlamp"]
  
  M1["APISIX Routes"]
  M2["Narwhal Portal"]
  M3["Istio Policies & Keycloak CR"]
  
  ROOT -->|"watches gitops/apps"| APPS
  APPS -->|"generates"| G1
  APPS -->|"generates"| G2
  APPS -->|"generates"| G3
  APPS -->|"generates"| G4
  APPS -->|"generates"| PLAT
  
  PLAT -->|"generates"| M1
  PLAT -->|"generates"| M2
  PLAT -->|"generates"| M3

  style ROOT fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style APPS fill:#f0fdf4,stroke:#059669,color:#111
  style PLAT fill:#f0fdf4,stroke:#059669,color:#111
  style G1 fill:#f9fafb,stroke:#d1d5db,color:#111
  style G2 fill:#f9fafb,stroke:#d1d5db,color:#111
  style G3 fill:#f9fafb,stroke:#d1d5db,color:#111
  style G4 fill:#f9fafb,stroke:#d1d5db,color:#111
  style M1 fill:#f9fafb,stroke:#d1d5db,color:#111
  style M2 fill:#f9fafb,stroke:#d1d5db,color:#111
  style M3 fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

```text
gitops/
├── apps/
│   └── app-of-apps.yaml           # 최상위 ArgoCD Application (진입점)
├── charts/
│   ├── narwhal-apps/              # 각 플랫폼 컴포넌트별 Application을 렌더링하는 Helm 차트
│   │   └── templates/
│   │       ├── apisix.yaml, metallb.yaml, cert-manager.yaml
│   │       ├── istio-base.yaml, istiod.yaml, ztunnel.yaml
│   │       ├── prometheus-stack.yaml, loki.yaml, tempo.yaml
│   │       ├── harbor.yaml, headlamp.yaml, kyverno.yaml, openbao.yaml
│   │       ├── narwhal-platform.yaml  # 하위 차트를 렌더링하는 메타 앱
│   │       └── ... (그 외 지원 컴포넌트)
│   └── narwhal-platform/          # Narwhal이 자체 관리하는 1차 매니페스트 차트
│       └── templates/
│           ├── apisix-routes.yaml         # APISIX 라우팅 룰
│           ├── argocd-config.yaml         # ArgoCD OIDC/RBAC 설정
│           ├── istio-ambient-policies.yaml# mTLS 및 메시 정책
│           ├── keycloak-cr.yaml           # Keycloak CR 및 테마 설정
│           └── narwhal-portal-k8s.yaml    # 포털 배포 설정
└── resources/                     # 독립적인 YAML 리소스 (NetworkPolicy 등)
```

이러한 3단계 트리 구조를 통해 개별 컴포넌트의 라이프사이클을 독립적이면서도 통일된 방식으로 관리할 수 있습니다.

## 변경 사항 반영 프로세스 (Push-to-Deploy)

클러스터의 ArgoCD는 로컬 환경이나 외부 GitHub 저장소가 아닌, **클러스터 내부에 배포된 Gitea 저장소**를 바라보고 있습니다 (`http://gitea-http.devtools.svc.cluster.local:3000/gitea-admin/narwhal-gitops.git`).

<Mermaid chart={`flowchart LR
  DEV["Developer<br/>(Edit gitops/ files)"]
  GIT["Gitea<br/>(In-cluster Git repo)"]
  ARGO["ArgoCD<br/>(automated sync)"]
  K8S["Kubernetes<br/>(Cluster State)"]

  DEV -->|"push-to-gitea.sh"| GIT
  GIT -->|"detects changes"| ARGO
  ARGO -->|"applies (selfHeal)"| K8S
  
  style DEV fill:#fff,stroke:#9ca3af,color:#111
  style GIT fill:#f0fdf4,stroke:#059669,color:#111
  style ARGO fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style K8S fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

따라서 설정을 변경하고 클러스터에 반영하려면 다음 단계를 따라야 합니다:

1. **파일 수정:** `gitops/` 디렉터리 하위의 리소스를 수정합니다. (예: `gitops/charts/narwhal-platform/templates/narwhal-portal-k8s.yaml`)
2. **Gitea에 푸시:** 변경 사항을 클러스터 내부의 Gitea 저장소로 푸시해야 합니다.
3. **ArgoCD 동기화:** 푸시된 사항을 ArgoCD가 감지하여 `automated` 동기화 정책을 통해 클러스터에 반영합니다.

이를 자동화하기 위해 제공되는 스크립트를 사용할 수 있습니다:

```bash
# 특정 파일의 변경 사항만 Gitea로 푸시 (권장)
ARGOCD_APP=narwhal-portal scripts/gitops/push-to-gitea.sh \
  "fix(portal-rbac): grant metrics.k8s.io read" \
  charts/narwhal-platform/templates/narwhal-portal-k8s.yaml

# gitops/ 디렉터리 전체를 동기화
scripts/gitops/push-to-gitea.sh "chore: sync all gitops"
```

> **주의:** 로컬에서 `git commit`만 수행하거나 외부 저장소에 푸시하는 것만으로는 클러스터에 배포되지 않습니다. 반드시 제공된 스크립트를 통해 내부 Gitea로 푸시해야 합니다.

## GitOps 원칙 및 규칙

- **버전 고정 (SemVer Pinning):** `:latest`와 같은 변경 가능한(Mutable) 태그는 사용하지 않습니다. 이미지나 차트의 버전이 명시적으로 변경되어야 ArgoCD가 Manifest의 텍스트 차이(Diff)를 감지하고 동기화를 트리거합니다.
- **GitOps 전용 변경:** 모든 지속적인 변경은 반드시 `gitops/` 저장소를 통해 이루어져야 합니다. 트러블슈팅을 위한 일회성 `kubectl edit`은 다음 재조정(Reconcile) 주기에 덮어씌워집니다.
