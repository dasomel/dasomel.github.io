---
title: "Tips & Tricks"
description: "Useful Tips for K-PaaS Local"
order: 9
date: 2024-07-03
lastModified: 2024-07-03
---

## SSH Access

Password: `vagrant` (vagrant default password)

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

## Checking Logs

Query inside master01 node (because master01 node acts as ansible server)

```shell
# platform
# TASK [cp-install : Run container platform deployment] **************************
tail -f /home/vagrant/cp-deployment/standalone/deploy-result.log

# portal
tail -f /home/vagrant/workspace/container-platform/cp-portal-deployment/script/deploy-portal-result.log
```

## Ansible Node Ping Test

Use to check communication status of each node:

```shell
source /vagrant/scripts/00.global_variable.sh

# ssh key copy
sshpass -pvagrant ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@"$MASTER01"
sshpass -pvagrant ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@"$MASTER02"
sshpass -pvagrant ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@"$WORKER01"
sshpass -pvagrant ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@"$WORKER02"

ansible all -m ping -i ~/cp-deployment/standalone/inventory/mycluster/inventory.yml
```

## Fixing SSH Error

Install the latest version of vagrant guest when `The following SSH command responded with a non-zero exit status` error occurs:

```shell
vagrant plugin install vagrant-vbguest

# https://github.com/dotless-de/vagrant-vbguest
vagrant plugin install vagrant-vbguest --plugin-version 0.32.0
```
