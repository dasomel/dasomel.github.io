---
title: 스토리지 아키텍처
description: Linux XFS Project Quota 커널 메커니즘, gRPC 데몬 내부 구조 및 프로비저닝 흐름.
project: NFS Quota Agent
path: nfs-quota-agent/architecture
order: 1301
lastModified: 2026-08-27
---

# 스토리지 아키텍처

NFS Quota Agent는 Go 언어로 작성된 경량 단일 바이너리 데몬으로, NFS 호스트 서버에서 루트 권한으로 실행됩니다.

## 내부 아키텍처 구성

<Mermaid chart={`flowchart TB
  CSI["Kubernetes CSI Driver / Client"] -->|"gRPC :50051 / HTTP :8080"| AGENT["nfs-quota-agent Daemon · Go"]

  subgraph CAP["Agent capabilities"]
    GRPC["gRPC Server\nCreateQuota · SetQuota · DeleteQuota"]
    HTTP["HTTP REST + Prometheus metrics"]
    PID["Project ID Allocator\n/etc/projects · /etc/projid"]
    CTRL["XFS Quota Controller\nxfs_quota CLI / ioctl"]
  end

  AGENT --> GRPC
  AGENT --> HTTP
  AGENT --> PID
  AGENT --> CTRL
  CTRL -->|"Linux VFS / XFS enforcement"| FS["/srv/nfs filesystem\nmounted with pquota"]
  FS --> P1["pvc-aaaa · Project 1001 · 10 GiB"]
  FS --> P2["pvc-bbbb · Project 1002 · 50 GiB"]
  FS --> P3["pvc-cccc · Project 1003 · 5 GiB"]`} />

이 구조는 **Kubernetes 요청 → Agent 제어 로직 → Linux/XFS 커널 강제**의 세 계층을 분리해서 보여줍니다. 실제 용량 제한은 애플리케이션 레벨이 아니라 XFS Project Quota가 커널에서 강제합니다.

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
