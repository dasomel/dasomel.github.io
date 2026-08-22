---
title: Quota Agent Overview
description: NFS PV quota enforcement mechanisms and architectural principles.
project: NFS Quota Agent
path: nfs-quota-agent/overview
order: 1300
lastModified: 2026-08-23
---

# Quota Agent Overview

NFS Quota Agent eliminates shared storage exhaustion in Kubernetes NFS environments.

## Core Challenge
- Standard NFS does not enforce per-directory storage limits
- Workloads can exceed requested storage without restriction
- Solved via XFS Project Quotas enforced at the Linux kernel layer

## Related Links

- [NFS Quota Agent Repository](https://github.com/dasomel/nfs-quota-agent)
- [English Project Home](/oss/en/nfs-quota-agent/)
