---
title: 박스 개요
description: Kubernetes 최적화 Ubuntu Vagrant 베이스 박스의 아키텍처 지원 및 설계 원칙.
project: Kube-Ready-Box
path: kube-ready-box/overview
order: 1400
lastModified: 2026-08-23
---

# 박스 개요

**Kube-Ready-Box**는 Kubernetes 클러스터를 로컬 환경에서 지연 없이 즉시 부트스트랩할 수 있도록 사전 최적화된 Ubuntu 24.04 / 26.04 LTS 기반 Vagrant 베이스 박스입니다.

## 핵심 가치

1. **부트스트랩 시간 0초 단축**: 매번 VM을 켤 때마다 패키지 설치와 커널 파라미터 설정을 반복할 필요 없이 즉시 `kubeadm` 또는 K8s 오케스트레이터를 실행할 수 있습니다.
2. **XFS Project Quota 사전 활성화**: 루트 및 스토리지 파티션에 `pquota` 옵션이 적용되어 디렉토리별 스토리지 용량 제한을 완벽 지원합니다.
3. **Multi-Arch & Multi-Provider**: Apple Silicon (ARM64)과 Intel/AMD (AMD64) 아키텍처를 모두 지원하며, VMware Desktop, VirtualBox, Libvirt 프로바이더를 지원합니다.
