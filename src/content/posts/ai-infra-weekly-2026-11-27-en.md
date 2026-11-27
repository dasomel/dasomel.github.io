---
title: "AI Infrastructure Weekly · 2026 W48 — KV Data Planes, GPU Memory, and Agent Isolation"
description: "An operational review of TripleKV and HiPerfCC, vLLM 0.34, Kueue 0.20.8, Agent Sandbox, the MLflow SSRF advisory, and MLX updates."
pubDate: 2026-11-27
tags: ["AI Infrastructure", "Kubernetes", "MLOps", "Research"]
featured: false
draft: false
---

> AI-assisted research briefing. Source window: 2026-11-14–27 (KST). Numbers are results reported by the papers or project releases, not independently reproduced here. The MLflow advisory published on 2026-11-13 was found during the retrospective scan and is identified separately. Proposed prototypes and project applications are not existing implementations.

## Executive summary

- Agent-serving KV management is moving beyond GPU-local LRU: tool execution windows can hide SSD-to-DRAM restoration in a three-tier data plane.
- vLLM 0.34 sizes KV capacity from memory actually free after warmup and adds recovery paths for checkpoint/restore and DP/EP scale-down. Its new defaults can regress shared-GPU deployments.
- Kueue 0.20.8 accumulates correctness fixes for DRA quota and MultiKueue workload lifecycle. Kueue 0.21.0-rc.2 promotes consumable-capacity quota to Beta.
- Agent Sandbox improves warm pools, suspend/resume and sandbox-scoped tokens. Separately, the MLflow artifact-URI SSRF requires MLflow 3.18.0 or later.
- MLX 0.32.5 and mlx-swift-lm 3.33.0 expand Metal kernels and Swift inference APIs, but any M4 Max performance gain still needs measurement.

## 1. Agentic inference KV cache becomes a tool-aware three-tier data plane

