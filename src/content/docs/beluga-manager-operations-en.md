---
title: Deployment & Operations
description: The current deployment boundary of manager/ — container images and compose exist, a cluster deployment chart does not.
project: Beluga
path: beluga/manager-operations
order: 1508
lastModified: 2026-10-15
---

# Deployment & Operations

## What exists today

- `manager/packages/domain-api/Dockerfile`, `manager/packages/web/Dockerfile` (nginx), and `manager/compose.yaml`. `make dev-up` starts both containers against fixtures. The containers run non-root with a read-only root filesystem, all capabilities dropped, and `no-new-privileges`.
- Host ports are fixed at 5180 (web) and 8787 (API). Podman is documented as unverified.
- Manager releases independently of the platform. CI is path-filtered to `manager/**`, so beluga-only PRs do not run it.
- OpenForge status is no longer a separate entry; it is reported under `beluga` in the root `.openforge/status.json` (the `policy-compiler` capability).

## What does not exist yet

- A Helm chart or Argo CD `Application`. A separate manager deployment chart is not pursued (beluga ADR-0005); any in-cluster deployment will be decided in a new ADR under beluga's `docs/adr/`.
- Authentication/authorization middleware. As a result, the opt-in Trino query history shows the service credential's view to every caller and requires an explicit acknowledgement.
- Kafka, Debezium, and Airflow adapters, and node-level OPA filtering.

Becoming deployable requires authN/authZ, read-only accounts with least privilege per adapter, health/readiness probes, and integration evidence against a real Beluga environment. These are tracked in beluga issues labeled `area:manager`.
