---
title: "Kube-Ready-Box"
description: "Kubernetes를 위한 Ubuntu 24.04/26.04 LTS Vagrant Base Box · ARM64/AMD64 · ext4/XFS"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Packer", "Ubuntu", "ARM64", "AMD64", "XFS", "ext4", "VMware", "VirtualBox"]
order: 9
type: "own"
featured: true
problem: "로컬 Kubernetes 클러스터를 반복해서 만들 때 OS 튜닝, kernel modules, networking, storage prerequisites를 매번 준비해야 하고 ARM64/AMD64와 provider별 차이까지 별도로 관리해야 함"
solution: "Packer로 Kubernetes용 Ubuntu base image를 사전 구성하고 Vagrant Cloud로 배포해 동일한 OS baseline을 여러 로컬 클러스터 프로젝트에서 반복 사용"
---

## 프로젝트 소개

**Kube-Ready-Box**는 Kubernetes를 로컬 VM 환경에서 빠르게 부트스트랩하기 위한 Ubuntu Vagrant Base Box 프로젝트입니다.

이 프로젝트의 핵심은 Kubernetes 자체를 포함하는 것이 아니라, Kubernetes가 올라가기 전에 필요한 **운영체제 수준의 준비 상태(OS readiness)**를 하나의 재현 가능한 이미지로 만드는 것입니다.

현재 Ubuntu **24.04 LTS**와 **26.04 LTS**를 제공하며, ext4와 XFS filesystem variant를 분리합니다. Apple Silicon 환경을 포함한 ARM64와 AMD64를 지원하고 VirtualBox와 VMware Fusion 같은 로컬 hypervisor에서 사용할 수 있습니다.

> Kube-Ready-Box는 Kubernetes installer가 아닙니다. `kubelet`, `kubeadm`, `kubectl`, CNI 및 container runtime은 사용자가 원하는 버전을 선택해 이후 설치합니다.

## 왜 필요한가

Narwhal, Beluga와 같은 로컬 Kubernetes 프로젝트에서는 VM을 만들 때마다 다음 작업이 반복됩니다.

```text
Ubuntu Cloud Image
      ↓
filesystem / disk 준비
      ↓
kernel modules / sysctl
      ↓
network / conntrack / buffers
      ↓
CSI / iSCSI / NFS prerequisite
      ↓
time synchronization
      ↓
monitoring / diagnostics tools
      ↓
Kubernetes bootstrap
```

Kube-Ready-Box는 이 중 **Kubernetes가 요구하는 OS baseline을 이미지 단계에서 표준화**합니다. 결과적으로 각 상위 프로젝트는 cluster bootstrap 로직에만 집중할 수 있습니다.

## 제공 이미지

| Ubuntu | Filesystem | 주요 용도 |
|---|---|---|
| 24.04 LTS | ext4 | 기본 안정형 로컬 Kubernetes 노드 |
| 24.04 LTS | XFS | storage/quota 및 대용량 workload |
| 26.04 LTS | ext4 | 최신 LTS / cgroup v2-only 환경 |
| 26.04 LTS | XFS | 최신 LTS + project quota 활용 |

Vagrant Cloud의 주요 box 이름은 다음과 같습니다.

```text
dasomel/ubuntu-24.04-ext4
dasomel/ubuntu-24.04-xfs
dasomel/ubuntu-26.04-ext4
dasomel/ubuntu-26.04-xfs
```

## Kubernetes Readiness Baseline

이미지는 다음과 같은 OS 수준 준비 작업을 포함합니다.

- swap 비활성화
- Kubernetes에 필요한 kernel modules
- IP forwarding / bridge networking
- conntrack 및 network buffer 튜닝
- `/sys/fs/bpf` 등 eBPF/CNI 관련 기반 준비
- `open-iscsi`, `cryptsetup`, `dmsetup`, `nfs-common` 등 storage prerequisite
- `chrony` 기반 시간 동기화
- auditd 등 보안/감사 기반 도구
- `jq`, `yq`, network diagnostics, performance tools
- 자동 disk/partition/LVM/filesystem 확장

## 24.04와 26.04의 차이

26.04는 cgroup v2-only 환경이며 containerd/kubelet의 systemd cgroup 설정을 명시적으로 맞춰야 합니다. 반대로 24.04는 보다 보수적인 기본값으로 안정적인 로컬 Kubernetes 개발 환경을 제공합니다.

| 항목 | Ubuntu 24.04 | Ubuntu 26.04 |
|---|---|---|
| Kernel | 6.8 | 7.0 |
| cgroup | v2 기본 | v2-only |
| 기본 선택 | 안정성 중심 | 최신 커널/플랫폼 기능 |
| Kubernetes 주의점 | 일반적인 설정 | `SystemdCgroup=true` 확인 |

## Build Pipeline

```text
Ubuntu Cloud Image
       ↓
     Packer
       ↓
OS configuration + filesystem tuning
       ↓
provider-specific validation
       ↓
Vagrant Box
       ↓
Vagrant Cloud
       ↓
Narwhal / Beluga / local K8s projects
```

Packer가 이미지를 생성하고 GitHub Actions가 provider와 architecture별 빌드·검증·배포를 자동화합니다. Box version과 Ubuntu release를 명확히 분리해 상위 프로젝트가 재현 가능한 개발 환경을 선택할 수 있습니다.

## Filesystem 선택

### ext4
일반적인 Kubernetes 개발 환경과 범용 workload에 적합합니다. Shrink와 일반 Linux tooling 호환성이 필요한 경우 유리합니다.

### XFS
대용량 데이터와 Kubernetes storage/quota 실험에 적합합니다. 특히 NFS Quota Agent와 함께 사용할 경우 XFS Project Quota를 활용할 수 있습니다.

## 시작하기

```bash
# 안정적인 기본 이미지
vagrant init dasomel/ubuntu-24.04-ext4
vagrant up --provider=vmware_desktop

# XFS / quota 환경
vagrant init dasomel/ubuntu-24.04-xfs
vagrant up --provider=vmware_desktop

# Ubuntu 26.04
vagrant init dasomel/ubuntu-26.04-ext4
vagrant up --provider=vmware_desktop
```

사용 후에는 box 자체가 Kubernetes cluster를 제공하는 것이 아니라는 점을 전제로 containerd, kubelet, kubeadm 또는 원하는 Kubernetes 배포판을 추가합니다.

## 검증

```bash
vagrant ssh -c "cat /etc/vagrant-box/info.json"
vagrant ssh -c "/bin/bash /etc/vagrant-box/check-tuning.sh"
```

검증 포인트는 단순히 VM이 boot되는지가 아니라, kernel setting, network readiness, filesystem 및 Kubernetes prerequisite가 의도한 baseline과 일치하는지입니다.

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [박스 개요](/oss/kube-ready-box/overview) | 프로젝트 목적과 지원 범위 |
| Architecture | [시스템 구조](/oss/kube-ready-box/architecture) | Packer → Box → Vagrant 흐름 |
| Getting Started | [사용 가이드](/oss/kube-ready-box/getting-started) | provider와 filesystem 선택 |
| Operations | [빌드/릴리스](/oss/kube-ready-box/operations) | Packer와 Vagrant Cloud 운영 |
| Verification | [검증](/oss/kube-ready-box/verification) | OS readiness와 release validation |

## 프로젝트 관계

```text
kube-ready-box
       ↓
  local Kubernetes node baseline
       ├── Narwhal
       ├── Beluga
       └── KubeMetal / other K8s projects
              ↓
       higher-level platform
```
