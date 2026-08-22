---
title: Container, Kubernetes & IaC Security
description: Hardened container images, non-root execution, NetworkPolicies, and policy-as-code.
project: OpenForge
path: openforge/standards/container-iac-security
order: 1029
lastModified: 2026-08-23
---

# Container, Kubernetes & IaC Security

Cloud-native workloads must be strictly isolated across container runtimes and Kubernetes clusters.

## Security Baseline

- **Multi-Stage Builds**: Compile in builder stages and copy only runtime binaries to minimal base images.
- **Non-Root Execution**: Workloads execute explicitly as non-root users (`USER 65532`).
- **Read-Only Root Filesystem**: Immutability enforced with `readOnlyRootFilesystem: true`.
- **NetworkPolicy Enforcement**: Default-deny ingress/egress policies restricting east-west traffic.
- **PodDisruptionBudgets**: PDBs configured to guarantee availability during maintenance.

## Canonical Source

- [Container, Kubernetes & IaC Security](https://github.com/dasomel/openforge/blob/main/docs/container-iac-security.md)
