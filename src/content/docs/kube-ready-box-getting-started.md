---
title: Vagrantfile 가이드
description: 멀티 프로바이더 설정, 리소스 할당 및 클러스터 프로비저닝 가이드.
project: Kube-Ready-Box
path: kube-ready-box/getting-started
order: 1402
lastModified: 2026-11-03
---

# Vagrantfile 가이드

Vagrantfile에서 Kube-Ready-Box를 불러와 다중 노드 클러스터를 정의하는 방법입니다.

## 기본 Vagrantfile 예시

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "dasomel/ubuntu-26.04-xfs"
  config.vm.box_url = "https://dasomel.github.io/kube-ready-box/boxes/ubuntu-26.04-xfs.json"
  config.vm.box_version = ">= 0.3.0"
  # Ubuntu 0.3.1: Apple Silicon은 vmware_desktop(arm64), Intel/AMD는 virtualbox(amd64)

  # VMware Desktop 프로바이더 설정
  config.vm.provider "vmware_desktop" do |v|
    v.cpus = 4
    v.memory = 8192
    v.gui = false
  end

  # VirtualBox 프로바이더 설정 (amd64 호스트)
  config.vm.provider "virtualbox" do |vb|
    vb.cpus = 4
    vb.memory = 8192
  end

  config.vm.network "private_network", ip: "192.168.56.10"
end
```
