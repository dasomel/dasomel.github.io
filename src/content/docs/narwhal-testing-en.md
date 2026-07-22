---
title: "Testing & Chaos Engineering"
description: "Load testing (k6) and chaos engineering (Chaos Mesh) configuration and runbooks for the Narwhal cluster"
project: "Narwhal"
order: 108
lastModified: 2026-07-17
---

The Narwhal project employs a load testing environment using k6 and a chaos engineering setup using Chaos Mesh to validate system reliability and performance. This document defines the experimental setup, safety guards, experiment runbooks, and baselines.

For more information on observability (monitoring dashboards, logging), refer to the [Observability](/en/docs/narwhal-observability) documentation.

## Chaos Mesh Deployment & Safety Guards

Chaos Mesh (v2.8.3) is deployed as an ArgoCD Application (`chaos-mesh`) in the `devtools` namespace, targeting the `chaos-testing` namespace for fault injection. The following safety measures and configurations are implemented to protect the system.

- **Blast-Radius Guard**: The `controllerManager.enableFilterNamespace=true` setting is applied. This ensures that ONLY namespaces explicitly annotated with `chaos-mesh.org/inject=enabled` can be targeted by experiments, preventing accidental cluster-wide outages.
- **Resource Optimization**: The `controllerManager.replicaCount` is pinned to 1 (chart default is 3) to accommodate the 2-vCPU/6GB node environment. Additionally, `dashboard.create=false` and `dnsServer.create=false` are configured.

