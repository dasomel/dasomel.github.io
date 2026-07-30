---
title: "Architecture"
description: "KubeMetal's Control/Compute split, Tauri v2 backend composition, and the design decisions behind ports, VM sizing, and the host bridge"
project: "KubeMetal"
order: 501
lastModified: 2026-07-30
---

## Overview

KubeMetal is an Apple Silicon-only hybrid MLOps desktop app. It unifies a standard Kubernetes control plane with macOS host-native MLX compute in a single Tauri v2 (Rust) + React/TypeScript application.

The MLOps stack — MLflow, SeaweedFS — is deployed as pods inside a lightweight K3s cluster running on Colima (`vz` + `virtiofs`) and managed with standard K8s manifests. Actual computation such as MLX-based fine-tuning and serving, however, runs as macOS host processes rather than inside K8s pods.

## Control/Compute Split — A Hardware Constraint, Not a Preference

This split is a hard invariant, not a design taste. **Apple Silicon's Metal GPU cannot be passed through to a Linux VM.** There is therefore no way at all to perform MLX computation inside a K8s pod.

- **K8s (Control)** — handles only the standard MLOps control plane: experiment tracking (MLflow), artifact storage (SeaweedFS), and orchestration (Prefect 3).
- **macOS host (Compute)** — every GPU-using workload is delegated to a host process spawned by the Rust backend.

This hybrid shape lets you start on a local desktop with no cloud GPU cost, while keeping a path open toward remote GPU servers or multi-node K3s clusters later.

<Mermaid chart={`flowchart TB
  subgraph HOST["macOS Host (Apple Silicon)"]
    APP["KubeMetal.app<br/>Tauri v2 (Rust) + React"]
    MLX["MLX Host Processes<br/>mlx-lm / mlx-vlm"]
    METAL["Metal GPU<br/>(no VM passthrough)"]
  end

  subgraph VM["Colima VM (vz + virtiofs)"]
    subgraph K3S["K3s Cluster"]
      MLF["MLflow<br/>Tracking / Model Registry"]
      SWF["SeaweedFS<br/>S3 Artifact Store"]
      PFT["Prefect 3<br/>Orchestration"]
      BR["mac-gpu-service<br/>ExternalName"]
    end
  end

  APP -->|"lifecycle / kubectl"| K3S
  APP -->|"spawn"| MLX
  MLX --> METAL
  MLX -->|"experiment logs / model registration"| MLF
  MLF -->|"artifacts"| SWF
  BR -->|"host.lima.internal"| MLX

  style APP fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#111
  style MLX fill:#eff6ff,stroke:#2563eb,color:#111
  style METAL fill:#f9fafb,stroke:#d1d5db,color:#111
  style MLF fill:#f0fdf4,stroke:#059669,color:#111
  style SWF fill:#f0fdf4,stroke:#059669,color:#111
  style PFT fill:#f0fdf4,stroke:#059669,color:#111
  style BR fill:#fffbeb,stroke:#d97706,color:#111
  style HOST fill:#fff,stroke:#9ca3af,color:#111
  style VM fill:#fafafa,stroke:#d1d5db,color:#374151
  style K3S fill:#fff,stroke:#9ca3af,color:#374151
`} />

## Application Composition

### Backend (Rust / Tauri v2)

Split into IPC command modules by functional domain.

| Module | Responsibility |
|--------|----------------|
| `colima` | Colima (vz) VM and K8s cluster lifecycle control |
| `provision` | Applies MLflow / SeaweedFS / Prefect / bridge manifests |
| `deploy_target` | Resolves the deploy target context — treats the cluster as configuration, not a constant |
| `metrics` | Collects RAM/CPU/GPU and thermal state |
| `mlx` | Host MLX venv installation, LoRA fine-tuning, model serving |
| `modelhub` | Hugging Face search → download → S3 upload → MLflow registration |
| `data_ingest`, `rag` | Data ingestion DAG, chunking, LanceDB RAG |
| `prefect` | Pipeline orchestration |
| `port_forward`, `access` | Port forwarding and one-click service access |
| `guardrails` | Memory pressure / thermal / battery / sleep-prevention guards |

`services/process.rs` owns external CLI spawning as a single path. An `.app` bundle inherits no shell PATH, so every external CLI goes through a path resolver, and the PATH handed to child processes is constructed there as well.

### Frontend (React 19 / TypeScript)

Organized as a per-tab component tree: `dashboard`, `kagent`, `pipeline`, `modelhub`, `mlx`, `data`, `access`, `airgap`. UI tokens are mapped 1:1 into the Tailwind config from `DESIGN.md` frontmatter as the single source.

## Key Design Decisions

### Port Assignments

| Service | Port | Note |
|---------|------|------|
| MLflow | 5001 | macOS AirPlay owns 5000 |
| SeaweedFS S3 API | 8333 | |
| SeaweedFS Filer UI | 8888 | |
| Prefect | 4200 | |
| Model serving | 8080 | |
| kagent UI | 8090 | 8080 is owned by serving |

All local URLs use `127.0.0.1`, never `localhost`.

### VM Sizing Derived from Detected RAM

Never hardcoded — the profile is computed from host RAM, and the backend clamps frontend input.

| Host RAM | VM allocation |
|----------|---------------|
| 16GB | 4GB / 2 CPU |
| 32–48GB | 8GB / 4 CPU |
| 64GB+ | 12GB / 6 CPU |

### Pod → Host Bridge

Pods reach the host MLX service through an ExternalName service (`mac-gpu-service` → `host.lima.internal`) with no `ports` field. On-device verification confirmed CoreDNS resolving to `192.168.5.2` under Colima; `host.docker.internal` is never used.

One pitfall worth naming — **ExternalName takes a DNS name, never an IP.** A CNAME pointing at an IP is NXDOMAIN, and nothing fails loudly when you try it. If the target must be an IP, a selector-less Service plus EndpointSlice is required instead, and the render script switches to that automatically.

### Metrics — Collected Without sudo

`sysinfo`-based RAM/CPU, plus sudo-free GPU metrics via `ioreg -c IOAccelerator` and thermal state from `NSProcessInfo.thermalState`. `powermetrics` and sudo/root paths remain forbidden without a privileged helper.

Thermal state has **no CLI source** — `pmset -g therm`, `sysctl`, and `ioreg AppleSMC` were all measured empty on this hardware. Thermal-based training pause is opt-in and fires only at `serious` (`fair` is normal under load). A manual resume overrides that pause cause for the rest of the run, but memory-pressure `critical` is never overridable on its own.

### Two MLX Runtimes

`mlx-lm` for text and `mlx-vlm` for vision share one venv, with `mlx-lm` as the default. Both servers pass `--host 127.0.0.1` explicitly, because `mlx_vlm.server` defaults to `0.0.0.0`.

Vision fine-tuning carries a few traps. In `mlx_vlm.lora`, `--adapter-path` means *resume*, not output — output is `--output-path`. And `--train-vision` requires a non-quantized (bf16) model; a 4-bit model dies in `QuantizedMatmul::vjp`.

## Never Fabricate State

The observability principle here is simple: **when a probe fails, surface the failure.** Hardcoded device specs, invented kubeconfig contexts, canned log lines, assumed pod readiness, and scripts printing success they did not verify are all treated as defects. Green gates mean the code compiles, not that the feature works.

Related: [Usage](/en/docs/kubemetal-usage) · [External Cluster Integration](/en/docs/kubemetal-integration)
