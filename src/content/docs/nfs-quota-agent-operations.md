---
title: 운영 및 모니터링
description: Web UI 운영, 알림 설정 및 장애 복구 절차.
project: NFS Quota Agent
path: nfs-quota-agent/operations
order: 1300
lastModified: 2026-08-23
---

# 운영 및 모니터링

일일 운영 및 장애 복구 지침입니다.

## 모니터링 항목
- `nfs_quota_used_bytes` / `nfs_quota_limit_bytes`: 용량 사용률 메트릭
- 쿼터 90% 초과 시 Prometheus Alertmanager 경고 전송
- XFS 파일시스템 점검: `xfs_repair` 및 `xfs_quota -c 'report -pbih' <path>`

## 관련 링크

- [NFS Quota Agent 저장소](https://github.com/dasomel/nfs-quota-agent)
- [프로젝트 홈](/oss/nfs-quota-agent/)
