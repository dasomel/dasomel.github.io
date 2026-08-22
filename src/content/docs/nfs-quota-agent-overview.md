---
title: 스토리지 쿼터 개요
description: NFS PV 용량 제한 메커니즘과 설계 원칙.
project: NFS Quota Agent
path: nfs-quota-agent/overview
order: 1300
lastModified: 2026-08-23
---

# 스토리지 쿼터 개요

NFS Quota Agent는 Kubernetes NFS 볼륨의 용량 고갈 문제를 근본적으로 해결합니다.

## 핵심 해결 과제
- 일반 NFS는 디렉토리별 용량 제한을 지원하지 않음
- 워크로드가 선언된 용량(`spec.resources.requests.storage`)을 초과해도 차단되지 않음
- XFS Project Quota를 적용하여 호스트 커널 차원에서 디렉토리 용량 초과를 물리적으로 차단

## 관련 링크

- [NFS Quota Agent 저장소](https://github.com/dasomel/nfs-quota-agent)
- [프로젝트 홈](/oss/nfs-quota-agent/)
