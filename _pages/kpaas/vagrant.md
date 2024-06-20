---
#layout: home
title: "Vagrant"
permalink: /kpaas/vagrant/
author_profile: false
sidebar:
  nav: kpaas
breadcrumbs: true
last_modified_at: 2024-06-17
toc: true
toc_label: "Global Variable"
#toc_icon: "cogs"
---

## Vagrant 접속 오류 수정
```shell
    vb.customize ['modifyvm', :id, '--nictype1', 'virtio']
    vb.customize ['modifyvm', :id, '--nictype2', 'virtio']
```
- virtualbox 실행 시간이 오래 지속되면 접속이 안되는 오류가 발생함
- 위 설정을 통해서 interface를 변경시켜 해당 오류를 수정함

## Master01 Node를 메인으로 설정
```shell
  # Master Node
  (1..2).reverse_each do |i|
```
- K-PaaS 쉘스크립트는 기본적으로 1번 Master Node를 설정하도록 되어 있음
- 자원을 절약하기 위해서 ansible server와 master01 서버를 동일하게 설장하기 위해
- reverse_each 설정을 통해서 2번 master node를 먼저 설치하고 1번 master node를 맨마지막에 설치함