---
title: 스토리지 & 데이터베이스
description: NFS CSI, SeaweedFS S3, nfs-quota-agent, CNPG.
project: Narwhal
path: narwhal/storage
order: 1100
lastModified: 2026-08-23
---

# 스토리지 & 데이터베이스

다양한 워크로드 요구사항을 만족하는 스토리지 및 데이터베이스 계층을 제공합니다.

## 스토리지 솔루션
- **NFS PersistentVolume**: XFS Project Quota 기반 PV 용량 제한 강제 (`nfs-quota-agent`)
- **Object Storage**: SeaweedFS 기반 고성능 분산 S3 호환 객체 저장소
- **CloudNativePG**: 고가용성(HA) PostgreSQL 클러스터 자동 복제 및 백업

## 관련 링크

- [Narwhal 저장소](https://github.com/dasomel/narwhal)
- [Narwhal 포털](/oss/narwhal/)
