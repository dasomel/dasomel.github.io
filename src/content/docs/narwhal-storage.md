---
title: 스토리지 & 데이터베이스
description: NFS CSI + nfs-quota-agent, SeaweedFS S3 객체 스토리지 및 CloudNativePG.
project: Narwhal
path: narwhal/storage
order: 1106
lastModified: 2026-08-23
---

# 스토리지 & 데이터베이스

Narwhal은 파일, 객체, 관계형 데이터베이스를 포괄하는 프로덕션급 스토리지 계층을 제공합니다.

## 스토리지 엔진 구성

1. **NFS PersistentVolumes (`nfs-quota-agent`)**:
   - `master-1` 노드의 XFS 파티션을 NFS로 공유
   - `nfs-quota-agent` 데몬이 XFS Project Quota를 적용하여 PVC 요청 크기만큼 디렉토리 용량을 엄격히 강제
2. **SeaweedFS S3 Object Storage**:
   - 초고속 분산 S3 호환 객체 스토리지
   - Velero 백업 아카이브, Loki 로그 청크, Tempo 트레이스 블록 저장소로 활용
3. **CloudNativePG (PostgreSQL)**:
   - Keycloak, Gitea, APISIX 메타데이터를 저장하는 HA PostgreSQL 클러스터
   - 자동 스트리밍 복제 및 Barman 기반 백업 지원
