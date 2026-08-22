---
title: Platform Overview
description: All-in-one modern data stack platform architecture (Kafka, Flink, Iceberg, Trino, Airflow).
project: Beluga
path: beluga/overview
order: 1500
lastModified: 2026-08-23
---

# Platform Overview

**Beluga** is an open-source, all-in-one modern data platform deployed on local Kubernetes via Infrastructure as Code (IaC).

## Core Value

- **End-to-End Data Pipeline**: Debezium CDC → Kafka streaming → Apache Flink transformations → Apache Iceberg lakehouse → Trino distributed SQL → Superset BI → Airflow orchestration
- **Single-Command Bootstrap**: Deploys the complete platform via Vagrant and Argo CD GitOps
- **Open Standards**: Built entirely on production-grade open-source data technologies
