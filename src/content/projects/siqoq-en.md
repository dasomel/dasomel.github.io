---
title: "Siqoq"
description: "A Physical AI infrastructure experiment that preserves semantic event and action contracts from simulation to edge hardware"
github: "https://github.com/dasomel/siqoq"
tags: ["Physical AI", "Edge AI", "Simulation", "ONNX Runtime", "Robotics", "OpenTelemetry"]
order: 12
type: "own"
featured: true
problem: "Perception-to-action workflows become difficult to reuse and verify when simulators, laptops, sensors, and actuators expose unrelated APIs and runtime assumptions"
solution: "Separate sensor, inference, transport, policy, and action implementations behind adapters while keeping semantic event and action contracts stable"
---

## Project Overview

**Siqoq** is an open-source infrastructure and playground for experimenting with Physical AI without requiring physical hardware. Started on 2026-08-25, it is an early-stage project whose README explicitly labels its current state as **"Early bootstrap / architecture validation."**

Physical AI development often becomes hardware-dependent too early, assuming cameras, edge GPUs, and robots from the start. Siqoq intentionally reverses that order:

1. Start on a laptop with simulation, recorded media, and virtual sensors.
2. Keep interfaces stable between simulated and physical sensors.
3. Run AI workloads as portable services/containers.
4. Move the same workloads to edge devices such as Jetson, ARM, or x86.
5. Observe the full perception → reasoning → action loop.
6. Add physical actuation only after the software path is validated.

This direction is inspired by the Microsoft Physical AI Toolchain's T0–T5 graduated adoption path, and Siqoq keeps a smaller, vendor-neutral scope with its own `S0`–`S5` maturity tier names (see [Maturity Tiers](https://github.com/dasomel/siqoq/blob/main/docs/maturity-tiers.md)).

## Core Loop

<Mermaid chart={`flowchart LR
  S["Simulation or Sensor"] --> P["Perception Runtime"]
  P --> E["Semantic Events"]
  E --> R["Policy / Agent"]
  R --> G["Safety Gate"]
  G --> A["Action Adapter"]
  A --> W["Physical or Simulated World"]
  W -.->|feedback| S`} />

The semantic event and action contracts are the stable center of the architecture; sensors, transports, inference engines, and hardware drivers remain freely replaceable adapters behind them.

### Sensor layer

Recorded video and webcam (USB/UVC) input are supported first, and mock/fixture-based LiDAR, depth-camera, and IMU adapters already exist (`src/siqoq/video_sensors.py`, `src/siqoq/spatial_sensors.py`). Additional real sensors such as CSI cameras remain planned.

### Inference layer

OpenCV + ONNX Runtime is the baseline, with accelerated paths such as TensorRT on NVIDIA Jetson isolated behind adapters (`src/siqoq/inference.py`). The base install has zero dependencies (`pyproject.toml`), with vision/transport/observability all split out as optional extras.

### Semantic event layer

Raw frames are not exposed as the API directly; they are normalized into meaningful events such as `object.detected` (`src/siqoq/events.py`). The event schema is versioned and published through a transport abstraction (stdout/in-memory today, NATS/MQTT planned).

### Policy / action layer

So reasoning components never directly control hardware, every action passes through an explicit adapter and a safety gate (`src/siqoq/policy.py`, `src/siqoq/actuation.py`, `src/siqoq/gpio.py`). Today this means a mock actuator adapter and a mock-only GPIO/relay interface; ROS 2, MCU, and real robot integration remain planned.

### Observability

`src/siqoq/telemetry.py` provides optional OpenTelemetry-based tracing/metrics, and `src/siqoq/trace.py` builds an end-to-end decision trace from sensor read to action result, with sensitive-metadata redaction by default.

## Fleet / Workload Layer (single-process, hardware-free)

<Mermaid chart={`flowchart TB
  WL["Workload Spec"] --> PL["Placement Check"]
  CAP["Capability Discovery"] --> PL
  PL --> FI["Fleet Inventory"]
  FI --> FO["Fleet Observe"]
  FO --> UI["Read-only Web Dashboard"]`} />

A layer for validating fleet concepts without Kubernetes/K3s is being added quickly:

- `src/siqoq/capabilities.py` — discovers a node's `RuntimeCapabilities`
- `src/siqoq/workload.py` — declarative workload spec, validated against capabilities
- `src/siqoq/placement.py` — device-capability-based workload placement checks
- `src/siqoq/fleet.py` — JSONL-based fleet inventory queries and result aggregation (single-process, hardware-free)
- `src/siqoq/routing.py` — local-vs-cloud AI routing (the cloud path is optional and mock-only)
- `src/siqoq/skills.py` — semantic skill/event catalog
- `src/siqoq/ui.py` — a read-only local web dashboard served via `siqoq ui serve`

