---
title: "Narwhal"
description: "재현 가능하고 검증 가능한 Kubernetes Internal Developer Platform (IDP)"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio", "ArgoCD", "Cilium", "Air-Gap"]
order: 6
type: "own"
featured: true
problem: "Kubernetes 위에 수십 개 Cloud Native 컴포넌트를 통합하면 DNS·TLS·SSO·네트워크·버전 호환성 문제가 반복적으로 발생함"
solution: "35개 애플리케이션을 하나의 GitOps 플랫폼으로 통합하고 설치·검증·운영까지 하나의 재현 가능한 단위로 제공"
---

## 프로젝트 소개

**Narwhal**은 Kubernetes 위에 GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway와 관리 포털을 통합한 오픈소스 **Internal Developer Platform (IDP)**입니다.

단순히 Kubernetes를 설치하는 것이 아니라 각 프로젝트 사이의 integration seam을 제품의 핵심으로 다룹니다.

> **Narwhal은 Kubernetes Installer가 아니라 Platform Integration 프로젝트입니다.**

## 현재 상태

- Kubernetes **v1.35** 기반
- 3 master + 3 worker HA 클러스터
- **35개 GitOps 관리 애플리케이션**
- **263건의 integration incident/lesson 기록**
- **51개 regression checks**를 CI에서 실행
- Vagrant ARM64 / Kakao Cloud AMD64 / air-gapped 환경 지원
- 아키텍처별 오프라인 번들 제공
- 최신 릴리스: **v1.2.0**

## 주요 구성 요소

| 영역 | 컴포넌트 |
|---|---|
| **Orchestration** | Kubernetes v1.35, HA control plane |
| **Networking** | Cilium, kube-vip, MetalLB, APISIX |
| **GitOps** | ArgoCD + Gitea App-of-Apps |
| **SSO** | Keycloak OIDC + APISIX openid-connect |
| **Observability** | Prometheus, Grafana, Loki, Tempo, Grafana Alloy, Hubble |
| **Storage** | NFS CSI, SeaweedFS S3, nfs-quota-agent |
| **Service Mesh** | Istio Ambient / ztunnel / mTLS |
| **Security** | cert-manager, OpenBao, Kyverno |
| **Backup** | Velero, CNPG Barman |
| **Management** | Narwhal Portal |
| **Testing** | Chaos Mesh, k6, cluster/SSO/regression verification |

## Integration Knowledge as Tests

Narwhal은 장애를 해결하고 버리는 대신 `lessons-log.md`에 원인과 **discriminator**를 기록하고 회귀 테스트로 연결합니다.

```text
Incident → Lesson → Discriminator → Regression Test
```

이 구조가 Kubernetes나 통합 컴포넌트 업그레이드 후 과거 문제가 다시 나타나는 것을 막는 핵심 유지보수 방식입니다.

## Air-Gapped Installation

인터넷이 없는 환경에서도 동일한 플랫폼을 설치할 수 있도록 컨테이너 이미지, Helm chart, 바이너리와 OS package를 아키텍처별로 묶어 제공합니다. 외부 의존성을 설치 시점에 해결하지 않고 사전에 bundle로 검증하는 것이 목표입니다.

## 기반 환경

Kube-Ready-Box의 `dasomel/ubuntu-26.04-xfs`를 기반으로 하며 XFS project quota와 Kubernetes 노드 튜닝을 활용합니다.

## 시작하기

```bash
git clone https://github.com/dasomel/narwhal.git
cd narwhal
vagrant up --provider=vmware_desktop
vagrant ssh master-1 -c "kubectl get nodes"
vagrant destroy -f
```

## 기술 문서

| 문서 | 내용 |
|---|---|
| [아키텍처](/ko/docs/narwhal-architecture) | HA, 노드 토폴로지, 네트워크와 플랫폼 구성 |
| [네트워킹](/ko/docs/narwhal-networking) | Cilium, kube-vip, MetalLB, APISIX, DNS |
| [GitOps](/ko/docs/narwhal-gitops) | ArgoCD + Gitea와 App-of-Apps |
| [보안 & SSO](/ko/docs/narwhal-security) | Keycloak, OpenBao, Kyverno, cert-manager |
| [관측성](/ko/docs/narwhal-observability) | Prometheus, Grafana, Loki, Tempo, Hubble |
| [스토리지 & 데이터베이스](/ko/docs/narwhal-storage) | NFS, SeaweedFS, nfs-quota-agent, CNPG |
| [운영 & 재해복구](/ko/docs/narwhal-operations) | Day-2, Velero, 장애 대응 |
| [테스트 & 카오스](/ko/docs/narwhal-testing) | Regression, Chaos Mesh, k6 |

## 참고 링크

- **GitHub**: [dasomel/narwhal](https://github.com/dasomel/narwhal)
- **Management Portal**: [Narwhal Portal](/ko/projects/narwhal-portal)
- **Base OS**: [Kube-Ready-Box](/ko/projects/kube-ready-box)
- **Storage Agent**: [NFS Quota Agent](/ko/projects/nfs-quota-agent)
