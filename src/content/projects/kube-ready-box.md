---
title: "Kube-Ready-Box"
description: "Kubernetes 최적화 Ubuntu LTS Vagrant Box — Multi-arch, XFS/ext4, Kubernetes 사전 튜닝"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Ubuntu", "Multi-Arch", "Security"]
order: 1
type: "own"
featured: true
problem: "Kubernetes 개발·테스트 환경 구축에 반복적인 OS 튜닝과 보안 설정이 필요함"
solution: "Packer로 Kubernetes 노드에 필요한 OS 튜닝·도구·보안 설정을 미리 적용한 Ubuntu LTS Vagrant Box 제공"
---

## 프로젝트 소개

**Kube-Ready-Box**는 Kubernetes 노드로 바로 사용할 수 있도록 Ubuntu LTS를 사전 튜닝한 **Multi-Architecture Vagrant Box** 프로젝트입니다.

현재 Ubuntu 24.04 LTS와 26.04 LTS를 지원하며 ext4/XFS 이미지를 각각 제공합니다. Narwhal의 기본 개발 환경은 `dasomel/ubuntu-26.04-xfs`입니다.

### 현재 릴리스

- **v0.2.3**
- Ubuntu 24.04 / 26.04
- VirtualBox / VMware Fusion
- AMD64 / ARM64
- ext4 / XFS

v0.2.3에서는 `apt-get full-upgrade` 기반 보안 업데이트와 kernel/AppArmor/sudo/OpenSSH 계열 보안 패키지 점검을 추가했습니다.

## 주요 특징

### Multi-Architecture

| Provider | AMD64 | ARM64 |
|---|---:|---:|
| VirtualBox 7.1+ | ✅ | ✅ |
| VMware Fusion | ✅ | ✅ |

### 파일시스템

| | ext4 | XFS |
|---|---|---|
| 용도 | 범용 Kubernetes 노드 | 대용량/쿼터 워크로드 |
| 프로젝트 쿼터 | 지원 | 지원 |
| Narwhal 연계 | 가능 | **기본 환경** |

### Kubernetes 최적화

커널 파라미터, IP forwarding, 파일 디스크립터/프로세스 제한, 스왑 비활성화, I/O scheduler 등 Kubernetes 노드에 필요한 OS 설정을 이미지 빌드 단계에서 적용합니다.

### 사전 설치 도구

`jq`, `yq`, `bash-completion`, `nfs-common`, `sshpass`, `sysstat`, `iotop`, `iftop`, `nload`, `nethogs`, `ipvsadm`, `ipset`, `conntrack`, `ethtool`, `tcpdump`, `nmap`, `linux-tools`, `bpfcc-tools`, `bpftrace` 등을 제공합니다.

### 보안 하드닝

- 보안 패키지 전체 업그레이드
- kernel / AppArmor / sudo / OpenSSH 관련 패키지 점검
- 빌드 시 CVE 관련 버전 감사를 `/var/log/kube-ready-box-security.log`에 기록
- Kubernetes용 AppArmor와 운영 환경에 필요한 마운트 지원

의도적으로 **containerd, kubelet, kubeadm, kubectl, CNI**는 포함하지 않습니다. 운영자가 원하는 Kubernetes 버전과 런타임을 선택하도록 OS 이미지의 책임 범위를 제한합니다.

## 시작하기

```bash
vagrant init dasomel/ubuntu-24.04-ext4
vagrant up --provider=vmware_desktop
```

Narwhal 개발 환경에서는:

```bash
vagrant init dasomel/ubuntu-26.04-xfs
vagrant up --provider=vmware_desktop
```

## 빌드

Packer 기반으로 Box를 생성합니다.

```bash
cd packer
./build.sh init
./build.sh vmware-arm64
./build.sh vmware-arm64 --fs=xfs
./build.sh vmware-arm64 --version=26.04
```

CI에서는 `workflow_dispatch` 입력으로 Ubuntu 버전을 선택할 수 있습니다.

## Narwhal과의 관계

```text
kube-ready-box
      ↓
Ubuntu 26.04 XFS
      ↓
   Narwhal
      ↓
Kubernetes IDP
```

Kube-Ready-Box는 Narwhal의 재현 가능한 기반 OS 환경을 제공하는 별도 OSS입니다.

## 기술 문서

| 문서 | 내용 |
|---|---|
| [박스 아키텍처 & 빌드](/ko/docs/kube-ready-box-architecture) | Packer 빌드, 파일시스템, 보안 하드닝 |
| [사용법](/ko/docs/kube-ready-box-usage) | Vagrant와 Kubernetes 연동 |
| [릴리스 & 배포](/ko/docs/kube-ready-box-release) | Vagrant Cloud/HCP 배포와 릴리스 절차 |

## 참고 링크

- **Vagrant Cloud**: [dasomel/ubuntu-24.04-ext4](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04-ext4) · [dasomel/ubuntu-24.04-xfs](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04-xfs)
- **Vagrant Cloud**: [dasomel/ubuntu-26.04-ext4](https://app.vagrantup.com/dasomel/boxes/ubuntu-26.04-ext4) · [dasomel/ubuntu-26.04-xfs](https://app.vagrantup.com/dasomel/boxes/ubuntu-26.04-xfs)
- **GitHub**: [dasomel/kube-ready-box](https://github.com/dasomel/kube-ready-box)
