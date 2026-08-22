---
title: "Narwhal"
description: "재현 가능하고 검증 가능한 Kubernetes Internal Developer Platform"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio Ambient", "Argo CD", "Cilium", "Air-Gap", "Keycloak", "Observability"]
order: 6
type: "own"
featured: true
problem: "수십 개 Cloud Native 프로젝트를 개별적으로 설치하면 DNS, TLS, identity, networking, startup order, version compatibility 같은 integration seam에서 반복적인 장애가 발생하고 업그레이드 때 다시 검증해야 함"
solution: "35개 GitOps-managed application을 하나의 reproducible IDP로 통합하고, 263건의 incident knowledge를 51개 CI regression checks와 live verification suite로 연결"
---

## 프로젝트 소개

**Narwhal**은 Kubernetes 위에 GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway와 Management Portal을 함께 제공하는 오픈소스 **Internal Developer Platform (IDP)**입니다.

Narwhal의 핵심은 Kubernetes 자체를 설치하는 것이 아닙니다. 실제 운영 비용이 발생하는 **컴포넌트 사이의 integration seam**을 하나의 제품 경계로 다루는 것입니다.

```text
Kubernetes
   ↓
GitOps / Identity / Networking / Security
   ↓
Observability / Storage / Backup / Registry
   ↓
Management Portal
   ↓
Developer / Operator Experience
```

## 현재 규모

README 기준 현재 reference implementation은 다음과 같은 상태입니다.

| 항목 | 현황 |
|---|---|
| Activity | 2026-02-08 이후 483 commits, 4 releases, latest v1.2.0 |
| Integration | 35 GitOps-managed applications |
| Regression | 51 CI regression checks |
| Live verification | Cluster 120+ checks, SSO 49 checks |
| Integration knowledge | 263 documented incidents |
| Deployment | Vagrant ARM64, Kakao Cloud AMD64, air-gapped |
| Offline bundle | Architecture별 104 container images, 27 Helm charts, binaries, manifests, OS packages |

이 수치는 commit 수를 강조하기 위한 것이 아니라, **통합 복잡성을 얼마나 반복해서 검증했는지**를 설명하는 운영 증거입니다.

## 핵심 구성

### Kubernetes / Networking

- Kubernetes **v1.35**
- Cilium **v1.19.x**
- Hubble **v1.19.x**
- kube-vip **v1.1.x**
- MetalLB **v0.16.x**
- APISIX **3.15.x**

### GitOps / Identity

- Argo CD **v3.4.x**
- Gitea **v1.26.x**
- Keycloak **26.5.x**

### Observability

- Prometheus Stack **v0.91.x**
- Loki **3.7.x**
- Grafana Alloy **v1.17.x**
- Tempo **2.9.x**
- Hubble

### Platform Services

- Harbor **v2.15.x**
- OpenBao **v2.5.x**
- Kyverno **v1.18.x**
- Headlamp **v0.42.x**
- SeaweedFS **v4.34.x**
- Velero **v1.18.x**
- CloudNative-PG **v1.29.x**
- Istio **v1.30.x** ambient mode

## Integration Seams를 제품으로 보기

예를 들어 다음은 단일 제품의 bug가 아니라 여러 시스템이 연결될 때 발생하는 문제입니다.

```text
Keycloak OIDC claim
       ↓
APISIX authentication
       ↓
service routing
       ↓
Istio ambient mTLS
       ↓
Kubernetes workload
```

Narwhal에서는 이런 경계를 문서, scripts, health checks, regression checks로 남깁니다. 따라서 특정 설정을 “한번 맞춰 놓는 것”이 아니라 업그레이드마다 다시 검증할 수 있습니다.

## Knowledge as Tests

Narwhal의 가장 중요한 운영 자산 중 하나는 `lessons-log.md`입니다.

장애를 다음과 같이 변환합니다.

```text
Incident
   ↓
Root Cause
   ↓
Discriminator
   ↓
Regression Check
   ↓
Future Upgrade Gate
```

각 incident에는 원인뿐 아니라 비슷하게 보이는 장애와 구분하기 위한 **discriminator**와 실패했던 접근까지 기록합니다. 이 방식이 누적되며 263건의 integration knowledge와 51개 CI checks로 연결되었습니다.

## 검증 계층

Narwhal은 “pod가 Running인가?”만 검증하지 않습니다.

| Layer | Scope | Question |
|---|---:|---|
| Cluster Verification | 120+ | 클러스터와 플랫폼 application이 실제로 건강한가? |
| SSO Verification | 49 | 여러 application의 identity flow가 end-to-end로 동작하는가? |
| CI Regression | 51 | 과거에 해결한 integration failure가 다시 발생하지 않았는가? |

실제 cluster 검증과 CI 회귀 검증을 분리함으로써 빠른 regression gate와 live environment verification을 동시에 유지합니다.

## Air-Gapped Installation

Narwhal은 인터넷 연결이 없는 환경을 중요한 운영 시나리오로 취급합니다.

```text
Online build
   ↓
images / charts / binaries / manifests / packages
   ↓
architecture-specific offline bundle
   ↓
verification
   ↓
install without live Internet
```

ARM64와 AMD64에 맞는 bundle을 사전에 만들고, upstream artifact identity와 내부 mirror 조건을 포함해 disconnected environment에서도 같은 platform contract를 재현하는 것을 목표로 합니다.

## Management Portal

Narwhal은 **Narwhal Portal**을 함께 사용해 day-2 운영을 제공합니다.

Portal은 dashboard, Argo CD status, security, cost, governance, catalog, architecture 등의 platform-level context를 하나의 UI로 제공합니다.

즉,

```text
Narwhal = platform integration + operation
Narwhal Portal = developer / operator experience
```

라는 역할 분리를 유지합니다.

## 시작하기

```bash
git clone https://github.com/dasomel/narwhal.git
cd narwhal

vagrant up --provider=vmware_desktop

vagrant ssh master-1 -c "kubectl get nodes"
vagrant ssh master-1 -c "kubectl get applications -A"
vagrant ssh master-1 -c "bash /home/vagrant/scripts/test/verify-cluster.sh"
```

지원 환경에는 Vagrant 기반 ARM64/AMD64 개발 환경과 Kakao Cloud deployment가 있으며, air-gapped install profile도 별도로 운영합니다.

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [플랫폼 개요](/oss/narwhal/overview) | IDP 범위와 integration-first 철학 |
| Architecture | [아키텍처](/oss/narwhal/architecture) | HA control plane, network, service layout |
| GitOps | [GitOps](/oss/narwhal/gitops) | Argo CD + Gitea App-of-Apps |
| Networking | [네트워킹](/oss/narwhal/networking) | Cilium, MetalLB, APISIX, DNS |
| Security | [보안/SSO](/oss/narwhal/security) | Keycloak, OpenBao, Kyverno, TLS |
| Observability | [관측성](/oss/narwhal/observability) | Prometheus, Grafana, Loki, Tempo, Hubble |
| Storage | [스토리지](/oss/narwhal/storage) | NFS CSI, SeaweedFS, quota, PostgreSQL |
| Operations | [운영](/oss/narwhal/operations) | backup, restore, upgrade, air-gap |
| Testing | [검증/카오스](/oss/narwhal/testing) | regression, cluster verification, chaos |

## 프로젝트 관계

```text
kube-ready-box
       ↓
   Narwhal IDP
   ├── nfs-quota-agent
   ├── ldapium
   └── Narwhal Portal

OpenForge
   └── shared engineering / supply-chain practices
```
