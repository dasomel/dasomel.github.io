---
title: "NFS Quota Agent"
description: "Kubernetes용 NFS PV에 자동으로 파일시스템 쿼터를 적용하는 에이전트"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "NFS", "Storage", "Quota", "Go"]
order: 2
type: "own"
---

## 프로젝트 소개

NFS Quota Agent는 **Kubernetes의 NFS 기반 PersistentVolume에 파일시스템 수준의 쿼터를 자동으로 적용**하는 에이전트입니다.

Kubernetes에서 스토리지 용량을 요청해도 NFS에서는 실제로 제한이 적용되지 않는 문제를 해결합니다. 이 에이전트는 NFS 서버 노드에서 실행되며, PV 용량에 맞춰 자동으로 프로젝트 쿼터를 설정합니다.

## 주요 기능

### 자동 쿼터 관리
- **PV 감시**: Kubernetes NFS PersistentVolume을 자동으로 감지
- **쿼터 자동 적용**: PV 용량에 맞춰 파일시스템 프로젝트 쿼터 설정
- **상태 추적**: PV 어노테이션을 통한 쿼터 적용 상태 모니터링

### 파일시스템 지원
- **XFS**: XFS 프로젝트 쿼터 (`xfs_quota`)
- **ext4**: ext4 프로젝트 쿼터 (`setquota`)

### 다양한 프로비저너 지원
- **csi-driver-nfs**: CSI 기반 NFS 드라이버
- **nfs-subdir-external-provisioner**: NFS Subdir External Provisioner
- **범용 모드**: 모든 NFS PV 처리 옵션

### 관리 도구
- **쿼터 상태 확인**: 현재 적용된 쿼터 조회
- **디스크 사용량 분석**: 프로젝트별 디스크 사용량 확인
- **고아 쿼터 정리**: 삭제된 PV의 잔여 쿼터 제거
- **웹 UI 대시보드**: 쿼터 현황 시각화

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│  │    Pod    │  │    Pod    │  │    Pod    │            │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘            │
│        │              │              │                  │
│        └──────────────┴──────────────┘                  │
│                       │                                 │
│              ┌────────▼─────────┐                       │
│              │  PersistentVolume│                       │
│              │   (NFS Storage)  │                       │
│              └────────┬─────────┘                       │
└───────────────────────┼─────────────────────────────────┘
                        │ NFS Mount
                        ▼
         ┌──────────────────────────────┐
         │       NFS Server Node        │
         │  ┌────────────────────────┐  │
         │  │  NFS Quota Agent       │  │
         │  │  - Watch PVs           │  │
         │  │  - Apply quotas        │  │
         │  │  - Monitor status      │  │
         │  └────────────────────────┘  │
         │              │               │
         │              ▼               │
         │  ┌────────────────────────┐  │
         │  │  Filesystem (XFS/ext4) │  │
         │  │  - Project Quotas      │  │
         │  └────────────────────────┘  │
         └──────────────────────────────┘
```

## 핵심 제약사항

**NFS 서버 노드에서 실행 필수**: `xfs_quota`, `setquota` 등의 쿼터 명령어는 로컬 파일시스템에서만 작동하므로, 에이전트는 반드시 NFS 서버 노드에서 실행되어야 합니다.

## 사용 예제

### Helm 설치

```bash
helm repo add nfs-quota-agent https://dasomel.github.io/nfs-quota-agent
helm install nfs-quota-agent nfs-quota-agent/nfs-quota-agent \
  --set nfsServerPath=/exports/nfs \
  --set provisioner=csi-driver-nfs
```

### 쿼터 상태 확인

```bash
# 모든 프로젝트 쿼터 조회
nfs-quota-agent status

# 디스크 사용량 분석
nfs-quota-agent disk-usage

# 고아 쿼터 정리
nfs-quota-agent cleanup-orphans
```

### PV 어노테이션

쿼터가 적용되면 PV에 어노테이션이 추가됩니다:

```yaml
metadata:
  annotations:
    nfs-quota-agent.io/quota-status: "applied"
    nfs-quota-agent.io/project-id: "1001"
```

## 기술 스택

- **언어**: Go
- **Kubernetes**: client-go를 사용한 PV 감시
- **파일시스템**: XFS, ext4 프로젝트 쿼터
- **배포**: Helm Chart, Container 이미지

## 사용 사례

### 멀티 테넌시 환경
여러 팀이 공유하는 NFS 스토리지에서 각 팀의 스토리지 사용량을 격리하고 제한

### 개발/테스트 환경
개발자들의 무분별한 스토리지 사용을 방지하고 비용 절감

### 온프레미스 Kubernetes
클라우드 스토리지가 아닌 온프레미스 NFS를 사용하는 환경에서 쿼터 관리 자동화

## 참고 링크

- **GitHub**: [dasomel/nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
- **Helm Chart**: [nfs-quota-agent Charts](https://dasomel.github.io/nfs-quota-agent)
