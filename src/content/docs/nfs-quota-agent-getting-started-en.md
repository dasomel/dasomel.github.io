---
title: Installation & Setup
description: systemd service installation, binary compilation, and Helm deployment.
project: NFS Quota Agent
path: nfs-quota-agent/getting-started
order: 1303
lastModified: 2026-08-23
---

# Installation & Setup

Step-by-step installation and cluster integration guide for NFS Quota Agent.

## 1. Source Compilation & Host Setup

```bash
# Clone and build binary
git clone https://github.com/dasomel/nfs-quota-agent.git
cd nfs-quota-agent
make build

# Install binary
sudo cp bin/nfs-quota-agent /usr/local/bin/
```

## 2. systemd Service Registration

Create `/etc/systemd/system/nfs-quota-agent.service`:

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

## 3. Helm Deployment to Kubernetes

```bash
helm install nfs-quota-agent ./charts/nfs-quota-agent   --namespace storage   --create-namespace   --set agent.server="192.168.56.10"   --set agent.grpcPort=50051
```
