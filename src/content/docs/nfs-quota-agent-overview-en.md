---
title: Quota Agent Overview
description: Physical storage quota enforcement mechanisms and design principles for NFS PVs.
project: NFS Quota Agent
path: nfs-quota-agent/overview
order: 1300
lastModified: 2026-08-23
---

# Quota Agent Overview

**NFS Quota Agent** is a high-performance storage enforcement daemon bringing strict filesystem-level quotas to Kubernetes NFS PersistentVolumes.

## Background & Motivation

- **Standard NFS Limitation**: Standard NFS provisioners track requested storage (`10Gi`) only as Kubernetes metadata without enforcing physical disk limits on the underlying storage host.
- **Storage Exhaustion Risk**: A single rogue workload writing unbounded data can exhaust shared NFS disks, crashing co-located services.
- **Solution**: Leverages Linux kernel **XFS Project Quotas (`xfs_quota`)** to enforce byte-accurate hard limits per NFS subdirectory.

## Key Features

- **XFS Project Quota Engine**: Immutable Project IDs mapped to directories for kernel-enforced limits
- **gRPC & HTTP APIs**: Low-latency RPC for CSI provisioners alongside REST management endpoints
- **QuotaPolicy CRD**: Native Kubernetes declarative custom resource definitions
- **Prometheus Metrics**: Real-time volume utilization, headroom, and quota violation alerts
- **Built-in Web UI**: Responsive storage administration dashboard
