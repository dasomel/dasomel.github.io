---
title: 시스템 구조
description: XFS 파티셔닝, 커널 파라미터(sysctl.d), containerd v2 및 cgroupv2 베이스라인.
project: Kube-Ready-Box
path: kube-ready-box/architecture
order: 1401
lastModified: 2026-08-23
---

# 시스템 구조

Packer 빌드 파이프라인에서 구성되는 시스템 및 커널 최적화 명세입니다.

## 커널 및 네트워크 파라미터 (`/etc/sysctl.d/99-kubernetes-cri.conf`)

```ini
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
fs.inotify.max_user_watches         = 524288
fs.inotify.max_user_instances       = 8192
vm.max_map_count                    = 262144
```

## 스토리지 및 컨테이너 런타임

- **XFS Mount Flags**: `/etc/fstab`에 `pquota,prjquota,noatime` 옵션 적용
- **containerd v2**: `SystemdCgroup = true`가 활성화된 `/etc/containerd/config.toml` 베이스라인
- **cgroup v2**: 커널 부트 파라미터에 `systemd.unified_cgroup_hierarchy=1` 강제 적용
