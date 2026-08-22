---
title: 배포 및 운영
description: Multi-stage 컨테이너 빌드, 환경변수 주입 및 쿠버네티스 배포 가이드.
project: Beluga Manager
path: beluga-manager/operations
order: 1603
lastModified: 2026-08-23
---

# 배포 및 운영

Beluga Manager의 프로덕션 배포 및 설정 기준입니다.

## 쿠버네티스 매니페스트 예시

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
