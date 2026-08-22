---
title: Deployment & Operations
description: Multi-stage container builds, health probes, and operational config.
project: Narwhal Portal
path: narwhal-portal/operations
order: 1200
lastModified: 2026-08-23
---

# Deployment & Operations

Production deployment baseline for Kubernetes.

## Operational Invariants
- Multi-stage minimal runtime container (`USER 10001`)
- Health probe endpoint at `/api/health`
- Runtime config injection via ConfigMaps and Secrets

## Related Links

- [Narwhal Portal Repository](https://github.com/dasomel/narwhal-portal)
- [Portal English Home](/oss/en/narwhal-portal/)
