---
title: System Architecture
description: Tauri v2 IPC bridge, host MLX acceleration engine, and local K8s control plane.
project: KubeMetal
path: kubemetal/architecture
order: 1801
lastModified: 2026-08-23
---

# System Architecture

KubeMetal combines desktop UI, host compute, and Kubernetes control planes.

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
