---
title: "AI Infrastructure Weekly · 2026 W39 — Distributed AI execution, recovery and KV cache"
description: "Recovered research brief: Distributed AI execution, recovery and KV cache."
pubDate: 2026-09-25
updatedDate: 2026-11-24
tags: ["AI Infrastructure", "Kubernetes", "MLOps", "Research"]
featured: false
draft: false
---

> Historical reconstruction from recovered AI Infra Research Brief records, compiled on 2026-11-24. AI-assisted research. Original paper identifiers are preserved for verification; numerical claims and unverified release assertions are excluded. The recovered text is not necessarily complete.

## Research watchlist from the historical brief

- [Crossflow](https://arxiv.org/abs/2609.27085)
- [Dynamo Fast Recovery](https://arxiv.org/abs/2609.25451)
- [KVSET](https://arxiv.org/abs/2609.27746)
- [SARA](https://arxiv.org/abs/2609.26763)
- [EMA](https://arxiv.org/abs/2609.27040)
- [JustFit](https://arxiv.org/abs/2609.17475)

## Architecture and operational implications

Treat failure detection and recovery, cache efficiency and placement as separate control loops. Compare TTFT, throughput, recovery time and duplicate retries under normal load and node failure. Track MLflow and Kueue updates.

## Read / prototype / watch

Read and validate the original references before relying on them. Prototype in a controlled environment, establish baseline and failure criteria, and track official releases. All project applications are proposals rather than verified implementations.

- [Kueue releases](https://github.com/kubernetes-sigs/kueue/releases)
- [MLflow releases](https://github.com/mlflow/mlflow/releases)
- [MLX releases](https://github.com/ml-explore/mlx/releases)

