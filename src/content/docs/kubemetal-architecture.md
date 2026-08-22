---
title: 시스템 아키텍처
description: Tauri v2 IPC 브리지, 호스트 MLX 가속 엔진 및 로컬 K8s 컨트롤 플레인 결합 구조.
project: KubeMetal
path: kubemetal/architecture
order: 1801
lastModified: 2026-08-23
---

# 시스템 아키텍처

KubeMetal의 하이브리드 아키텍처는 데스크톱 UI, 호스트 연산 엔진 및 K8s 제어 플레인을 유기적으로 결합합니다.

```text
  ┌────────────────────────────────────────────────────────┐
  │  KubeMetal Desktop UI (React 19 + Tailwind CSS)        │
  └─────────────┬────────────────────────────┬─────────────┘
                │ Tauri v2 IPC               │ K8s Client
                ▼                            ▼
  ┌───────────────────────────┐   ┌────────────────────────┐
  │  macOS Host MLX Engine    │   │  Local K8s (Colima)    │
  │  - Apple MLX Framework    │   │  - Control Plane (K3s) │
  │  - GPU/NPU Metal Shaders  │   │  - MLOps CRD Operators │
  │  - LoRA / MLX Inference   │   │  - Model Pipelines     │
  └───────────────────────────┘   └────────────────────────┘
```
