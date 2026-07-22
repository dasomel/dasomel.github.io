---
title: "Observability"
description: "Monitoring, logging, and tracing stack for the Narwhal cluster"
project: "Narwhal"
order: 105
lastModified: 2026-07-17
---

The Narwhal project provides a comprehensive observability stack for metrics, logs, distributed tracing, and network visibility.

## Core Components

The following diagram illustrates the data flow of the three main observability pipelines (metrics, logs, traces) alongside the network visibility component.

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

| Category | Component | Version | Storage (nfs-csi) | Role |
|---|---|---|---|---|
| **Metrics** | Prometheus | chart 86.2.3 | 10Gi | TSDB (7d retention), Alert evaluation, k6 Remote Write |
| **Dashboard** | Grafana | 12.x | 5Gi | Unified dashboards, OIDC-based SSO |
| **Logs** | Loki | v3.7.3 | (SeaweedFS S3) | Log aggregation system in Monolithic mode |
| **Log Agent** | Grafana Alloy | v1.17.0 | - | Node-level log collector (replaces Promtail) |
| **Traces** | Tempo | v2.9.0 | (SeaweedFS S3) | Distributed tracing backend |
| **Network** | Hubble | v1.19.4 | - | Cilium-based L3/L4/L7 network visibility |

## Metric Collection and Alerting (Prometheus)

- Deployed via the `kube-prometheus-stack` Helm chart with a 7-day data retention policy.
- **k6 Load Test Integration**: Configured with `enableRemoteWriteReceiver: true` to receive metrics pushed directly from k6 tests, visualized on a dedicated **k6 Load Test dashboard** (`k6-load-test`). For the load-test scenarios and baselines, see [Testing & Chaos Engineering](/en/docs/narwhal-testing).
- **Optimizations**: Since Cilium operates in `kube-proxy-replacement` mode, default monitoring for `kubeProxy` and `kubeEtcd` is disabled to prevent false-positive alerts.
- **Alerting Rules**: Manages 22 alerts across 6 groups through the `narwhal-alerts` PrometheusRule:
  - **cluster-health** (4): Node NotReady, API Server/etcd downtime
  - **node-health** (4): CPU 90%+, Disk 85%+, resource pressure
  - **platform-apps** (6): Core platform app downtime, ArgoCD OutOfSync
  - **database** (3): `CNPGClusterNotHealthy`, `CNPGReplicationLag`, `CNPGHighConnections`
  - **certificates** (2): `CertificateExpiringSoon`, `CertificateNotReady`
  - **reboot-recovery** (3): `CiliumAgentNotReady`, `ZtunnelNotReady`, `IstioCNINotReady` — watches network/mesh dataplane recovery after a reboot

## Dashboards and SSO Integration (Grafana)

- Accessible at `grafana.local.narwhal.internal` and supports Keycloak-based OIDC (OAuth2) SSO authentication.
- Automatically maps Role-Based Access Control (RBAC) using OIDC scopes (`openid, email, profile, groups`):
  - `cluster-admin` group -> Grafana Admin
  - `developer` group -> Grafana Editor
  - Others -> Viewer
- Dashboards are dynamically detected and provisioned via ConfigMaps using an ArgoCD sidecar.
- The Tempo distributed tracing datasource is automatically linked via OTLP (`tempo.monitoring.svc.cluster.local:4317`), enabling seamless navigation between metrics and traces.

## Logging Pipeline (Loki + Alloy)

- **Loki (v3.7.3)**
  - Deployed in a Monolithic architecture to maintain a lightweight yet scalable setup.
  - Utilizes **SeaweedFS S3** (`loki` bucket, port 8333) for chunk and index storage instead of local disk (using S3ForcePathStyle).
- **Grafana Alloy**
  - The latest collection agent introduced to replace the deprecated Promtail.
  - Deployed as a DaemonSet across all nodes to send container logs directly to Loki (`http://loki:3100/loki/api/v1/push`).
  - To avoid duplicate collection, metric and event collection features are disabled (`podLogsViaLoki: true`), focusing strictly on log collection.

## Distributed Tracing (Tempo)

- **Tempo (v2.9.0)**: Tracks transactions across microservices.
- Version `2.9.0` is used instead of `2.10.x` to maintain vParquet2 block encoding compatibility.
- Uses **SeaweedFS S3** (`tempo` bucket) as its storage backend.

## Service Mesh and Network Observability

### Hubble (Cilium)
- Integrated with the Cilium CNI to analyze L3/L4 connectivity and L7 HTTP flows in real time.
- The UI is accessible at `hubble.local.narwhal.internal` behind APISIX OIDC authentication.

### Istio Ambient Mesh Telemetry
- Configured in sidecar-less Ambient mode, managing mTLS and network flows via `ztunnel` and `istiod`.
- Core telemetry for the Istio system is automatically scraped by Prometheus via the `istio-telemetry-monitors.yaml` (PodMonitor) configuration.
