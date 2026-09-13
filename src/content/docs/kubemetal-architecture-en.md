---
title: System Architecture
description: Tauri v2 IPC bridge, host MLX acceleration engine, and local K8s control plane.
project: KubeMetal
path: kubemetal/architecture
order: 1801
lastModified: 2026-08-27
---

# System Architecture

KubeMetal combines desktop UI, host compute, and Kubernetes control planes.

<Mermaid chart={`flowchart TB
  UI["KubeMetal Desktop UI\nReact 19 · Tailwind CSS · Tauri v2"]
  UI -->|"Tauri v2 IPC"| MLX["macOS Host MLX Engine\nApple MLX · Metal · LoRA · MLX inference"]
  UI -->|"Kubernetes client"| K8S["Local Kubernetes\nColima · K3s control plane"]
  K8S --> OPS["MLOps operators / CRDs"]
  K8S --> PIPE["Model pipelines / services"]
  MLX -.->|"host-accelerated model lifecycle"| PIPE`} />

The key architectural decision is the separation of responsibilities: **Kubernetes manages platform control and service lifecycle, while the macOS host provides Apple Silicon accelerated compute**. The desktop UI presents both execution planes as one product experience.
