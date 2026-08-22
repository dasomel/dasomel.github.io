---
title: Observability Stack
description: Prometheus, Grafana, Loki, Tempo, Alloy, and Hubble eBPF telemetry.
project: Narwhal
path: narwhal/observability
order: 1105
lastModified: 2026-08-23
---

# Observability Stack

Narwhal provides full-stack telemetry integrating metrics, logs, distributed traces, and network flows into a single unified operational dashboard.

## Telemetry Pipeline

```text
[ Kubernetes Pods & Nodes ]
      │
      ├─ Metrics (Prometheus Exporters) ──► Prometheus ──► Grafana
      ├─ Logs (Alloy Agent) ──────────────► Loki ────────► Grafana
      ├─ Traces (OpenTelemetry SDK) ─────► Tempo ───────► Grafana
      └─ Network Flows (eBPF BPF Maps) ──► Hubble UI
```

## 4 Observability Pillars

1. **Metrics (Prometheus Operator)**: Node CPU/memory, XFS storage consumption, and APISIX latency alerts
2. **Logs (Grafana Loki + Alloy)**: Label-indexed container log aggregation and streaming
3. **Traces (Grafana Tempo)**: OpenTelemetry distributed trace correlation with logs via TraceIDs
4. **Network Telemetry (Cilium Hubble)**: Real-time service topology, DNS latency, and packet drops via eBPF
