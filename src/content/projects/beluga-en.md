---
title: "Beluga"
description: "A local Kubernetes data platform connecting Kafka, CDC, Flink, Iceberg, Trino, Superset, and Airflow"
github: "https://github.com/dasomel/beluga"
tags: ["Kubernetes", "k3s", "Data Platform", "Kafka", "Debezium", "Flink", "Iceberg", "Trino", "Airflow", "GitOps"]
order: 10
type: "own"
featured: true
problem: "Each modern data-platform component is easy to deploy in isolation, but reproducing CDC, streaming, lakehouse, query, BI, and orchestration boundaries consistently is difficult on a local machine"
solution: "A reproducible k3s-based reference platform using Vagrant, Helm, and Argo CD GitOps, validated through real end-to-end clickstream and PostgreSQL CDC flows"
---

## Project Overview

**Beluga** is a self-hosted, learning-scale modern data platform for reproducing the end-to-end data lifecycle on local Kubernetes.

It intentionally focuses on **integration evidence**, not production-scale infrastructure. The platform demonstrates how CDC, streaming, stream processing, lakehouse storage, SQL analytics, BI, and orchestration can work together under one GitOps-managed environment.

```text
Source / PostgreSQL
        │
        ├── Debezium CDC
        ▼
      Kafka
        │
        ▼
      Flink
        │
        ▼
 Iceberg Lakehouse
        │        │
        │        └── Trino → Superset
        │
        └── Airflow orchestration
```

## Platform Components

| Area | Components | Role |
|---|---|---|
| Cluster | k3s, Cilium, MetalLB | Local Kubernetes base |
| Gateway | APISIX, etcd | HTTP entrypoint |
| GitOps | Argo CD | App-of-Apps deployment |
| Identity | Keycloak, OpenLDAP | Authentication and groups |
| Policy | OPA, OpenFGA | Policy and authorization |
| Streaming | Strimzi Kafka, Debezium | Events and CDC |
| Processing | Flink Kubernetes Operator | Stateful stream processing |
| Catalog | Lakekeeper | Iceberg REST catalog |
| Storage | SeaweedFS | S3-compatible object storage |
| Database | CloudNativePG | PostgreSQL source and metadata |
| Query | Trino | Distributed SQL over Iceberg |
| BI | Superset | Analytics and dashboards |
| Orchestration | Airflow 3 | DAG-based workflows |
| Optional governance | OpenMetadata, OpenSearch | Catalog and lineage |
| Observability | Prometheus Stack | Platform metrics |

## Integration Model

The platform is split into `beluga-platform` and `beluga-data` Helm layers, both deployed through Argo CD. This keeps platform services and data workloads independently understandable while maintaining a single bootstrap path.

Two real data demonstrations provide validation:

- **Synthetic clickstream** — generated events through streaming and lakehouse processing
- **PostgreSQL CDC** — source DB changes captured by Debezium and processed into the lakehouse

## Local Resource Profile

Beluga is not a tiny demo. It provisions four VMs and a full data stack.

- 32GB host RAM minimum
- 48GB+ enables larger profiles and OpenMetadata/Trino workers
- 64GB+ adds further worker memory
- VMware Fusion on ARM64 or VirtualBox on AMD64
- profile selection is based on detected host resources

This makes Beluga a reference environment for studying the **integration cost of a complete data platform**, rather than a lightweight sample app.

## Verification

The repository deliberately separates rendering from real runtime verification:

```text
make test
   ↓
cluster health
   ↓
Kafka + CDC
   ↓
Flink + Iceberg
   ↓
Trino query
   ↓
Airflow / Superset
   ↓
authorization regression
```

The scripts inspect real cluster/API state instead of treating successful Helm rendering as proof of a working platform.

## Security and Credentials

Passwords are not committed to the repository. Bootstrap generates credentials and stores them in Kubernetes Secrets, while Helm values use placeholders/references rather than static credentials.

The repository also keeps policy declarations under `policies/` so identity, authorization, and database policy generation can remain aligned.

## Current Status

Beluga is a **personal / learning-scale reference platform**.

- Core Kafka/CDC → Flink → Iceberg → Trino/Superset/Airflow flow is implemented toward clean-install E2E validation.
- The local cluster is not continuously running, so not every latest change has live-cluster validation.
- Governance/policy compiler integration continues as a separate evolution area.

## Getting Started

```bash
git clone https://github.com/dasomel/beluga.git
cd beluga
make up
make status
make test
```

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [Platform Overview](/oss/en/beluga/overview) | Scope and product model |
| Architecture | [Pipeline Architecture](/oss/en/beluga/architecture) | Component boundaries and data flow |
| Getting Started | [Cluster Setup](/oss/en/beluga/getting-started) | VM → k3s → GitOps bootstrap |
| Operations | [Data Operations](/oss/en/beluga/operations) | Lifecycle and operational runbooks |
| Troubleshooting | [Troubleshooting](/oss/en/beluga/troubleshooting) | Cluster, Kafka, Flink, and query issues |

## Project Relationship

```text
kube-ready-box
      ↓
Beluga local Kubernetes
      ↓
Kafka → Flink → Iceberg → Trino → Superset
      ↓
Beluga Manager (unified control plane, early stage)
```
