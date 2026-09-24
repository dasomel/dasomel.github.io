---
title: "Beluga Manager"
description: "An early control-plane project establishing architecture and contracts for connecting Beluga services through common domains"
github: "https://github.com/dasomel/beluga-manager"
tags: ["Data Platform", "Control Plane", "Kafka", "Flink", "Iceberg", "Trino", "Airflow", "API"]
order: 11
type: "own"
featured: true
problem: "Kafka, Flink, Iceberg, Trino, and Airflow expose independent APIs and UIs, making cross-service pipeline context difficult to inspect from one place"
solution: "Use adapters and correlation to expose stable platform domains without replacing upstream systems or creating a second source of truth"
---

## Project Overview

**Beluga Manager** is an early project establishing the architecture and contracts for a unified Beluga control plane. It is not yet an executable management console.

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

<Mermaid chart={`flowchart TB
  CONTRACT["API Contract"] --> API["Unified Service API"]
  API --> CORR["Discovery / Correlation"]
  CORR --> PIPE["Kafka → Flink → Iceberg → Trino"]
  PIPE --> DOMAIN["Data Asset · Query · Operations"]`} />

Initial scope versus actually-verified implementation status (as of 2026-09-21, checked against `main`):

| Item | Status |
|---|---|
| Unified Service API / Pipeline Domain API | **Implemented** — `packages/domain-api` (Hono + `@hono/zod-openapi`) serves `/api/v1/services`, `/pipelines`, `/data-assets`, `/health`, `/events` |
| Pipeline topology view | **Implemented** — the Architecture view renders a graph with `@xyflow/react` |
| Service health/status, degraded/stale state | **Implemented** — warning badges driven by each service's `staleAfterMs` |
| resource/event/log drill-down | **Partial** — the Operations view only provides an event timeline; resource/log drill-down does not exist yet |
| English/Korean UI foundation | **Implemented** |
| Service discovery / cross-service correlation (real adapters) | **Not implemented** — every API above is served from hand-written stub data (`stub-data/*.ts`); there is no real call to Kafka, Flink, Iceberg, Trino, Airflow, or Kubernetes yet (scope of #41/#42) |

Reimplementing specialist OSS UIs or offering broad destructive management actions is still out of scope for now.

## API Direction

`packages/domain-api` actually implements the endpoints below as an OpenAPI contract (issue #43) — but the responses are still stub data, and the code itself is annotated "STUB DATA, NOT LIVE UPSTREAM INTEGRATION."

```text
GET /api/v1/services
GET /api/v1/services/{id}
GET /api/v1/pipelines
GET /api/v1/pipelines/{id}
GET /api/v1/data-assets
GET /api/v1/health
GET /api/v1/events
```

The frontend should consume Beluga Domain APIs rather than calling every upstream OSS API directly. Five of `packages/web`'s views — Overview, Services, Pipelines, Architecture, and Operations — are already wired to this API via TanStack Query hooks (`useServices`/`usePipelines`/`useEvents`/`useDomainApiHealth`); Data Catalog, Query Workspace, and Policy still run on static `mockData.ts`/demo content.

## Policy Compiler

`packages/policy-compiler` is not a separate companion project anymore — it lives in this repository's npm workspace. It compiles Zod-validated YAML policy declarations (matching `policies/` in the Beluga data-platform repo) into Keycloak realm configuration, Trino OPA Rego policies, and PostgreSQL DDL/roles, and provides drift detection between current and desired state (`src/drift.ts`, `src/compare.ts`) plus a `policyctl` CLI (`bin/policyctl.ts`). The compiler core, each backend (Keycloak/pgddl/Rego), drift, schema, and validation all have vitest coverage.

## Architecture Decision Records (ADRs)

ADR-0001 (React 19 + Vite 8 + Tailwind 4 frontend), ADR-0002 (TypeScript/Node npm workspace, Hono backend), and ADR-0003 (shadcn/ui + Radix design system, WCAG 2.2 AA target) are all Accepted. However, `packages/web` today is Tailwind-only screens — the shadcn/ui components ADR-0003 selected (data grid, DAG graph, dedicated SQL editor, etc.) have not been adopted yet.

## System-1 Decision Provider (issue #69)

`packages/domain-api/src/decision/` scaffolds a provider-neutral, Zod-validated decision interface plus a deterministic rule-based provider that fails closed when telemetry is missing or stale. No local-model or external-provider integration exists yet.

## Internationalization

The project is designed around `en-US` and `ko-KR`, browser detection, manual selection, persistent preferences, and locale-neutral APIs. Real resource identifiers such as Topic names, tables, jobs, and namespaces are never translated.

## Current Status

Beluga Manager is no longer just documentation and architecture. It has been restructured into an npm workspace (`packages/domain-api`, `packages/web`, `packages/policy-compiler`); the Domain API contract and 5 of 8 UI views (Overview, Services, Pipelines, Architecture, Operations) are actually wired together; and the Policy Compiler is implemented and tested. That said, the Domain API is still stub-data-backed — **there is no real Kafka/Flink/Iceberg/Trino/Airflow/Kubernetes adapter integration yet** (#41/#42) — so it retains its original character as a reference implementation for "how do you represent the relationships across multiple OSS as one domain," not a finished production management console.

## Getting Started

This repository is an **npm workspace** (`workspaces: ["packages/*"]` in the root `package.json`), not pnpm.

```bash
git clone https://github.com/dasomel/beluga-manager.git
cd beluga-manager
npm install
make verify          # lint + test
npm run dev          # Vite dev server for packages/web
npm test             # vitest across all workspaces
npm run typecheck
npm run policyctl    # policy-compiler CLI
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
