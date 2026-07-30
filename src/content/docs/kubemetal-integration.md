---
title: "외부 클러스터 연동"
description: "기존 Kubernetes 클러스터에 KubeMetal을 붙이는 두 티어 — 기본 에이전트 온리(L1)와 옵트인 풀스택 배포(L2), GitOps 경로와 폐쇄망 지원"
project: "KubeMetal"
order: 503
lastModified: 2026-07-30
---

## 통합 티어 — 기본은 에이전트 온리

스택의 집은 앱 자신의 k3s(colima)입니다. 이미 운영 중인 외부 클러스터는 기본적으로 **관찰·진단·운영 대상**으로만 연결하며, 클러스터 안의 어떤 것도 Mac의 로컬 스택에 의존해서는 안 됩니다.

| 티어 | 범위 | 클러스터에 설치되는 것 |
|------|------|----------------------|
| **L1 — 에이전트 온리 (기본)** | 관찰·진단·운영 | kagent CRD + 에이전트. 브리지 없음 |
| **L2 — 풀스택 (옵트인)** | MLOps 스택까지 외부 클러스터에 배치 | 전용 `kubemetal` 네임스페이스 + 호스트 브리지 |

L1이 기본인 이유는 실측입니다. L2의 편입 비용(터미널 경로 확인, 미러 레지스트리, ArgoCD 경계 조정)이 클러스터 수에 비례해 반복된다는 것이 확인됐습니다.

## L1 — 에이전트 온리 (기본 경로)

```bash
make kagent-up CONTEXT=<kubeconfig-컨텍스트>   # kagent 0.9.12 helm 설치 (kagent ns)
```

이후 앱의 **kagent 운영** 탭에서 컨텍스트별 진단 조회와 에이전트(security / promql / observability) 켜고 끄기를 수행합니다. kagent UI는 `make forward`로 8090에 열립니다.

이 경로는 실제 운영 중인 6노드 K3s HA 클러스터(Narwhal)에서 검증됐습니다 — 서명된 패키징 앱에서 사전점검부터 kagent 진단 조회까지 in-app 실측(2026-07-30).

## L2 — 기존 클러스터에 풀스택 배포 (옵트인)

Colima를 새로 띄우지 않고 이미 있는 Kubernetes 클러스터에 MLOps 스택을 올리는 고급 경로입니다. **클러스터는 상수가 아니라 설정입니다** — 렌더 스크립트가 네임스페이스·브리지·StorageClass·이미지 레지스트리의 모든 대상별 치환을 소유하며, `scripts/k8s/kustomization.yaml`이 유일한 매니페스트 목록입니다.

외부 클러스터는 `default`가 아닌 전용 `kubemetal` 네임스페이스를 씁니다. `default`는 colima 전용으로 남깁니다.

<Mermaid chart={`flowchart TB
  PF["1. make preflight<br/>도달성 / StorageClass / ArgoCD / Kyverno / 브리지 후보"]
  RD["2. make render<br/>적용 없이 결과만 확인"]
  GATE{"BRIDGE_HOST<br/>검증됐나?"}
  REJ["렌더 거부<br/>(colima 전용 주소 유출 방지)"]
  ARGO{"대상 ns를<br/>ArgoCD가 소유?"}
  PV["3a. make provision<br/>직접 apply"]
  GO["3b. make export-gitops<br/>파일만 내려놓음"]

  PF --> RD --> GATE
  GATE -->|"아니오"| REJ
  GATE -->|"예"| ARGO
  ARGO -->|"아니오"| PV
  ARGO -->|"예"| GO

  style PF fill:#eff6ff,stroke:#2563eb,color:#111
  style RD fill:#eff6ff,stroke:#2563eb,color:#111
  style GATE fill:#fffbeb,stroke:#d97706,color:#111
  style REJ fill:#fef2f2,stroke:#dc2626,color:#111
  style ARGO fill:#fffbeb,stroke:#d97706,color:#111
  style PV fill:#f0fdf4,stroke:#059669,stroke-width:2px,color:#111
  style GO fill:#f0fdf4,stroke:#059669,stroke-width:2px,color:#111
`} />

