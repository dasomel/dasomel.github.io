---
title: "Beluga Manager"
description: "Unified control plane that correlates Beluga data-platform services into Pipeline, Data Asset, Service, and Operations domains"
github: "https://github.com/dasomel/beluga-manager"
tags: ["Data Platform", "Control Plane", "Kafka", "Flink", "Iceberg", "Trino", "Airflow", "API"]
order: 11
type: "own"
featured: true
problem: "Kafka, Flink, Iceberg, Trino, and Airflow expose independent APIs and UIs, making cross-service pipeline context difficult to inspect from one place"
solution: "Use adapters and correlation to expose stable platform domains without replacing upstream systems or creating a second source of truth"
---

## Project Overview

**Beluga Manager** is the unified control plane and management console for the Beluga Data Platform.

The project does not try to reimplement Kafka, Flink, Iceberg, Trino, or Airflow UIs. Each upstream system remains authoritative for its own resources. Beluga Manager adds value by answering questions that cross those service boundaries.

Examples:

- Which Kafka Topic and Flink Job belong to the same Pipeline?
- Which Iceberg table represents a Data Asset and how can it be queried?
- Which downstream resources are affected by a failed job?
- Which platform services are healthy, stale, degraded, or unavailable?

The product focus is **integration context**, not UI duplication.

## Domain Model

### Pipeline

<Mermaid chart={`flowchart TB
  SRC["Source / CDC"] --> KAFKA["Kafka Topic"]
  KAFKA --> FLINK["Flink Job"]
  FLINK --> ICEBERG["Iceberg Table"]
  ICEBERG --> TRINO["Trino / Query"]`} />

A Pipeline correlates resources across the data platform into one operational unit.

### Data Asset

Provides catalog, schema, table, columns, partitions, location, and query context while keeping Iceberg authoritative for lakehouse metadata.

### Service

Represents platform capability rather than a simple installation list: Streaming, Processing, Lakehouse, Query, Orchestration, BI, Storage, and Observability.

### Operations

Combines health, events, logs, resources, and dependencies for cross-service investigation.

## Integration Architecture

<Mermaid chart={`flowchart TB
  UI["Beluga Manager UI"] --> DOMAIN["Unified Domain API"]
  DOMAIN --> CORR["Discovery / Correlation"]
  CORR --> KAFKA["Kafka Adapter"]
  CORR --> FLINK["Flink Adapter"]
  CORR --> ICEBERG["Iceberg Adapter"]
  CORR --> TRINO["Trino Adapter"]
  CORR --> AIRFLOW["Airflow Adapter"]
  KAFKA --> PLATFORM["Beluga Data Platform"]
  FLINK --> PLATFORM
  ICEBERG --> PLATFORM
  TRINO --> PLATFORM
  AIRFLOW --> PLATFORM`} />

This isolates OSS API versions and implementation differences from the frontend.

<Mermaid chart={`flowchart TB
  OSS["OSS API"] --> ADAPTER["Integration Adapter"]
  ADAPTER --> CORR["Discovery / Correlation"]
  CORR --> DOMAIN["Beluga Domain"]
  DOMAIN --> API["Unified API"]
  API --> UI["Manager UI"]`} />

## State Model

Beluga Manager distinguishes:

| State | Meaning |
|---|---|
| Authoritative state | State owned by the upstream OSS |
| Short-lived cache | Performance cache |
| Correlation index | Cross-service relationship index |
| Beluga-owned metadata | Explicit platform metadata and mappings |

Uncertain relationships should not be presented as authoritative facts.

## MVP Direction

The repository is currently **early development / architecture-first**. The planned order is:

<Mermaid chart={`flowchart TB
  CONTRACT["API Contract"] --> API["Unified Service API"]
  API --> CORR["Discovery / Correlation"]
  CORR --> PIPE["Kafka → Flink → Iceberg → Trino"]
  PIPE --> DOMAIN["Data Asset · Query · Operations"]`} />

Initial scope focuses on read-first capabilities: service discovery, pipeline topology, health/status, degraded/stale states, resource/event/log drill-down, and English/Korean foundations. Broad destructive management actions remain out of scope for the first slice.

## API Direction

```text
GET /api/v1/services
GET /api/v1/services/{id}
GET /api/v1/pipelines
GET /api/v1/pipelines/{id}
GET /api/v1/data-assets
GET /api/v1/health
GET /api/v1/events
```

The frontend should consume Beluga Domain APIs rather than calling every upstream OSS API directly.

## Internationalization

The project is designed around `en-US` and `ko-KR`, browser detection, manual selection, persistent preferences, and locale-neutral APIs. Real resource identifiers such as Topic names, tables, jobs, and namespaces are never translated.

## Current Status

**Early development.** Beluga Manager is being established as a reference implementation for the problem of cross-OSS data-platform context rather than as a finished production management console.

## Getting Started

```bash
git clone https://github.com/dasomel/beluga-manager.git
cd beluga-manager
pnpm install
pnpm dev
```

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [Manager Overview](/oss/en/beluga-manager/overview) | Problem, domains, MVP |
| Architecture | [Control Plane Architecture](/oss/en/beluga-manager/architecture) | Adapters, correlation, unified API |
| Development | [Development Guide](/oss/en/beluga-manager/development) | Project structure and local workflow |
| Operations | [Operations](/oss/en/beluga-manager/operations) | Deployment and environment conventions |

## Project Relationship

<Mermaid chart={`flowchart TB
  BELUGA["Beluga Data Platform"] --> KAFKA["Kafka"]
  BELUGA --> FLINK["Flink"]
  BELUGA --> ICEBERG["Iceberg"]
  BELUGA --> TRINO["Trino"]
  BELUGA --> AIRFLOW["Airflow"]
  KAFKA --> MANAGER["Beluga Manager"]
  FLINK --> MANAGER
  ICEBERG --> MANAGER
  TRINO --> MANAGER
  AIRFLOW --> MANAGER
  MANAGER --> DOMAINS["Pipeline · Data Asset · Service · Operations"]`} />
