---
title: "KubeMetal"
description: "An Apple Silicon hybrid MLOps desktop app separating Kubernetes control from native macOS MLX compute"
github: "https://github.com/dasomel/kubemetal"
tags: ["Apple Silicon", "macOS", "Tauri", "Rust", "React", "Kubernetes", "K3s", "Colima", "MLX", "MLOps"]
order: 13
type: "own"
featured: true
problem: "Apple Silicon Metal compute cannot simply be treated as ordinary Linux VM compute, so an all-in-Kubernetes MLOps architecture leaves local hardware underused"
solution: "Run the MLOps control plane on K3s/Colima while executing GPU-bound MLX fine-tuning and serving as native macOS processes behind a Tauri desktop experience"
---

## Project Overview

**KubeMetal** is an Apple Silicon MLOps workstation implemented as a desktop application.

Its defining architecture is **control/compute separation**: Kubernetes remains the control-plane environment for services such as MLflow and SeaweedFS, while GPU-bound MLX workloads execute directly on the macOS host where Apple Silicon Metal and Unified Memory are available.

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

## User Workspaces

| Tab | Purpose |
|---|---|
| Dashboard | RAM/CPU, Colima lifecycle, MLOps provisioning, port forwarding |
| kagent Ops | Agent-based diagnostics and AI-assisted operations for external clusters |
| Pipeline | End-to-end model workflow visualization |
| Model Hub | Hugging Face search, host download, SeaweedFS upload, MLflow registration |
| MLX Studio | Host MLX environment, LoRA fine-tuning, model serving |
| Data | Ingestion DAGs, chunking, LanceDB RAG, SeaweedFS backup, DVC |
| Access Console | Service access and health checks |
| Air-Gap Management | Offline bundle installation and asset verification |

## External Cluster Integration

The default D30 path is **agent-only**. The external Kubernetes cluster remains separate from KubeMetal's local MLOps stack and is connected for diagnostics and operations rather than being re-provisioned.

```text
Existing Kubernetes Cluster
        │
        │ kagent agent
        ▼
  KubeMetal kagent Ops
        │
        └── diagnostics / security / PromQL / observability

KubeMetal local k3s
        └── MLflow / SeaweedFS / local control plane
```

A full-stack D26 external deployment path is opt-in and performs preflight checks for kubeconfig context, storage class, Kyverno enforcement, Argo CD ownership, and verified host-bridge reachability before applying manifests.

## macOS Security Boundary

Because KubeMetal is a desktop application that can access local networks and Kubernetes APIs, code signing and macOS permission identity are part of the runtime model. Ad-hoc signing can produce unstable permission identity across builds; a stable signing identity is required for repeatable LAN access and distribution.

## Air-Gapped MLOps

Air-gap management covers bundles containing:

- container images
- Helm charts
- binaries
- asset versions
- verification metadata

This makes the project useful not only as a local ML launcher but as an edge/disconnected MLOps workstation control surface.

## Measured Reference Performance

The repository documents packaged-app measurements from an Apple M4 Pro / 64GB system on 2026-07-27–28:

- VLM serving: **196–198 tok/s**
- VLM TTFT: **442–767 ms**
- LoRA fine-tuning: **674.5M trainable parameters**, peak memory **8.7GB**
- 64GB host profile: K8s VM around 12GB / 6 CPU

These values are hardware/model-specific references, not universal benchmarks. Their value is demonstrating the behavior of the hybrid architecture on real Apple Silicon hardware.

## Development Environment

```bash
git clone https://github.com/dasomel/kubemetal.git
cd kubemetal
pnpm install
pnpm tauri dev
```

Requirements include macOS 14+, Apple Silicon, Homebrew, Colima, kubectl, Node 22+, pnpm, and Rust.

## Current Development Scope

The repository README marks the core Phase 1–3 capabilities as complete, including Tauri/Colima lifecycle, MLflow/SeaweedFS provisioning, Model Hub, host MLX fine-tuning, serving, pipeline visualization, packaged app output, and resource/thermal guardrails.

Subsequent work continues around external-cluster integration, signing, GitOps boundaries, and real-world operational constraints.

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [KubeMetal Overview](/oss/en/kubemetal/overview) | Product scope and architecture |
| Architecture | [System Architecture](/oss/en/kubemetal/architecture) | Tauri ↔ K3s ↔ host MLX boundaries |
| MLOps | [MLOps Pipelines](/oss/en/kubemetal/mlops) | Model lifecycle and fine-tuning |
| Integration | [External Cluster Integration](/oss/en/kubemetal/integration) | D30/D26 integration paths |
| Usage | [Usage Guide](/oss/en/kubemetal/usage) | End-user workflow |
| Operations | [Operations](/oss/en/kubemetal/operations) | Signing, guardrails, troubleshooting |

## Project Relationship

```text
Apple Silicon Mac
        ↓
    KubeMetal
     ├── Kubernetes control plane
     └── native MLX compute
                ↓
       local / edge MLOps
```
