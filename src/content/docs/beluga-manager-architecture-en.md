---
title: Control Plane Architecture
description: Next.js App Router, REST/WebSocket adapters, and state aggregation models.
project: Beluga Manager
path: beluga-manager/architecture
order: 1601
lastModified: 2026-08-23
---

# Control Plane Architecture

Beluga Manager integrates Next.js App Router with cluster backend services.

## Backend Adapters

- **Kafka Adapter**: Inspects consumer groups and topic lag via Kafka REST Proxy
- **Flink Adapter**: Direct integration with Flink JobManager REST API
- **Trino Adapter**: Aggregates query telemetry and worker loads via Trino REST API
