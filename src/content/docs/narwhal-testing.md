---
title: "테스트 & 카오스 엔지니어링"
description: "Narwhal 클러스터의 부하 테스트(k6) 및 카오스 엔지니어링(Chaos Mesh) 설정과 실험 런북"
project: "Narwhal"
order: 108
lastModified: 2026-07-17
---

Narwhal 프로젝트는 시스템의 신뢰성과 성능을 검증하기 위해 k6 기반의 부하 테스트와 Chaos Mesh 기반의 카오스 엔지니어링 환경을 구성하고 있습니다. 이 문서는 실험 환경 설정, 안전 장치, 실험 런북 및 기준선(Baseline)을 정의합니다. 

관측 가능성(모니터링 대시보드, 로깅)에 대한 자세한 정보는 [관측성](/ko/docs/narwhal-observability) 문서를 참조하세요.

## Chaos Mesh 배포 및 안전 장치 (Safety Guards)

Chaos Mesh(v2.8.3)는 `devtools` 네임스페이스에 ArgoCD Application(`chaos-mesh`)으로 배포되며, 실험 대상 컨트롤은 `chaos-testing` 네임스페이스를 타겟으로 합니다. 시스템 보호를 위해 다음과 같은 안전 장치와 설정이 적용되어 있습니다.

- **Blast-Radius Guard**: `controllerManager.enableFilterNamespace=true` 설정이 적용되어 있습니다. 오직 `chaos-mesh.org/inject=enabled` 어노테이션이 명시적으로 부여된 네임스페이스만 장애 주입 대상이 될 수 있어, 실수로 인한 전체 클러스터 장애를 방지합니다.
- **리소스 최적화**: 2vCPU/6GB 노드 환경에 맞춰 `controllerManager.replicaCount`를 1로 고정(기본값 3)하였으며, `dashboard.create=false` 및 `dnsServer.create=false`로 설정했습니다.

