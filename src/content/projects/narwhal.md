---
title: "Narwhal"
description: "재현 가능하고 검증 가능한 Kubernetes Internal Developer Platform"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio Ambient", "Argo CD", "Cilium", "Air-Gap", "Keycloak", "Observability"]
order: 6
type: "own"
featured: true
problem: "수십 개 Cloud Native 프로젝트를 개별적으로 설치하면 DNS, TLS, identity, networking, startup order, version compatibility 같은 integration seam에서 반복적인 장애가 발생하고 업그레이드 때 다시 검증해야 함"
solution: "35개 GitOps-managed application을 하나의 reproducible IDP로 통합하고, 440건의 incident knowledge를 393개 regression checks와 live verification suite로 연결"
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
| Activity | 2026-02-08 이후 1,207 commits (v1.3.0 기준), 5 releases, latest v1.3.0 |
| Integration | 35 GitOps-managed applications |
| Regression | 393 regression checks (`regression-check-kakao.sh`), CI에서는 매 push마다 51-check suite 실행 |
| Live verification | Cluster 120+ checks, SSO 49 checks |
| Integration knowledge | 440 documented incidents |
| Deployment | Vagrant ARM64, Kakao Cloud AMD64, air-gapped |
| Offline bundle | Architecture별 104 container images, 27 Helm charts, binaries, manifests, OS packages |

이 수치는 commit 수를 강조하기 위한 것이 아니라, **통합 복잡성을 얼마나 반복해서 검증했는지**를 설명하는 운영 증거입니다.

## 현재 상태

최신 릴리스는 **v1.3.0**(2026-10-22)으로, v1.2.0 이후 main에 쌓인 보안 하드닝을 묶은 **hardening release**입니다. 핵심은 air-gap/오프라인 업그레이드 번들에 무결성 체인을 붙이고, 컴포넌트 간 trust boundary를 좁힌 뒤 static CI gate로 고정한 것입니다.

- **Air-gap 번들 무결성 체인**: 저장 시점 이미지별 digest inventory(`images.digests.json`), OCI layout 바이트 검증, image config의 `os/architecture` 검증을 `09` 관문에서 fail-closed로 확인
- **오프라인 업그레이드 번들 파이프라인**: JSON schema·verifier·승인 기반 promotion gate·dry-run diff, 번들 age/provenance 검증. cert-manager가 첫 오케스트레이션 파일럿
- **Trust boundary 축소**: Keycloak 클라이언트별 정확한 `webOrigins`, Velero·Portal RBAC least-privilege, `database` default-deny ingress, APISIX Admin API를 pod CIDR로 제한, gateway가 클라이언트가 보낸 `X-WEBAUTH-USER`를 더 이상 신뢰하지 않음, `root_squash` NFS export
- **공급망 CI gate**: mutable 이미지 태그·패키지 설치 차단, pip hash 강제, license policy gate, 오프라인 번들 CycloneDX SBOM
- **Service mesh static gate**(R242~R244): `PeerAuthentication` PERMISSIVE 예외를 검토된 allowlist로 고정
- **OpenBao raft snapshot 암호화 백업**(Velero 연동) 추가 — 아직 어떤 클러스터에도 활성화되지 않았고 라이브 동작은 미검증
- 컴포넌트: Kubernetes 1.35.7, nfs-quota-agent 0.5.0, Portal 이미지 1.1.0

릴리스 노트의 Known issues도 그대로 남겨 둡니다. Kyverno 이미지 서명 정책은 `Audit` 전용이라 아직 아무것도 차단하지 않고, 부트스트랩 중에는 ArgoCD가 reconcile할 때까지 mesh-wide PERMISSIVE가 유지됩니다. 기존 클러스터·번들은 Upgrade notes의 운영자 조치가 필요합니다(예: digest inventory 이전에 만든 번들은 `02`를 다시 실행해야 `09`를 통과).

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

각 incident에는 원인뿐 아니라 비슷하게 보이는 장애와 구분하기 위한 **discriminator**와 실패했던 접근까지 기록합니다. 이 방식이 누적되며 440건의 integration knowledge와 393개 regression checks로 연결되었습니다.

## 검증 계층

Narwhal은 “pod가 Running인가?”만 검증하지 않습니다.

| Layer | Scope | Question |
|---|---:|---|
| Cluster Verification | 120+ | 클러스터와 플랫폼 application이 실제로 건강한가? |
| SSO Verification | 49 | 여러 application의 identity flow가 end-to-end로 동작하는가? |
| Regression | 393 | 과거에 해결한 integration failure가 다시 발생하지 않았는가? |

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

Portal은 dashboard, Argo CD status, security, cost, governance, catalog, architecture 등의 platform-level context를 하나의 UI로 제공합니다. 포털 코드는 별도 저장소(`narwhal-portal`, 현재 아카이브)에서 이 저장소의 `portal/` 디렉토리로 이동했고, 릴리스는 `portal/vX.Y.Z` 태그(최신 Portal v1.1.2)로 발행됩니다.

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
