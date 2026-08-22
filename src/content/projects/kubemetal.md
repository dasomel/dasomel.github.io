---
title: "KubeMetal"
description: "Apple Silicon 하이브리드 MLOps 데스크톱 앱 (Tauri v2 + Rust + React + Apple MLX)"
github: "https://github.com/dasomel/kubemetal"
tags: ["Kubernetes", "MLOps", "AppleSilicon", "MLX", "Tauri", "Rust", "React", "LLM"]
order: 13
type: "own"
featured: true
problem: "Apple Silicon Mac에서 쿠버네티스 기반 MLOps 워크로드를 구동할 때 가상화 VM 내부에서는 Apple Silicon GPU/NPU의 Unified Memory 하드웨어 가속을 활용하기 어려움"
solution: "K3s/Colima 기반 K8s 컨트롤 플레인과 macOS 호스트 네이티브 Apple MLX 연산 엔진을 Tauri v2 IPC로 결합한 하이브리드 MLOps 데스크톱 플랫폼 구축"
---

## 프로젝트 소개

**KubeMetal**은 Apple Silicon Mac 환경에서 Kubernetes 오케스트레이션과 Apple MLX 하드웨어 가속을 완벽하게 결합한 차세대 하이브리드 MLOps 데스크톱 애플리케이션입니다.

Tauri v2 (Rust 백엔드)와 React (TypeScript 프론트엔드)를 기반으로 구축되었으며, 컨테이너 가상화의 유연성과 macOS 호스트의 초고속 Unified Memory(최대 128GB+) 하드웨어 연산 성능을 동시에 제공합니다.

### 핵심 기술 및 특징

- **하이브리드 컴퓨트 아키텍처**: VM 내부의 가벼운 K3s 컨트롤 플레인 + 호스트 네이티브 Apple MLX/Metal 연산 분리
- **Tauri v2 IPC 브리지**: Rust 비동기 런타임과 React UI 간의 안전하고 빠른 네이티브 시스템 통신
- **로컬 LLM 파인튜닝 & 추론**: LoRA 어댑터 결합, GGUF/MLX 양자화 모델 로딩 및 고속 분산 추론
- **MLOps 라이프사이클 관리**: 모델 가중치 다운로드, 양자화 변환, 파이프라인 배포 및 리소스 실시간 시각화
- **하드웨어 호환성 최적화**: M1/M2/M3/M4 Pro/Max/Ultra 칩셋별 메모리 압박 완화 및 대역폭 극대화

---

## 아키텍처 다이어그램

```text
  ┌────────────────────────────────────────────────────────┐
  │  KubeMetal Desktop Application (Tauri v2 + React)     │
  │  - Model Catalog & Fine-Tuning UI                      │
  │  - Pipeline Visualizer & Resource Metrics              │
  └─────────────┬────────────────────────────┬─────────────┘
                │ Native IPC                 │ K8s API
                ▼                            ▼
  ┌───────────────────────────┐   ┌────────────────────────┐
  │  macOS Host MLX Engine    │   │  Local K8s (K3s/Colima)│
  │  - Apple Silicon GPU/NPU  │   │  - Control Plane       │
  │  - Unified Memory Pool    │   │  - Pipeline Operators  │
  │  - LoRA / MLX Inference   │   │  - Model Serving CRD   │
  └───────────────────────────┘   └────────────────────────┘
```

---

## 시작하기 (Quickstart)

```bash
# 1. 저장소 클론
git clone https://github.com/dasomel/kubemetal.git
cd kubemetal

# 2. 의존성 설치
pnpm install

# 3. Tauri v2 데스크톱 앱 개발 모드 실행
pnpm tauri dev
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 설명 |
|---|---|---|
| **개요 (Overview)** | [KubeMetal 개요](/oss/kubemetal/overview) | 하이브리드 MLOps 아키텍처 및 Apple Silicon 최적화 |
| **아키텍처 (Architecture)** | [시스템 아키텍처](/oss/kubemetal/architecture) | Tauri v2 브리지, 호스트 MLX 엔진 및 K3s 컨트롤러 |
| **MLOps 파이프라인 (MLOps)** | [MLOps 가이드](/oss/kubemetal/mlops) | 로컬 LLM 파인튜닝, LoRA 어댑터, 양자화 추론 |
| **시작하기 (Getting Started)** | [앱 설치 및 설정](/oss/kubemetal/getting-started) | 데스크톱 앱 빌드, 모델 카탈로그 초기화 |
| **운영 가이드 (Operations)** | [성능 최적화 & 운영](/oss/kubemetal/operations) | Unified Memory 튜닝, 호환성 매트릭스, E2E 검증 |
