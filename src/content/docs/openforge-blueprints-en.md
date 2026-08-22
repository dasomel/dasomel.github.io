---
title: Architecture Blueprints
description: Recommended platform and service architecture patterns combining OpenForge standards and templates.
project: OpenForge
path: openforge/blueprints
order: 1005
lastModified: 2026-08-23
---

# Architecture Blueprints

Blueprints combine individual standards and implementation templates into cohesive, end-to-end engineering architecture patterns.

## 1. OSS Service Blueprint

End-to-end delivery pattern for cloud-native services and applications:

```text
Repository Bootstrap (Standard layout, dual README)
      ↓
CI Pipeline (Linting, unit testing, static analysis)
      ↓
Security Gate (Secret detection, SBOM generation, container scan)
      ↓
Container Build (Multi-stage minimal image build)
      ↓
Artifact Registry (Signed image publication)
      ↓
Kubernetes / GitOps (Argo CD declarative synchronization)
      ↓
Identity & Security (OIDC federation, NetworkPolicy isolation)
      ↓
Observability (Prometheus metrics, structured logging, /healthz)
      ↓
Backup & Runbooks (Automated backup validation and disaster recovery)
```

---

## 2. Platform Component Blueprint

Architectural pattern for infrastructure daemons, bare-metal controllers, and system-level agents:

- **Host & System Integration**: systemd service templates, kernel parameter tuning, storage project quota controls
- **Offline / Air-gap Support**: Pre-packaged container bundles and trusted offline mirror manifests
- **Hardware Compatibility**: Cross-compilation (amd64/arm64) and kernel version compatibility matrices
