---
title: "Narwhal"
description: "재현 가능하고 검증 가능한 Kubernetes Internal Developer Platform (IDP)"
github: "https://github.com/dasomel/narwhal"
tags: ["Kubernetes", "Vagrant", "GitOps", "IDP", "Istio", "ArgoCD", "Cilium", "Air-Gap", "Keycloak", "Alloy"]
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

- **Kubernetes v1.35 HA**: 3 Control Plane + 3 Worker 노드 토폴로지 (kube-vip 기반 VIP `192.168.56.100`)
- **35개 GitOps 애플리케이션**: Argo CD + Gitea App-of-Apps 선언적 수명주기 관리 및 Sync Waves 의존성 제어
- **263건의 통합 인시던트 교훈**: 장애 원인과 판별자(Discriminator)를 `lessons-log.md`에 체계적으로 기록
- **51개 CI 회귀 테스트**: 클러스터 업그레이드 및 컴포넌트 변경 시 과거 장애 재발을 원천 차단
- **Air-Gap 오프라인 번들링**: 아키텍처별(ARM64/AMD64) 이미지, Helm 차트, 바이너리 사전 검증 패키지 제공
- **Kube-Ready-Box 기반**: Ubuntu 26.04 LTS 및 XFS Project Quota 최적화 커널 활용

---

## 35개 통합 컴포넌트 매트릭스

| 영역 | 컴포넌트 | 버전 / 기술 | 주요 역할 및 연동 방식 |
|---|---|---|---|
| **Control Plane** | Kubernetes | v1.35 | 3-node HA etcd 쿼럼, 고가용성 API 서버 |
| **HA VIP** | kube-vip | v1.1.x | Control Plane IP 가상화 (`192.168.56.100`) |
| **CNI** | Cilium | v1.17+ | eBPF Host Routing, Kube-proxy 대체, NetworkPolicy |
| **Service Mesh** | Istio Ambient | v1.24+ | ztunnel L4 mTLS 암호화, Sidecar-less 아키텍처 |
| **Load Balancer** | MetalLB | v0.14+ | L2 Mode IP Pool (`192.168.56.200~220`) |
| **API Gateway** | Apache APISIX | v3.11+ | OIDC 플러그인, 동적 라우팅, Rate Limiting |
| **GitOps** | Argo CD | v2.13+ | App-of-Apps 패턴, 선언적 클러스터 상태 동기화 |
| **Git Engine** | Gitea | v1.23+ | 자체 호스팅 Git 저장소, 웹훅 기반 동기화 트리거 |
| **IAM / SSO** | Keycloak | v26+ | OIDC 중앙 인증, 역할 기반 접근 제어(RBAC) |
| **Metrics** | Prometheus | v2.55+ | 클러스터 메트릭 수집 및 Alertmanager 알림 |
| **Dashboards** | Grafana | v11+ | 사전 구성된 플랫폼 통합 관제 대시보드 |
| **Logs** | Grafana Loki | v3.3+ | 멀티 테넌트 로그 집계 및 실시간 로그 스트리밍 |
| **Log Agent** | Grafana Alloy | v1.5+ | eBPF 및 파드 로그 수집 에이전트 |
| **Traces** | Grafana Tempo | v2.6+ | OpenTelemetry 호환 분산 트레이싱 백엔드 |
| **Network Flow** | Cilium Hubble | v1.17+ | eBPF 기반 실시간 서비스 맵 및 흐름 시각화 |
| **File Storage** | NFS CSI + Quota | v4.9+ | XFS Project Quota 기반 용량 제한 (`nfs-quota-agent`) |
| **Object Store** | SeaweedFS S3 | v3.79+ | 고성능 분산 S3 호환 객체 저장소 |
| **Relational DB** | CloudNativePG | v1.25+ | HA PostgreSQL 클러스터 자동 복제 및 Barman 백업 |
| **Secrets** | OpenBao | v2.1+ | 암호화된 시크릿 저장소 및 동적 토큰 발급 |
| **Policy** | Kyverno | v1.13+ | Pod Security Standards(PSS) 강제 및 승인 제어 |
| **Certificates** | cert-manager | v1.16+ | 내부 CA 및 Let's Encrypt 인증서 자동 갱신 |
| **Backup / DR** | Velero | v1.15+ | 클러스터 리소스 및 PVC 스냅샷 백업/복구 |
| **Chaos** | Chaos Mesh | v2.6+ | 네트워크 단절, 지연, 파드 다운 카오스 실험 |
| **UI Portal** | Narwhal Portal | Next.js 16 | 플랫폼 리소스 조회, 릴리스 상태 점검 워크벤치 |

---

## 아키텍처 토폴로지 및 트래픽 흐름

```text
                        사용자 / 개발자 요청
                                │
                                ▼
                   MetalLB (192.168.56.200)
                                │
                                ▼
                   Apache APISIX (API Gateway)
                                │
        ┌───────────────────────┼───────────────────────┐
        │ OIDC 인증 확인          │ mTLS 트래픽 라우팅     │
        ▼                       ▼                       ▼
   Keycloak SSO            Istio Ambient (ztunnel)   Workloads
   (192.168.56.10:8080)    (L4/L7 Encryption)        (ArgoCD, Grafana, ...)
```

---

## 263건의 인시던트 교훈을 통한 회귀 방지 (Knowledge as Tests)

Narwhal은 장애를 일회성으로 해결하는 데 그치지 않고, `docs/lessons-log.md`에 원인과 **판별자(Discriminator)**를 기록한 뒤 자동화된 CI 회귀 테스트로 연결합니다.

```text
장애 발생 (Incident)
      ↓
근본 원인 및 판별자 식별 (Root Cause & Discriminator)
      ↓
lessons-log.md 기록 (Knowledge Codification)
      ↓
CI 자동화 회귀 테스트 작성 (51 Regression Checks)
      ↓
업그레이드 및 릴리스 시 재발 방지 (Zero-Drift Guarantee)
```

---

## 시작하기 (Quickstart)

```bash
# 1. 저장소 클론
git clone https://github.com/dasomel/narwhal.git
cd narwhal

# 2. 로컬 6노드 HA 클러스터 부트스트랩 (VMware Desktop / VirtualBox)
vagrant up --provider=vmware_desktop

# 3. 마스터 노드 접속 및 클러스터 노드 상태 확인
vagrant ssh master-1 -c "kubectl get nodes -o wide"

# 4. Argo CD 전체 애플리케이션 동기화 상태 점검
vagrant ssh master-1 -c "kubectl get applications -n argocd"

# 5. 플랫폼 검증 스위트 실행 (120+ checks)
vagrant ssh master-1 -c "/opt/narwhal/scripts/verify-cluster.sh"
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 상세 내용 |
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
