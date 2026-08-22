---
title: "Kube-Ready-Box"
description: "Kubernetes-ready Ubuntu 24.04/26.04 LTS Vagrant Box (Multi-arch / Multi-provider)"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Packer", "Ubuntu", "XFS", "cgroupv2", "containerd", "ARM64"]
order: 9
type: "own"
featured: true
problem: "로컬에서 쿠버네티스 다중 노드 클러스터를 부트스트랩할 때마다 OS 패키지 설치, 커널 파라미터 튜닝, cgroup 설정, 스토리지 쿼터 구성 등의 반복 작업으로 15분 이상 소요됨"
solution: "Packer 파이프라인으로 XFS Project Quota, containerd v2, cgroupv2, 커널 최적화가 완료된 즉시 구동 가능한 Vagrant 베이스 박스를 자동 빌드 및 배포"
---

## 프로젝트 소개

**Kube-Ready-Box**는 Kubernetes 클러스터를 로컬 환경에서 지연 없이 즉시 부트스트랩할 수 있도록 사전 최적화된 Ubuntu 24.04 / 26.04 LTS 기반 Vagrant 베이스 박스입니다.

HashiCorp Packer 파이프라인을 통해 VirtualBox, VMware Desktop 및 Libvirt 프로바이더용 박스를 생성하며, Apple Silicon (ARM64)과 Intel/AMD (AMD64) 아키텍처를 모두 지원합니다.

### 핵심 기술 및 특징

- **XFS Project Quotas 사전 활성화**: 루트 및 데이터 파티션에 `pquota` 옵션이 적용되어 디렉토리별 스토리지 쿼터 강제 가능
- **cgroup v2 & containerd v2**: 최신 쿠버네티스 표준에 맞춘 컨테이너 런타임 및 리소스 격리 베이스라인
- **커널 파라미터 튜닝**: `br_netfilter`, `overlay`, `ip_forward`, max user watches/instances 최적화
- **Packer 자동화 빌드**: GitHub Actions 기반 다중 아키텍처 자동 빌드 및 Vagrant Cloud (`dasomel/ubuntu-26.04-xfs`) 릴리스
- **Node Readiness Attestation**: 부팅 시 30개 이상의 필수 커널 모듈과 시스템 무결성을 자동 검증

---

## 아키텍처 다이어그램

```text
  Packer Build Pipeline
┌────────────────────────────────────────────────────────┐
│  Ubuntu 26.04 LTS Base ISO                             │
│  ├─ XFS Partitioning (pquota enabled)                  │
│  ├─ Kernel sysctl.d Tuning (br_netfilter, ip_forward)  │
│  ├─ containerd v2 & runc Setup                         │
│  └─ Security Hardening & Zero-Key Invariants           │
└───────────────────────────┬────────────────────────────┘
                            │ Multi-Provider Packaging
                            ▼
  Vagrant Cloud (dasomel/ubuntu-26.04-xfs)
  - VMware Desktop (ARM64 / AMD64)
  - VirtualBox (AMD64)
  - Libvirt / KVM
                            │
                            ▼ vagrant up (0-sec bootstrap)
  Narwhal / Beluga Local Kubernetes Clusters
```

---

## 시작하기 (Quickstart)

```ruby
# Vagrantfile 예시
Vagrant.configure("2") do |config|
  config.vm.box = "dasomel/ubuntu-26.04-xfs"
  config.vm.box_version = ">= 1.2.0"
  
  config.vm.provider "vmware_desktop" do |v|
    v.cpus = 2
    v.memory = 4096
  end
end
```

```bash
# 1. Vagrant 머신 실행
vagrant up --provider=vmware_desktop

# 2. XFS 쿼터 및 커널 파라미터 확인
vagrant ssh -c "mount | grep xfs; sysctl net.ipv4.ip_forward"
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 설명 |
|---|---|---|
| **개요 (Overview)** | [박스 개요](/oss/kube-ready-box/overview) | Kube-Ready-Box의 최적화 목표 및 아키텍처 지원 |
| **아키텍처 (Architecture)** | [시스템 구조](/oss/kube-ready-box/architecture) | XFS 파티셔닝, 커널 파라미터, cgroupv2 베이스라인 |
| **시작하기 (Getting Started)** | [Vagrantfile 가이드](/oss/kube-ready-box/getting-started) | 멀티 프로바이더 설정 및 클러스터 프로비저닝 |
| **운영 가이드 (Operations)** | [Packer 빌드 & 릴리스](/oss/kube-ready-box/operations) | Vagrant Cloud 배포 파이프라인 및 버전 관리 |
| **검증 (Verification)** | [노드 검증 체크리스트](/oss/kube-ready-box/verification) | Node Readiness Attestation 및 30개 무결성 점검 |
