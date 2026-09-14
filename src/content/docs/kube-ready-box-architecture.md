---
title: 시스템 구조
description: Ubuntu cloud image에서 검증된 Kubernetes-ready Vagrant Box까지의 빌드 구조와 제품 경계.
project: Kube-Ready-Box
path: kube-ready-box/architecture
order: 1401
lastModified: 2026-09-14
---

# 시스템 구조

<Mermaid chart={`flowchart LR
  SOURCE["Ubuntu Cloud Image"] --> PACKER["Packer Templates"]
  PACKER --> MODULES["OS Provisioning Modules"]
  MODULES --> BOX["Provider Vagrant Box"]
  BOX --> VM["Verified VM Baseline"]
  VM --> CONSUMER["Kubernetes Installer / Cluster Project"]`} />

Kube Ready Box의 제품 경계는 **검증된 OS 이미지**입니다. Container runtime, Kubernetes, kubeadm/kubelet/kubectl과 CNI는 기본 Box에 포함되지 않으며 사용하는 Cluster Project가 설치합니다.

## 저장소 계층

| 계층 | 책임 |
|---|---|
| Packer definition | Ubuntu release, AMD64/ARM64, VirtualBox/VMware, ext4/XFS 조합 |
| OS contract | Kernel module, sysctl, limits, package, boot-time disk 확장 |
| Capability modules | Network, storage, security, time sync, observability 준비 |
| Verification | Provider boot와 machine-readable tuning evidence |
| Release evidence | 검증을 통과한 provider artifact와 build input 추적 |

## 불변 조건

- Kubernetes-ready와 Kubernetes-preinstalled를 구분합니다.
- ext4와 XFS는 동작 차이가 있으므로 별도 artifact로 유지합니다.
- AMD64와 ARM64는 같은 OS contract를 따르고 provider 예외를 문서화합니다.
- Template validation만으로 실제 VM runtime 검증을 대체하지 않습니다.
