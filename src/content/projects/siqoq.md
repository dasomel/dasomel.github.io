---
title: "Siqoq"
description: "Simulation에서 edge hardware까지 동일한 semantic event와 action contract를 유지하는 Physical AI infrastructure 실험"
github: "https://github.com/dasomel/siqoq"
tags: ["Physical AI", "Edge AI", "Simulation", "ONNX Runtime", "Robotics", "OpenTelemetry"]
order: 12
type: "own"
featured: true
problem: "시뮬레이터, 노트북, 실제 센서와 actuator가 서로 다른 API와 실행 환경을 사용하면 perception-to-action 흐름을 재사용하고 검증하기 어려움"
solution: "Sensor·inference·transport·policy·action 구현을 adapter로 분리하고 semantic event/action contract를 안정적인 중심 경계로 유지"
---

## 프로젝트 소개

**Siqoq**는 물리적 하드웨어 없이도 Physical AI를 실험할 수 있는 오픈소스 인프라이자 playground입니다. 2026-08-25에 시작된 초기 단계 프로젝트로, README는 현재 상태를 **"Early bootstrap / architecture validation"** 으로 명시하고 있습니다.

일반적인 Physical AI 개발은 카메라, 엣지 GPU, 로봇 같은 실제 하드웨어를 처음부터 전제로 삼는 경우가 많습니다. Siqoq는 이 순서를 의도적으로 뒤집습니다.

1. 랩톱에서 시뮬레이션, recorded media, virtual sensor로 시작
2. 시뮬레이션 센서와 실제 센서 사이에 동일한 interface 유지
3. AI workload를 portable service/container로 실행
4. 동일한 workload를 Jetson, ARM, x86 같은 엣지 디바이스로 이동
5. perception → reasoning → action 루프 전체를 관찰
6. 소프트웨어 경로가 검증된 뒤에만 물리적 actuation 추가

