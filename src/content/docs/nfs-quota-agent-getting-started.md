---
title: 설치 및 설정
description: systemd 서비스 등록 및 Helm 배포 가이드.
project: NFS Quota Agent
path: nfs-quota-agent/getting-started
order: 1300
lastModified: 2026-08-23
---

# 설치 및 설정

호스트 머신에 데몬을 설치하고 Helm을 통해 클러스터와 연동합니다.

## 설치 요약
1. XFS 파일시스템 생성 및 `pquota` 옵션으로 마운트
2. `nfs-quota-agent.service` systemd 유닛 등록
3. 클러스터에 Helm 차트 배포

## 관련 링크

- [NFS Quota Agent 저장소](https://github.com/dasomel/nfs-quota-agent)
- [프로젝트 홈](/oss/nfs-quota-agent/)
