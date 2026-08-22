---
title: "Beluga"
description: "A self-hosted all-in-one modern data platform on local Kubernetes (Kafka + Flink + Iceberg + Trino + Airflow)"
github: "https://github.com/dasomel/beluga"
tags: ["Kubernetes", "DataPlatform", "Kafka", "Flink", "Iceberg", "Trino", "Superset", "Airflow", "ArgoCD"]
order: 10
type: "own"
featured: true
problem: "Setting up modern data stacks (Kafka, Flink, Iceberg, Trino, Superset, Airflow) locally for development is painful and time-consuming"
solution: "A complete, self-hosted data platform deployed via Vagrant and Argo CD GitOps with one-click automation"
---

## Project Overview

**Beluga** is an open-source, all-in-one modern data platform deployed on local Kubernetes via Infrastructure as Code (IaC).

It covers the complete data lifecycle: Debezium CDC ingestion, Kafka event streaming, Apache Flink real-time transformation, Apache Iceberg lakehouse storage, Trino distributed SQL querying, Apache Superset BI visualization, and Apache Airflow batch orchestration.

### End-to-End Pipeline Flow

```text
  [Data Sources] (RDBMS / PostgreSQL)
         │
         ▼ Debezium CDC
  ┌────────────────────────────────────────────────────────┐
  │  Apache Kafka (Event Streaming & Buffer)               │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼ Stream Processing
  ┌────────────────────────────────────────────────────────┐
  │  Apache Flink (Real-time Stateful Transformations)     │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼ Lakehouse Storage (MinIO S3)
  ┌────────────────────────────────────────────────────────┐
  │  Apache Iceberg (ACID Table Format & Time Travel)      │
  └─────────────┬────────────────────────────┬─────────────┘
                │                            │
                ▼ Query Engine               ▼ Orchestration
  ┌───────────────────────────┐   ┌────────────────────────┐
  │  Trino (Distributed SQL)  │   │  Apache Airflow (DAGs) │
  └─────────────┬─────────────┘   └────────────────────────┘
                │
                ▼ BI & Visualization
  ┌───────────────────────────┐
  │  Apache Superset (Charts) │
  └───────────────────────────┘
```

---

## 7 Core Data Components

| Component | Responsibility | Key Features |
|---|---|---|
| **Kafka & Debezium** | Event Streaming & CDC | Low-latency change data capture and event buffering |
| **Apache Flink** | Real-time Stream Processing | Stateful stream transformation with exactly-once guarantees |
| **Apache Iceberg** | Open Lakehouse Table Format | ACID transactions, time travel, and schema evolution |
| **MinIO S3** | Object Storage | High-throughput local S3-compatible storage tier |
| **Trino** | Distributed SQL Query Engine | High-speed interactive ANSI SQL analytics over lakehouse tables |
| **Apache Superset** | BI & Dashboard Visualization | Rich interactive dashboards and visual data exploration |
| **Apache Airflow** | Workflow Orchestration | Python-authored DAG scheduling and workflow management |

---

## Getting Started

```bash
# 1. Clone repository
git clone https://github.com/dasomel/beluga.git
cd beluga

# 2. Boot local cluster
vagrant up

# 3. Verify Argo CD GitOps synchronization
vagrant ssh master -c "kubectl get applications -n argocd"

# 4. Trigger demo data pipeline
make demo-pipeline
```

---

## Documentation Index

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [Platform Overview](/oss/en/beluga/overview) | Architecture and core value proposition |
| **Architecture** | [Pipeline Architecture](/oss/en/beluga/architecture) | Kafka → Flink → Iceberg → Trino data flow |
| **Getting Started** | [Cluster Setup](/oss/en/beluga/getting-started) | Vagrant + Helm local bootstrap guide |
| **Operations** | [Data Operations](/oss/en/beluga/operations) | Lifecycle, metrics, and backup runbooks |
| **Troubleshooting** | [Troubleshooting Guide](/oss/en/beluga/troubleshooting) | Kafka lag, Flink checkpoints, and query tuning |