All of this layer runs on a single process without a real Kubernetes cluster or multi-node network — it is a **model/simulation-level** capability and does not prove real GitOps deployment or multi-node fleet operation.

## Getting Started

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
siqoq demo
```

The first demo runs on generated synthetic events with no camera or accelerator required. Verification is unified through the Makefile.

```bash
make install    # pip install -e '.[dev]'
make verify     # ruff check . && pytest && python -m build
make install-full && make verify-full   # includes vision/transport/observability extras
```

The CLI can run scenarios, capability checks, fleet operations, placement, skills, traces, and the dashboard directly.

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

A multi-stage `Dockerfile` builds `amd64`/`arm64` images. CI builds both architectures but only run-tests (smoke-tests) `amd64`; `arm64` is build-verified only, via QEMU.

```bash
make container-run          # amd64 build + run, matching CI
make container-run-native   # build + run for the host architecture, no emulation
```

## Current Status — Implemented vs. Planned

Siqoq describes itself as "early bootstrap / architecture validation," and `docs/testing.md` states plainly that "a passing `make verify` does not prove camera/device, ONNX/TensorRT, NATS/MQTT, ROS 2, Kubernetes/K3s, or real actuator behavior." The distinction below is based on the repository's code, commit history, and `docs/maturity-tiers.md`.

**Implemented and backed by tests (all at mock/fixture/simulation level):**

- Python package structure, versioned semantic event model, CLI (`src/siqoq/cli.py`)
- Recorded video/webcam sensor adapters, mock LiDAR/depth/IMU adapters
- A portable inference adapter interface built on OpenCV + ONNX Runtime
- A deterministic scenario runner with regression coverage via `examples/scenarios/catalog.json` (`tests/test_scenario_catalog.py`, run as part of CI's `pytest` step)
- Mock actuator adapter, mock-only GPIO/relay adapter, policy/safety gate
- Device capability discovery, a declarative workload spec, and capability-based placement checks
- Single-process fleet inventory query/aggregation, local-vs-cloud AI routing (both mock paths)
- Semantic skill/event catalog, end-to-end decision trace with redaction
- Optional OpenTelemetry telemetry, `amd64`/`arm64` container builds (arm64 build-only), a read-only local web dashboard
- 35+ pytest test files and CI (ruff + pytest + build)

**Still planned, not yet merged into the repository:**

- Real Isaac Sim/Gazebo integration (currently only evaluation spike documents exist under `docs/evaluations/`)
- Real sensors beyond USB, such as CSI cameras, and real TensorRT acceleration verified on actual NVIDIA Jetson hardware
- Real NATS/MQTT event infrastructure, a real ROS 2 bridge, and MCU/robot integration
- Real Kubernetes/K3s deployment, GitOps rollout, and multi-node fleet operation
- Windows support (currently only an evaluation document exists)

Against the S0–S5 model in `docs/maturity-tiers.md`, the software paths corresponding to S0 (laptop/synthetic data) and S2 (simulation/deterministic scenarios) are backed by tests, while S1 (real USB sensor), S3 (edge hardware), S4 (real physical actuation), and S5 (real multi-node fleet) have only interfaces and mock paths in place.

## Documentation

| Goal | Document |
|---|---|
| Product boundary and current status | [Overview](/oss/en/siqoq/overview/) |
| Stable contracts and adapter structure | [Architecture](/oss/en/siqoq/architecture/) |
| Executable development and verification scope | [Development](/oss/en/siqoq/development/) |

## Project Relationship

<Mermaid chart={`flowchart LR
  OF["OpenForge"] -->|standards, agent conventions| SQ["Siqoq"]
  SQ -->|category Physical AI/Edge AI, role experiment| OF`} />

Siqoq follows [OpenForge](https://github.com/dasomel/openforge)'s engineering conventions: documentation-first changes, small reviewable issues, CI from the beginning, dependency hygiene, and security reporting. In return, Siqoq is registered in OpenForge's canonical portfolio registry (`portfolio/projects.json`) with `category: Physical AI / Edge AI`, `role: experiment`, and `development_status: active`, placing it under the same evidence-based portfolio governance as the other projects.

## Links

- [GitHub Repository](https://github.com/dasomel/siqoq)
