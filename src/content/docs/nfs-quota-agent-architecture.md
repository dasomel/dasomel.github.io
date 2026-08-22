---
title: 스토리지 아키텍처
description: Linux XFS Project Quota 커널 메커니즘, gRPC 데몬 내부 구조 및 프로비저닝 흐름.
project: NFS Quota Agent
path: nfs-quota-agent/architecture
order: 1301
lastModified: 2026-08-23
---

# 스토리지 아키텍처

NFS Quota Agent는 Go 언어로 작성된 경량 단일 바이너리 데몬으로, NFS 호스트 서버에서 루트 권한으로 실행됩니다.

## 내부 아키텍처 구성

```text
Kubernetes CSI Driver / Client
             │
             ▼ gRPC (:50051) / HTTP (:8080)
┌──────────────────────────────────────────────────────────┐
│  nfs-quota-agent Daemon (Go)                             │
│  ├─ gRPC Server (CreateQuota, SetQuota, DeleteQuota)    │
│  ├─ HTTP REST & Prometheus Metrics Exporter              │
│  ├─ Project ID Allocator (/etc/projects, /etc/projid)    │
│  └─ XFS Quota Controller (xfs_quota CLI / ioctl)         │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼ Linux Kernel VFS / XFS Engine
┌──────────────────────────────────────────────────────────┐
│  /srv/nfs Filesystem (Mounted with 'pquota')             │
│  ├─ /srv/nfs/pvc-aaaa (Project ID 1001, Limit: 10 GiB)   │
│  ├─ /srv/nfs/pvc-bbbb (Project ID 1002, Limit: 50 GiB)   │
│  └─ /srv/nfs/pvc-cccc (Project ID 1003, Limit: 5 GiB)    │
└──────────────────────────────────────────────────────────┘
```

## XFS Project Quota 커널 동작 원리

1. **마운트 옵션**: XFS 파일시스템이 `pquota` (또는 `prjquota`) 플래그로 마운트되어야 합니다.
2. **디렉토리 매핑**: 새로운 PVC 생성 시 고유한 `Project ID`를 발급하고 디렉토리에 프로젝트 플래그를 설정합니다:
   ```bash
   xfs_quota -x -c 'project -s -p /srv/nfs/pvc-12345 101' /srv/nfs
   ```
3. **용량 한도 설정**: 하드 리밋(Hard Limit)과 소프트 리밋(Soft Limit)을 설정합니다:
   ```bash
   xfs_quota -x -c 'limit -p bhard=10g 101' /srv/nfs
   ```
4. **커널 강제 차단**: 워크로드가 10GiB를 초과하여 쓰기를 시도하면 커널이 즉시 `EDQUOT (Disk quota exceeded)` 에러를 반환합니다.
