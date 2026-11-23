---
title: "AI Infrastructure Weekly · 2026 W46 — KV state in agent serving and training correctness"
description: "Recovered research brief: KV state in agent serving and training correctness."
pubDate: 2026-11-13
updatedDate: 2026-11-24
tags: ["AI Infrastructure", "Kubernetes", "MLOps", "Research"]
featured: false
draft: false
---

> Historical reconstruction from recovered AI Infra Research Brief records, compiled on 2026-11-24. AI-assisted research. Original paper identifiers are preserved for verification; numerical claims and unverified release assertions are excluded. The recovered text is not necessarily complete.

## Research watchlist from the historical brief

- [Bursts That Outlast Themselves](https://arxiv.org/abs/2611.13412)
- [Evolving Infra](https://arxiv.org/abs/2611.12304)
- [Plumbline](https://arxiv.org/abs/2611.13393)
- [VerKV](https://arxiv.org/abs/2611.11319)
- [Can KV Cache Be Reused Across Model Updates?](https://arxiv.org/abs/2611.14051)
- [The GPU Needs an Operating System](https://arxiv.org/abs/2611.08720)

## Architecture and operational implications

The agent KV working set is state for admission and recovery. Observe cache misses, prefill recomputation and session residency after bursts; compare session parking policies. Separate prefill/decode phase switching from KV placement; isolate KV across model revisions by default until quality regression is evaluated. For training, propose an MLflow promotion gate recording tokenizer, loss mask, collective, checkpoint round-trip and reference gradient evidence beyond loss. Evaluate GPU sharing using foreground p99 slowdown, not utilization alone. MLX issues #4841 and #4856 remain historical regression-review topics.

## Read / prototype / watch

Read and validate the original references before relying on them. Prototype in a controlled environment, establish baseline and failure criteria, and track official releases. All project applications are proposals rather than verified implementations.

- [Kueue releases](https://github.com/kubernetes-sigs/kueue/releases)
- [MLflow releases](https://github.com/mlflow/mlflow/releases)
- [MLX releases](https://github.com/ml-explore/mlx/releases)
- [MLX issue #4841](https://github.com/ml-explore/mlx/issues/4841)
- [MLX issue #4856](https://github.com/ml-explore/mlx/issues/4856)

