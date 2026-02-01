---
title: "Kube-Ready-Box"
description: "Kubernetes 최적화된 Ubuntu 24.04 LTS Vagrant Box"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Ubuntu", "Multi-Arch"]
order: 1
type: "own"
---

## 프로젝트 소개

Kube-Ready-Box는 **Kubernetes 배포를 위해 OS 수준에서 최적화된 Ubuntu 24.04 LTS Vagrant Box**입니다.

Vagrant Cloud에서 `dasomel/ubuntu-24.04`로 배포되며, 컨테이너 오케스트레이션 환경에 필요한 시스템 튜닝이 사전 적용되어 있습니다.

## 주요 특징

### 멀티 아키텍처 및 프로바이더 지원

| Provider | AMD64 | ARM64 | 비고 |
|----------|-------|-------|------|
| VirtualBox | ✅ | ✅ | ARM64는 VirtualBox 7.1+ 필요 |
| VMware Fusion | ✅ | ✅ | Apple Silicon 지원 |

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

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 4096
    vb.cpus = 2
  end

  config.vm.provider "vmware_desktop" do |v|
    v.vmx["memsize"] = "4096"
    v.vmx["numvcpus"] = "2"
  end

  config.vm.hostname = "k8s-node"
  config.vm.network "private_network", ip: "192.168.56.10"
end
```

### 최적화 검증

```bash
# Box 정보 확인
vagrant ssh -c "cat /etc/vagrant-box/info.json"

# 튜닝 설정 검증 스크립트
vagrant ssh -c "/bin/bash /etc/vagrant-box/check-tuning.sh"
```

## Kubernetes 설치 예제

Box 생성 후 Kubernetes 설치:

```bash
# 1. containerd 설치 및 설정
sudo apt-get update && sudo apt-get install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd && sudo systemctl enable containerd

# 2. Kubernetes 설치 (버전 선택)
K8S_VERSION="v1.31"
curl -fsSL "https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/Release.key" | \
  sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/ /" | \
  sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update && sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# 3. 클러스터 초기화 (마스터 노드)
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

## 빌드 정보

이 Box는 [Packer](https://www.packer.io/)를 사용하여 빌드됩니다:

```bash
cd packer

# Packer 플러그인 초기화
./build.sh init

# 특정 Box 빌드
./build.sh vmware-arm64      # VMware ARM64
./build.sh virtualbox-arm64  # VirtualBox ARM64

# 전체 Box 빌드 (4개)
./build.sh all
```

## AI 협업 디렉토리

이 저장소는 AI 코딩 어시스턴트를 위한 `.agent/` 디렉토리를 포함합니다:

- **AGENT.md**: 기술 가이드 (Packer, K8s 튜닝, 최적화)
- **SECURITY.md**: 보안 가이드라인
- **skills/**: AI 에이전트 스킬 (자동 리뷰)

## 참고 링크

- **Vagrant Cloud**: [dasomel/ubuntu-24.04](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04)
- **GitHub**: [dasomel/kube-ready-box](https://github.com/dasomel/kube-ready-box)
- **Kubernetes 공식 문서**: [kubernetes.io](https://kubernetes.io/)
