---
title: "Beluga Manager"
description: "Unified Control Plane & Edge UI for the Beluga Data Platform"
github: "https://github.com/dasomel/beluga-manager"
tags: ["Next.js", "React", "DataPlatform", "ControlPlane", "TypeScript", "TailwindCSS"]
order: 11
type: "own"
featured: true
problem: "Fragmented operations across disparate dashboards (Kafka, Flink, Iceberg, Trino) slow down troubleshooting and pipeline orchestration"
solution: "A unified control plane web UI aggregating pipeline health, job lifecycle states, and Iceberg schemas into a single workbench"
---

## Project Overview

**Beluga Manager** is the unified control plane web application for managing and inspecting the Beluga data platform.

Built with Next.js, React, TypeScript, and Tailwind CSS, it offers a responsive and intuitive user interface for multi-stage data pipeline orchestration.

### Key Highlights

- **Real-Time Topology Visualization**: Interactive visual mapping of data flows from CDC sources to Iceberg lakehouses
- **Job Lifecycle Controls**: Trigger Flink savepoints, restart streaming jobs, and run Airflow DAGs
- **Schema Explorer**: Inspect Iceberg table schemas, partition evolution, and snapshot time travel
- **Centralized Alerting Hub**: Instant alerts for Kafka consumer lag spikes and Flink job exceptions

---

## Architecture Diagram

```text
  Browser (Data Engineer / Ops)
             │
             ▼
  ┌────────────────────────────────────────────────────────┐
  │  Beluga Manager UI (Next.js App Router)               │
  │  - Real-time Pipeline Topology Visualizer              │
  │  - Flink / Kafka / Airflow Status Aggregator           │
  │  - Iceberg Schema & Time-Travel Explorer               │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼ REST / WebSocket API
  ┌────────────────────────────────────────────────────────┐
  │  Beluga Platform Services                              │
  │  (Kafka Connect · Flink REST · Trino Coordinator)     │
  └────────────────────────────────────────────────────────┘
```

---

## Getting Started

```bash
# 1. Clone repository
git clone https://github.com/dasomel/beluga-manager.git
cd beluga-manager

# 2. Install dependencies and start dev server
pnpm install
pnpm dev
```

---

## Documentation Index

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [Manager Overview](/oss/en/beluga-manager/overview) | Control plane philosophy and inspection scope |
| **Architecture** | [Control Plane Architecture](/oss/en/beluga-manager/architecture) | Frontend/backend communication and state aggregation |
| **Development** | [Development Guide](/oss/en/beluga-manager/development) | pnpm setup, component structure, and mock servers |
| **Operations** | [Deployment & Operations](/oss/en/beluga-manager/operations) | Container packaging, environment variables, and K8s |