<Mermaid chart={`flowchart TB
  RUN["run-chaos.sh<br/>실험 스크립트"]
  API["Kubernetes API<br/>(PodChaos 등)"]
  CTRL["Chaos Controller<br/>(devtools)"]
  SAFE{"Namespace<br/>Annotation Check"}
  T1["Target Pod<br/>(chaos-mesh.org/inject=enabled)"]
  T2["Protected Pod<br/>(어노테이션 없음)"]

  RUN -->|"적용"| API
  API --> CTRL
  CTRL -->|"검증"| SAFE
  SAFE -->|"통과"| T1
  SAFE -.->|"차단"| T2

  style RUN fill:#fff,stroke:#9ca3af,color:#111
  style API fill:#f0fdf4,stroke:#059669,color:#111
  style CTRL fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style SAFE fill:#f0fdf4,stroke:#059669,color:#111
  style T1 fill:#f9fafb,stroke:#d1d5db,color:#111
  style T2 fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

### Kyverno 정책 예외

`chaos-daemon`은 다른 파드의 네트워크 및 I/O 네임스페이스에 장애를 주입하기 위해 `privileged: true` 및 `hostPID: true` 권한이 필수적입니다(DaemonSet 하드코딩). 따라서, `chaos-testing` 네임스페이스에 한하여 의도적이고 제한된 범위 내에서 Kyverno의 `disallow-privileged-containers` 및 `disallow-host-namespaces` 정책 예외가 적용되어 있습니다.

### ArgoCD ignoreDifferences 적용

Chaos Mesh 차트는 렌더링될 때마다 Webhook/Daemon용 자체 서명 인증서를 재생성하고 임의의 `rollme` 파드 어노테이션을 생성합니다. 이를 방치하면 ArgoCD의 `selfHeal`이 컨트롤러와 데몬을 무한히 재시작시키므로, 해당 리소스들에 대해 `ignoreDifferences` 설정을 필수로 적용했습니다.

## 카오스 실험 런북 (Experiment Suite)

과거 발생했던 실제 장애 상황을 기반으로 작성된 카오스 실험 목록입니다. 각 실험은 특정 가설을 검증하며, 완료 후 시스템이 자가 복구되어야 합니다.

각 실험은 **PodChaos** 5종, **NetworkChaos** 1종, **StressChaos** 1종으로 구성됩니다.

#### `headlamp-kill` — 스모크 테스트

`PodChaos` · 타겟 `devtools` / `app.kubernetes.io/name=headlamp`

- **가설**: 상태를 갖지 않는 단일 레플리카 UI 파드는 종료되어도 즉시 재배포된다. 위험이 가장 낮은 대상이므로, Chaos Mesh를 설치·업그레이드한 직후 컨트롤러가 실제로 파드를 죽일 수 있고 클러스터가 복구되는지를 **본 실험 전에 먼저 확인**하는 용도입니다.
- **판정 기준**: 파드가 정상 재시작되어 복구.

#### `istiod-kill` — Istio 컨트롤 플레인 장애

`PodChaos` · 타겟 `istio-system` / `app=istiod`

- **가설**: `istiod`가 죽어도 기존 프록시 간 통신(데이터 플레인)은 단절 없이 유지되고, 재시작 후 제어 흐름이 정상 복구된다. **과거 이력**: `istiod`가 단일 레플리카로 동작하던 시절 SPOF로 작용해, 컨트롤 플레인 장애 시 메시 전체의 설정 동기화가 멈추고 연쇄 장애가 발생한 적이 있습니다.
- **판정 기준**: 파드가 즉시 재생성되어 Running/Ready, 실험 중·후로 Portal `/login`이 계속 200 OK.

#### `openbao-kill` — 시크릿 스토어 장애

`PodChaos` · 타겟 `storage` / `app.kubernetes.io/name=openbao`, `component=server`

- **가설**: `openbao-0`을 강제 종료하면 재시작 시 `openbao-auto-unseal` 작업이 즉시 실행되어 자동으로 Unseal된다. **과거 이력**: 파드가 비정상 재시작됐을 때 자동 Unseal되지 않고 Seal 상태로 대기해, 비밀번호·API 토큰을 조회하는 서비스가 모두 멈춘 사례가 있습니다.
- **판정 기준**: 새 파드가 자동 Unseal되어 1/1 Ready, Portal `/login` 200 OK 유지.

#### `coredns-latency` — DNS 지연

`NetworkChaos` · 타겟 `kube-system` / `k8s-app=kube-dns`

- **가설**: CoreDNS에 500ms 지연을 주입해도 캐싱과 타임아웃 재시도 정책이 동작해, 핵심 서비스 호출이 실패하지 않고 느려질 뿐이다. **과거 이력**: 호스트 과부하로 CoreDNS가 자원 고갈을 겪으며 DNS 쿼리 타임아웃이 발생해 내부 통신이 연쇄적으로 끊긴 적이 있습니다.
- **판정 기준**: 60초 지연 주입 기간 및 이후, Portal `/login`이 느려지더라도 반드시 200 OK.

#### `keycloak-kill` — IAM 인증 장애

`PodChaos` · 타겟 `iam` / `app=keycloak`

- **가설**: Keycloak 파드가 제거되어도 클라이언트의 기존 JWT 세션은 만료까지 유효하고, 재시작 후 세션 검증이 중단 없이 이어진다. 신규 로그인만 일시 지연된다. **과거 이력**: Keycloak이 비정상 종료됐을 때 분산 세션이 소실되거나 DB 연결이 끊겨 접속 중이던 모든 사용자가 강제 로그아웃되고 신규 로그인이 마비된 적이 있습니다.
- **판정 기준**: 재시작 중 기존 토큰으로 보낸 API 요청이 유효, 복구 즉시 `/login` 200 OK.

#### `worker-cpu-stress` — 호스트 CPU 과부하

`StressChaos` · 타겟 `chaos-testing` / `chaos-target=stress`

- **가설**: 워커 노드에 CPU 부하를 가해도 `pause` 이미지 기반의 독립 스트레스 타겟(`chaos-stress-target`)만 타겟팅하므로, 핵심 시스템 파드에는 직접적인 자원 고갈이 발생하지 않는다. **과거 이력**: 2026-07-14 호스트 CPU가 100%에 도달했을 때 Liveness/Readiness Probe가 타임아웃으로 실패했고, 쿠버네티스가 이를 비정상으로 오판해 파드를 계속 재시작시키는 악순환(Probe-kill Storm)이 발생했습니다.
- **판정 기준**: 시스템 파드의 Restart count 증가 없음, Portal `/login` 200 OK 유지.

#### `cnpg-primary-kill` — 데이터베이스 페일오버

`PodChaos` · 타겟 `database` / `cnpg.io/instanceRole=primary`

- **가설**: CNPG Primary 인스턴스를 종료하면 오퍼레이터가 즉시 감지해 Replica 중 하나를 새 Primary로 승격시키고 연결을 복구한다. **과거 이력**: PostgreSQL Primary가 예기치 않게 다운됐을 때 페일오버가 지연되어, Keycloak을 비롯한 인증 서버가 영구적인 DB 연결 오류를 내며 다운타임이 장기화된 적이 있습니다.
- **판정 기준**: 다른 파드가 Primary(`cnpg.io/instanceRole=primary`)로 승격되어 Ready, 다운타임 수십 초 이내, 복구 후 Portal 로그인 200 OK.

### 실행 방법

전용 스크립트(`tests/chaos/run-chaos.sh`)를 사용하여 실험을 실행합니다. 실험 전후로 자동화된 상태 검증이 수행됩니다.
```bash
./tests/chaos/run-chaos.sh <experiment-name>
```

## k6 부하 테스트 (Load Testing)

시스템의 API 응답성과 인증 파이프라인의 처리 한계를 측정하기 위해 세 가지 시나리오를 구성했습니다. 모든 실행은 Preflight 스크립트를 거칩니다.

### 테스트 시나리오 및 기준

| 시나리오 | VU 상한 | p(95) 임계치 | 실패율 임계치 | 주요 검증 대상 |
|---|---|---|---|---|
| **gateway-fanout** | 30 | 1500ms | 5% | APISIX 게이트웨이를 통한 5개 엔드포인트(ArgoCD, Gitea, Grafana, Harbor, Keycloak) 동시 조회 |
| **portal-browse** | 20 | 3000ms | 1% | Portal API 요청, CSRF 발급, Keycloak Signin 처리 성능 |
| **login-flow** | 5 | 2000ms | 1% | 전체 OIDC 플로우 (CSRF → 로그인 폼 → 콜백 → 세션 발급) |

*참고: `login-flow`의 VU 상한이 5명인 이유는 Keycloak의 비밀번호 해싱이 2-vCPU 노드 환경에서 CPU 집약적인 작업이기 때문입니다.*

### 실행 방법 및 모니터링 연동

k6 실행 시 `--prom` 플래그를 추가하면 Prometheus의 Remote Write Receiver로 메트릭이 전송되어 Grafana 대시보드(k6 Load Test)에서 실시간 관찰이 가능합니다.

<Mermaid chart={`flowchart LR
  K6["k6 Runner<br/>(--prom 플래그)"]
  PROM["Prometheus<br/>(Remote Write Receiver)"]
  GRAF["Grafana<br/>(k6 Load Test 대시보드)"]

  K6 -->|"메트릭 푸시"| PROM
  PROM -->|"데이터 쿼리"| GRAF

  style K6 fill:#fff,stroke:#9ca3af,color:#111
  style PROM fill:#f0fdf4,stroke:#059669,color:#111
  style GRAF fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
`} />

```bash
# 단일 또는 전체 시나리오 실행 (Prometheus 연동)
./run-k6.sh gateway-fanout
./run-k6.sh all --prom
```

### 2026-07-17 최초 측정 기준선 (Baseline)

> 주의: 아래 수치는 호스트 부하 경합 상태에서 각 1회 측정된 결과입니다. 회귀(Regression) 판단 지표로 사용하기 전, 부하가 안정된 호스트에서 3회 재측정하여 평균값으로 갱신해야 합니다.

| 시나리오 | VU 상한 | p(95) | 실패율 | 임계치 통과 여부 |
|---|---|---|---|---|
| **gateway-fanout** | 30 | 88ms | 0.28% | PASS (1500ms / 5%) |
| **portal-browse** | 20 | 7.53s* | 0.47% | - (3000ms / 1%) |
| **login-flow** | 5 | 85ms | 0.00% | PASS (2000ms / 1%) |

* **portal-browse 예외 사항**: p95 7.53s 수치는 VU 50 × 6 배치(약 300 In-flight) 환경에서 측정된 값입니다. 단일 Portal 레플리카가 병목으로 작용함을 확인하여, VU 상한을 20으로 낮추고 임계치를 3000ms로 현실화했습니다. 다음 측정부터 VU 20 기준으로 재기록합니다.
* **login-flow 성과**: 전체 OIDC 플로우 부하를 통과하여, 16k 프록시 버퍼 및 청크 세션 쿠키 경로가 정상적으로 동작함을 입증했습니다.

## Preflight 검증 (Preflight Gate)

테스트 실행의 신뢰성을 보장하기 위해 부하 테스트(`run-k6.sh`) 및 카오스 실험(`run-chaos.sh`) 실행 전 `scripts/test/preflight-host.sh`가 자동으로 수행됩니다. 이 게이트는 호스트의 1분 평균 CPU 부하(Load), 여유 메모리 상태(Memory free), 모든 Kubernetes 노드의 Ready 상태를 사전에 검사하며, 하나라도 실패하면 테스트를 진행하지 않습니다. 측정 자체가 호스트 경합에 오염되는 것을 막기 위한 장치입니다.
