---
title: Air-Gap Deployment
description: Air-gap bundle packaging, registry mirroring, and verification for disconnected networks.
project: ldapium
path: ldapium/air-gap
order: 1703
lastModified: 2026-08-23
---

# Air-Gap Deployment

Air-gap deployment procedures for disconnected enterprise infrastructures.

```bash
# 1. Package bundles in connected environment
./scripts/bundle-images.sh

# 2. Push to internal offline registry
./scripts/load-images.sh --registry internal-registry.local:5000
```
