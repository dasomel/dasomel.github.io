---
title: "Usage"
description: "Installing and running KubeMetal, what each of the eight tabs does, the model-to-serving workflow, and measured performance"
project: "KubeMetal"
order: 502
lastModified: 2026-07-30
---

## Requirements

- macOS 14+ (Apple Silicon)
- Homebrew
- colima, kubectl — `brew install colima kubectl`
- Node 22+ / pnpm
- Rust (rustup)

Apple Silicon only. On Intel Macs the MLX compute path does not exist.

## Application Layout — Eight Tabs

| Tab | Role |
|-----|------|
| **Dashboard** | Live RAM/CPU monitoring, one-click start/stop of the Colima (vz) K8s cluster, MLOps stack provisioning, port-forward control |
| **kagent Operations** | Cluster AIOps — per-context kagent diagnostics, toggling AI agents (security / promql / observability), connecting to the kagent UI (8090) |
| **Pipeline** | Card-based visualization of each stage: cluster start → provisioning → model download → fine-tuning → MLflow registration → serving |
| **Model Hub** | One-click flow from Hugging Face model search → host download → SeaweedFS S3 upload → MLflow Model Registry registration, plus a registered-model listing |
| **MLX Studio** | Installs the host MLX venv, runs LoRA fine-tuning on local models (live progress/loss), starts and stops `mlx_lm.server` model serving |
| **Data** | Data ingestion DAG pipeline (web/file/HF → chunking → LanceDB RAG → SeaweedFS S3 backup), DVC dataset version management |
| **Access Console** | One-click credential-free access to provisioned services (MLflow, SeaweedFS Filer, …) with health status |
| **Air-Gap Management** | Downloads offline bundles (images, charts, binaries) for closed networks, performs offline installation, verifies asset versions |

## Running It

### 1. Install dependencies

```bash
pnpm install
```

### 2. Development mode

`beforeDevCommand` starts the vite dev server automatically.

```bash
pnpm tauri dev
```

### 3. Start the cluster

Pressing **Start Cluster** on the **Dashboard** tab runs the following internally, with CPU/memory values computed automatically from the detected host RAM.

```bash
colima start --cpu <N> --memory <M> --vm-type=vz --mount-type=virtiofs --kubernetes
```

colima is not reentrant — run one lifecycle operation at a time, and never above the computed profile.

### 4. Provision the MLOps stack

Pressing **Provision MLOps Stack** applies the MLflow / SeaweedFS (+ credential Secret) / mac-gpu-bridge manifests to the cluster.

### 5. Port forwarding

Pressing **Start Port Forwarding** exposes the following addresses.

- MLflow: `http://127.0.0.1:5001`
- SeaweedFS S3 API: `http://127.0.0.1:8333`
- SeaweedFS Filer UI: `http://127.0.0.1:8888`

Port forwards die with their parent process. If access drops suddenly, first check whether the process owning the forward is still alive.

### 6. Download → fine-tune → serve

Download a model on the **Model Hub** tab, then run fine-tuning and serving on the **MLX Studio** tab. The **Pipeline** tab shows the end-to-end flow; the **Access Console** tab covers service access.

<Mermaid chart={`flowchart LR
  HF["Hugging Face<br/>model search"] --> DL["Host download"]
  DL --> UP["SeaweedFS S3<br/>upload"]
  UP --> REG["MLflow<br/>Model Registry"]
  REG --> FT["MLX LoRA<br/>fine-tuning (host)"]
  FT --> LOG["MLflow<br/>experiment logs / adapters"]
  LOG --> SRV["mlx_lm.server<br/>serving :8080"]

  style HF fill:#f9fafb,stroke:#d1d5db,color:#111
  style DL fill:#eff6ff,stroke:#2563eb,color:#111
  style UP fill:#f0fdf4,stroke:#059669,color:#111
  style REG fill:#f0fdf4,stroke:#059669,color:#111
  style FT fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#111
  style LOG fill:#f0fdf4,stroke:#059669,color:#111
  style SRV fill:#eff6ff,stroke:#2563eb,color:#111
`} />

## Measured Performance (reference)

Measured on Apple M4 Pro / 64GB through the packaged app, 2026-07-27 to 07-28. Numbers vary with model, prompt, and hardware.

| Item | Measured | Conditions |
|------|----------|------------|
| VLM serving throughput | 196–198 tok/s (server-reported) | Qwen2-VL-2B-Instruct-4bit, mlx-vlm 0.6.7, OCR request with image |
| VLM serving TTFT | 442–767 ms | same as above |
| LoRA fine-tuning (with vision stack) | 674.5M trainable params (30.5%), 8.7GB peak memory | Qwen2-VL-2B bf16, `--train-vision` |
| K8s VM overhead | auto-computed from host RAM (64GB host → 12GB/6CPU VM) | compute runs on the host, outside the VM |

## Command-line Gates

`make help` is the entrypoint and its recipes are canonical. Two gates are worth knowing by name.

```bash
make verify          # tests + clippy + tsc + design lint + web build
make verify-airgap   # offline-startup probe
```

## Build / Packaging

```bash
pnpm tauri build   # produces .app / .dmg bundles (unsigned local build)
```

Outputs:

- `src-tauri/target/release/bundle/macos/KubeMetal.app`
- `src-tauri/target/release/bundle/dmg/KubeMetal_0.1.0_aarch64.dmg`

If a valid codesigning identity exists in the keychain, `make app` signs with it automatically. A packaged app that reaches LAN clusters needs stable code signing — see [External Cluster Integration](/en/docs/kubemetal-integration) for why.

## Troubleshooting

When you doubt what the app reports, check directly from the CLI.

```bash
colima status --json
kubectl --context colima get pods -n default

# external cluster
kubectl --context <context> get pods -n kubemetal
```

Related: [Architecture](/en/docs/kubemetal-architecture) · [External Cluster Integration](/en/docs/kubemetal-integration)
