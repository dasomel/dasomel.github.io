---
title: Architecture Decision Records
description: Architecture decision records on Skaffold workflows and cost-basis optimization.
project: Narwhal Portal
path: narwhal-portal/adr
order: 1204
lastModified: 2026-08-23
---

# Architecture Decision Records

Key architecture decision records (ADRs) governing Narwhal Portal development.

## ADR-0001: Adoption of Skaffold for Inner-Loop Development
- **Status**: Accepted
- **Decision**: Standardize on Skaffold file synchronization and automated incremental builds for local cluster development instead of manual build/push cycles.
- **Impact**: Reduced developer feedback loop from 2 minutes to under 3 seconds.

## ADR-0002: gRPC / Protocol Buffers Contract Standardization
- **Status**: Accepted
- **Decision**: Define gRPC-web with compiled Protocol Buffers schemas as the primary communication contract between the portal and cluster control planes.
- **Impact**: Guaranteed end-to-end type safety with a 60% reduction in JSON serialization overhead.
