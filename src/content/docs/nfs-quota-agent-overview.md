---
title: 스토리지 쿼터 개요
description: Kubernetes NFS 스토리지의 물리적 용량 제한 강제 메커니즘과 설계 원칙.
project: NFS Quota Agent
path: nfs-quota-agent/overview
order: 1300
lastModified: 2026-08-23
---

# 스토리지 쿼터 개요

**NFS Quota Agent**는 Kubernetes 클러스터에서 NFS PersistentVolume(PV)에 대해 파일시스템 수준의 엄격한 용량 쿼터(Quota)를 강제하는 고성능 스토리지 에이전트 데몬입니다.

## 문제 배경 및 필요성

- **Kubernetes NFS의 한계**: 표준 NFS CSI 드라이버는 PVC 요청 용량(`spec.resources.requests.storage: 10Gi`)을 쿠버네티스 메타데이터로만 인식할 뿐, 실제 NFS 공유 스토리지에 물리적 용량 제한을 강제하지 못합니다.
- **공유 스토리지 고갈 리스크**: 특정 파드가 무한정 데이터를 기록하면 동일한 NFS 서버를 공유하는 모든 서비스가 디스크 용량 고갈로 연쇄 중단됩니다.
- **해결책**: Linux 커널의 **XFS Project Quotas (`xfs_quota`)** 기능을 활용하여 서브디렉토리별로 바이트 단위의 정확한 하드 리밋(Hard Limit)을 강제합니다.

## 핵심 기능

- **XFS Project Quota 엔진**: 서브디렉토리별 불변 프로젝트 ID(`ProjectID`) 할당 및 커널 레벨 용량 강제
- **gRPC & HTTP API**: CSI 프로비저너 연동을 위한 초고속 RPC 인터페이스 및 RESTful 관리 엔드포인트
- **QuotaPolicy CRD**: 쿠버네티스 네이티브 선언적 매니페스트 지원
- **Prometheus 메트릭**: 볼륨별 실시간 용량 사용량, 남은 공간, 쿼터 초과 알림 메트릭 제공
- **내장 관리 Web UI**: 반응형 스토리지 대시보드 및 실시간 경고 시스템
