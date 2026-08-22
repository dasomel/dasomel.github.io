---
title: "NFS Quota Agent"
description: "Kubernetes NFS PersistentVolume 스토리지 쿼터 강제 에이전트"
github: "https://github.com/dasomel/nfs-quota-agent"
tags: ["Kubernetes", "Go", "Storage", "NFS", "XFS", "Quota", "gRPC", "Prometheus"]
order: 8
type: "own"
featured: true
problem: "Kubernetes 기본 NFS CSI 드라이버는 PersistentVolume에 대한 물리적 스토리지 용량 제한(Quota)을 강제하지 못해 특정 워크로드가 전체 NFS 스토리지를 고갈시킬 위험이 있음"
solution: "Linux XFS Project Quota 메커니즘을 활용하여 NFS 공유 디렉토리별로 바이트 단위의 정확한 스토리지 쿼터를 강제하는 Go 데몬 및 QuotaPolicy CRD 구축"
---

## 프로젝트 소개

**NFS Quota Agent**는 Kubernetes 클러스터에서 NFS 기반 PersistentVolume(PV)에 대해 파일시스템 수준의 엄격한 용량 쿼터(Quota)를 강제하는 고성능 스토리지 에이전트 데몬입니다.

Kubernetes 표준 NFS 프로비저너가 용량 제한을 강제하지 못하는 문제를 Linux 커널의 **XFS Project Quotas (`xfs_quota`)** 기능을 활용하여 해결합니다.

### 주요 기능 및 특징

- **XFS Project Quota 엔진**: 서브디렉토리별 불변 프로젝트 ID 할당 및 하드/소프트 용량 제한 강제
- **gRPC & HTTP API**: CSI 프로비저너 또는 외부 오케스트레이터와 연동 가능한 고속 인터페이스
- **QuotaPolicy CRD**: 쿠버네티스 네이티브 매니페스트로 네임스페이스 및 PVC별 스토리지 정책 선언
- **Prometheus 모니터링**: 용량 사용률, 남은 공간, 쿼터 초과 이벤트 메트릭 제공
- **웹 관리 UI**: 직관적인 스토리지 사용 현황 대시보드 및 실시간 알림 기능

---

## 아키텍처 다이어그램

```text
  Kubernetes Cluster               NFS Storage Host
┌─────────────────────┐          ┌───────────────────────────────────┐
│ PVC (Claim: 10Gi)   │          │  nfs-quota-agent Daemon (Go)      │
│         │           │          │  - gRPC Server (:50051)           │
│         ▼           │  gRPC    │  - HTTP API & Metrics (:8080)     │
│ NFS CSI Provisioner ├─────────►│  - Quota Controller               │
└─────────────────────┘          └─────────────────┬─────────────────┘
                                                   │
                                                   ▼ xfs_quota CLI / ioctl
                                 ┌───────────────────────────────────┐
                                 │  Linux XFS Filesystem             │
                                 │  /srv/nfs/pvc-12345 (ProjID: 101) │
                                 │  [Hard Limit: 10 GiB Enforced]    │
                                 └───────────────────────────────────┘
```

---

## 시작하기 (Quickstart)

```bash
# 1. 저장소 클론 및 빌드
git clone https://github.com/dasomel/nfs-quota-agent.git
cd nfs-quota-agent
make build

# 2. XFS 마운트 경로를 지정하여 데몬 실행
sudo ./bin/nfs-quota-agent --nfs-root=/srv/nfs --port=8080 --grpc-port=50051

# 3. Helm 차트로 쿠버네티스에 배포
helm install nfs-quota-agent ./charts/nfs-quota-agent -n storage --create-namespace
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 설명 |
|---|---|---|
| **개요 (Overview)** | [에이전트 개요](/oss/nfs-quota-agent/overview) | XFS 기반 쿼터 강제 메커니즘과 설계 원칙 |
| **아키텍처 (Architecture)** | [스토리지 아키텍처](/oss/nfs-quota-agent/architecture) | Linux XFS Project Quota 및 gRPC 데몬 내부 구조 |
| **기능 가이드 (Feature Guide)** | [기능 및 CRD 가이드](/oss/nfs-quota-agent/feature-guide) | QuotaPolicy CRD, 동적 프로비저닝, 메트릭 |
| **시작하기 (Getting Started)** | [설치 및 설정](/oss/nfs-quota-agent/getting-started) | systemd 서비스 등록 및 Helm 배포 가이드 |
| **운영 가이드 (Operations)** | [운영 및 모니터링](/oss/nfs-quota-agent/operations) | Web UI 운영, 알림 설정 및 장애 복구 절차 |
