---
title: "KubeMetal"
description: "Apple Silicon-only hybrid MLOps desktop app — a K8s control plane (Colima/K3s) and macOS host MLX compute in one"
github: "https://github.com/dasomel/kubemetal"
tags: ["MLOps", "Apple Silicon", "MLX", "Kubernetes", "K3s", "Tauri", "Rust", "React"]
order: 8
type: "own"
featured: true
problem: "Apple Silicon's Metal GPU cannot be passed through to a Linux VM, leaving no way to run MLX compute inside a K8s pod"
solution: "Keep control (MLflow, SeaweedFS) in K3s pods and split GPU compute out to macOS host processes, running the full MLOps loop locally with no cloud GPU"
---

## Overview

KubeMetal is an **Apple Silicon-only hybrid MLOps desktop app**. It unifies a standard Kubernetes control plane with macOS host-native MLX compute in a single Tauri v2 (Rust) + React/TypeScript application.

The MLOps stack — MLflow, SeaweedFS — is deployed as pods inside a lightweight K3s cluster running on Colima (`vz` + `virtiofs`), managed with standard K8s manifests. Actual compute such as MLX-based fine-tuning and serving runs directly as macOS host processes rather than inside K8s pods.

## Control/Compute Separation — A Hardware Constraint, Not a Preference

This split is a hard invariant, not a design taste. Apple Silicon's Metal GPU cannot be passed through to a Linux VM, so there is no way at all to perform MLX computation inside a K8s pod.

- **K8s (Control)** — handles only experiment tracking (MLflow), artifact storage (SeaweedFS) and orchestration (Prefect 3)
- **macOS host (Compute)** — every GPU-bound task is delegated to a host process spawned by the Rust backend

This lets you start on a local desktop with no cloud GPU cost, while keeping a path open toward remote GPU servers or multi-node K3s clusters later.

## App Layout — 8 Tabs

| Tab | Role |
|-----|------|
| **Dashboard** | Live RAM/CPU monitoring, one-click start/stop of the Colima (vz) K8s cluster, MLOps stack provisioning, port-forward control |
| **kagent Ops** | Cluster AIOps — per-context kagent diagnostics, toggling AI agents (security / promql / observability), kagent UI connection |
| **Pipeline** | Card-based visualization of each stage: cluster start → provisioning → model download → fine-tuning → MLflow registration → serving |
| **Model Hub** | One-click flow from Hugging Face search → host download → SeaweedFS S3 upload → MLflow Model Registry registration |
| **MLX Studio** | Installs the host MLX venv, runs LoRA fine-tuning on local models (live progress/loss), starts and stops `mlx_lm.server` |
| **Data** | Data ingestion DAG (web/file/HF → chunking → LanceDB RAG → SeaweedFS S3 backup), DVC dataset version management |
| **Access Console** | One-click credential-free access to provisioned services with health status |
| **Air-Gap Management** | Downloads offline bundles (images, charts, binaries) for closed networks, offline installation, asset version checks |

## Key Design Decisions

- **Port assignments** — MLflow 5001 (AirPlay owns 5000), SeaweedFS S3 8333, Filer UI 8888, Prefect 4200, model serving 8080, kagent UI 8090. All local URLs use `127.0.0.1`.
- **VM sizing derived from detected RAM** — never hardcoded (16GB → 4GB/2CPU, 32–48GB → 8GB/4CPU, 64GB+ → 12GB/6CPU).
- **Pod → host bridge** — an ExternalName service (`mac-gpu-service` → `host.lima.internal`) with no `ports` field, with CoreDNS resolution verified on device.
- **Metrics without sudo** — `sysinfo` RAM/CPU plus GPU metrics via `ioreg -c IOAccelerator` and thermal state from `NSProcessInfo.thermalState`. No `powermetrics`, no sudo paths.
- **Two MLX runtimes** — `mlx-lm` for text and `mlx-vlm` for vision share one venv, with `mlx-lm` as the default.

## External Cluster Integration

An existing cluster is connected as **agent-only** by default: the MLOps stack stays on the app's own k3s while the external cluster gets just the kagent agents for observation and diagnostics. Nothing inside that cluster depends on the Mac's local stack.

Deploying the full MLOps stack onto an existing cluster is an opt-in path, running preflight → render check → apply. An unverified bridge address refuses to render rather than shipping a guess. Both paths were verified against a live 6-node K3s HA cluster ([Narwhal](/en/projects/narwhal)) through Kyverno Enforce policies, a private mirror registry and ArgoCD GitOps.

## Measured Performance (reference)

Measured on Apple M4 Pro / 64GB through the packaged app. Numbers vary with model, prompt and hardware.

| Item | Measured | Conditions |
|------|----------|------------|
| VLM serving throughput | 196–198 tok/s | Qwen2-VL-2B-Instruct-4bit, mlx-vlm 0.6.7 |
| VLM serving TTFT | 442–767 ms | same as above |
| LoRA fine-tuning | 674.5M trainable params (30.5%), 8.7GB peak memory | Qwen2-VL-2B bf16, `--train-vision` |

## Tech Stack

TypeScript · Rust (Tauri v2) · Python · Colima/K3s · MLflow · SeaweedFS · Prefect 3 · MLX

See the [Architecture](/en/docs/kubemetal-architecture), [Usage](/en/docs/kubemetal-usage) and [External Cluster Integration](/en/docs/kubemetal-integration) documents for details.
