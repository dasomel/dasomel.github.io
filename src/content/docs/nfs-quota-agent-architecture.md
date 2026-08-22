---
title: 스토리지 아키텍처
description: Linux XFS Project Quota 및 gRPC 데몬 내부 구조.
project: NFS Quota Agent
path: nfs-quota-agent/architecture
order: 1300
lastModified: 2026-08-23
---

# 스토리지 아키텍처

Go 언어로 작성된 경량 데몬이 XFS 마운트 경로를 직접 관리합니다.

## 내부 아키텍처
- **Project ID 관리자**: `/etc/projects`, `/etc/projid` 매핑 관리
- **gRPC Server**: CSI 볼륨 프로비저닝 시 쿼터 생성/수정/삭제 RPC 처리
- **Prometheus Collector**: 15초 주기로 볼륨별 I/O 및 사용량 수집

## 관련 링크

- [NFS Quota Agent 저장소](https://github.com/dasomel/nfs-quota-agent)
- [프로젝트 홈](/oss/nfs-quota-agent/)
