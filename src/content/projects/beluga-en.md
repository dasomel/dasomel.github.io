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

<Mermaid chart={`flowchart TB
  SRC["Source / PostgreSQL"] -->|"Debezium CDC"| KAFKA["Kafka"]
  KAFKA --> FLINK["Flink"]
  FLINK --> ICEBERG["Iceberg Lakehouse"]
  ICEBERG --> TRINO["Trino"]
  TRINO --> SUPERSET["Superset"]
  AIRFLOW["Airflow orchestration"] -.-> FLINK
  AIRFLOW -.-> TRINO`} />

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

The single source of truth for exact versions/images/licenses is the repository's [`VERSIONS.md`](https://github.com/dasomel/beluga/blob/main/VERSIONS.md). Notable pins: Kubernetes v1.36 (k3s channel), Strimzi Kafka Operator 1.1.0 (KRaft, Kafka 4.3.0), Debezium 3.6.1.Final, Flink Kubernetes Operator 1.15.0 (runtime Flink 1.20.0), Lakekeeper v0.13.1, Trino 483, Airflow 3.3.0, Superset 6.1.0, Keycloak 26.7.1, CloudNativePG (PostgreSQL 17.6).

## Integration Model

The platform is split into `beluga-platform` and `beluga-data` Helm layers, both deployed through Argo CD. This keeps platform services and data workloads independently understandable while maintaining a single bootstrap path.

Two real data demonstrations provide validation:

- **Synthetic clickstream** — generated events through streaming and lakehouse processing
- **PostgreSQL CDC** — source DB changes captured by Debezium and processed into the lakehouse

## Architecture

<Mermaid chart={`flowchart TB
  subgraph CLUSTER["Beluga local cluster"]
    EDGE["Gateway · Identity · Policy"]
    KAFKA["Kafka / CDC"]
    PLATFORM["Platform Services"]
    FLINK["Flink"]
    LAKE["Lakekeeper + SeaweedFS"]
    TRINO["Trino"]
    SUPERSET["Superset"]
    AIRFLOW["Airflow"]
    EDGE --> KAFKA
    EDGE --> PLATFORM
    KAFKA --> FLINK
    FLINK --> LAKE
    LAKE --> TRINO
    TRINO --> SUPERSET
    AIRFLOW -.-> FLINK
    AIRFLOW -.-> TRINO
    PLATFORM -.-> TRINO
  end`} />

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

<Mermaid chart={`flowchart TB
  TEST["make test"] --> H["01 · cluster health"]
  H --> CDC["02 · Kafka + CDC"]
  CDC --> STREAM["03 · Flink + Iceberg"]
  STREAM --> QUERY["04 · Trino query"]
  QUERY --> DAG["05 · Airflow / Superset"]
  DAG --> AUTH["06 · authorization regression"]`} />

The scripts inspect real cluster/API state instead of treating successful Helm rendering as proof of a working platform.

## Security and Credentials

Passwords are not committed to the repository. Bootstrap generates credentials and stores them in Kubernetes Secrets, while Helm values use placeholders/references rather than static credentials.

The repository also keeps policy declarations under `policies/` so identity, authorization, and database policy generation can remain aligned.

## Operations Agent (read-only PoC)

As the first safe-execution slice for issue #108, `scripts/agent/operations_agent.py` inspects the cluster, collects failure signals, and produces remediation **proposals only, without mutating the cluster**.

- The execution path follows OpenForge Agent Execution Security principles: request → resolve fixed tool/target → canonical invocation digest → risk classification → request-side authorization → fixed argv executor (read-only only) → result hashing/findings → evidence record.
- `configs/operations-agent-policy.json` declares a risk class per tool — `cluster.nodes`/`cluster.pods`/`cluster.events`/`gitops.applications` are `read-only-diagnostic` and executable, while `data.mutate`/`external.http`/`platform.privileged` are `approvalRequired: true` and `executable: false` in the PoC. An approval flag does not make a disabled class executable.
- Safety invariants: no free-form shell/model-generated `kubectl` arguments reach execution — only code-owned argv defined in the script does; an isolated kubeconfig is required instead of the shared `~/.kube/config`; the Kubernetes context must always be `beluga`; evidence stores hashes/byte counts/status rather than raw output.
- The design has seven roles (cluster-inspector, data-service-inspector, identity-inspector, storage-inspector, observability-inspector, hypothesis-agent, verifier), but the current implementation covers only the shared read-only inspection boundary — per-role graph orchestration remains future work.
- `make test-agent` verifies the policy/security suite without a live cluster, backed by a permanent CI workflow (`operations-agent-security.yml`).

## Current Status

Beluga is a **personal / learning-scale reference platform**.

- Core Kafka/CDC → Flink → Iceberg → Trino/Superset/Airflow flow is implemented toward clean-install E2E validation and marked done (`docs/IMPLEMENTATION-STATUS.md`, verified 2026-09-14).
- The local cluster is not continuously running (`vagrant status` shows all 4 VMs stopped), so not every latest change has live-cluster validation.
- Governance/policy compiler integration continues as a separate evolution area.
- The Operations Agent only runs its read-only diagnostic profile; data-mutation, external-egress, and privileged-operation execution remain contractually disabled.
- Cluster-stability fixes have continued since 2026-08-28: scoping MetalLB's L2Advertisement to the private network interface, unblocking the ArgoCD/OpenMetadata UIs behind APISIX, setting explicit key usages on internal-CA certificates, renaming the VMware provider to `vagrant-vmware-desktop` (vmware_desktop), and tuning the VM RAM profile for 64GB hosts.

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

<Mermaid chart={`flowchart TB
  READY["kube-ready-box"] --> K8S["Beluga local Kubernetes"]
  K8S --> FLOW["Kafka → Flink → Iceberg → Trino → Superset"]
  FLOW --> MANAGER["Beluga Manager\nunified control plane · early stage"]`} />
