---
title: Features & CRD Guide
description: QuotaPolicy CRD, dynamic volume provisioning, and metrics.
project: NFS Quota Agent
path: nfs-quota-agent/feature-guide
order: 1300
lastModified: 2026-08-23
---

# Features & CRD Guide

Declarative storage quota management via Kubernetes CRDs.

## QuotaPolicy Manifest
```yaml
apiVersion: storage.dasomel.io/v1alpha1
kind: QuotaPolicy
metadata:
  name: standard-pvc-quota
spec:
  hardLimit: 10Gi
  softLimit: 8Gi
  gracePeriod: 24h
```

## Related Links

- [NFS Quota Agent Repository](https://github.com/dasomel/nfs-quota-agent)
- [English Project Home](/oss/en/nfs-quota-agent/)
