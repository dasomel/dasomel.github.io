---
title: "KubeMetal"
description: "Apple Silicon Hybrid MLOps Desktop Application (Tauri v2 + Rust + React + Apple MLX)"
github: "https://github.com/dasomel/kubemetal"
tags: ["Kubernetes", "MLOps", "AppleSilicon", "MLX", "Tauri", "Rust", "React", "LLM"]
order: 13
type: "own"
featured: true
problem: "Running Kubernetes MLOps workloads on Apple Silicon Macs inside VMs isolates models from native GPU/NPU Unified Memory acceleration"
solution: "A hybrid MLOps desktop application bridging a lightweight K8s control plane with host-native Apple MLX compute via Tauri v2 IPC"
---

## Project Overview

**KubeMetal** is a hybrid MLOps desktop application engineered to seamlessly combine Kubernetes orchestration with Apple MLX hardware acceleration on Apple Silicon Macs.

Built with Tauri v2 (Rust backend) and React (TypeScript frontend), it delivers container flexibility alongside host-native Unified Memory (up to 128GB+) compute performance.

### Key Highlights

- **Hybrid Compute Architecture**: Lightweight K3s control plane in VM coupled with host-native Apple MLX compute engine
- **Tauri v2 IPC Bridge**: Secure, high-throughput asynchronous communication between Rust backend and React UI
- **Local LLM Fine-Tuning & Inference**: LoRA adapter training, GGUF/MLX quantization, and low-latency inference
- **Full MLOps Lifecycle**: Model downloads, quantization pipelines, model serving CRDs, and live telemetry
- **Hardware Optimization**: Tailored memory pressure mitigations across M1/M2/M3/M4 Pro/Max/Ultra architectures

---

## Architecture Diagram

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

## Getting Started

```bash
# 1. Clone repository
git clone https://github.com/dasomel/kubemetal.git
cd kubemetal

# 2. Install dependencies
pnpm install

# 3. Start Tauri v2 desktop app in development mode
pnpm tauri dev
```

---

## Documentation Index

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [KubeMetal Overview](/oss/en/kubemetal/overview) | Hybrid MLOps architecture and Apple Silicon compute |
| **Architecture** | [System Architecture](/oss/en/kubemetal/architecture) | Tauri v2 bridge, host MLX engine, and K3s |
| **MLOps Guide** | [MLOps Pipelines](/oss/en/kubemetal/mlops) | Local LLM fine-tuning, LoRA adapters, and quantization |
| **Getting Started** | [App Setup & Installation](/oss/en/kubemetal/getting-started) | Desktop app compilation and model catalog setup |
| **Operations** | [Performance & Operations](/oss/en/kubemetal/operations) | Unified Memory tuning, compatibility matrix, and tests |
