---
title: 설치 및 설정
description: NFS 서버 노드 준비, 파일시스템 quota 사전 조건 및 Helm 차트 배포 가이드.
project: NFS Quota Agent
path: nfs-quota-agent/getting-started
order: 1303
lastModified: 2026-09-17
---

# 설치 및 설정

NFS Quota Agent 데몬을 NFS 호스트 서버에 설치하고 쿠버네티스 클러스터와 연동하는 절차입니다.

## 1. NFS 서버 사전 조건 확인

에이전트는 NFS client가 아니라 **실제 NFS server node**에서 실행되어야 합니다. export가 quota를 지원하는 파일시스템에 있고, 해당 quota 기능이 활성화되어 있는지 먼저 확인합니다.

```bash
# 파일시스템과 마운트 옵션 확인
findmnt -T /data -o TARGET,FSTYPE,OPTIONS

# XFS/ext4: pquota 또는 prjquota가 포함되어야 함
# Btrfs: quota 활성화 및 PV 디렉터리의 subvolume 여부 확인
btrfs quota status /data
btrfs subvolume show /data/<pv-directory>
```

ext4를 사용하는 최소 Linux 이미지에서는 `quota_tree`와 `quota_v2` 커널 모듈이 별도 패키지에 있을 수 있습니다. ext4 mount 실패 시 파일시스템 손상으로 단정하기 전에 `dmesg`와 커널 모듈 패키지를 확인합니다.

## 2. Helm 배포

저장소의 `charts/nfs-quota-agent`에서 DaemonSet을 설치합니다. `nfs-server` 라벨은 실제 NFS 서버 노드에만 설정해야 합니다.

```bash
kubectl label node <nfs-server-node> nfs-server=true
helm install nfs-quota-agent ./charts/nfs-quota-agent \
  --namespace nfs-quota-agent --create-namespace \
  --set config.nfsBasePath=/export \
  --set config.nfsServerPath=/data \
  --set nfsExport.hostPath=/data
```

설치 후에는 다음으로 배치와 로그를 확인합니다.

```bash
kubectl -n nfs-quota-agent get daemonset,pods -o wide
kubectl -n nfs-quota-agent logs -l app.kubernetes.io/name=nfs-quota-agent
```

## 3. 소스 빌드 (개발·검증용)

```bash
# 저장소 클론 및 바이너리 빌드
git clone https://github.com/dasomel/nfs-quota-agent.git
cd nfs-quota-agent
make build

# 바이너리 시스템 경로로 복사
sudo cp bin/nfs-quota-agent /usr/local/bin/
```

직접 바이너리를 systemd로 실행하는 방식은 현재 Helm DaemonSet 배포 모델의 대체 경로가 아닙니다. 호스트에서 수동 실행해야 하는 경우에는 저장소의 최신 CLI flags와 host mount 구성을 확인한 뒤, Kubernetes API 접근 권한과 quota 명령 실행 권한을 동일하게 제공해야 합니다.
