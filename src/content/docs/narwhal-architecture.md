---
title: "아키텍처"
description: "Narwhal v1.2의 HA Kubernetes IDP 아키텍처와 플랫폼 통합 구조"
project: "Narwhal"
order: 101
lastModified: 2026-08-19
---

## 인프라스트럭처 오버뷰

Narwhal은 Kubernetes v1.35 위에 GitOps, IAM/SSO, API Gateway, Service Mesh, Observability, Storage, Backup, Policy와 Management Portal을 통합한 재현 가능한 IDP입니다.

현재 기본 개발 토폴로지는 **3 master + 3 worker**이며, Vagrant/ARM64와 Kakao Cloud/AMD64 및 air-gapped 설치를 목표로 동일한 플랫폼 구성을 유지합니다.

## 베이스 박스

- `dasomel/ubuntu-26.04-xfs`
- Ubuntu 26.04 LTS / Linux 7.0 계열
- XFS project quota 기반
- Kube-Ready-Box에서 Packer로 생성

## 노드 구성

| 노드 | 역할 | IP |
|---|---|---|
| master-1 | Control Plane, NFS, dnsmasq | 192.168.56.10 |
| master-2 | Control Plane, dnsmasq | 192.168.56.11 |
| master-3 | Control Plane | 192.168.56.12 |
| worker-1 | Platform Apps | 192.168.56.21 |
| worker-2 | Platform Apps | 192.168.56.22 |
| worker-3 | Platform Apps | 192.168.56.23 |

각 VM은 기본 2 CPU / 6 GiB이며 전체 플랫폼 구동에는 32 GiB 이상, 40 GiB 이상을 권장합니다.

## HA Control Plane

Kubernetes v1.35의 3-node control plane과 kube-vip를 사용합니다.

- API VIP: `192.168.56.100`
- kube-vip: v1.1.x
- etcd: 3-node quorum, 1 node failure tolerance

```text
kubectl / ArgoCD
       │
       ▼
192.168.56.100
   kube-vip VIP
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
M1    M2    M3
 │     │     │
 └─────┼─────┘
       │
    Workers
```

## 네트워크

| 목적 | 값 |
|---|---|
| Node Network | `192.168.56.0/24` |
| Pod Network | `10.244.0.0/16` |
| Service Network | `10.96.0.0/12` |
| LoadBalancer | `192.168.56.200` 계열 |
| Internal DNS | `*.local.narwhal.internal` |

외부 요청은 `DNS → MetalLB → APISIX → OIDC/Service route → workload` 흐름으로 처리됩니다.

## 플랫폼 레이어

```text
                    Kubernetes v1.35
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     Cilium             kube-vip           MetalLB
        │                                     │
      Istio Ambient                         APISIX
        │                                     │
  ┌─────┴────────────────────────────────────┴─────┐
  │ GitOps · SSO · Observability · Storage · Backup │
  │ ArgoCD/Gitea · Keycloak · Prom/Grafana/Loki     │
  │ NFS/SeaweedFS · Velero/CNPG · OpenBao/Kyverno   │
  └──────────────────────┬──────────────────────────┘
                         │
                  Narwhal Portal
```

현재 GitOps에서 **35개 애플리케이션**을 관리하며, `lessons-log.md`에는 통합 과정에서 발생한 **263건의 incident**가 기록되어 있습니다.

## 검증 구조

Narwhal은 단순 설치 성공이 아니라 세 단계로 검증합니다.

- Cluster verification: 120+ checks
- SSO verification: 49 checks
- CI regression suite: 51 checks

회귀 검증은 incident의 원인과 discriminator를 테스트로 연결합니다.

## Air-Gapped 구조

온라인 환경에서 확보한 이미지·Helm chart·바이너리·OS package를 아키텍처별 bundle로 만들고, 설치 시 외부 레지스트리나 패키지 저장소에 연결하지 않고 배포할 수 있도록 구성합니다.

따라서 Narwhal의 재현성은 단순한 VM snapshot이 아니라 **버전 고정 + artifact bundle + regression verification**의 조합으로 정의됩니다.
