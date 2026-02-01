---
title: "Vagrant"
description: "Vagrant 설정 및 팁"
order: 6
date: 2024-06-17
lastModified: 2026-02-02
---

## Provider 선택

### VirtualBox (x86/Intel)

```shell
brew install --cask virtualbox
vagrant up
```

### VMware (ARM64/Apple Silicon)

```shell
# VMware Fusion 설치
brew install --cask vmware-fusion

# Vagrant VMware 플러그인 설치
vagrant plugin install vagrant-vmware-desktop

# VMware provider로 실행
vagrant up --provider=vmware_desktop
```

## Vagrant 접속 오류 수정

```shell
vb.customize ['modifyvm', :id, '--nictype1', 'virtio']
vb.customize ['modifyvm', :id, '--nictype2', 'virtio']
```

- VirtualBox 실행 시간이 오래 지속되면 접속이 안되는 오류가 발생함
- 위 설정을 통해서 interface를 변경시켜 해당 오류를 수정함

## Master01 Node를 메인으로 설정

```shell
# Master Node
(1..2).reverse_each do |i|
```

- K-PaaS 쉘스크립트는 기본적으로 1번 Master Node를 설정하도록 되어 있음
- 자원을 절약하기 위해서 ansible server와 master01 서버를 동일하게 설정하기 위해
- `reverse_each` 설정을 통해서 2번 master node를 먼저 설치하고 1번 master node를 맨마지막에 설치함
