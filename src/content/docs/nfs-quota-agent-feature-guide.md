---
title: 기능 및 CRD 가이드
description: QuotaPolicy CRD, 동적 볼륨 프로비저닝, Prometheus 메트릭 및 REST API.
project: NFS Quota Agent
path: nfs-quota-agent/feature-guide
order: 1302
lastModified: 2026-08-23
---

# 기능 및 CRD 가이드

NFS Quota Agent가 제공하는 선언적 CRD 및 모니터링 기능에 대한 상세 가이드입니다.

## QuotaPolicy CRD 사양

```yaml
apiVersion: storage.dasomel.io/v1alpha1
kind: QuotaPolicy
metadata:
  name: database-quota-policy
  namespace: database
spec:
  pvcSelector:
    matchLabels:
      tier: production-db
  hardLimit: "50Gi"
  softLimit: "45Gi"
  gracePeriod: "24h"
  alertThresholdPercent: 85
```

## 주요 REST API 엔드포인트

| Method | Endpoint | 설명 |
|---|---|---|
| `GET` | `/api/v1/quotas` | 전체 XFS 쿼터 할당 및 사용량 목록 조회 |
| `POST` | `/api/v1/quotas` | 신규 디렉토리에 대한 쿼터 생성 및 ProjectID 할당 |
| `GET` | `/api/v1/quotas/{id}` | 특정 ProjectID의 상세 사용 통계 조회 |
| `PUT` | `/api/v1/quotas/{id}` | 기존 쿼터의 Hard/Soft 용량 수정 (볼륨 확장) |
| `DELETE`| `/api/v1/quotas/{id}` | 쿼터 해제 및 ProjectID 회수 |
| `GET` | `/metrics` | Prometheus 표준 메트릭 스크랩 엔드포인트 |

## Prometheus 모니터링 메트릭

- `nfs_quota_used_bytes{project_id="101", path="/srv/nfs/pvc-1"}`: 현재 사용 중인 바이트 수
- `nfs_quota_limit_bytes{project_id="101", path="/srv/nfs/pvc-1"}`: 설정된 하드 쿼터 바이트 수
- `nfs_quota_utilization_ratio`: 쿼터 사용률 비율 (`used / limit`)
- `nfs_quota_violation_total`: 쿼터 초과 차단 발생 횟수 카운터
