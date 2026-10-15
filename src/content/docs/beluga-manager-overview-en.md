---
title: Manager Overview
description: The unified control plane in the manager/ directory of the beluga monorepo — target domains and implementation scope as of 2026-10-15.
project: Beluga
path: beluga/manager-overview
order: 1505
lastModified: 2026-10-15
---

# Manager Overview

**Beluga Manager** is the unified control plane that connects Beluga's OSS components through one domain model. Under [ADR-0005](https://github.com/dasomel/beluga/blob/main/docs/adr/0005-consolidate-beluga-manager-into-monorepo.md) (2026-10-15), the standalone `dasomel/beluga-manager` repository was consolidated, with full history, into the **`manager/` directory** of `dasomel/beluga`, and the old repository was archived.

Kafka, Flink, Iceberg, Trino, and Airflow remain authoritative for their own resources; Manager correlates them to answer platform-level questions. It is not a portal that replaces the OSS UIs.

## Domains

- **Pipeline**: Kafka → Flink → Iceberg → Trino relationships
- **Data Asset**: catalog, schema, table, and query context
- **Service**: each OSS expressed as a platform capability
- **Operations**: health, event, resource, and dependency correlation

## Implementation scope as of 2026-10-15

Checked against `manager/docs/IMPLEMENTATION-STATUS.md` and the `manager/` sources on beluga `origin/main` (`4bd0190`).

- **Implemented**: the Domain API in `packages/domain-api` (Hono + `@hono/zod-openapi`), the `packages/web` console (React 19 + Vite) with Overview, Services, Pipelines, Data Catalog, Query Workspace, and Policy views (plus Architecture and Operations), `packages/policy-compiler` with the `policyctl` CLI, and an English/Korean UI.
- **Stub by default**: without configuration, the Domain API answers from fixtures checked into the repository. Passing fixture-backed tests is not evidence of real upstream behavior.
- **Three opt-in read-only adapters**: Flink (`BELUGA_FLINK_*`), Trino query history (`BELUGA_TRINO_*`), and the Lakekeeper catalog (`BELUGA_LAKEKEEPER_*`). All are off by default, and only the Flink adapter has a documented live-cluster check.
- **Not implemented**: Kafka, Debezium (CDC), and Airflow adapters, live telemetry discovery, authentication/authorization middleware, and a deployment chart.

The earlier claim that "no frontend, backend, or adapter exists" no longer matches reality and has been corrected. This is still not a finished operations console; it is at a read-first stage.

## Where to go next

- [Architecture](/oss/en/beluga/manager-architecture) — adapters, correlation, state model
- [Development](/oss/en/beluga/manager-development) — `cd manager && npm install`
- [Deployment & Operations](/oss/en/beluga/manager-operations) — current deployment boundary
