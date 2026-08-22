---
title: Control Plane Architecture
description: Frontend/backend communication and state aggregation models.
project: Beluga Manager
path: beluga-manager/architecture
order: 1600
lastModified: 2026-08-23
---

# Control Plane Architecture

Server-side data aggregation built on Next.js App Router.

## Architecture Stack
- **Client UI**: React Server Components + Client Workbench
- **Backend Adapters**: Kafka REST Proxy, Flink REST API, and Trino JDBC
- **State Store**: In-memory cache and lightweight state persistence

## Related Links

- [Beluga Manager Repository](https://github.com/dasomel/beluga-manager)
- [English Project Home](/oss/en/beluga-manager/)
