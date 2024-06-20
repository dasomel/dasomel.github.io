---
#layout: home
title: "Tips & Tricks"
permalink: /kpaas/tipsntricks/
author_profile: false
sidebar:
  nav: kpaas
last_modified_at: 2024-06-17
toc: true
toc_label: "Tips & Tricks"
#toc_icon: "cogs"
---


### ssh
- PW: vagrant(vagrant default password)
 
```shell
# master01
ssh-keygen -R 192.168.100.101
ssh vagrant@192.168.100.101

# master02
ssh-keygen -R 192.168.100.102
ssh vagrant@192.168.100.102

# worker01
ssh-keygen -R 192.168.100.111
ssh vagrant@192.168.100.111

# worker02
ssh-keygen -R 192.168.100.112
ssh vagrant@192.168.100.112
```

### log view

- master01 node안에서 조회
- master01 node가 ansibel server 역할을 하기 때문임

```shell
# platform
# TASK [cp-install : Run container platform deployment] **************************
tail -f /home/vagrant/cp-deployment/standalone/deploy-result.log

# portal
tail -f /home/vagrant/workspace/container-platform/cp-portal-deployment/script/deploy-portal-result.log
```

### ansible node ping test
- 각 node의 통신상태 확인시 사용

```shell
source /vagrant/scripts/00.global_variable.sh

# ssh key copy
sshpass -pvagrant ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@"$MASTER01"
sshpass -pvagrant ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@"$MASTER02"
sshpass -pvagrant ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@"$WORKER01"
sshpass -pvagrant ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@"$WORKER02"

ansible all -m ping -i ~/cp-deployment/standalone/inventory/mycluster/inventory.yml
```

### The following SSH command responded with a non-zero exit status
- 에러 발생시 vagrant guest 최신 버전을 설치

```shell
vagrant plugin install vagrant-vbguest

# https://github.com/dotless-de/vagrant-vbguest
vagrant plugin install vagrant-vbguest --plugin-version 0.32.0
```
