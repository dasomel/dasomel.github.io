---
title: 기능 및 CRD 가이드
description: QuotaPolicy CRD, 동적 프로비저닝, 메트릭.
project: NFS Quota Agent
path: nfs-quota-agent/feature-guide
order: 1300
lastModified: 2026-08-23
---

# 기능 및 CRD 가이드

Kubernetes CRD를 통해 선언적으로 쿼터 정책을 정의할 수 있습니다.

## QuotaPolicy 매니페스트
```yaml
apiVersion: storage.dasomel.io/v1alpha1
kind: QuotaPolicy
metadata:
  name: standard-pvc-quota
spec:
  hardLimit: 10Gi
  softLimit: 8Gi
  gracePeriod: 24h
```

## 관련 링크

- [NFS Quota Agent 저장소](https://github.com/dasomel/nfs-quota-agent)
- [프로젝트 홈](/oss/nfs-quota-agent/)
