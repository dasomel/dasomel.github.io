---
title: Storage Architecture
description: Linux XFS Project Quotas and gRPC daemon internals.
project: NFS Quota Agent
path: nfs-quota-agent/architecture
order: 1300
lastModified: 2026-08-23
---

# Storage Architecture

A lightweight Go daemon directly governing XFS mount points.

## Architecture
- **Project ID Registry**: Dynamic mapping across `/etc/projects` and `/etc/projid`
- **gRPC Server**: Low-latency RPC handling volume create/resize/delete events
- **Prometheus Collector**: 15s metric collection covering volume usage and limits

## Related Links

- [NFS Quota Agent Repository](https://github.com/dasomel/nfs-quota-agent)
- [English Project Home](/oss/en/nfs-quota-agent/)
