---
title: "KubeMetal"
description: "Apple Silicon에서 Kubernetes Control Plane과 macOS MLX Compute를 결합하는 하이브리드 MLOps 데스크톱 앱"
github: "https://github.com/dasomel/kubemetal"
tags: ["Apple Silicon", "macOS", "Tauri", "Rust", "React", "Kubernetes", "K3s", "Colima", "MLX", "MLOps"]
order: 13
type: "own"
featured: true
problem: "Apple Silicon의 Metal GPU 연산을 Linux VM 내부 Kubernetes Pod로 직접 전달하기 어렵기 때문에 일반적인 '모든 것을 Kubernetes 안에서 실행'하는 MLOps 구조가 로컬 Mac에서는 하드웨어를 제대로 활용하지 못함"
solution: "K3s/Colima는 MLOps control plane으로 사용하고 실제 GPU-bound MLX fine-tuning/serving은 macOS host process에서 실행하는 control/compute separation 모델을 데스크톱 UX로 제공"
---

## 프로젝트 소개

**KubeMetal**은 Apple Silicon Mac을 하나의 로컬 MLOps workstation으로 사용하는 하이브리드 데스크톱 애플리케이션입니다.

핵심 아이디어는 Kubernetes를 모든 작업의 실행 위치로 보지 않는 것입니다. K3s와 MLflow, SeaweedFS 같은 **control-plane / platform services는 Colima 기반 Kubernetes에서 실행**하고, Apple Silicon GPU/Metal을 사용하는 실제 ML computation은 **macOS host process에서 실행**합니다.

이 구조는 Apple Silicon에서 GPU를 Linux VM에 단순 passthrough하는 방식의 한계를 피하면서도, Kubernetes가 제공하는 선언적 배포·서비스 관리·관측성 패턴을 유지합니다.

## Control / Compute Separation

```text
                    KubeMetal Desktop
             ┌──────────────────────────┐
             │ Tauri v2 + React UI      │
             │ Dashboard / Pipeline     │
             │ Model Hub / MLX Studio   │
             └────────────┬─────────────┘
                          │
               ┌──────────┴───────────┐
               │                      │
               ▼                      ▼
      Kubernetes Control Plane     macOS Host Compute
      ┌──────────────────────┐     ┌──────────────────────┐
      │ K3s / Colima         │     │ MLX / Metal          │
      │ MLflow               │     │ LoRA Fine-tuning     │
      │ SeaweedFS            │     │ Model Serving        │
      │ manifests / services │     │ Host resources       │
      └──────────────────────┘     └──────────────────────┘
```

Kubernetes가 실험 추적과 artifact storage를 담당하고, 모델 계산량이 큰 작업은 host에서 수행합니다.

## 8개 사용자 작업 공간

| Tab | 역할 |
|---|---|
| Dashboard | RAM/CPU, Colima cluster lifecycle, MLOps stack provisioning, port-forward |
| kagent Ops | 외부 cluster의 agent-based diagnostics와 AI agent 관리 |
| Pipeline | cluster → provisioning → model → fine-tuning → registration → serving 흐름 |
| Model Hub | Hugging Face 검색 → host download → SeaweedFS upload → MLflow registration |
| MLX Studio | host MLX environment, LoRA fine-tuning, model serving |
| Data | ingestion DAG, chunking, LanceDB RAG, SeaweedFS backup, DVC |
| Access Console | MLflow / SeaweedFS 등 provisioned service 접근 |
| Air-Gap Management | image/chart/binary offline bundle 다운로드·설치·version verification |

## 외부 Kubernetes 통합

KubeMetal은 기존 Kubernetes cluster를 모두 로컬 stack으로 가져오려 하지 않습니다.

기본 D30 경로는 **agent-only integration**입니다.

```text
Existing Kubernetes Cluster
        │
        │ kagent agent
        ▼
  KubeMetal kagent Ops
        │
        └── diagnostics / security / PromQL / observability

KubeMetal local k3s
        └── MLflow / SeaweedFS / local MLOps control plane
```

