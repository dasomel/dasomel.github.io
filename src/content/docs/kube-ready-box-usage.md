---
title: "사용법"
description: "Kube-Ready-Box를 활용한 Vagrantfile 작성, Provider 설정 및 K8s 설치 가이드"
project: "Kube-Ready-Box"
order: 302
lastModified: 2026-07-17
---

## Vagrantfile 설정 및 활용

Kube-Ready-Box는 단일 노드는 물론, 멀티 노드 Kubernetes 클러스터 구성에 적합하도록 설계되었습니다.

### 단일 노드 구성 예시

단일 노드 구성 시 호스트 머신의 아키텍처(Intel/AMD 또는 Apple Silicon)에 따라 적절한 Provider를 선택하는 것이 중요합니다.

```ruby
Vagrant.configure("2") do |config|
  # 사용할 OS 및 파일시스템 변형 선택 (예: 24.04 ext4)
  config.vm.box = "dasomel/ubuntu-24.04-ext4"

  host_arch = `uname -m`.strip

  if host_arch == "arm64" || host_arch == "aarch64"
    config.vm.provider "vmware_desktop" do |v|
      v.vmx["memsize"] = "4096"
      v.vmx["numvcpus"] = "2"
    end
  else
    config.vm.provider "virtualbox" do |vb|
      vb.memory = 4096
      vb.cpus = 2
      # 네트워크 성능 향상을 위한 virtio 설정
      vb.customize ["modifyvm", :id, "--nictype1", "virtio"]
    end
  end

  config.vm.hostname = "k8s-node"
  config.vm.network "private_network", ip: "192.168.56.10"
end
```

### 기본 명령어

- `vagrant up`: Box 다운로드 및 VM 구동
- `vagrant ssh`: 가상 머신 접속
- `vagrant halt`: VM 중지
- `vagrant destroy -f`: VM 강제 삭제

## Provider별 설정 팁

### VirtualBox
Intel/AMD 기반 환경에서 주로 사용합니다. 네트워크 인터페이스 타입을 `virtio`로 변경하면 처리량이 크게 향상됩니다.
- 팁: `vb.customize ["modifyvm", :id, "--nictype1", "virtio"]`

### VMware Fusion
Apple Silicon(ARM64) 환경에서 최적의 성능을 제공합니다. (ARM 환경에서 VirtualBox 사용 시 7.2.6 이상 버전이 필수입니다.)

## K8s 설치 (Post-Install)

Kube-Ready-Box는 Kubernetes 패키지 자체를 포함하지 않으므로 사용자가 원하는 버전을 직접 설치해야 합니다.

### 1. cgroup 드라이버 설정 (필수)
Ubuntu 26.04는 cgroup v2 전용입니다. containerd와 kubelet의 cgroup 드라이버를 `systemd`로 통일해야 합니다.

```bash
# containerd 시스템 cgroup 활성화
sudo apt-get update && sudo apt-get install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd && sudo systemctl enable containerd
```

### 2. Kubelet 및 컨트롤 플레인 설치

```bash
# 원하는 Kubernetes 버전 설정
K8S_VERSION="v1.31"
curl -fsSL "https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/Release.key" | \
  sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/ /" | \
  sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update && sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# 클러스터 초기화 (Master Node)
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

### 3. CNI 적용
초기화 완료 후 사용할 CNI 플러그인을 설치합니다. (eBPF 기반의 Cilium이나 간단한 설정의 Flannel 등을 활용할 수 있습니다.)

```bash
# Flannel 적용 예시
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

## 문제 해결 팁

- **Box 다운로드 캐시 문제**: `vagrant box remove` 후 `~/.vagrant.d/boxes/` 캐시 폴더를 직접 삭제하고 다시 시도하세요.
- **네트워크 연결 안됨**: VM 내부에서 `ip addr`로 `192.168.56.x` 대역이 정상적으로 할당되었는지 확인합니다.
