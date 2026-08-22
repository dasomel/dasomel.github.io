---
title: Installation Guide
description: Docker Compose local execution and Kubernetes Helm production deployment.
project: ldapium
path: ldapium/getting-started
order: 1702
lastModified: 2026-08-23
---

# Installation Guide

Deploying ldapium across Docker Compose and Kubernetes environments.

## Docker Compose Quickstart

```bash
git clone https://github.com/dasomel/ldapium.git
cd ldapium
cp .env.example .env
docker compose up -d
```

## Kubernetes Helm Deployment

```bash
helm install ldapium ./charts/ldapium   --namespace identity   --create-namespace   --set admin.password="StrongRandomPassword123!"
```
