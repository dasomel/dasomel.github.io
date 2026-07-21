---
title: "Narwhal"
description: "Vagrant 기반 Kubernetes Internal Developer Platform (IDP) 클러스터"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio", "ArgoCD", "Cilium"]
order: 6
type: "own"
featured: true
problem: "로컬 환경에서 프로덕션 수준의 Kubernetes IDP를 구성하려면 수십 개 컴포넌트를 직접 설치·통합해야 함"
solution: "vagrant up 한 명령으로 HA 컨트롤 플레인, GitOps, SSO, Observability, Service Mesh를 포함한 전체 IDP 클러스터 자동 프로비저닝"
---

## 프로젝트 소개

**Narwhal**은 Vagrant 기반 Kubernetes **Internal Developer Platform (IDP)** 클러스터입니다.

"바다의 유니콘"이라 불리는 일각고래처럼, 단일 클러스터에서 프로덕션 수준의 플랫폼 전체를 제공합니다. [kube-ready-box](https://github.com/dasomel/kube-ready-box)의 `dasomel/ubuntu-26.04-xfs` Box를 기반으로 하며, Kubernetes v1.35 HA 클러스터 위에 GitOps, SSO, Observability, Service Mesh, Storage, Backup까지 완전 자동화로 구성합니다.

## 주요 구성 요소

| 영역 | 컴포넌트 |
|------|----------|
| **오케스트레이션** | Kubernetes v1.35 (HA: master ×3, worker ×3) |
| **네트워킹** | Cilium CNI, MetalLB, kube-vip (VIP HA), APISIX API Gateway |
| **GitOps** | ArgoCD + Gitea (App-of-Apps 패턴) |
| **SSO** | Keycloak OIDC (ArgoCD, Grafana, Gitea, Harbor, Headlamp 연동) |
| **Observability** | Prometheus, Grafana, Loki, Tempo, Hubble |
| **Storage** | NFS (Block) + SeaweedFS (Object/S3) + nfs-quota-agent |
| **Service Mesh** | Istio ambient mode (mTLS, ztunnel, 사이드카 없음) |
| **보안** | cert-manager, OpenBao (Secrets), Kyverno (Policy) |
| **백업** | Velero + CNPG barman |
| **테스트** | Chaos Mesh (카오스 실험), k6 (부하 테스트) |

## 아키텍처

```
┌──────────────────────────────────────────────────┐
│                  Vagrant VMs                     │
├──────────────────┬─────────────┬─────────────────┤
│  master-1        │ master-2/3  │ worker-1/2/3    │
│  192.168.56.10   │ .11 / .12   │ .21 / .22 / .23 │
│  2 CPU, 6GB      │ 2 CPU, 6GB  │ 2 CPU, 6GB      │
│  NFS, dnsmasq    │ dnsmasq     │                 │
└──────────────────┴─────────────┴─────────────────┘
                   VIP: 192.168.56.100 (kube-vip)
                   LB:  192.168.56.200 (MetalLB/APISIX)
                   DNS: *.local.narwhal.internal
```

## 요구사항

- Vagrant 2.4+
- VirtualBox 7.1+ 또는 VMware Fusion 26H1
- RAM 32GB+ (권장 40GB+)
- VM당 30GB+ Disk

## 시작하기

```bash
git clone https://github.com/dasomel/narwhal.git
cd narwhal

# 클러스터 생성 (모든 컴포넌트 자동 프로비저닝)
vagrant up --provider=vmware_desktop

# 노드 상태 확인
vagrant ssh master-1 -c "kubectl get nodes"

# 클러스터 삭제
vagrant destroy -f
```

## 기술 문서

각 영역을 원본 소스 기준으로 상세히 정리한 문서입니다.

| 문서 | 내용 |
|------|------|
| [아키텍처](/ko/docs/narwhal-architecture) | 클러스터 토폴로지, HA 컨트롤 플레인, 노드 구성 |
| [네트워킹](/ko/docs/narwhal-networking) | Cilium, MetalLB, kube-vip, APISIX, DNS |
| [GitOps](/ko/docs/narwhal-gitops) | ArgoCD + Gitea App-of-Apps 패턴 |
| [보안 & SSO](/ko/docs/narwhal-security) | Keycloak OIDC, OpenBao, Kyverno, cert-manager |
| [관측성](/ko/docs/narwhal-observability) | Prometheus, Grafana, Loki, Tempo, Hubble |
| [스토리지 & 데이터베이스](/ko/docs/narwhal-storage) | NFS, SeaweedFS, nfs-quota-agent, CNPG |
| [운영 & 재해복구](/ko/docs/narwhal-operations) | Day-2 운영, Velero 백업/복구, 장애 대응 |
| [테스트 & 카오스 엔지니어링](/ko/docs/narwhal-testing) | Chaos Mesh 실험 스위트, k6 부하 테스트, 기준선 |

## 참고 링크

- **GitHub**: [dasomel/narwhal](https://github.com/dasomel/narwhal)
- **관리 포털**: [Narwhal Portal](/ko/projects/narwhal-portal)
- **Base Box**: [dasomel/kube-ready-box](https://github.com/dasomel/kube-ready-box)
- **nfs-quota-agent**: [dasomel/nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
