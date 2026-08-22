---
title: "Narwhal"
description: "재현 가능하고 검증 가능한 Kubernetes Internal Developer Platform (IDP)"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio", "ArgoCD", "Cilium", "Air-Gap", "Keycloak"]
order: 6
type: "own"
featured: true
problem: "Kubernetes 위에 수십 개 Cloud Native 컴포넌트를 통합하면 DNS, TLS, SSO, 네트워크 및 버전 호환성 장애가 반복 발생함"
solution: "35개 애플리케이션을 단일 GitOps 플랫폼으로 통합하고 263건의 인시던트 교훈을 회귀 테스트로 연결한 재현 가능한 IDP 구축"
---

## 프로젝트 소개

**Narwhal**은 Kubernetes v1.35 기반 위에서 GitOps, IAM/SSO, Service Mesh, Observability, Artifact Registry, Storage, Backup, Policy, API Gateway 및 관리 포털을 단일 단위로 통합한 오픈소스 **Internal Developer Platform (IDP)**입니다.

단순한 Kubernetes 설치 스크립트가 아니라, 컴포넌트 간의 결합 경계(Integration Seams)를 검증하고 유지보수하는 플랫폼 통합 솔루션입니다.

### 플랫폼 핵심 현황

- **Kubernetes v1.35 HA**: 3 Control Plane + 3 Worker 노드 토폴로지 (kube-vip 기반 VIP)
- **35개 GitOps 애플리케이션**: Argo CD + Gitea App-of-Apps 선언적 수명주기 관리
- **263건의 통합 인시던트 교훈**: 장애 원인과 판별자(Discriminator)를 `lessons-log.md`에 기록
- **51개 CI 회귀 테스트**: 업그레이드 및 변경 시 과거 장애 재발을 원천 차단
- **Air-Gap 오프라인 번들링**: 아키텍처별(ARM64/AMD64) 이미지 및 Helm 차트 사전 검증 패키지 제공
- **Kube-Ready-Box 기반**: Ubuntu 26.04 LTS 및 XFS Project Quota 최적화 커널 활용

---

## 아키텍처 토폴로지

```text
                     Kubernetes v1.35 HA Cluster
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
      Cilium eBPF             kube-vip (VIP)            MetalLB
         │                                                 │
    Istio Ambient                                       APISIX (API Gateway)
         │                                                 │
   ┌─────┴─────────────────────────────────────────────────┴─────┐
   │ GitOps · SSO · Observability · Storage · Backup · Security  │
   │ ArgoCD / Gitea · Keycloak OIDC · Prometheus / Grafana / Loki│
   │ NFS CSI / SeaweedFS S3 · Velero / CNPG · OpenBao / Kyverno  │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
                          Narwhal Portal (UI)
```

---

## 35개 통합 컴포넌트 매트릭스

| 영역 | 주요 통합 컴포넌트 | 핵심 기능 및 역할 |
|---|---|---|
| **Orchestration** | Kubernetes v1.35, kube-vip | 3-node HA 컨트롤 플레인, etcd 쿼럼 유지, 고가용성 API VIP |
| **Networking & Ingress** | Cilium eBPF, MetalLB, Apache APISIX | BGP/L2 로드밸런싱, 고성능 API 라우팅, OIDC 플러그인 통합 |
| **GitOps Engine** | Argo CD, Gitea | App-of-Apps 패턴 선언적 배포, 자체 호스팅 Git 저장소 |
| **IAM & SSO** | Keycloak, OAuth2 Proxy | 통합 사용자 디렉토리, OIDC 토큰 발급, 서비스별 SSO 연동 |
| **Service Mesh** | Istio Ambient, ztunnel | Sidecar-less L4/L7 트래픽 보안, 상호 TLS(mTLS), Hubble 시각화 |
| **Observability** | Prometheus, Grafana, Loki, Tempo, Alloy | 메트릭 수집, 분산 추적, 중앙 로그 집계 및 대시보드 |
| **Storage & Data** | NFS CSI, SeaweedFS S3, nfs-quota-agent, CloudNativePG | XFS 쿼터 적용 PV 스토리지, 분산 S3 객체 저장소, HA PostgreSQL |
| **Security & Policy** | cert-manager, OpenBao, Kyverno | Let's Encrypt / 내부 CA 자동 인증서 발급, 시크릿 볼트, 정책 검증 |
| **Backup & DR** | Velero, Barman | 클러스터 리소스 백업, S3 스냅샷 스케줄링, DB 시점 복구 |
| **Management UI** | Narwhal Portal | 플랫폼 리소스 조회, 릴리스 상태 점검, 개발자 워크벤치 |

---

## 시작하기 (Quickstart)

```bash
# 1. 저장소 클론
git clone https://github.com/dasomel/narwhal.git
cd narwhal

# 2. 로컬 HA 클러스터 생성 (VMware / VirtualBox)
vagrant up --provider=vmware_desktop

# 3. 클러스터 노드 상태 확인
vagrant ssh master-1 -c "kubectl get nodes -o wide"

# 4. GitOps 및 전체 플랫폼 애플리케이션 동기화 상태 점검
vagrant ssh master-1 -c "kubectl get applications -n argocd"
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 설명 |
|---|---|---|
| **개요 (Overview)** | [플랫폼 개요](/oss/narwhal/overview) | Narwhal IDP 설계 철학과 3계층 통합 모델 |
| **아키텍처 (Architecture)** | [클러스터 아키텍처](/oss/narwhal/architecture) | 3M+3W 노드 토폴로지, HA 컨트롤 플레인 및 네트워크 흐름 |
| **GitOps** | [GitOps 워크플로](/oss/narwhal/gitops) | Argo CD + Gitea App-of-Apps 선언적 배포 체계 |
| **네트워킹 (Networking)** | [네트워크 및 Ingress](/oss/narwhal/networking) | Cilium eBPF, MetalLB, APISIX 라우팅 및 DNS |
| **보안 & SSO (Security)** | [보안 및 인증 체계](/oss/narwhal/security) | Keycloak OIDC, OpenBao, Kyverno 정책 통제 |
| **관측성 (Observability)** | [모니터링 & 로깅](/oss/narwhal/observability) | Prometheus, Grafana, Loki, Tempo, Hubble 분산 추적 |
| **스토리지 (Storage)** | [스토리지 & DB](/oss/narwhal/storage) | NFS CSI, SeaweedFS S3, nfs-quota-agent, CNPG |
| **운영 & 백업 (Operations)** | [Day-2 운영 & 재해복구](/oss/narwhal/operations) | Velero 백업, 에어갭 오프라인 번들, 업그레이드 가이드 |
| **테스트 & 카오스 (Testing)** | [회귀 검증 & 카오스](/oss/narwhal/testing) | 263건의 인시던트 회귀 테스트(51 checks) 및 Chaos Mesh |
