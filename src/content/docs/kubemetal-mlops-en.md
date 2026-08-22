---
title: MLOps Pipelines
description: Local LLM fine-tuning (LoRA/QLoRA), MLX quantization, and low-latency inference.
project: KubeMetal
path: kubemetal/mlops
order: 1802
lastModified: 2026-08-23
---

# MLOps Pipelines

Guide to authoring fine-tuning and inference pipelines in KubeMetal.

## Supported Workflows

1. **One-Click Model Downloads**: HuggingFace and Ollama weight ingestion
2. **LoRA / QLoRA Fine-Tuning**: Supervised fine-tuning on local custom datasets
3. **4-bit / 8-bit Quantization**: 70% memory reduction via Apple MLX quantization
4. **High-Speed Local Serving**: OpenAI-compatible `/v1/chat/completions` endpoints
