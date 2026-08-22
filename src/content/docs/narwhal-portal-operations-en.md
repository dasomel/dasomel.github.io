---
title: Deployment & Operations
description: Multi-stage production container packaging, health probes, and K8s deployment.
project: Narwhal Portal
path: narwhal-portal/operations
order: 1203
lastModified: 2026-08-23
---

# Deployment & Operations

Production deployment, container hardening, and operational guidelines for Narwhal Portal.

## Container Hardening & Efficiency

- **Multi-Stage Dockerfile**: Strips development toolchains to achieve minimal images under 150MB
- **Non-Root Execution**: Runs strictly as `USER node (UID 10001)`
- **Health Probes**: Standardized `/api/health` endpoint for Liveness and Readiness probes

## Kubernetes Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: narwhal-portal
  namespace: narwhal-system
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: portal
        image: ghcr.io/dasomel/narwhal-portal:v1.2.0
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
        resources:
          limits:
            cpu: "1"
            memory: 512Mi
          requests:
            cpu: "100m"
            memory: 128Mi
```
