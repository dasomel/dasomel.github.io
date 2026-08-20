---
title: "Beluga"
description: "A self-hosted local data platform that reproduces the full flow from CDC to Lakehouse and BI on Kubernetes"
github: "https://github.com/dasomel/beluga"
tags: ["Data Platform", "Kafka", "CDC", "Flink", "Iceberg", "Trino", "Kubernetes", "GitOps"]
order: 1
type: "own"
featured: true
problem: "Learning Kafka, CDC, Flink, Iceberg, Trino, Superset, and Airflow separately makes it hard to reproduce a real end-to-end data flow locally"
solution: "Provides a reproducible Vagrant + Helm + ArgoCD environment for CDC → Kafka → Flink → Iceberg → Trino/Superset → Airflow with E2E verification"
---

## Overview

**Beluga** is a self-hosted data platform for reproducing a modern data stack end to end on a local Kubernetes cluster.

```text
PostgreSQL
  ↓ CDC
Kafka
  ↓
Flink
  ↓
Iceberg Lakehouse
  ↓
Trino / Superset
  ↓
Airflow
```

The goal is not simply to install components, but to make the **complete data journey executable and verifiable**.

## Current Direction

- Local Kubernetes with Vagrant
- Kafka + CDC
- Flink streaming
- Iceberg Lakehouse
- Trino / Superset query and BI
- Airflow orchestration
- Helm + ArgoCD based IaC

## Links

- **GitHub**: [dasomel/beluga](https://github.com/dasomel/beluga)
