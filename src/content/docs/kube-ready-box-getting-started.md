---
title: Vagrantfile 가이드
description: 멀티 프로바이더 설정 및 클러스터 프로비저닝.
project: Kube-Ready-Box
path: kube-ready-box/getting-started
order: 1400
lastModified: 2026-08-23
---

# Vagrantfile 가이드

VMware Desktop, VirtualBox, Libvirt에서 Kube-Ready-Box를 실행하는 방법입니다.

## Vagrant 설정 예시
```ruby
config.vm.box = 'dasomel/ubuntu-26.04-xfs'
config.vm.network 'private_network', ip: '192.168.56.10'
```

## 관련 링크

- [Kube-Ready-Box 저장소](https://github.com/dasomel/kube-ready-box)
- [프로젝트 홈](/oss/kube-ready-box/)
