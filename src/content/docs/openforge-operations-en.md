---
title: Operations Guide
description: Post-deployment lifecycle, observability, backup/recovery, and operational standards.
project: OpenForge
path: openforge/operations
order: 1006
lastModified: 2026-08-23
---

# Operations Guide

OpenForge projects document the full **post-deployment lifecycle** in addition to initial setup and installation.

## Essential Operational Checkpoints

1. **Health Probes**: Explicitly defined Liveness (`/healthz`), Readiness (`/readyz`), and Startup probe contracts.
2. **Observability**: Standardized Prometheus metric endpoints, structured JSON logging, and OpenTelemetry trace conventions.
3. **Secret Isolation**: Secrets are strictly separated from configurations and injected via environment variables or secret volumes.
4. **Upgrades & Rollbacks**: Zero-downtime rolling updates, database schema migration compatibility, and emergency rollback runbooks.
5. **Backup & Recovery (DR)**: Automated regular backups verified through tested restore runbooks.
6. **Incident Response**: Severity-based incident response workflows aligned with the [Troubleshooting Guide](/oss/en/openforge/troubleshooting).