이 방향은 Microsoft Physical AI Toolchain의 T0–T5 단계적 도입 모델에서 영감을 받았으며, Siqoq는 더 작고 벤더 중립적인 범위를 유지하기 위해 `S0`–`S5`라는 별도 이름의 성숙도 단계를 사용합니다([Maturity Tiers](https://github.com/dasomel/siqoq/blob/main/docs/maturity-tiers.md)).

## 핵심 동작

<Mermaid chart={`flowchart LR
  S["Simulation or Sensor"] --> P["Perception Runtime"]
  P --> E["Semantic Events"]
  E --> R["Policy / Agent"]
  R --> G["Safety Gate"]
  G --> A["Action Adapter"]
  A --> W["Physical or Simulated World"]
  W -.->|feedback| S`} />

Semantic event와 action contract가 아키텍처의 안정적인 중심이며, 센서·transport·inference engine·하드웨어 드라이버는 그 뒤에서 자유롭게 교체 가능한 어댑터로 남습니다.

### 센서 계층

Recorded video와 webcam(USB/UVC) 입력을 우선 지원하며, LiDAR·depth camera·IMU 어댑터는 mock/fixture 기반으로 이미 추가되어 있습니다(`src/siqoq/video_sensors.py`, `src/siqoq/spatial_sensors.py`). CSI 카메라 등 추가 실센서는 아직 계획 단계입니다.

### Inference 계층

OpenCV + ONNX Runtime을 baseline으로 하고, NVIDIA Jetson의 TensorRT 같은 가속 경로는 어댑터 뒤에 격리됩니다(`src/siqoq/inference.py`). base install은 의존성이 0개(`pyproject.toml`)이며, vision/transport/observability는 모두 optional extra로 분리되어 있습니다.

### Semantic Event 계층

Raw frame을 그대로 API로 노출하지 않고, `object.detected`처럼 의미 있는 event로 정규화합니다(`src/siqoq/events.py`). Event schema는 버전이 명시되어 있고, transport 추상화(stdout/in-memory, 이후 NATS/MQTT)를 통해 발행됩니다.

### Policy / Action 계층

Reasoning 컴포넌트가 하드웨어를 직접 제어하지 않도록, 모든 action은 명시적 adapter와 safety gate를 통과합니다(`src/siqoq/policy.py`, `src/siqoq/actuation.py`, `src/siqoq/gpio.py`). 현재는 mock actuator adapter와 mock-only GPIO/relay interface만 존재하며, ROS 2/MCU/실제 로봇 연동은 계획 단계입니다.

### Observability

`src/siqoq/telemetry.py`가 OpenTelemetry 기반 tracing/metrics를 optional로 제공하며, `src/siqoq/trace.py`는 sensor read부터 action result까지 이어지는 end-to-end decision trace를 민감정보 redaction과 함께 생성합니다.

## Fleet / Workload 계층 (single-process, hardware-free)

<Mermaid chart={`flowchart TB
  WL["Workload Spec"] --> PL["Placement Check"]
  CAP["Capability Discovery"] --> PL
  PL --> FI["Fleet Inventory"]
  FI --> FO["Fleet Observe"]
  FO --> UI["Read-only Web Dashboard"]`} />

Kubernetes/K3s 없이도 fleet 개념을 검증하기 위한 계층이 빠르게 추가되고 있습니다.

- `src/siqoq/capabilities.py` — 노드의 `RuntimeCapabilities` 탐지
- `src/siqoq/workload.py` — 선언적 workload spec과 capability 대조 validation
- `src/siqoq/placement.py` — 디바이스 capability 기반 workload 배치 판정
- `src/siqoq/fleet.py` — JSONL 기반 fleet inventory 조회와 결과 집계 (단일 프로세스, 하드웨어 불필요)
- `src/siqoq/routing.py` — local/cloud AI 라우팅 (cloud 경로는 optional, mock-only)
- `src/siqoq/skills.py` — semantic skill/event catalog
- `src/siqoq/ui.py` — `siqoq ui serve`로 띄우는 read-only 로컬 웹 대시보드

이 계층은 모두 실제 Kubernetes 클러스터나 다중 노드 네트워크 없이 단일 프로세스에서 동작하는 **모델/시뮬레이션 수준**이며, 실제 GitOps 배포나 멀티노드 fleet 운영을 증명하지 않습니다.

## 시작하기

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
siqoq demo
```

첫 데모는 카메라나 가속기 없이 생성된 synthetic event만으로 동작합니다. 검증은 Makefile로 통일되어 있습니다.

```bash
make install    # pip install -e '.[dev]'
make verify     # ruff check . && pytest && python -m build
make install-full && make verify-full   # vision/transport/observability extra 포함
```

CLI로 시나리오, capability, fleet, placement, skill, trace, 대시보드를 직접 실행할 수 있습니다.

```bash
siqoq scenario run --config examples/scenario.json
siqoq capabilities
siqoq workload validate --spec examples/workloads/fixture_detection_workload.json
siqoq fleet list --inventory examples/fleet/inventory.jsonl
siqoq placement check --nodes examples/nodes.json --require vision_extra_available
siqoq skills list
siqoq trace build --event-json <path> [--action-json <path>]
siqoq ui serve [--port 8000]
```

`amd64`/`arm64` 멀티스테이지 `Dockerfile`도 제공되며, CI는 두 아키텍처를 모두 빌드하지만 실제 실행 검증(smoke test)은 `amd64`에서만 수행합니다. `arm64`는 QEMU로 빌드만 검증됩니다.

```bash
make container-run          # CI와 동일하게 amd64로 build + run
make container-run-native   # 호스트 아키텍처로 에뮬레이션 없이 build + run
```

## 현재 상태 — 구현된 것과 계획인 것

Siqoq는 스스로를 "early bootstrap / architecture validation" 단계로 규정하며, `docs/testing.md`도 "`make verify`가 통과했다고 해서 카메라·디바이스, ONNX/TensorRT, NATS/MQTT, ROS 2, Kubernetes/K3s, 실제 actuator 동작이 증명되는 것은 아니다"라고 명시합니다. 아래 구분은 저장소의 코드와 커밋 이력, `docs/maturity-tiers.md`를 근거로 합니다.

**구현되어 테스트로 뒷받침되는 것 (모두 mock/fixture/simulation 수준):**

- Python 패키지 구조, semantic event 모델과 버전 관리, CLI(`src/siqoq/cli.py`)
- Recorded video/webcam 센서 어댑터, LiDAR/depth/IMU mock 어댑터
- OpenCV + ONNX Runtime 기반 portable inference adapter interface
- Deterministic scenario runner와 `examples/scenarios/catalog.json` 기반 회귀 테스트 (`tests/test_scenario_catalog.py`가 CI의 `pytest` 단계에서 함께 검증)
- Mock actuator adapter, mock-only GPIO/relay adapter, policy/safety gate
- Device capability discovery, 선언적 workload spec, capability 기반 placement 판정
- Single-process fleet inventory 조회/집계, local-vs-cloud AI 라우팅(둘 다 mock 경로)
- Semantic skill/event catalog, redaction을 포함한 end-to-end decision trace
- Optional OpenTelemetry telemetry, `amd64`/`arm64` 컨테이너 빌드(arm64는 build-only), read-only 로컬 웹 대시보드
- 35개 이상의 pytest 테스트 파일과 CI(ruff + pytest + build)

**아직 계획이며 저장소에 merge되지 않은 것:**

- Isaac Sim/Gazebo 실제 연동(현재는 evaluation spike 문서만 존재, `docs/evaluations/`)
- CSI 카메라 등 실제 USB 이외 센서, 실제 NVIDIA Jetson에서의 TensorRT 가속 검증
- 실제 NATS/MQTT 이벤트 인프라, 실제 ROS 2 bridge와 MCU/로봇 연동
- 실제 Kubernetes/K3s 배포, GitOps 롤아웃, 멀티노드 fleet 운영
- Windows 지원(현재는 evaluation 문서만 존재)

`docs/maturity-tiers.md`의 S0–S5 모델 기준으로는 S0(랩톱/synthetic data)와 S2(시뮬레이션/결정론적 시나리오)에 해당하는 소프트웨어 경로가 테스트로 뒷받침되고, S1(실제 USB 센서), S3(엣지 하드웨어), S4(실제 물리 actuation), S5(실제 멀티노드 fleet)는 인터페이스와 mock 경로만 준비된 상태입니다.

## 상세 기술 문서

| 목적 | 문서 |
|---|---|
| 제품 경계와 현재 상태 | [Overview](/oss/siqoq/overview/) |
| 안정적인 contract와 adapter 구조 | [Architecture](/oss/siqoq/architecture/) |
| 실제 개발 및 검증 범위 | [Development](/oss/siqoq/development/) |

## 프로젝트 관계

<Mermaid chart={`flowchart LR
  OF["OpenForge"] -->|standards, agent 지침| SQ["Siqoq"]
  SQ -->|category Physical AI/Edge AI, role experiment| OF`} />

Siqoq는 문서 우선 변경, 작은 리뷰 가능한 이슈, 초기부터의 CI, 의존성 위생, 보안 리포팅 같은 [OpenForge](https://github.com/dasomel/openforge)의 엔지니어링 관행을 따릅니다. 반대로 OpenForge의 canonical portfolio registry(`portfolio/projects.json`)에도 Siqoq가 `category: Physical AI / Edge AI`, `role: experiment`, `development_status: active`로 등록되어 있어, 다른 프로젝트들과 같은 evidence 기반 portfolio governance 아래 놓입니다.

## Links

- [GitHub Repository](https://github.com/dasomel/siqoq)
