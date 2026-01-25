---
title: "Global Variable"
description: "K-PaaS Local Environment Variable Configuration"
order: 7
lastModified: 2024-06-17
---

## Vagrant Home Path

```shell
export INSTALL_PATH=/home/vagrant
```

## VirtualBox Interface Setting

```shell
export VM_INTERFACE_NAME=enp0s8
```

Used in HAProxy:

```shell
sudo cat << EOF | sudo tee -a /etc/keepalived/keepalived.conf
vrrp_instance VI_1 {
  interface $INTERFACE_NAME
```

## IP Configuration

### Node Configuration

```shell
# Node
export MASTER01=192.168.100.101
export MASTER02=192.168.100.102
export WORKER01=192.168.100.111
export WORKER02=192.168.100.112
export CLUSTER_ENDPOINT=192.168.100.200

# Portal
export PORTAL_MASTER_NODE_PUBLIC_IP=cluster-endpoint
export PORTAL_HOST_IP=192.168.100.201
export PORTAL_HOST_DOMAIN=k-paas.io
```

### Local(PC) Configuration

```shell
192.168.100.201 k-paas.io
192.168.100.201 vault.k-paas.io
192.168.100.201 harbor.k-paas.io
192.168.100.201 keycloak.k-paas.io
192.168.100.201 portal.k-paas.io
```

### CLUSTER_ENDPOINT

- Virtual IP setting for master server redundancy (keepalive, haproxy)
- Master node apiserver address
