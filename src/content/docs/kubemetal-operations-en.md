---
title: Performance & Operations
description: Unified Memory optimization, Apple Silicon chip matrix, and E2E validation.
project: KubeMetal
path: kubemetal/operations
order: 1804
lastModified: 2026-08-23
---

# Performance & Operations

Hardware performance tuning and operational verification for Apple Silicon.

## Hardware Tier Recommendation Matrix

| Chip Tier | Unified Memory | Model Parameters | Quantization |
|---|---|---|---|
| **Base Tier** | 16 GB ~ 24 GB | 7B ~ 8B | 4-bit Q4_K_M |
| **Pro Tier** | 32 GB ~ 64 GB | 14B ~ 32B | 4-bit / 8-bit |
| **Max Tier** | 64 GB ~ 128 GB | 70B | 4-bit Q4_K_M |
| **Ultra Tier**| 128 GB ~ 192 GB| 70B ~ 120B | 8-bit / 16-bit |

## Expanding GPU Memory via sysctl

```bash
sudo sysctl iogpu.wired_mem_limit=57344
```
