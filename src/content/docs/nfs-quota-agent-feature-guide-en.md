---
title: Features & CRD Guide
description: QuotaPolicy CRD, dynamic provisioning, Prometheus metrics, and REST APIs.
project: NFS Quota Agent
path: nfs-quota-agent/feature-guide
order: 1302
lastModified: 2026-08-23
---

# Features & CRD Guide

Comprehensive guide to declarative CRDs, APIs, and observability in NFS Quota Agent.

## QuotaPolicy CRD Specification

```yaml
apiVersion: storage.dasomel.io/v1alpha1
kind: QuotaPolicy
metadata:
  name: database-quota-policy
  namespace: database
spec:
  pvcSelector:
    matchLabels:
      tier: production-db
  hardLimit: "50Gi"
  softLimit: "45Gi"
  gracePeriod: "24h"
  alertThresholdPercent: 85
```

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/quotas` | List all active quotas and utilization stats |
| `POST` | `/api/v1/quotas` | Create quota and assign a new Project ID |
| `GET` | `/api/v1/quotas/{id}` | Inspect specific quota metrics |
| `PUT` | `/api/v1/quotas/{id}` | Update hard/soft thresholds (volume expansion) |
| `DELETE`| `/api/v1/quotas/{id}` | Remove quota and recycle Project ID |
| `GET` | `/metrics` | Prometheus metrics scrape endpoint |
