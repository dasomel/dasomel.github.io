---
title: "박스 아키텍처 & 빌드"
description: "Kube-Ready-Box의 내부 구조, 기반 OS, 파일시스템 설계 및 Packer 빌드 파이프라인"
project: "Kube-Ready-Box"
order: 301
lastModified: 2026-07-21
---

## 아키텍처 개요

Kube-Ready-Box는 단일 인스턴스에서 원활한 Kubernetes 운영이 가능하도록 OS 레벨에서 사전 튜닝된 Ubuntu LTS 기반 Vagrant Box입니다. 이 Box는 플랫폼 엔지니어링 및 개발 환경(예: Narwhal IDP 클러스터)의 기반 이미지로 활용되도록 설계되었습니다.

기본적으로 다음과 같은 환경을 지원합니다:
- **기반 OS**: Ubuntu 24.04 LTS (기본값) 및 26.04 LTS
- **아키텍처**: AMD64, ARM64 (Apple Silicon 지원)
- **프로바이더**: VirtualBox, VMware Fusion

## 기반 OS (24.04 vs 26.04)

두 버전의 핵심 차이점은 커널과 cgroup 관리 방식에 있습니다.

| | 24.04 LTS (Noble Numbat) | 26.04 LTS (Resolute Raccoon) |
|---|---|---|
| 커널 | 6.8 | 7.0 |
| init / cgroup | systemd 255, cgroup v2 기본 | systemd 259, cgroup v1 제거 (v2 전용) |
| 암호화 | TLS 1.2+ | 양자내성(PQC) 기본 (OpenSSL 3.5 / OpenSSH 10.2) |
| 안정성 | 최대 안정성 (기본값) | 최신 LTS |

- 26.04는 cgroup v1이 완전히 제거되어 v2 전용으로만 동작합니다. 이는 Kubernetes 튜닝 시 `SystemdCgroup=true` 설정과 맞물려 중요하게 작용합니다.

## 파일시스템 설계 (XFS와 prjquota)

Kube-Ready-Box는 `ext4`와 `xfs` 두 가지 파일시스템 변형을 제공하며, 각기 다른 사용 목적을 가집니다. 디스크는 1TB로 Thin Provisioning되어 부팅 시 파티션, PV, LV, 파일시스템 순으로 자동 확장됩니다.

### XFS를 사용하는 이유
특히 XFS 파일시스템 옵션(`dasomel/ubuntu-26.04-xfs`)은 Narwhal 클러스터 및 `nfs-quota-agent`와 같은 프로젝트의 필수 기반이 됩니다. 다음은 XFS 파일시스템이 어떻게 Narwhal 클러스터의 스토리지 격리를 보장하는지 보여주는 흐름도입니다.

