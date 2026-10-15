---
title: Control Plane Architecture
description: Domain API, correlation, adapter structure, authoritative-state boundaries, and the policy compiler seam.
project: Beluga
path: beluga/manager-architecture
order: 1506
lastModified: 2026-10-15
---

# Control Plane Architecture

<Mermaid chart={`flowchart TB
  UI["Manager Web (React + Vite)"] --> API["Domain API (Hono)"]
  API --> DOMAIN["Pipeline · Data Asset · Service · Operations"]
  DOMAIN --> CORR["Discovery / Correlation"]
  CORR --> ADAPTER["Capability-aware Adapters"]
  ADAPTER --> SOURCE["Authoritative OSS APIs"]`} />

## Principles

- Kafka, Flink, Iceberg, Trino, and Airflow keep owning their own state.
- The frontend calls only Beluga domain APIs (`/api/v1/services`, `/pipelines`, `/data-assets`, and so on), never upstream OSS APIs.
- Adapters isolate version and capability differences from the Domain API.
- State is split into authoritative state, short-lived cache, correlation index, and Beluga-owned metadata. Uncertain relationships are not shown as authoritative facts; they keep confidence and evidence.

## Implemented adapters and remaining scope

| Target | Status |
|---|---|
| Flink REST | opt-in, read-only. Maps jobs to Pipelines and links the sink Iceberg table by name convention (confidence 0.6) |
| Trino query history | opt-in, read-only; SQL literals and comments are masked by default |
| Lakekeeper (Iceberg REST) | opt-in, read-only catalog source. No node-level authorization filtering yet |
| Kafka, Debezium, Airflow | not implemented |

With no adapter enabled, the Domain API returns fixtures. Upstream hosts are hardcoded to `*.local.beluga.internal` (per beluga ADR-0005), so there is no standalone deployment target outside this platform.

## Policy compiler seam

`manager/packages/policy-compiler` compiles the YAML policies in `policies/` into Keycloak configuration, Trino OPA Rego (`trino.rego`), and PostgreSQL DDL/roles (`db-roles.sql`). Before consolidation, `ci.yml` and `release.yml` checked out beluga-manager at two different pinned SHAs, and the `ci.yml` pin was 118 commits behind at import time. Now test 14 and both workflows run the compiler from `manager/` in the same tree, so a compiler change and the regenerated artifacts land in one PR.

## Decision records

Manager ADRs live in `manager/docs/adr/`: 0001 frontend (React + Vite), 0002 backend (Hono), 0003 UI design system (shadcn/ui, WCAG 2.2 AA target), and 0004 hierarchical Data Asset API are Accepted; 0006 Safe Actions, 0007 Observability, and 0008 ArgoCD integration are Proposed. 0005 (deployment and GitOps) was superseded by beluga ADR-0005.