**Primary sources:** 2026-11-18 [TripleKV](https://arxiv.org/abs/2611.25112); 2026-11-21 [HiPerfCC-KVCache](https://arxiv.org/abs/2611.28702).

### TripleKV — move SSD reads into the tool-execution window

TripleKV treats GPU HBM (L1), host DRAM (L2), and SSD (L3) as one KV hierarchy. The agent harness predicts when each tool call will finish and asynchronously prefetches the required KV blocks from SSD into DRAM. DRAM becomes a non-inclusive tier, avoiding duplicate copies of GPU-resident blocks, and protects prefetched blocks until reuse. The final DRAM-to-GPU transfer still uses the existing vLLM path after request admission.

The paper evaluates Qwen3-30B-A3B on one H100 NVL: 32 GiB of HBM remains for KV after model weights, with 64 GiB of DRAM and a 1 TiB SSD RAID. It replays four agent benchmark traces with 12–20 concurrent agent threads. The authors report that requests requiring critical-path SSD reads fall from 45–76% to below 10%, and p95 TTFT improves by up to 49% against their vLLM DRAM/SSD baseline.

**Architecture and operations:** The harness already knows which prefix the next turn will reuse; the uncertain variable is tool completion time. Keep prediction metadata in the agent layer and block movement/eviction in the KV manager. Observe critical-path SSD-read fraction, tool-latency prediction error, DRAM pressure, prefetch bytes and recomputed tokens—not only prefix-hit ratio.

**Evidence and limits:** This is an arXiv preprint. Evaluation is limited to one H100 NVL, one MoE model and replayed traces. Its baseline extends vLLM 0.24 from June 2026, so the reported gain cannot be assumed for vLLM 0.34. No independently verified public implementation was found.

### HiPerfCC-KVCache — reduce protected-transfer lock contention

HiPerfCC studies how protected KV copies under GPU confidential computing hold driver locks long enough to stall independent serving operations. Its SGLang implementation uses bounded backup submissions, prioritizes ready-token readback, and parallelizes restores with auxiliary contexts and shared GPU staging. Across three models and three workloads on H200, the authors report 1.74× geometric-mean output-token throughput (up to 2.72×) over staged HiCache-Workers, with mean TTFT down 36% (up to 59%). They also report a 1.28× geometric-mean gain on RTX PRO 6000 Blackwell.

**Operational meaning:** For confidential GPU deployments, measure driver-lock hold time, protected-copy granularity, token-readback queueing and restore latency per context—not just bandwidth. This work is less relevant to ordinary non-confidential serving. It is an arXiv preprint; no public implementation or upstream SGLang release was verified.

## 2. vLLM 0.34.0 — dynamic KV sizing and recovery, with significant default changes

**Source:** 2026-11-16 [vLLM v0.34.0](https://github.com/vllm-project/vllm/releases/tag/v0.34.0).

v0.34.0 removes Model Runner V1 and leaves V2 as the only runner. Extensible KV cache is enabled by default and sizes the cache from memory actually free after CUDA graph capture and warmup. The default block size changes from 16 to 64; ROCm 7.2 artifacts are removed in favor of ROCm 10.0, and CUDA artifacts target CUDA 13.0.

The release also adds checkpoint/restore through CRIU and cuda-checkpoint, fault-tolerant DP/EP scale-down that removes dead ranks and redistributes experts, and opt-in cache-aware admission ordering. The serving engine increasingly owns cache state and recoverable execution units.

The release notes cite a model-specific H200 example where KV capacity grows from 433k to 672k tokens, but also report TPOT increases of 6–18% for some models at concurrency 128. These are project-reported measurements, not a general performance guarantee.

**Trade-offs:** Do not use one memory policy for both exclusive-GPU Pods and MPS/time-sliced sharing. In shared environments, reserve explicit memory headroom and validate post-warmup KV capacity, OOM behavior, TTFT and TPOT. Check custom logits processors that depended on Model Runner V1 and any block-size assumptions.

**Maturity:** Stable OSS release. The breaking changes justify canaries across CUDA/ROCm, GPU generations, custom kernels, connectors and GPU-sharing modes.

## 3. Kueue 0.20.8 — correctness fixes for DRA quota and MultiKueue lifecycle

**Sources:** [v0.20.7 (2026-11-19)](https://github.com/kubernetes-sigs/kueue/releases/tag/v0.20.7), [v0.20.8 (2026-11-26)](https://github.com/kubernetes-sigs/kueue/releases/tag/v0.20.8), and [v0.21.0-rc.2 (2026-11-24)](https://github.com/kubernetes-sigs/kueue/releases/tag/v0.21.0-rc.2).

v0.20.7 fixes DRA cases where a missing DeviceClass or a quota-charge change during scheduling could lead to incorrect admission or reservation with stale charges. It also rejects duplicate charging from multiple capacity sources. MultiKueue fixes cover a worker-removal path that could redispatch a Workload without deleting the remote object, allowing the same Job to run twice, and an orphaned remote Job left behind when a manager Job was orphaned. ConcurrentAdmission pending counts and stale metrics were corrected as well.

v0.20.8 primarily aligns controller logging. Per-object logs move from verbosity 2 to 3 and structured log keys change. Existing Loki parsers, alerts and Grafana dashboards that depend on log text or keys need review before upgrading.

**Operational meaning:** DRA correctness depends on DeviceClass, capacity sources and quota charges—not just GPU count. MultiKueue testing should cover worker removal, reconnection and manager restart, checking for duplicate or orphaned remote Workloads. v0.20.8 is a stable patch worth evaluating, but review the full patch chain and logging migration.

**Next step:** v0.21.0-rc.2 is a pre-release. It promotes the DRA prioritized list and consumable-capacity quota to Beta, allowing DeviceClass capacity dimensions to map to separate quota resources. This could help model GPU partitions and NPU capacity, but production use should wait for a stable release and CRD/feature-gate compatibility checks.

## 4. Agent Sandbox and MLflow — execution isolation and artifact-fetch trust boundaries

### Kubernetes SIG Agent Sandbox v1.0.12

**Sources:** 2026-11-20 [Agent Sandbox v1.0.12](https://github.com/kubernetes-sigs/agent-sandbox/releases/tag/v1.0.12) and [architecture / README](https://github.com/kubernetes-sigs/agent-sandbox).

Agent Sandbox uses a Sandbox CRD/controller plus SandboxClaim, SandboxTemplate and SandboxWarmPool to manage stateful singleton execution environments. v1.0.12 adds suspend/resume APIs across the Go, Python and TypeScript SDKs, claim lifecycle options, per-pool readiness grace periods and a CI runner example. sandbox-router adds v2 tokens bound to namespace, name and UID.

The security boundary matters: a scoped token is bound to one Sandbox identity, but it authorizes every port, method and path on that Sandbox until expiry. It is not path-level least privilege. All router replicas must be upgraded before issuing the new token format; older replicas reject it with 403.

Suspend deletes the Pod while retaining the claim and PVCs. Processes, memory and emptyDir do not survive unless a separate Pod-snapshot mechanism is used. Agent Sandbox itself does not provide kernel isolation; the selected RuntimeClass, such as gVisor or Kata Containers, determines the underlying isolation.

**Operational proposal:** For untrusted agent code, combine per-sandbox identity, short token TTLs, egress restrictions, metadata-endpoint blocking and read-only artifact mounts. Warm pools reduce startup latency but increase idle sandbox cost and namespace quota consumption.

### MLflow SSRF — tracking servers below 3.18.0 require remediation

**Sources:** 2026-11-13 [GHSA-mr9f-g8qf-4w4j / CVE-2026-118628](https://github.com/mlflow/mlflow/security/advisories/GHSA-mr9f-g8qf-4w4j) and [MLflow 3.18.0](https://github.com/mlflow/mlflow/releases/tag/v3.18.0).

The MLflow tracking server did not sufficiently validate client-supplied experiment artifact locations and model-version sources. Artifact endpoints could therefore cause the server to connect to arbitrary hosts and ports. The advisory rates the issue High, CVSS 8.2. Versions below 3.18.0 are affected; 3.18.0 is patched. Versions 3.17.0–3.17.2 added general host validation but remained vulnerable to a bypass through wasbs URIs.

**Operational action:** Upgrade to MLflow 3.18.0 or later, enable tracking-server authentication, and restrict egress to approved artifact-storage hosts. Set MLFLOW_ALLOWED_HOST_ADDRESSED_ARTIFACT_SCHEMES narrowly and only when another host-addressed artifact scheme is genuinely required. Do not broadly allow http/https by default. Use Kubernetes NetworkPolicy or an egress gateway to block internal CIDRs and cloud metadata endpoints.

The release list still shows MLflow 3.18.0 as the latest stable release. This security fix takes priority over waiting for a 3.19 feature release.

## 5. Apple Silicon MLX — Metal kernels and Swift inference APIs advance

**Sources:** 2026-11-25 [MLX v0.32.5](https://github.com/ml-explore/mlx/releases/tag/v0.32.5) and 2026-11-17 [mlx-swift-lm 3.33.0](https://github.com/ml-explore/mlx-swift-lm/releases/tag/3.33.0).

MLX 0.32.5 includes Metal FP4 dequantization and quantized-matmul paths, SDPA kernels for speculative decoding, sliding-window attention, and a fix for a data race in distributed-ring pending send/receive lists. It also fixes head-dimension-512 SDPA on M1/M2. That older-generation fix should not be interpreted as an M4 Max performance gain; the release notes provide no integrated M4 Max measurements.

mlx-swift-lm 3.33.0 adds Qwen 3.8 and MTP drafters, LFM3 models, separate reasoning and answer streams, and expanded KV-cache inspection/restore/eviction APIs. It also contains source-breaking Swift API changes. Do not conflate this Swift stack with Python mlx-lm.

**Operational meaning:** Compare 0.32.4 and 0.32.5 on the same M4 Max with the same model, quantization, prompt and thermal conditions. Measure prompt processing, decode tokens/s, peak unified memory, cache eviction and memory growth during long runs. Validate the Swift stack as a separate combination.

## Possible applications to public OSS

These are proposals derived from the research, not claims about current implementations.

- **Narwhal:** Its current README does not list Kueue or Agent Sandbox. If GPU workload admission enters scope, evaluate Kueue 0.20.8 as an optional add-on. If Agent Sandbox is introduced, Cilium egress policy and Kyverno policy could constrain RuntimeClass, privileged Pods, hostPath and metadata access.
- **KubeMetal:** Its verified path separates MLflow and SeaweedFS in K3s from MLX processes running natively on macOS. MLX 0.32.5 is a host-mlx version-pinning and regression-test candidate. First verify MLflow is at least 3.18.0. Do not put Kueue/DRA on the default local Mac path until the GPU is demonstrably discoverable, allocatable, isolatable and accounted for as a Kubernetes device.
- **Beluga:** Its current scope is Kafka/CDC, Flink, Iceberg, Trino and Airflow; no AI agent runtime integration is verified. If untrusted agents later execute data tasks, consider per-job Sandboxes, restricted object-store credentials, Cilium egress policy and OPA/OpenFGA authorization.

## What was not repeated in this window

- **Distributed training:** No new post-2026-11-13 training/checkpoint system release or paper with sufficient primary-source evidence was verified. Kubeflow Trainer 2.4.0 was released on November 6, before this issue window.
- **MLflow:** No new stable release after 3.18.0 was verified. The security advisory is more actionable than repeating its feature release.
- **SGLang:** The official release page still lists 0.5.23 as the latest stable version. No stable 0.5.24 release was verified, so nightly builds are not presented as releases.
- **Korean ecosystem:** This scan did not verify a post-cutoff Korean Kubernetes/AI-infrastructure OSS primary-source update that materially changes the architecture decisions above. Unsubstantiated local signals were omitted.

## Priorities

### Read now

1. [TripleKV](https://arxiv.org/abs/2611.25112) — tool latency and SSD-to-DRAM prefetch
2. [vLLM 0.34.0](https://github.com/vllm-project/vllm/releases/tag/v0.34.0) — KV sizing and breaking defaults
3. [Kueue 0.20.8](https://github.com/kubernetes-sigs/kueue/releases/tag/v0.20.8) — DRA/MultiKueue correctness and log migration
4. [MLflow GHSA](https://github.com/mlflow/mlflow/security/advisories/GHSA-mr9f-g8qf-4w4j) — remediation for tracking servers below 3.18.0

### Test / prototype

- **Kueue 0.20.8 staging:** Replay missing DeviceClass, duplicate capacity source, quota recomputation and worker-removal scenarios. Success means actual Pod/Workload counts match quota and metrics, with zero duplicate remote Jobs. Any duplicate execution, stale reservation or negative/missing gauge is a failure.
- **vLLM 0.34 canary:** Compare post-warmup KV capacity, p95 TTFT/TPOT, GPU OOM and interference between concurrent processes against 0.33. Roll back the defaults if model SLOs are breached or shared-GPU OOMs appear.
- **Agent Sandbox 1.0.12:** Test claim-to-ready p95, token expiry, cross-sandbox/namespace access and metadata egress blocking with gVisor or Kata. Any successful cross-sandbox access or metadata reachability is a failure. Explicitly verify that processes and emptyDir disappear after suspend.
- **MLX 0.32.5:** Compare 0.32.4 and 0.32.5 on the same M4 Max for prompt/decode throughput, peak unified memory and memory growth after 30 minutes of repeated runs. Reject the upgrade if output correctness regresses, OOMs recur or memory grows continuously.
- **TripleKV concept:** Before implementing the system, measure tool-specific completion-time prediction error and prefetch coverage from agent traces. Do not expand if prefetch interferes with foreground I/O or increases DRAM pressure.

### Watch

- Stable Kueue 0.21 and real GPU/NPU use of consumable-capacity DRA quota
- A public TripleKV implementation and reproduction against vLLM 0.34
- HiPerfCC code release and SGLang upstream integration
- Agent Sandbox snapshot/suspend semantics and multi-tenant token policy
- SGLang 0.5.24 stable, MLflow 3.19 and subsequent MLX releases

