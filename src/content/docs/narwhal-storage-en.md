---
title: Storage & Databases
description: NFS CSI + nfs-quota-agent, SeaweedFS S3 object storage, and CloudNativePG.
project: Narwhal
path: narwhal/storage
order: 1106
lastModified: 2026-08-23
---

# Storage & Databases

Narwhal provides a production-grade storage tier spanning file, object, and relational database systems.

## Storage Engines

1. **NFS PersistentVolumes (`nfs-quota-agent`)**:
   - Shared XFS storage hosted on `master-1`
   - Strict per-PV byte limits enforced via Linux XFS Project Quotas
2. **SeaweedFS S3 Object Storage**:
   - High-throughput distributed S3-compatible object storage
   - Target backend for Velero snapshots, Loki chunks, and Tempo blocks
3. **CloudNativePG (PostgreSQL)**:
   - High-availability PostgreSQL cluster backing Keycloak, Gitea, and APISIX
   - Automated streaming replication and continuous Barman WAL archiving
