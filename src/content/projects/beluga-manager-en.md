---
title: "Beluga Manager"
description: "Unified Control Plane and management layer for the Beluga Data Platform"
github: "https://github.com/dasomel/beluga-manager"
tags: ["Data Platform", "Control Plane", "Kafka", "Flink", "Iceberg", "Trino", "Airflow", "Kubernetes"]
order: 3
type: "own"
featured: true
problem: "Operating Kafka, Flink, Iceberg, Trino, and Airflow separately makes it difficult to understand service-spanning data flows, health, and operational context from one place"
solution: "Integrate authoritative upstream APIs through adapters and discovery/correlation to expose unified Beluga domains and a single management experience for Pipelines, Data Assets, Services, and Operations"
---

## Project Overview

**Beluga Manager** is the unified entry point and management layer for the Beluga Data Platform.

```text
Upstream OSS
    ↓
Authoritative APIs
    ↓
Integration Adapters
    ↓
Discovery / Correlation
    ↓
Beluga Domain API
    ↓
Beluga Manager UI
```

It is not an OSS collection portal. It creates **cross-service operational context** by composing the APIs of specialized open-source components.

## Core Domains

- **Pipeline** — cross-service data flow across Kafka Topics, Flink Jobs, Iceberg Tables, and Trino contexts
- **Data Asset** — Catalog, Schema, Table, Column, Partition, and Query Context
- **Service** — Identity, Version, Health, Dependencies, and Capabilities
- **Operations** — Resource, Event, Health, Log, and Dependency-driven troubleshooting

## Initial MVP

The first vertical slice focuses on:

```text
Kafka → Flink → Iceberg → Trino
```

The MVP validates Unified Service API, Service Discovery, Cross-service Correlation, Pipeline Domain API, health/status, drill-down, and the English/Korean UI foundation.

## Design Principles

- Keep each OSS authoritative for its own resources
- Frontends consume Beluga Domain APIs rather than OSS-specific APIs
- Prefer correlation and minimal cache/index state over broad metadata duplication
- Isolate upstream API/version differences behind integration adapters
- Never present uncertain relationships as authoritative facts
- Validate product value read-first before introducing broad mutating operations

## Internationalization

- `en-US` — English
- `ko-KR` — Korean
- Browser locale detection
- Manual language selection
- Locale-neutral APIs
- Actual Kafka Topics, Tables, Jobs, Namespaces, and identifiers are never translated

## Links

- **GitHub**: [dasomel/beluga-manager](https://github.com/dasomel/beluga-manager)
- **Architecture**: [Beluga Manager Architecture](https://github.com/dasomel/beluga-manager/blob/main/docs/architecture.md)
