---
title: Deployment & Operations
description: Multi-stage container packaging, runtime configuration, and K8s deployment.
project: Beluga Manager
path: beluga-manager/operations
order: 1603
lastModified: 2026-08-23
---

# Deployment & Operations

Production deployment and configuration standards for Beluga Manager.

## Kubernetes Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: beluga-manager
  namespace: beluga-system
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: manager
        image: ghcr.io/dasomel/beluga-manager:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: KAFKA_REST_URL
          value: "http://kafka-rest:8082"
        - name: FLINK_REST_URL
          value: "http://flink-jobmanager:8081"
```
