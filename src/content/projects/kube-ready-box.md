---
title: "Kube-Ready-Box"
description: "Kubernetes 최적화된 Ubuntu 24.04 LTS Vagrant Box"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Ubuntu", "Multi-Arch"]
order: 3
---

## 프로젝트 소개

Kube-Ready-Box는 **Kubernetes 배포를 위해 OS 수준에서 최적화된 Ubuntu 24.04 LTS Vagrant Box**입니다.

Vagrant Cloud에서 `dasomel/ubuntu-24.04`로 배포되며, 컨테이너 오케스트레이션 환경에 필요한 시스템 튜닝이 사전 적용되어 있습니다.

## 주요 특징

### 멀티 아키텍처 및 프로바이더 지원
- **AMD64 / ARM64**: 두 아키텍처 모두 지원
- **VirtualBox 7.1+**: Intel/AMD 기반 시스템
- **VMware Fusion**: Apple Silicon 호환 (M1/M2/M3)

### Kubernetes 최적화

사전 적용된 시스템 튜닝:

**커널 파라미터**
```bash
# 네트워크 버퍼 최적화
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864

# IP 포워딩 활성화
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-iptables = 1
```

**리소스 제한**
```bash
# 프로세스 및 파일 디스크립터 제한
* soft nofile 1048576
* hard nofile 1048576
* soft nproc 1048576
* hard nproc 1048576
```

**디스크 I/O 스케줄러**
- SSD: `none` (최적 성능)
- HDD: `mq-deadline` (처리량 최적화)

**스왑 비활성화**
- Kubernetes 요구사항에 맞게 스왑 완전 제거

### 포함되지 않은 것

의도적으로 포함하지 않은 컴포넌트 (사용자 선택 설치):
- Container Runtime (containerd, CRI-O 등)
- Kubernetes 컴포넌트 (kubelet, kubeadm, kubectl)
- CNI 플러그인 (Calico, Cilium 등)

## 시작하기

### 요구사항

- Vagrant 2.3+
- VirtualBox 7.1+ 또는 VMware Fusion

### 기본 사용법

```bash
# Vagrant 초기화
vagrant init dasomel/ubuntu-24.04

# VM 시작 (VirtualBox)
vagrant up

# VM 시작 (VMware)
vagrant up --provider=vmware_desktop
```

### Vagrantfile 예제

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "dasomel/ubuntu-24.04"
  config.vm.box_version = "1.0.0"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "4096"
    vb.cpus = 2
  end

  config.vm.provider "vmware_desktop" do |vmware|
    vmware.vmx["memsize"] = "4096"
    vmware.vmx["numvcpus"] = "2"
  end
end
```

### 최적화 검증

```bash
# VM 접속
vagrant ssh

# 커널 파라미터 확인
sysctl net.ipv4.ip_forward
sysctl net.bridge.bridge-nf-call-iptables

# 리소스 제한 확인
ulimit -n
ulimit -u

# 스왑 비활성화 확인
free -h
```

## Kubernetes 설치 예제

Box 생성 후 Kubernetes 설치:

```bash
# Container Runtime 설치 (containerd)
sudo apt-get update
sudo apt-get install -y containerd

# Kubernetes 설치
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# 클러스터 초기화
sudo kubeadm init

# CNI 플러그인 설치 (예: Calico)
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

## 빌드 정보

이 Box는 [Packer](https://www.packer.io/)를 사용하여 빌드됩니다:

```bash
# Packer 빌드
packer build packer/ubuntu-24.04.pkr.hcl

# Vagrant Cloud 업로드
vagrant cloud publish dasomel/ubuntu-24.04 1.0.0 virtualbox \
  output/ubuntu-24.04-amd64-virtualbox.box
```

## AI 협업 디렉토리

이 저장소는 AI 기반 개발을 위한 `.agent/` 디렉토리를 포함합니다:

```
.agent/
├── context.md          # 프로젝트 컨텍스트
├── tasks/              # 작업 정의
└── docs/               # 참고 문서
```

## 참고 링크

- **Vagrant Cloud**: [dasomel/ubuntu-24.04](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04)
- **공식 문서**: [GitHub Repository](https://github.com/dasomel/kube-ready-box)
- **Kubernetes 공식 문서**: [kubernetes.io](https://kubernetes.io/)