<Mermaid chart={`flowchart TB
  RUN["run-chaos.sh<br/>Experiment Script"]
  API["Kubernetes API<br/>(PodChaos, etc.)"]
  CTRL["Chaos Controller<br/>(devtools)"]
  SAFE{"Namespace<br/>Annotation Check"}
  T1["Target Pod<br/>(chaos-mesh.org/inject=enabled)"]
  T2["Protected Pod<br/>(No annotation)"]

  RUN -->|"Apply"| API
  API --> CTRL
  CTRL -->|"Verify"| SAFE
  SAFE -->|"Pass"| T1
  SAFE -.->|"Block"| T2

  style RUN fill:#fff,stroke:#9ca3af,color:#111
  style API fill:#f0fdf4,stroke:#059669,color:#111
  style CTRL fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style SAFE fill:#f0fdf4,stroke:#059669,color:#111
  style T1 fill:#f9fafb,stroke:#d1d5db,color:#111
  style T2 fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

### Kyverno Policy Exceptions

The `chaos-daemon` requires `privileged: true` and `hostPID: true` (hardcoded in the chart's DaemonSet, not a values toggle) to inject faults into other pods' network and I/O namespaces. Consequently, it is excluded from the Kyverno `disallow-privileged-containers` and `disallow-host-namespaces` policies FOR the `chaos-testing` NAMESPACE ONLY. This is a deliberate, strictly scoped exception.

### ArgoCD ignoreDifferences

The Chaos Mesh chart regenerates self-signed certificates (webhook and daemon certs) and generates a random `rollme` pod annotation on every render. Without explicitly ignoring these, ArgoCD's `selfHeal` mechanism would continuously attempt to re-roll the controller and daemon infinitely. Therefore, applying `ignoreDifferences` is required to ensure stability.

## Chaos Experiment Suite (Runbook)

This runbook lists chaos experiments derived from real past incidents. Each experiment validates a specific hypothesis, and the system must self-recover upon completion.

The suite consists of five **PodChaos**, one **NetworkChaos**, and one **StressChaos** experiment.

#### `headlamp-kill` — smoke test

`PodChaos` · target `devtools` / `app.kubernetes.io/name=headlamp`

- **Hypothesis**: a stateless, single-replica UI pod redeploys instantly when killed. It is the lowest-risk target, so it runs **before the real experiments** — right after any Chaos Mesh install or upgrade — to prove the controller can actually kill a pod and that the cluster recovers.
- **Pass criteria**: the pod restarts successfully and recovers.

#### `istiod-kill` — Istio control plane failure

`PodChaos` · target `istio-system` / `app=istiod`

- **Hypothesis**: killing `istiod` leaves existing proxy-to-proxy traffic (the data plane) uninterrupted, and control flow recovers once the pod restarts. **Past incident**: when `istiod` ran as a single replica it acted as a SPOF — a control-plane failure stopped config sync across the whole mesh and cascaded into a broader outage.
- **Pass criteria**: the pod is recreated immediately to Running/Ready, and Portal `/login` keeps returning 200 OK during and after the experiment.

#### `openbao-kill` — secret store failure

`PodChaos` · target `storage` / `app.kubernetes.io/name=openbao`, `component=server`

- **Hypothesis**: force-killing `openbao-0` triggers the `openbao-auto-unseal` job on restart, so the pod unseals automatically. **Past incident**: after an abnormal restart the pod stayed sealed instead of auto-unsealing, stalling every service that reads passwords or API tokens from it.
- **Pass criteria**: the new pod auto-unseals to 1/1 Ready, and Portal `/login` keeps returning 200 OK.

#### `coredns-latency` — DNS latency

`NetworkChaos` · target `kube-system` / `k8s-app=kube-dns`

- **Hypothesis**: injecting 500ms of latency into CoreDNS does not fail core service calls — caching and timeout/retry policies absorb it, so calls merely slow down. **Past incident**: host overload starved CoreDNS of resources, causing DNS query timeouts that cascaded into broken internal service-to-service communication.
- **Pass criteria**: during and after the 60s latency injection, Portal `/login` must still return 200 OK, even if slower.

#### `keycloak-kill` — IAM authentication failure

`PodChaos` · target `iam` / `app=keycloak`

- **Hypothesis**: removing the Keycloak pod leaves already-issued JWT sessions valid until expiry, session validation resumes uninterrupted after restart, and only new logins are briefly delayed. **Past incident**: an abnormal Keycloak termination lost distributed session state / DB connectivity, force-logging-out every connected user and paralysing new logins.
- **Pass criteria**: API requests using existing tokens stay valid through the restart, and `/login` returns 200 OK immediately on recovery.

#### `worker-cpu-stress` — host CPU saturation

`StressChaos` · target `chaos-testing` / `chaos-target=stress`

- **Hypothesis**: loading a worker node's CPU only affects the dedicated `pause`-image stress target (`chaos-stress-target`), so core system pods never hit direct resource starvation. **Past incident**: on 2026-07-14 host CPU reached 100%, Liveness/Readiness probes timed out, and Kubernetes misread that as unhealthy and kept restarting pods — a Probe-kill Storm.
- **Pass criteria**: no increase in system pod restart counts, and Portal `/login` keeps returning 200 OK.

#### `cnpg-primary-kill` — database failover

`PodChaos` · target `database` / `cnpg.io/instanceRole=primary`

- **Hypothesis**: killing the CNPG primary makes the operator detect it immediately, promote a replica to primary, and restore application connectivity. **Past incident**: when the PostgreSQL primary went down unexpectedly, failover lagged and authentication servers including Keycloak threw persistent DB connection errors, stretching the outage.
- **Pass criteria**: another pod is promoted to primary (`cnpg.io/instanceRole=primary`) and becomes Ready, downtime stays within tens of seconds, and Portal login returns 200 OK after recovery.

### How to Run

Execute experiments using the dedicated script (`tests/chaos/run-chaos.sh`), which runs automated pre- and post-steady-state validations.
```bash
./tests/chaos/run-chaos.sh <experiment-name>
```

## k6 Load Testing

Three scenarios are structured to measure the API responsiveness and the processing limits of the authentication pipeline. All runs are gated by the preflight script.

### Test Scenarios & Thresholds

| Scenario | VU Cap | p(95) Threshold | Fail Rate Threshold | Key Focus |
|---|---|---|---|---|
| **gateway-fanout** | 30 | 1500ms | 5% | Concurrent hits across 5 endpoints behind the APISIX gateway (ArgoCD, Gitea, Grafana, Harbor, Keycloak). |
| **portal-browse** | 20 | 3000ms | 1% | Portal API requests, CSRF token issuance, and Keycloak sign-in performance. |
| **login-flow** | 5 | 2000ms | 1% | Full OIDC flow (CSRF → Login form → Callback → Session issuance) with fresh sessions. |

*Note: The `login-flow` VU cap is restricted to 5 because Keycloak's password hashing algorithm is highly CPU-intensive on 2-vCPU nodes.*

### Execution & Monitoring Integration

Appending the `--prom` flag to the k6 run pushes metrics directly to Prometheus via the Remote Write Receiver. The results can be visualized in real-time on the Grafana "k6 Load Test" dashboard.

<Mermaid chart={`flowchart LR
  K6["k6 Runner<br/>(--prom flag)"]
  PROM["Prometheus<br/>(Remote Write Receiver)"]
  GRAF["Grafana<br/>(k6 Load Test Dashboard)"]

  K6 -->|"Push Metrics"| PROM
  PROM -->|"Query Data"| GRAF

  style K6 fill:#fff,stroke:#9ca3af,color:#111
  style PROM fill:#f0fdf4,stroke:#059669,color:#111
  style GRAF fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
`} />

```bash
# Run a single or all scenarios (with Prometheus integration)
./run-k6.sh gateway-fanout
./run-k6.sh all --prom
```

### 2026-07-17 Baseline Record

> Note: The values below are from a 1-sample run while the host was under load contention. They must be re-measured 3 times on a quiet host and averaged before being used to judge regressions.

| Scenario | VU Cap | p(95) | Fail Rate | Threshold Passed |
|---|---|---|---|---|
| **gateway-fanout** | 30 | 88ms | 0.28% | PASS (1500ms / 5%) |
| **portal-browse** | 20 | 7.53s* | 0.47% | - (3000ms / 1%) |
| **login-flow** | 5 | 85ms | 0.00% | PASS (2000ms / 1%) |

* **portal-browse Nuance**: The 7.53s p95 was measured at 50 VUs with a 6-request batch (~300 in-flight requests). It highlighted that the single portal replica is the bottleneck. The cap was subsequently lowered to 20 and the threshold made realistic at 3000ms. The next run will re-record based on 20 VUs.
* **login-flow Success**: Passed the full OIDC flow under load, confirming that the 16k proxy buffer and chunked session cookie path hold up effectively.

## Preflight Gate

To ensure testing reliability, `scripts/test/preflight-host.sh` is automatically invoked before running load tests (`run-k6.sh`) or chaos experiments (`run-chaos.sh`). This gate checks the host's 1-minute CPU load, free memory, and that every Kubernetes node is Ready; if any check fails, the run does not proceed. It exists to stop host contention from contaminating the measurement itself.
