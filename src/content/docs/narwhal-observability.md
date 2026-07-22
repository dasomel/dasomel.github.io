---
title: "관측성"
description: "Narwhal 클러스터의 모니터링, 로깅, 트레이싱 스택 (Observability)"
project: "Narwhal"
order: 105
lastModified: 2026-07-17
---

Narwhal 프로젝트는 메트릭, 로그, 분산 추적(Tracing), 네트워크 가시성을 위한 통합 관측성(Observability) 스택을 제공합니다. 

## 주요 컴포넌트

다음은 관측성 스택의 세 가지 주요 파이프라인(메트릭, 로그, 트레이스)과 네트워크 가시성 컴포넌트의 데이터 흐름입니다.

<Mermaid chart={`flowchart TB
  subgraph METRICS["Metrics Pipeline"]
    E["Exporters<br/>(node, kube-state)"]
    PROM["Prometheus<br/>(TSDB, 7d)"]
    E --> PROM
  end

  subgraph LOGS["Logs Pipeline"]
    POD["Pods<br/>(Containers)"]
    ALLOY["Grafana Alloy<br/>(DaemonSet)"]
    LOKI["Loki<br/>(Monolithic)"]
    POD --> ALLOY
    ALLOY --> LOKI
  end

  subgraph TRACES["Traces Pipeline"]
    APP["Applications<br/>(OTLP)"]
    TEMPO["Tempo<br/>(Distributed Tracing)"]
    APP --> TEMPO
  end

  subgraph NET["Network Visibility"]
    CILIUM["Cilium<br/>(eBPF)"]
    HUBBLE["Hubble UI<br/>(L3/L4/L7)"]
    CILIUM --> HUBBLE
  end

  GRAFANA["Grafana<br/>(Unified Dashboard)"]
  
  PROM --> GRAFANA
  LOKI --> GRAFANA
  TEMPO --> GRAFANA

  style GRAFANA fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style PROM fill:#f0fdf4,stroke:#059669,color:#111
  style LOKI fill:#f0fdf4,stroke:#059669,color:#111
  style TEMPO fill:#f0fdf4,stroke:#059669,color:#111
  style HUBBLE fill:#f9fafb,stroke:#d1d5db,color:#111
  style ALLOY fill:#f9fafb,stroke:#d1d5db,color:#111
  style E fill:#f9fafb,stroke:#d1d5db,color:#111
  style POD fill:#fff,stroke:#9ca3af,color:#111
  style APP fill:#fff,stroke:#9ca3af,color:#111
  style CILIUM fill:#f9fafb,stroke:#d1d5db,color:#111
  style METRICS fill:#fafafa,stroke:#d1d5db,color:#374151
  style LOGS fill:#fafafa,stroke:#d1d5db,color:#374151
  style TRACES fill:#fafafa,stroke:#d1d5db,color:#374151
  style NET fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

| 구분 | 컴포넌트 | 버전 | 스토리지 (nfs-csi) | 역할 |
|---|---|---|---|---|
| **Metrics** | Prometheus | chart 86.2.3 | 10Gi | TSDB (7일 보존), 알림 평가, k6 Remote Write |
| **Dashboard** | Grafana | 12.x | 5Gi | 통합 대시보드, OIDC 기반 SSO 연동 |
| **Logs** | Loki | v3.7.3 | (SeaweedFS S3) | Monolithic 구조의 로그 집계 시스템 |
| **Log Agent** | Grafana Alloy | v1.17.0 | - | Promtail을 대체하는 노드 단위 로그 수집기 |
| **Traces** | Tempo | v2.9.0 | (SeaweedFS S3) | 분산 트레이싱 백엔드 |
| **Network** | Hubble | v1.19.4 | - | Cilium 기반 L3/L4/L7 네트워크 가시성 |

## 메트릭 수집 및 알림 (Prometheus)

- `kube-prometheus-stack` 헬름 차트로 배포되며, 7일의 데이터 보존(Retention) 주기를 가집니다.
- **k6 Load Test 통합**: `enableRemoteWriteReceiver: true` 설정으로 k6 테스트 메트릭을 직접 푸시받아, 전용 **k6 Load Test 대시보드**(`k6-load-test`)에서 시각화합니다. 부하 테스트 시나리오와 기준선은 [테스트 & 카오스 엔지니어링](/ko/docs/narwhal-testing) 문서를 참고하세요.
- **최적화**: Cilium이 `kube-proxy-replacement` 모드로 동작하므로, 오탐이 발생하는 `kubeProxy` 및 `kubeEtcd` 모니터링은 비활성화되어 있습니다.
- **알림 규칙(Alerting)**: `narwhal-alerts` 규칙 그룹을 통해 6개 그룹 22개의 알림을 관리합니다.
  - **cluster-health** (4개): 노드 NotReady, API 서버/etcd 다운
  - **node-health** (4개): CPU 90%+, 디스크 85%+, 리소스 압력
  - **platform-apps** (6개): 주요 플랫폼 앱 다운, ArgoCD OutOfSync
  - **database** (3개): `CNPGClusterNotHealthy`, `CNPGReplicationLag`, `CNPGHighConnections`
  - **certificates** (2개): `CertificateExpiringSoon`, `CertificateNotReady`
  - **reboot-recovery** (3개): `CiliumAgentNotReady`, `ZtunnelNotReady`, `IstioCNINotReady` — 재부팅 후 네트워크/메시 데이터플레인 복구 감시

## 대시보드 및 SSO 연동 (Grafana)

- `grafana.local.narwhal.internal` 로 접속하며, Keycloak 기반 OIDC(OAuth2) SSO 인증을 지원합니다.
- OIDC Scopes로 `openid, email, profile, groups`를 사용하여 역할 기반 접근 제어(RBAC)를 자동 매핑합니다:
  - `cluster-admin` 그룹 -> Grafana Admin
  - `developer` 그룹 -> Grafana Editor
  - 기타 -> Viewer
- 대시보드는 ArgoCD 사이드카를 통해 ConfigMap 형태로 동적 감지되어 프로비저닝됩니다.
- Tempo (분산 트레이싱) 데이터소스가 OTLP(`tempo.monitoring.svc.cluster.local:4317`)로 자동 연동되어 메트릭과 트레이스 간 이동이 가능합니다.

## 로깅 파이프라인 (Loki + Alloy)

- **Loki (v3.7.3)**
  - Monolithic 아키텍처로 배포되어 가벼우면서도 확장성 있는 구조를 유지합니다.
  - 블록 및 인덱스 저장을 로컬 디스크 대신 **SeaweedFS S3** (`loki` 버킷, 포트 8333)를 활용합니다 (S3ForcePathStyle).
- **Grafana Alloy**
  - 단종 예정인 Promtail을 대체하여 도입된 최신 수집 에이전트입니다.
  - DaemonSet으로 모든 노드에 배포되며, 수집된 컨테이너 로그를 Loki(`http://loki:3100/loki/api/v1/push`)로 직접 전송합니다.
  - 중복 수집을 방지하기 위해 메트릭이나 이벤트 수집 기능은 비활성화(`podLogsViaLoki: true`)하고 로그 기능에 집중합니다.

## 분산 추적 (Tempo)

- **Tempo (v2.9.0)**: 마이크로서비스 간 트랜잭션을 추적합니다.
- vParquet2 블록 호환성을 위해 `2.10.x` 버전 대신 `2.9.0` 버전을 사용합니다.
- 저장소 백엔드로 **SeaweedFS S3** (`tempo` 버킷)를 사용합니다.

## 서비스 메시 및 네트워크 관측성

### Hubble (Cilium)
- Cilium CNI와 통합되어 L3/L4 연결성 및 L7 HTTP 흐름을 실시간으로 분석합니다.
- `hubble.local.narwhal.internal`에서 APISIX OIDC를 거쳐 UI에 접근할 수 있습니다.

### Istio Ambient Mesh Telemetry
- 사이드카(Sidecar) 없는 Ambient 모드로 구성되며, `ztunnel`과 `istiod`를 통해 mTLS 및 네트워크 흐름을 제어합니다.
- `istio-telemetry-monitors.yaml` (PodMonitor)을 통해 Istio 시스템의 핵심 텔레메트리가 Prometheus에 자동으로 수집됩니다.
