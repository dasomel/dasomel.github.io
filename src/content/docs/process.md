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
NAMESPACE        NAME                                                    READY   STATUS      RESTARTS      AGE
chaos-mesh       chaos-controller-manager-6648dff67b-8dv6w               1/1     Running     0             26h
chaos-mesh       chaos-daemon-49qvk                                      1/1     Running     0             26h
chaos-mesh       chaos-dashboard-58d8d8589c-tvsl5                        1/1     Running     0             26h
chaos-mesh       chaos-dns-server-6cbc94c77-q8mc4                        1/1     Running     0             26h
chartmuseum      chartmuseum-648968c7dd-n7cjg                            1/1     Running     0             26h
cp-portal        cp-portal-api-deployment-56b5c87fcd-295cs               1/1     Running     0             22h
cp-portal        cp-portal-catalog-api-deployment-6f94b7d5c-qmp9p        1/1     Running     0             23h
cp-portal        cp-portal-chaos-api-deployment-74f5955f8d-22697         1/1     Running     0             23h
cp-portal        cp-portal-chaos-collector-deployment-69f847bff9-9jc8k   1/1     Running     0             23h
cp-portal        cp-portal-common-api-deployment-7b48b54788-zk75r        1/1     Running     0             22h
cp-portal        cp-portal-metric-api-deployment-575f9d4df8-qvf85        1/1     Running     0             23h
cp-portal        cp-portal-terraman-deployment-db5544bb4-v6lcz           1/1     Running     0             23h
cp-portal        cp-portal-ui-deployment-788d99bb45-x8hn4                1/1     Running     0             21h
default          nfs-subdir-external-provisioner-59b6cdb74d-dkwlm        1/1     Running     0             46h
harbor           harbor-core-547d8bcf7b-vhr5r                            1/1     Running     0             26h
harbor           harbor-jobservice-5db8b59574-hbn49                      1/1     Running     0             26h
harbor           harbor-portal-7c8cf785d6-h6bg4                          1/1     Running     0             26h
harbor           harbor-postgresql-0                                     1/1     Running     0             26h
harbor           harbor-redis-master-0                                   1/1     Running     0             26h
harbor           harbor-registry-6fd978fbf5-nchs8                        2/2     Running     0             26h
harbor           harbor-trivy-0                                          1/1     Running     0             26h
ingress-nginx    ingress-nginx-controller-74f695ff79-mp5xx               1/1     Running     0             46h
keycloak         keycloak-0                                              1/1     Running     0             21h
keycloak         keycloak-1                                              1/1     Running     0             21h
kube-system      calico-kube-controllers-695788f969-6kp65                1/1     Running     0             46h
kube-system      calico-node-6m8st                                       1/1     Running     0             46h
kube-system      coredns-dbd95956c-mp6k4                                 1/1     Running     0             20h
kube-system      coredns-dbd95956c-stbd5                                 1/1     Running     0             20h
kube-system      dns-autoscaler-846b5fbd88-pvvfg                         1/1     Running     0             46h
kube-system      kube-apiserver-master01                                 1/1     Running     0             46h
kube-system      kube-apiserver-master02                                 1/1     Running     0             46h
kube-system      kube-controller-manager-master01                        1/1     Running     0             46h
kube-system      kube-controller-manager-master02                        1/1     Running     0             46h
kube-system      kube-scheduler-master01                                 1/1     Running     0             46h
kube-system      kube-scheduler-master02                                 1/1     Running     0             46h
kube-system      metrics-server-65765bb6cf-qtzdb                         1/1     Running     0             46h
kyverno          kyverno-admission-controller-7b74bfcfcb-gtjjx           1/1     Running     0             46h
kyverno          kyverno-background-controller-7ff58cc7cb-sdgdg          1/1     Running     0             46h
kyverno          kyverno-cleanup-controller-6999cc56d9-s4qvk             1/1     Running     0             46h
kyverno          kyverno-reports-controller-64d994cdc5-nxb6n             1/1     Running     0             46h
mariadb          mariadb-0                                               1/1     Running     0             26h
metallb-system   controller-68cccbf98c-8s2m9                             1/1     Running     0             46h
metallb-system   speaker-2kzd8                                           1/1     Running     0             46h
openbao          openbao-0                                               1/1     Running     0             26h
openbao          openbao-agent-injector-6567764cc9-rx54t                 1/1     Running     0             26h
```
