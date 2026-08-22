---
title: 배포 및 운영
description: Multi-stage 프로덕션 컨테이너 빌드, 헬스체크 및 쿠버네티스 배포 가이드.
project: Narwhal Portal
path: narwhal-portal/operations
order: 1203
lastModified: 2026-08-23
---

# 배포 및 운영

Narwhal Portal의 프로덕션 배포 및 운영 기준입니다.

## 컨테이너 빌드 및 보안

- **Multi-Stage Dockerfile**: 빌드 툴체인(Node/pnpm)과 런타임 환경을 분리하여 최종 이미지 크기를 150MB 이하로 경량화
- **Non-Root 실행**: `USER node (UID 10001)`로 실행하여 컨테이너 탈출 취약점 방어
- **헬스 프로브 엔드포인트**: Liveness/Readiness 프로브를 위한 `/api/health` 제공

## 쿠버네티스 배포 매니페스트 예시

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
