---
title: Control Plane Architecture
description: Planned domain API, correlation, adapter structure, and authoritative-state boundaries.
project: Beluga Manager
path: beluga-manager/architecture
order: 1601
lastModified: 2026-09-14
---

# Control Plane Architecture

The structure below is a **target architecture**, not an implemented application topology.

<Mermaid chart={`flowchart TB
  UI["Planned Manager UI"] --> API["Beluga Domain API"]
  API --> DOMAIN["Pipeline · Data Asset · Service · Operations"]
  DOMAIN --> CORR["Discovery / Correlation"]
  CORR --> ADAPTER["Capability-aware Adapters"]
  ADAPTER --> SOURCE["Authoritative OSS APIs"]`} />

## Planned adapter boundary

- Kafka, Flink, Iceberg, Trino, and Airflow continue to own their state.
- Adapters isolate version and capability differences from the domain API.
- A correlation index is derived state and does not replace upstream facts.
- Uncertain relationships preserve provenance and confidence.

Frontend/backend frameworks and transports remain undecided until an ADR selects them. Next.js, REST/WebSocket, or a particular Kafka proxy must not be treated as the current stack.
