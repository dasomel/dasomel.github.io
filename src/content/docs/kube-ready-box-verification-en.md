---
title: Node Verification
description: Node Readiness Attestation and 30 automated integrity checks.
project: Kube-Ready-Box
path: kube-ready-box/verification
order: 1400
lastModified: 2026-08-23
---

# Node Verification

System integrity attestation ensuring node readiness for Kubernetes.

## Verification Checkpoints
- Loaded `br_netfilter` and `overlay` modules
- Verified XFS `pquota` active mount flags
- Verified containerd execution and cgroup v2 hierarchy

## Related Links

- [Kube-Ready-Box Repository](https://github.com/dasomel/kube-ready-box)
- [English Project Home](/oss/en/kube-ready-box/)