실제 테스트에서는 6-node K3s HA cluster에서 diagnostics/preflight 경로를 확인했고, 앱의 기본 통합 모델을 “기존 cluster를 다시 배포하는 것”이 아니라 “관찰·진단 대상으로 연결하는 것”으로 정리했습니다.

Full-stack external deployment는 D26 opt-in 경로로 별도 제공합니다. 이 경우 target kubeconfig context, StorageClass, Kyverno policy, Argo CD ownership, host bridge reachability 등을 사전에 검사합니다.

## 왜 서명된 macOS App이 중요한가

KubeMetal은 Kubernetes API와 local network에 접근하는 desktop application이므로 macOS의 network/code-signing 경계가 실제 기능의 일부입니다.

개발 환경에서는 ad-hoc signing으로 인해 local network permission identity가 빌드마다 달라질 수 있고, 배포용으로는 안정적인 code-signing identity가 필요합니다. 따라서 프로젝트는 signed application과 external cluster access를 함께 고려합니다.

## Air-Gap

KubeMetal은 air-gapped 환경도 데스크톱 UI에서 관리 대상으로 포함합니다.

- container images
- Helm charts
- binaries
- asset versions
- offline bundle verification

즉 단순한 “로컬 ML launcher”가 아니라 **edge / disconnected MLOps workstation**까지 확장 가능한 제어면을 지향합니다.

## 성능 측정의 의미

실제 측정값은 프로젝트의 하드웨어 특성을 설명하는 reference로 사용됩니다.

2026-07-27~28 Apple M4 Pro / 64GB 환경에서 packaged app을 기준으로 다음과 같은 측정이 문서화되어 있습니다.

- VLM serving: 약 **196–198 tok/s**
- VLM TTFT: **442–767 ms**
- LoRA fine-tuning: **674.5M trainable params**, peak memory **8.7GB**
- 64GB host profile: K8s VM에 12GB/6CPU 수준 할당

이는 특정 모델의 절대 성능을 보장하는 benchmark가 아니라, **host-native compute와 VM control plane을 분리했을 때 얻을 수 있는 로컬 MLOps baseline**입니다.

## 개발 환경

```bash
git clone https://github.com/dasomel/kubemetal.git
cd kubemetal
pnpm install
pnpm tauri dev
```

기본적으로 macOS 14+ Apple Silicon, Homebrew, Colima, kubectl, Node 22+, pnpm, Rust toolchain이 필요합니다.

## 단계별 개발 상태

README 기준으로 Phase 1~3의 핵심 기능이 구현된 상태이며, 이후 작업은 외부 cluster integration, hardware guardrails, GitOps 경계와 같은 실제 환경의 운영 조건을 다루는 방향으로 이어집니다.

주요 완료 범위:

- Tauri v2 + Colima lifecycle
- MLflow / SeaweedFS provisioning
- Model Hub
- Host MLX LoRA fine-tuning
- model serving
- pipeline visualization
- unified access console
- packaged `.app` / `.dmg`
- thermal / memory / sleep guardrails

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [KubeMetal 개요](/oss/kubemetal/overview) | 제품 목적과 control/compute separation |
| Architecture | [아키텍처](/oss/kubemetal/architecture) | Tauri ↔ K3s ↔ host MLX 경계 |
| MLOps | [MLOps 가이드](/oss/kubemetal/mlops) | model lifecycle과 fine-tuning |
| Integration | [외부 클러스터 연계](/oss/kubemetal/integration) | D30/D26 통합 모델 |
| Usage | [사용 가이드](/oss/kubemetal/usage) | 데스크톱 작업 흐름 |
| Operations | [운영 가이드](/oss/kubemetal/operations) | signing, resource guardrails, troubleshooting |

## 프로젝트 관계

```text
Kube-Ready-Box / Kubernetes experience
                ↓
         Narwhal / cloud-native IDP

Apple Silicon Mac
        ↓
    KubeMetal
     ├── Kubernetes control plane
     └── native MLX compute
                ↓
      local / edge MLOps
```
