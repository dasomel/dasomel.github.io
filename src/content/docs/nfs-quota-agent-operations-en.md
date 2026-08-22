---
title: Operations & Monitoring
description: Web UI administration, Alertmanager rules, XFS diagnostics, and DR.
project: NFS Quota Agent
path: nfs-quota-agent/operations
order: 1304
lastModified: 2026-08-23
---

# Operations & Monitoring

Operational guidelines, alerting thresholds, and disaster recovery runbooks.

## Web UI Management Dashboard

Access the built-in administration dashboard on port `8080`:
- `http://192.168.56.10:8080`
- Real-time PV list, path mappings, capacity charts, and threshold indicators

## Prometheus Alerting Rules

```yaml
groups:
- name: nfs-quota-alerts
  rules:
  - alert: NFSQuotaNearlyFull
    expr: (nfs_quota_used_bytes / nfs_quota_limit_bytes) * 100 > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "NFS PV quota usage exceeds 85%"
      description: "PV at {{ $labels.path }} is currently at {{ $value }}% capacity."
```

## Troubleshooting & Diagnostics

1. **Resync Quotas**:
   ```bash
   xfs_quota -x -c 'quotacheck' /srv/nfs
   ```
2. **Generate Usage Report**:
   ```bash
   xfs_quota -x -c 'report -pbih' /srv/nfs
   ```
