---
title: Day-2 Operations & DR
description: Velero backup, air-gap offline bundles, and maintenance runbooks.
project: Narwhal
path: narwhal/operations
order: 1100
lastModified: 2026-08-23
---

# Day-2 Operations & DR

Day-2 operational runbooks and disaster recovery strategies.

## Operations Invariants
- **Automated Backups**: Scheduled daily Velero backups across cluster manifests and persistent volumes
- **Air-Gap Deployment**: Self-contained offline archive deployment without external network access
- **Node Maintenance**: Zero-downtime rolling maintenance with `kubectl drain` and PodDisruptionBudgets

## Related Links

- [Narwhal Repository](https://github.com/dasomel/narwhal)
- [Narwhal English Portal](/oss/en/narwhal/)