<Mermaid chart={`flowchart LR
  OS["Kube-Ready-Box<br/>(XFS prjquota)"]
  DIR["디렉토리 트리 쿼터<br/>(Directory-tree Quotas)"]
  AGT["nfs-quota-agent<br/>(Per-PV Quotas)"]
  NW["Narwhal 클러스터<br/>(스토리지 격리 보장)"]

  OS -->|"지원"| DIR
  DIR -->|"강제"| AGT
  AGT -->|"의존"| NW

  style OS fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style DIR fill:#f0fdf4,stroke:#059669,color:#111
  style AGT fill:#f0fdf4,stroke:#059669,color:#111
  style NW fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

- **Project Quota (prjquota)**: XFS는 디렉토리 트리 수준에서 용량을 제한하는 프로젝트 쿼터를 지원합니다. Kubernetes는 이를 통해 Pod의 `ephemeral-storage` 용량 격리(`--local-storage-capacity-isolation`)를 정확하게 구현할 수 있습니다.
- **ext4와의 차이**: ext4 변형은 온라인 축소를 지원하고 박스 크기가 약 2.2GB로 가벼워 범용에 적합하지만, K8s Quota 네이티브 지원을 위해서는 약 3.4GB 크기의 XFS 변형이 권장됩니다.

## 사전 설치 패키지 및 OS 튜닝

컨테이너 런타임(containerd) 및 K8s 컴포넌트(kubelet 등)는 사용자 선택권을 위해 의도적으로 **포함하지 않습니다**. 대신 K8s 구동을 위한 최적화가 적용되어 있습니다.

- **커널 파라미터**: IP 포워딩 활성화, 네트워크/메모리/파일시스템 튜닝 적용
- **리소스 제한**: 스왑(Swap) 비활성화, 파일 디스크립터 및 프로세스 제한 해제
- **사전 설치 도구**: `jq`, `yq`, `bash-completion`, `nfs-common`, `sshpass` 및 각종 성능 분석 도구(`sysstat`, `bpftrace`, `tcpdump` 등)

## 보안 하드닝 & K8s 전제조건 (v1.1.0)

v1.1.0 업데이트는 보안 하드닝 및 Kubernetes(K8s) 전제조건 충족에 중점을 두었습니다.

### 보안 하드닝

- **`needrestart` 제거 (Purge)**: 로컬 권한 에스컬레이션 취약점 5건(CVE-2024-48990, CVE-2024-48991, CVE-2024-48992, CVE-2024-10224, CVE-2024-11003)을 근본적으로 차단하기 위해 패키지를 완전히 삭제했습니다.
- **`unattended-upgrades` 완벽 제거**: 기존 `remove` 방식에서 `purge`로 변경하여, 잔류 설정(`logind InhibitDelayMaxSec=30` 등)까지 정리했습니다.
- **`auditd` 설치 후 비활성화**: CIS 벤치마크 요건(EKS/GKE/AKS 노드 이미지 표준)을 충족하도록 설치하였으나, I/O 오버헤드 방지를 위해 기본적으로 비활성화(`systemctl disable --now auditd`)했습니다. (설정: `max_log_file=50`, `max_log_file_action=ROTATE`, `disk_full_action=SUSPEND`) 활성화가 필요할 경우 `systemctl enable --now auditd`를 사용합니다.
- **`apparmor-utils` 추가**: K8s 공식 보안 체크리스트에 따라 추가 설치되었습니다.
- **보안 필수 패키지 업그레이드 유지**: OpenSSH(CVE-2025-26465/26466), sudo(CVE-2025-32462/32463), 커널/AppArmor(CVE-2026-23xxx) 등의 중요 보안 패치는 적용된 상태를 유지합니다.

### K8s/CSI 전제조건

- **Longhorn CSI 스토리지 지원**: Longhorn V1 엔진의 필수 요구 사항인 `open-iscsi`, `cryptsetup`, `dmsetup`을 사전 설치했습니다. 또한 `/etc/modules-load.d/iscsi.conf`를 통해 `iscsi_tcp` 커널 모듈을 적재하고 `iscsid` 서비스를 활성화했습니다.
- **Cilium eBPF 영구 마운트**: `/etc/fstab`에 `bpffs /sys/fs/bpf bpf defaults 0 0`을 추가하여 재부팅 시에도 eBPF 리소스가 영구적으로 유지되도록 구성했습니다.

### OS 튜닝 보강

- **`vm.max_map_count` 설정**: K8s 권장 사항 및 Ubuntu 26.04 systemd 기본값에 맞춰 `1048576`으로 설정하여 하위 값으로 다운그레이드되는 현상을 방지했습니다.
- **EEVDF 무효 튜너블 제거**: 커널 6.6+의 EEVDF 스케줄러 전환에 따라 무의미해진 CFS 스케줄러 튜너블(`kernel.sched_min_granularity_ns`, `sched_wakeup_granularity_ns`)을 제거했습니다. 또한 `ubuntu-tuning.sh`가 `/etc/os-release`를 기반으로 버전을 자동 감지하도록 개선되었습니다.
- **시간 동기화 (`chrony` 전환)**: K8s 및 etcd의 클럭 안정성 권장 사항이자 Ubuntu 25.10+ 기본 데몬인 `chrony`로 시간 동기화 도구를 전환(`systemd-timesyncd`에서 변경)했습니다. 한국 NTP 서버는 `/etc/chrony/sources.d/kr-ntp.sources`에 구성됩니다.

## Packer 빌드 파이프라인

모든 Box 이미지는 Packer를 사용하여 선언적으로 빌드되며, `packer/build.sh` 스크립트를 통해 제어됩니다. 이 파이프라인은 다양한 버전과 파일시스템을 단일 프로세스로 처리합니다.

<Mermaid chart={`flowchart LR
  ISO["Ubuntu ISO<br/>+ autoinstall (ext4 / xfs)"]
  subgraph MATRIX["단일 파이프라인 공유"]
    TPL["Packer Templates<br/>(VirtualBox / VMware)"]
    PROV["Provisioning Scripts<br/>(01-base ~ 04-k8s)"]
  end
  BOX(["Box Artifacts<br/>(24.04 / 26.04 x ext4 / xfs)"])

  ISO -->|"입력"| TPL
  TPL -->|"실행"| PROV
  PROV -->|"생성"| BOX

  style ISO fill:#fff,stroke:#9ca3af,color:#111
  style TPL fill:#f0fdf4,stroke:#059669,color:#111
  style PROV fill:#f0fdf4,stroke:#059669,color:#111
  style BOX fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style MATRIX fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

```bash
# 24.04 빌드 (기본 ext4)
./build.sh vmware-arm64

# 26.04 빌드 (xfs)
./build.sh vmware-arm64 --version=26.04 --fs=xfs

# 전체 빌드 (4개 Box 병렬 빌드)
./build.sh all
```

### 빌드 단계 (Provisioning Scripts)

빌드는 번호가 지정된 스크립트 순서대로 실행됩니다:
- `01-base.sh`: 패키지 업데이트
- `02-os-tuning.sh`: 커널 파라미터 및 리소스 최적화
- `03-os-packages.sh`: 필수 K8s 연관 도구 설치
- `04-k8s-prereq.sh`: 스왑 제거 및 필수 커널 모듈 적재
- 그 외 네트워크 및 디스크 I/O 최적화 스크립트 실행 후 빌드 종료

Apple Silicon(ARM64) 환경에서는 VMware Fusion을 권장하며, VirtualBox 사용 시 Scancode 문제 해결을 위해 VirtualBox 7.2.6 이상 버전이 필요합니다.
