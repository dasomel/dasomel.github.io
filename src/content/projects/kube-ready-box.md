---
title: "Kube-Ready-Box"
description: "Kubernetes 최적화된 Ubuntu 24.04 / 26.04 LTS Vagrant Box"
github: "https://github.com/dasomel/kube-ready-box"
tags: ["Kubernetes", "Vagrant", "Ubuntu", "Multi-Arch"]
order: 1
type: "own"
featured: true
problem: "Kubernetes 개발/테스트 환경 구축에 반복적인 수작업 필요"
solution: "원커맨드로 로컬 K8s 클러스터 + 필수 도구 자동 세팅"
---

## 프로젝트 소개

Kube-Ready-Box는 **Kubernetes 배포를 위해 OS 수준에서 최적화된 Ubuntu LTS Vagrant Box**입니다.

**24.04 LTS** (Noble Numbat, 기본값)과 **26.04 LTS** (Resolute Raccoon, 커널 Linux 7.0)를 모두 지원하며, 컨테이너 오케스트레이션 환경에 필요한 시스템 튜닝이 사전 적용되어 있습니다.

Vagrant Cloud에서 버전과 파일시스템별로 배포됩니다:

- 24.04 ext4: `dasomel/ubuntu-24.04-ext4` / xfs: `dasomel/ubuntu-24.04-xfs`
- 26.04 ext4: `dasomel/ubuntu-26.04-ext4` / xfs: `dasomel/ubuntu-26.04-xfs`

## 24.04 vs 26.04

| | 24.04 LTS (Noble Numbat) | 26.04 LTS (Resolute Raccoon) |
|---|---|---|
| 커널 | 6.8 | **7.0** |
| init / cgroup | systemd 255, cgroup v2 기본 | systemd 259, **cgroup v1 제거 (v2 전용)** |
| 컨테이너 런타임 | containerd 1.7 | containerd 2.2 / runc 1.4 |
| 암호화 | TLS 1.2+ | **양자내성(PQC) 기본** (OpenSSL 3.5 / OpenSSH 10.2) |
| 핵심 유틸 | GNU coreutils, sudo | 일부 Rust 재작성 (uutils, sudo-rs) |
| 선택 기준 | 최대 안정성 (**기본값**) | 최신 LTS, 커널 7.0 기능 |

> **K8s 참고**: 26.04는 cgroup v2 전용이므로 kubelet/containerd에 `SystemdCgroup=true`가 필요합니다. 두 라인 모두 동일하게 Kubernetes 튜닝이 적용됩니다.

## 주요 특징

### 멀티 아키텍처 및 프로바이더 지원

| Provider | AMD64 | ARM64 | 비고 |
|----------|-------|-------|------|
| VirtualBox | ✅ | ✅ | ARM64는 VirtualBox 7.1+ 필요 |
| VMware Fusion | ✅ | ✅ | Apple Silicon 지원 |

### 파일시스템 선택 (ext4 / xfs)

| | ext4 | xfs |
|---|---|---|
| **권장 용도** | 범용 | K8s 워크로드, 대용량 파일 |
| **K8s Quota** | 미지원 | `--local-storage-capacity-isolation` |
| **온라인 축소** | 지원 | 미지원 |
| **Box 크기** | ~2.2GB | ~3.4GB |

### 대용량 디스크 및 자동 확장

- **1TB 디스크**: Thin provisioning으로 실제 사용량만큼만 차지 (ext4 ~2.2GB, xfs ~3.4GB)
- **자동 확장**: 부팅 시 디스크 자동 확장 (파티션 → PV → LV → 파일시스템)

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

### 사전 설치 도구

| 분류 | 도구 |
|------|------|
| **K8s 생태계** | jq, yq, bash-completion, nfs-common, sshpass |
| **모니터링** | sysstat, iotop, iftop, nload, nethogs, dool |
| **네트워크 진단** | ipvsadm, ipset, conntrack, ethtool, tcpdump, nmap |
| **성능 분석** | linux-tools, bpfcc-tools, bpftrace |

### 보안 하드닝 (v1.1.0)

v1.1.0에서는 `needrestart` 제거(CVE 5건 완화), `auditd` 설치 후 비활성화(CIS 벤치마크 대응), `apparmor-utils` 추가, Longhorn CSI 및 Cilium bpffs 영구 마운트를 지원합니다. 상세 내용은 [박스 아키텍처 & 빌드](/ko/docs/kube-ready-box-architecture) 문서에서 확인할 수 있습니다.

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
# 24.04 ext4 (기본, 안정성, 범용)
vagrant init dasomel/ubuntu-24.04-ext4
vagrant up --provider=vmware_desktop

# 24.04 xfs (K8s ephemeral storage quota, 대용량 파일에 유리)
vagrant init dasomel/ubuntu-24.04-xfs
vagrant up --provider=vmware_desktop

# 26.04 (Resolute Raccoon, 커널 Linux 7.0)
vagrant init dasomel/ubuntu-26.04-ext4
vagrant up --provider=vmware_desktop
```

### Vagrantfile 예제

```ruby
Vagrant.configure("2") do |config|
  # 24.04: "dasomel/ubuntu-24.04-ext4" 또는 "dasomel/ubuntu-24.04-xfs"
  # 26.04: "dasomel/ubuntu-26.04-ext4" 또는 "dasomel/ubuntu-26.04-xfs"
  config.vm.box = "dasomel/ubuntu-24.04-ext4"

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

# 24.04 빌드 (기본)
./build.sh vmware-arm64
./build.sh vmware-arm64 --fs=xfs

# 26.04 빌드
./build.sh vmware-arm64 --version=26.04
./build.sh vmware-arm64 --version=26.04 --fs=xfs

# 전체 Box 빌드
./build.sh all                  # 24.04 ext4
./build.sh all --version=26.04  # 26.04 ext4
```

> **CI**: GitHub Actions `workflow_dispatch` 트리거의 `ubuntu_version` 입력으로 24.04 / 26.04를 선택할 수 있습니다.

## AI 협업 디렉토리

이 저장소는 AI 코딩 어시스턴트를 위한 `.agent/` 디렉토리를 포함합니다:

- **AGENT.md**: 기술 가이드 (Packer, K8s 튜닝, 최적화)
- **SECURITY.md**: 보안 가이드라인
- **skills/**: AI 에이전트 스킬 (자동 리뷰)

## 기술 문서

각 영역을 원본 소스 기준으로 상세히 정리한 문서입니다.

| 문서 | 내용 |
|------|------|
| [박스 아키텍처 & 빌드](/ko/docs/kube-ready-box-architecture) | Packer 빌드 파이프라인, XFS prjquota 설계, 멀티 프로바이더 |
| [사용법](/ko/docs/kube-ready-box-usage) | Vagrantfile 연동, 프로바이더 선택, Kubernetes 사후 설치 |
| [릴리스 & 배포](/ko/docs/kube-ready-box-release) | Vagrant Cloud / HCP 게시, 자격증명, 배포 체크리스트 |

## 참고 링크

- **Vagrant Cloud (24.04)**: [ext4](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04-ext4) / [xfs](https://app.vagrantup.com/dasomel/boxes/ubuntu-24.04-xfs)
- **Vagrant Cloud (26.04)**: [ext4](https://app.vagrantup.com/dasomel/boxes/ubuntu-26.04-ext4) / [xfs](https://app.vagrantup.com/dasomel/boxes/ubuntu-26.04-xfs)
- **GitHub**: [dasomel/kube-ready-box](https://github.com/dasomel/kube-ready-box)
- **Kubernetes 공식 문서**: [kubernetes.io](https://kubernetes.io/)
