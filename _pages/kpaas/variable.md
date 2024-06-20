---
#layout: home
title: "Global Variable"
permalink: /kpaas/variable/
author_profile: false
sidebar:
  nav: kpaas
breadcrumbs: true
last_modified_at: 2024-06-17
toc: true
toc_label: "Global Variable"
#toc_icon: "cogs"
---

## Vagrant home 주소
```shell
export INSTALL_PATH=/home/vagrant
```

## IP 설정
```shell
export MASTER01=192.168.100.101
export MASTER02=192.168.100.102
export WORKER01=192.168.100.111
export WORKER02=192.168.100.112
export CLUSTER_ENDPOINT=192.168.100.200
```
- CLUSTER_ENDPOINT
  - master 서버 이중화를 위해서 virtual ip 설정(keepalive, haproxy)
  - master node apiserver 주소
