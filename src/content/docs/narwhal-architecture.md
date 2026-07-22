---
title: "아키텍처"
description: "Vagrant 기반 Kubernetes IDP 클러스터의 전체 아키텍처 및 HA 컨트롤 플레인 구성"
project: "Narwhal"
order: 101
lastModified: 2026-07-17
---

## 인프라스트럭처 오버뷰

Narwhal은 단일 클러스터에서 프로덕션 수준의 플랫폼 스택을 제공하는 Vagrant 기반 Kubernetes Internal Developer Platform (IDP) 클러스터입니다. 3개의 마스터 노드와 3개의 워커 노드로 구성된 HA(High Availability) 아키텍처를 채택하고 있습니다.

### 베이스 박스(Base Box)

- **이미지**: `dasomel/ubuntu-26.04-xfs` (Ubuntu 26.04 LTS, Kernel 7.0 기반)
- **특징**: `nfs-quota-agent`를 지원하기 위해 프로젝트 쿼터(prjquota)가 활성화된 XFS 파일시스템을 사용합니다.
- **Provider**: VirtualBox 및 VMware Desktop 환경을 모두 지원합니다.

## 노드 구성 (Node Layout)

모든 노드는 `192.168.56.0/24` 프라이빗 네트워크 대역을 사용합니다. 마스터는 컨트롤 플레인과 DaemonSet 여유분을, 워커는 플랫폼 앱 구동을 위해 각각 6GiB를 할당합니다.

| 노드명 | IP 주소 | 역할 | CPU | Memory | 비고 |
|---|---|---|---|---|---|
| `narwhal-master-1` | `192.168.56.10` | Control Plane | 2 | 6 GiB | NFS Server, dnsmasq |
| `narwhal-master-2` | `192.168.56.11` | Control Plane | 2 | 6 GiB | dnsmasq |
| `narwhal-master-3` | `192.168.56.12` | Control Plane | 2 | 6 GiB | dnsmasq |
| `narwhal-worker-1` | `192.168.56.21` | Worker | 2 | 6 GiB | 플랫폼 앱 실행 |
| `narwhal-worker-2` | `192.168.56.22` | Worker | 2 | 6 GiB | 플랫폼 앱 실행 |
| `narwhal-worker-3` | `192.168.56.23` | Worker | 2 | 6 GiB | 플랫폼 앱 실행 |

- **스토리지**: 전체 IDP 배포 시 VM당 최소 30GB 디스크 공간을 권장합니다.

## HA 컨트롤 플레인 디자인

Kubernetes v1.35.5 버전 기반으로 구성되며, 3대의 마스터 노드를 통한 고가용성 및 1 fault tolerance를 제공합니다.

- **kube-vip (v1.1.2)**: `192.168.56.100` 주소를 Control Plane VIP로 사용합니다. ARP 기반의 리더 선출(Leader Election) 방식을 사용하여 안정적인 API 서버 접근을 보장합니다.
- **etcd**: 3-node 쿼럼(quorum=2/3)으로 구성되어 마스터 노드 1대 장애 시에도 정상 동작합니다.

<Mermaid chart={`flowchart TB
  KC["kubectl / ArgoCD"]
  VIP(["kube-vip VIP<br/>192.168.56.100<br/>(ARP 리더 선출)"])
  M1["master-1 · .10<br/>apiserver + etcd<br/>NFS · dnsmasq"]
  M2["master-2 · .11<br/>apiserver + etcd"]
  M3["master-3 · .12<br/>apiserver + etcd"]
  W1["worker-1 · .21"]
  W2["worker-2 · .22"]
  W3["worker-3 · .23"]

  KC -->|":6443"| VIP
  VIP -.->|"리더 1대만 VIP 보유"| M1
  VIP -.-> M2
  VIP -.-> M3
  M1 <-->|"etcd raft (quorum 2/3)"| M2
  M2 <--> M3
  M3 <--> M1
  M1 --> W1
  M1 --> W2
  M1 --> W3

  style VIP fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style M1 fill:#f0fdf4,stroke:#059669,color:#111
  style M2 fill:#f0fdf4,stroke:#059669,color:#111
  style M3 fill:#f0fdf4,stroke:#059669,color:#111
  style W1 fill:#f9fafb,stroke:#d1d5db,color:#111
  style W2 fill:#f9fafb,stroke:#d1d5db,color:#111
  style W3 fill:#f9fafb,stroke:#d1d5db,color:#111
  style KC fill:#fff,stroke:#9ca3af,color:#111
`} />

## 네트워크 대역 (Network CIDRs)

| 목적 | 네트워크 대역 (CIDR) |
|---|---|
| Node Network | `192.168.56.0/24` |
| Pod Network | `10.244.0.0/16` |
| Service Network | `10.96.0.0/12` |
| MetalLB LoadBalancer Pool | `192.168.56.200` ~ `192.168.56.220` |

## 컴포넌트 토폴로지 요약

클러스터 프로비저닝은 순차적으로 이루어지며, 마스터 및 워커 노드 조인이 모두 완료된 이후 Phase 2 플랫폼 서비스들이 배포됩니다. 사용자 요청은 DNS 해석 → MetalLB → APISIX 게이트웨이를 거쳐 메시 내부 워크로드로 전달됩니다.

<Mermaid chart={`flowchart TB
  U["브라우저<br/>*.local.narwhal.internal"]
  DNS["dnsmasq · masters<br/>192.168.56.10:53"]
  LB(["MetalLB L2<br/>192.168.56.200"])
  GW["APISIX<br/>API Gateway + OIDC 플러그인"]
  KEY["Keycloak<br/>OIDC 인증"]

  subgraph MESH["Istio ambient mode · ztunnel mTLS (사이드카 없음)"]
    GIT["Gitea"]
    ARGO["ArgoCD"]
    HAR["Harbor"]
    PROM["Prometheus · Grafana<br/>Loki · Tempo"]
    PORTAL["Narwhal Portal"]
  end

  U -->|"① 이름 해석"| DNS
  DNS -->|"② → .200"| U
  U -->|"③ HTTPS"| LB
  LB --> GW
  GW -.->|"④ 미인증 시 리다이렉트"| KEY
  GW -->|"⑤ 라우팅 (ApisixRoute)"| MESH

  style LB fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style GW fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style DNS fill:#f0fdf4,stroke:#059669,color:#111
  style KEY fill:#f0fdf4,stroke:#059669,color:#111
  style U fill:#fff,stroke:#9ca3af,color:#111
  style MESH fill:#fafafa,stroke:#d1d5db,color:#374151
  style GIT fill:#f9fafb,stroke:#d1d5db,color:#111
  style ARGO fill:#f9fafb,stroke:#d1d5db,color:#111
  style HAR fill:#f9fafb,stroke:#d1d5db,color:#111
  style PROM fill:#f9fafb,stroke:#d1d5db,color:#111
  style PORTAL fill:#f9fafb,stroke:#d1d5db,color:#111
`} />
