---
title: "KubeMetal"
description: "Apple Silicon 전용 하이브리드 MLOps 데스크톱 앱 — K8s 제어면과 macOS 호스트 MLX 연산을 하나로"
github: "https://github.com/dasomel/kubemetal"
tags: ["MLOps", "Apple Silicon", "MLX", "Kubernetes", "K3s", "Tauri", "Rust", "React"]
order: 8
type: "own"
featured: true
problem: "Apple Silicon의 Metal GPU는 리눅스 VM으로 패스스루할 수 없어 Kubernetes Pod 안에서 MLX 연산을 수행하기 어려움"
solution: "MLflow·SeaweedFS·Prefect는 K3s 제어면에 두고 MLX GPU 연산은 macOS 호스트로 분리해 로컬 MLOps 전체 흐름을 제공"
---

## 프로젝트 소개

**KubeMetal**은 Apple Silicon Mac에서 Kubernetes 기반 MLOps와 네이티브 MLX GPU 연산을 한 애플리케이션으로 연결하는 **Tauri v2 + Rust + React/TypeScript** 데스크톱 프로젝트입니다.

핵심은 **Control Plane과 Compute Plane의 분리**입니다.

- **K3s/Colima**: MLflow, SeaweedFS, Prefect 3, kagent 등 제어·관리 컴포넌트
- **macOS 호스트**: MLX 기반 모델 다운로드, LoRA fine-tuning, inference serving

## 최근 구현 범위

### MLX fine-tuning / serving

MLX 엔진이 실제 동작하는 단계까지 구현됐습니다.

- MLX 환경 자동 점검/설정
- `mlx-lm` 기반 LoRA fine-tuning
- 진행률 및 loss 표시
- MLflow REST로 실험 기록
- `mlx_lm.server` 기반 로컬 serving
- start/stop 및 프로세스 종료 제어

실제 Apple Silicon 하드웨어에서 Qwen2.5-0.5B 4bit 다운로드 → LoRA fine-tuning → adapter 생성 → MLflow run 완료까지 smoke verification을 수행했습니다.

### Object Storage

기존 MinIO 경로를 **SeaweedFS** 기반 S3 스택으로 전환했습니다.

- S3 API: `8333`
- Filer UI: `8888`

## 앱 구성

| 탭 | 역할 |
|---|---|
| **Dashboard** | 호스트 리소스, Colima/K3s, MLOps 스택 상태 |
| **kagent** | 클러스터 AIOps 진단 및 agent 연결 |
| **Pipeline** | 다운로드 → fine-tuning → MLflow → serving 흐름 |
| **Model Hub** | Hugging Face → SeaweedFS → MLflow Registry |
| **MLX Studio** | MLX 환경, LoRA 학습, `mlx_lm.server` 제어 |
| **Data** | 수집 → 청킹 → LanceDB RAG → SeaweedFS, DVC |
| **Access Console** | 프로비저닝된 서비스 접근 및 health 확인 |
| **Air-Gap** | 이미지·차트·바이너리 오프라인 번들 관리 |

## 설계 원칙

```text
┌──────────────────────── K3s / Control ────────────────────────┐
│ MLflow │ SeaweedFS │ Prefect │ kagent │ Kubernetes resources │
└──────────────────────────────┬────────────────────────────────┘
                               │
                         host bridge
                               │
┌──────────────────────── macOS / Compute ──────────────────────┐
│ Apple Silicon GPU │ MLX │ mlx-lm │ mlx-vlm │ model serving   │
└────────────────────────────────────────────────────────────────┘
```

Apple Silicon의 GPU 제약 때문에 이 분리는 선택사항이 아니라 현재 아키텍처의 전제입니다.

## 외부 클러스터

외부 Kubernetes 클러스터에서는 기본적으로 **agent-only** 방식으로 연결하고, KubeMetal 자체 K3s를 독립적으로 유지합니다. 풀스택 배포는 명시적으로 선택하는 경로이며, 렌더링과 정책 검증 후 적용합니다.

## 기술 스택

TypeScript · Rust(Tauri v2) · Python · Colima/K3s · MLflow · SeaweedFS · Prefect 3 · MLX

## 기술 문서

[아키텍처](/ko/docs/kubemetal-architecture) · [사용법](/ko/docs/kubemetal-usage) · [외부 클러스터 연동](/ko/docs/kubemetal-integration)
