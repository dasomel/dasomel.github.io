---
title: 운영 및 모니터링
description: Web UI 운영, Alertmanager 알림 설정, XFS 점검 및 장애 복구 절차.
project: NFS Quota Agent
path: nfs-quota-agent/operations
order: 1304
lastModified: 2026-08-23
---

# 운영 및 모니터링

NFS Quota Agent의 일일 운영, 알림 규칙 및 장애 복구 지침입니다.

## Web UI 관리 대시보드

데몬이 실행 중인 호스트의 포트 `8080`으로 접속하여 웹 대시보드를 확인합니다:
- `http://192.168.56.10:8080`
- 활성 PVC 쿼터 목록, 디렉토리 경로, 사용량 그래프 및 임계치 경고 확인

## Prometheus Alertmanager 알림 규칙

```yaml
groups:
- name: nfs-quota-alerts
  rules:
  - alert: NFSQuotaNearlyFull
    expr: (nfs_quota_used_bytes / nfs_quota_limit_bytes) * 100 > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "NFS PV quota usage exceeds 85%"
      description: "PV at {{ $labels.path }} is currently at {{ $value }}% capacity."
```

## 장애 복구 및 XFS 파일시스템 점검

1. **쿼터 불일치 시 재동기화**:
   ```bash
   xfs_quota -x -c 'quotacheck' /srv/nfs
   ```
2. **실시간 쿼터 리포트 확인**:
   ```bash
   xfs_quota -x -c 'report -pbih' /srv/nfs
   ```