### 1. 사전점검

도달성, 기본 StorageClass, 대상 네임스페이스를 소유한 ArgoCD Application, Kyverno Enforce 정책, 호스트 브리지 후보를 실측으로 확인합니다.

```bash
make preflight CONTEXT=<컨텍스트> NAMESPACE=kubemetal
```

### 2. 렌더링 확인

적용하지 않고 결과만 봅니다.

```bash
make render CONTEXT=<컨텍스트> BRIDGE_HOST=<호스트IP> STORAGE_CLASS=<SC>
```

`BRIDGE_HOST`는 **1단계에서 확인한 후보 중 실제로 도달이 검증된 주소**여야 합니다. 생략하면 렌더가 거부됩니다 — 지정하지 않으면 colima 전용 주소가 그대로 실려 나가 파드가 조용히 죽기 때문입니다. 검증되지 않은 브리지 주소는 추측을 배포하는 대신 렌더를 거부하는 쪽을 택합니다.

### 3. 적용

```bash
make provision CONTEXT=<컨텍스트> BRIDGE_HOST=<호스트IP> STORAGE_CLASS=<SC>
```

이 풀스택 경로는 같은 6노드 클러스터에서 Kyverno Enforce 정책, 사설 미러 레지스트리(Docker Hub pull 제한 우회), ArgoCD GitOps(selfHeal 경계) 환경을 통과해 실측 검증됐습니다(2026-07-26, 터미널 경로).

## 사내 레지스트리 / 미러

폐쇄망이거나 Docker Hub 익명 pull 제한에 걸리는 클러스터라면 `IMAGE_REGISTRY`를 붙여 Docker Hub 이미지를 재지정합니다.

```bash
make provision CONTEXT=<컨텍스트> BRIDGE_HOST=<호스트IP> IMAGE_REGISTRY=<호스트[/프로젝트]>
```

## ArgoCD가 대상 네임스페이스를 소유한 경우

직접 apply는 selfHeal이 되돌립니다. 이때는 GitOps 경로를 씁니다 — KubeMetal은 **파일만 내려놓고 Git push는 하지 않습니다.**

```bash
make export-gitops NARWHAL_DIR=/path/to/narwhal CONTEXT=<컨텍스트> BRIDGE_HOST=<호스트IP>
```

푸시와 동기화는 GitOps 저장소의 소유자가 판단할 일로 남깁니다.

## 코드 서명이 필요한 이유

패키징 앱에서 LAN 클러스터에 접근하려면 **안정된 코드 서명이 필요합니다.** ad-hoc 서명은 빌드마다 식별자가 바뀌기 때문에 macOS 로컬 네트워크 권한이 고정되지 않고, LAN kubectl이 `no route to host`로 막힙니다.

- 키체인에 유효한 codesigning 아이덴티티가 있으면 `make app`이 자동으로 그것으로 서명합니다. 이 Mac 한정으로는 자가서명 인증서로 충분합니다(실측 2026-07-29).
- 타인 배포용은 Developer ID를 씁니다.

```bash
make app SIGNING_IDENTITY="Developer ID Application: …"
```

## 폐쇄망(Air-Gap) 지원

**Air-Gap 관리** 탭에서 오프라인 번들(이미지·차트·바이너리)을 미리 내려받아 폐쇄망에 반입하고, 오프라인 설치와 자산 버전 확인을 수행합니다. 오프라인 기동 자체는 별도 게이트로 검증합니다.

```bash
make verify-airgap
```

## 트러블슈팅

```bash
kubectl --context <컨텍스트> get pods -n kubemetal
kubectl --context <컨텍스트> get application -A | grep kubemetal   # ArgoCD 소유 여부
```

관련 문서: [아키텍처](/ko/docs/kubemetal-architecture) · [사용법](/ko/docs/kubemetal-usage)
