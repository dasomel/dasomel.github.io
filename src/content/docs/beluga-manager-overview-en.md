---
title: Manager Overview
description: Target and current documentation/design boundary of the Beluga unified control plane.
project: Beluga Manager
path: beluga-manager/overview
order: 1600
lastModified: 2026-09-14
---

# Manager Overview

**Beluga Manager** is a design project for connecting Beluga's OSS components through one domain model. The repository currently contains no frontend, backend, Tauri application, or working integration adapter and cannot be deployed as an operational console.

## Target domains

- **Pipeline**: represent Kafka → Flink → Iceberg → Trino relationships
- **Data Asset**: connect catalog, schema, table, and query context
- **Service**: describe individual OSS products as platform capabilities
- **Operations**: correlate health, events, logs, and dependencies

## Implemented today

- English/Korean product, architecture, development, and security documentation
- repository verification script and tests
- CI and OpenForge portfolio-status publication integration

APIs, UI, topology visualization, job controls, and schema management remain target scope rather than current features.
