---
title: "Global Variable"
description: "K-PaaS Local 환경 변수 설정"
order: 7
lastModified: 2026-02-02
---

## Vagrant home 주소

```shell
export INSTALL_PATH=/home/vagrant
```

## VirtualBox interface 설정

```shell
export VM_INTERFACE_NAME=enp0s8
```

HAProxy에서 사용됨:

```shell
sudo cat << EOF | sudo tee -a /etc/keepalived/keepalived.conf
vrrp_instance VI_1 {
  interface $INTERFACE_NAME
```

## IP 설정

### Node 설정

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

### Local(PC) 설정

#### MacOS, Linux

File: `/etc/hosts`

```shell
sudo cat << EOF | sudo tee -a /etc/hosts
192.168.100.200 cluster-endpoint
192.168.100.201 k-paas.io
192.168.100.201 openbao.k-paas.io
192.168.100.201 harbor.k-paas.io
192.168.100.201 keycloak.k-paas.io
192.168.100.201 portal.k-paas.io
192.168.100.201 chartmuseum.k-paas.io
EOF
```

#### Windows

File: `C:\Windows\System32\drivers\etc\hosts`

관리자 권한으로 cmd 실행:

```shell
echo.192.168.100.200 cluster-endpoint>>      %SystemRoot%\system32\drivers\etc\hosts
echo.192.168.100.201 k-paas.io>>             %SystemRoot%\system32\drivers\etc\hosts
echo.192.168.100.201 openbao.k-paas.io>>     %SystemRoot%\system32\drivers\etc\hosts
echo.192.168.100.201 harbor.k-paas.io>>      %SystemRoot%\system32\drivers\etc\hosts
echo.192.168.100.201 keycloak.k-paas.io>>    %SystemRoot%\system32\drivers\etc\hosts
echo.192.168.100.201 portal.k-paas.io>>      %SystemRoot%\system32\drivers\etc\hosts
echo.192.168.100.201 chartmuseum.k-paas.io>> %SystemRoot%\system32\drivers\etc\hosts
```

### CLUSTER_ENDPOINT

- master 서버 이중화를 위해서 virtual ip 설정 (keepalive, haproxy)
- master node apiserver 주소
