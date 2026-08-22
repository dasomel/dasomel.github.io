---
title: 설치 및 배포 가이드
description: Docker Compose 로컬 실행 및 Kubernetes Helm 차트 프로덕션 배포.
project: ldapium
path: ldapium/getting-started
order: 1702
lastModified: 2026-08-23
---

# 설치 및 배포 가이드

Docker Compose 또는 Helm 차트로 ldapium을 배포하는 방법입니다.

## Docker Compose 실행

```bash
git clone https://github.com/dasomel/ldapium.git
cd ldapium
cp .env.example .env
docker compose up -d
```

## Kubernetes Helm 배포

```bash
helm install ldapium ./charts/ldapium   --namespace identity   --create-namespace   --set admin.password="StrongRandomPassword123!"
```
