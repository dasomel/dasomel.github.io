---
title: Troubleshooting Guide
description: Root-cause analysis for Kafka lag, Flink checkpoint timeouts, and Trino OOMs.
project: Beluga
path: beluga/troubleshooting
order: 1504
lastModified: 2026-08-23
---

# Troubleshooting Guide

Common operational failure modes and remediation runbooks for Beluga.

## 1. High Kafka Consumer Lag
- **Cause**: Flink operator bottleneck or partition skew
- **Remediation**: Scale Flink task parallelism and increase topic partition counts

## 2. Flink Checkpoint Timeouts
- **Cause**: MinIO storage I/O contention or large RocksDB state payloads
- **Remediation**: Verify incremental checkpointing is enabled; audit MinIO disk latency

## 3. Trino Query Memory Exhaustion
- **Remediation**: Tune `query.max-memory-per-node` and enforce partition pruning in SQL queries
