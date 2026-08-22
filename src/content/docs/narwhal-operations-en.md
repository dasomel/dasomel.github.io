---
title: Day-2 Operations & DR
description: Velero backup automation, air-gap offline bundles, and maintenance runbooks.
project: Narwhal
path: narwhal/operations
order: 1107
lastModified: 2026-08-23
---

# Day-2 Operations & DR

Narwhal provides comprehensive operational runbooks covering Day-2 lifecycle management and disaster recovery.

## Scheduled Backups & Disaster Recovery (Velero)

- Automated daily snapshots of cluster manifests and PVC volumes stored in SeaweedFS S3
- Full cluster restoration with a single command:
  ```bash
  velero restore create --from-backup narwhal-daily-backup-latest
  ```

## Air-Gap Offline Deployment

Self-contained distribution archives for disconnected environments:
- `narwhal-bundle-arm64.tar.gz` and `narwhal-bundle-amd64.tar.gz`
- Bundles 120 container images, 35 Helm charts, OS deb packages, and binaries
- Automatically pushes images to local mirror registries during bootstrap
