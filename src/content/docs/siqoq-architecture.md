---
title: Siqoq 아키텍처
description: Semantic event와 action contract를 중심으로 한 simulation-to-reality 구조.
project: Siqoq
path: siqoq/architecture
order: 1701
lastModified: 2026-09-14
---

# Siqoq 아키텍처

<Mermaid chart={`flowchart TB
  INPUT["Frame / Sensor Sample"] --> NORMALIZE["Sensor Adapter"]
  NORMALIZE --> INFERENCE["Inference Runtime"]
  INFERENCE --> EVENT["Semantic Event"]
  EVENT --> DECISION["Policy / Agent"]
  DECISION --> SAFETY["Safety Gate"]
  SAFETY --> ACTION["Action Adapter"]
  ACTION -. "telemetry / feedback" .-> INPUT`} />

## 안정적인 중심 경계

`Sensor Adapter → Semantic Event`와 `Validated Action → Action Adapter`가 핵심 contract입니다. Laptop, simulation, edge, fleet mode는 이 contract를 유지하면서 입력 장치, inference engine, transport와 배포 방식을 교체합니다.

## 계층별 책임

| 계층 | 책임 |
|---|---|
| Sensor adapter | recorded media, UVC camera, simulated sensor를 같은 입력 contract로 정규화 |
| Inference runtime | CPU baseline부터 accelerator adapter까지 model execution 캡슐화 |
| Semantic event | raw frame 대신 downstream이 소비할 의미 단위 제공 |
| Transport | in-process/stdout, NATS, MQTT를 교체 가능하게 유지 |
| Policy / agent | deterministic policy, local agent, optional cloud-assisted reasoning |
| Safety gate | action allow/deny와 실행 조건 검증 |
| Action adapter | mock, GPIO/relay, ROS 2, MCU/hardware 실행 경계 |
| Observability | sensor read부터 action result까지 trace와 metric 연결 |
