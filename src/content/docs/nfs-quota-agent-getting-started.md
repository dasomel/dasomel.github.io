---
title: 설치 및 설정
description: systemd 서비스 등록, 바이너리 컴파일 및 Helm 차트 배포 가이드.
project: NFS Quota Agent
path: nfs-quota-agent/getting-started
order: 1303
lastModified: 2026-08-23
---

# 설치 및 설정

NFS Quota Agent 데몬을 NFS 호스트 서버에 설치하고 쿠버네티스 클러스터와 연동하는 절차입니다.

## 1. 소스 빌드 및 호스트 설치

```bash
# 저장소 클론 및 바이너리 빌드
git clone https://github.com/dasomel/nfs-quota-agent.git
cd nfs-quota-agent
make build

# 바이너리 시스템 경로로 복사
sudo cp bin/nfs-quota-agent /usr/local/bin/
```

## 2. systemd 서비스 유닛 등록

`/etc/systemd/system/nfs-quota-agent.service` 파일 생성:

```ini
[Unit]
Description=NFS Quota Agent for Kubernetes
After=network.target nfs-server.service

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/nfs-quota-agent --nfs-root=/srv/nfs --port=8080 --grpc-port=50051
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nfs-quota-agent
sudo systemctl status nfs-quota-agent
```

## 3. Kubernetes Helm 배포

```bash
helm install nfs-quota-agent ./charts/nfs-quota-agent   --namespace storage   --create-namespace   --set agent.server="192.168.56.10"   --set agent.grpcPort=50051
```
