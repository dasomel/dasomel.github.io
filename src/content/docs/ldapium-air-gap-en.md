---
title: Air-Gap Deployment
description: Offline artifact packaging and verification for disconnected networks.
project: ldapium
path: ldapium/air-gap
order: 1700
lastModified: 2026-08-23
---

# Air-Gap Deployment

Air-gap bundle creation for disconnected enterprise environments.

## Offline Workflow
1. Execute `scripts/bundle-images.sh` to package container images
2. Push images to internal offline mirror registry
3. Configure internal registry paths in Helm values

## Related Links

- [ldapium Repository](https://github.com/dasomel/ldapium)
- [English Project Home](/oss/en/ldapium/)
