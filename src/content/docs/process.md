---
title: "설치과정"
description: "K-PaaS Local 설치 프로세스"
order: 5
lastModified: 2026-02-02
---

## 설치 후 사용 화면

K-PaaS Lite를 설치하면 다음과 같은 Container Platform Portal을 사용할 수 있습니다.

![Portal Demo](/images/kpaas/portal.gif)

## 설치 프로세스

![설치 프로세스](/images/kpaas/process.png)

## Installation

### VirtualBox (x86/Intel)

```shell
vagrant up &> ./logs/vagrant_$(date +%Y%m%d_%H%M%S).log
```

### VMware (ARM64/Apple Silicon)

```shell
vagrant up --provider=vmware_desktop &> ./logs/vagrant_$(date +%Y%m%d_%H%M%S).log
```

## VM stop

```shell
vagrant suspend
```

## VM destroy

```shell
vagrant destroy -f
```

## Log

### Vagrant 로그

![Vagrant 로그](/images/kpaas/log_vagrant.gif)

### Platform 로그

![Platform 로그](/images/kpaas/log_platform.gif)

## Platform installation complete

```shell
vagrant@master01:~$ kubectl get po -A
NAMESPACE        NAME                                               READY   STATUS      RESTARTS      AGE
cp-portal        cp-portal-api-deployment-55ffb6495b-b285b          1/1     Running     0             19m
cp-portal        cp-portal-common-api-deployment-76887f945f-r5zwn   1/1     Running     0             19m
cp-portal        cp-portal-metric-api-deployment-6cb7ff679d-vqxcg   1/1     Running     0             19m
cp-portal        cp-portal-terraman-deployment-f84c47bd7-zjb4w      1/1     Running     0             23m
cp-portal        cp-portal-ui-deployment-7cf58c847c-xmcwq           1/1     Running     0             19m
default          nfs-pod-provisioner-5fdb9dd5d6-ld49k               1/1     Running     3 (38m ago)   39m
harbor           cp-harbor-chartmuseum-8456b8856b-7f9b9             1/1     Running     0             34m
harbor           cp-harbor-core-856df8bb99-r2dnq                    1/1     Running     0             34m
harbor           cp-harbor-database-0                               1/1     Running     3 (14m ago)   34m
harbor           cp-harbor-jobservice-59f674897b-n8j9p              1/1     Running     3 (32m ago)   34m
harbor           cp-harbor-notary-server-5f58f65769-kc242           1/1     Running     6 (14m ago)   34m
harbor           cp-harbor-notary-signer-5ffbfccc6c-nzxpg           1/1     Running     1 (33m ago)   34m
harbor           cp-harbor-portal-776646487f-dcrjz                  1/1     Running     0             34m
harbor           cp-harbor-redis-0                                  1/1     Running     0             34m
harbor           cp-harbor-registry-68899d8bfb-xvxgg                2/2     Running     0             34m
harbor           cp-harbor-trivy-0                                  1/1     Running     0             34m
ingress-nginx    ingress-nginx-admission-create-fc8dg               0/1     Completed   0             39m
ingress-nginx    ingress-nginx-admission-patch-zx5hq                0/1     Completed   1             39m
ingress-nginx    ingress-nginx-controller-6dc9c5fb7c-pf6mp          1/1     Running     0             39m
keycloak         cp-keycloak-667678f5bd-2qfxt                       1/1     Running     0             19m
keycloak         cp-keycloak-667678f5bd-x42z7                       1/1     Running     0             18m
kube-system      calico-kube-controllers-648dffd99-nth7x            1/1     Running     0             46m
kube-system      calico-node-f4r57                                  1/1     Running     0             47m
kube-system      calico-node-k2f4x                                  1/1     Running     0             47m
kube-system      calico-node-lxzqp                                  1/1     Running     0             47m
kube-system      calico-node-twvjn                                  1/1     Running     0             47m
kube-system      coredns-77f7cc69db-rx9g4                           1/1     Running     0             45m
kube-system      coredns-77f7cc69db-scqz9                           1/1     Running     0             45m
kube-system      dns-autoscaler-8576bb9f5b-fzxp6                    1/1     Running     0             45m
kube-system      kube-apiserver-master01                            1/1     Running     0             38m
kube-system      kube-apiserver-master02                            1/1     Running     0             38m
kube-system      kube-controller-manager-master01                   1/1     Running     2             49m
kube-system      kube-controller-manager-master02                   1/1     Running     3 (38m ago)   48m
kube-system      kube-proxy-4xfxk                                   1/1     Running     0             48m
kube-system      kube-proxy-5m6hk                                   1/1     Running     0             48m
kube-system      kube-proxy-6rtws                                   1/1     Running     0             48m
kube-system      kube-proxy-mkbwh                                   1/1     Running     0             48m
kube-system      kube-scheduler-master01                            1/1     Running     2 (38m ago)   49m
kube-system      kube-scheduler-master02                            1/1     Running     2 (42m ago)   48m
kube-system      metrics-server-bd6df7764-lllq6                     1/1     Running     0             44m
kube-system      nodelocaldns-2cm6z                                 1/1     Running     0             45m
kube-system      nodelocaldns-2w9pn                                 1/1     Running     0             45m
kube-system      nodelocaldns-976pm                                 1/1     Running     0             45m
kube-system      nodelocaldns-h8x4h                                 1/1     Running     0             45m
mariadb          cp-mariadb-0                                       1/1     Running     0             23m
metallb-system   controller-666f99f6ff-jgd4p                        1/1     Running     0             44m
metallb-system   speaker-dw6lt                                      1/1     Running     0             44m
metallb-system   speaker-fvh7b                                      1/1     Running     0             44m
metallb-system   speaker-tff9j                                      1/1     Running     0             44m
metallb-system   speaker-zrj6m                                      1/1     Running     0             44m
vault            cp-vault-0                                         1/1     Running     0             34m
vault            cp-vault-agent-injector-7b84c58f45-cmw4g           1/1     Running     0             34m
```
