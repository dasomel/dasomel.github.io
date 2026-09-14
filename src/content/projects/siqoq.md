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

**Siqoq**는 Physical AI의 전체 제품을 한 번에 만들기보다, simulation에서 real edge로 이동할 때 유지되어야 하는 infrastructure contract를 먼저 검증합니다.

<Mermaid chart={`flowchart LR
  SENSOR["Simulation / Sensor"] --> PERCEPTION["Perception Runtime"]
  PERCEPTION --> EVENT["Semantic Event"]
  EVENT --> POLICY["Policy / Agent"]
  POLICY --> SAFETY["Safety Gate"]
  SAFETY --> ACTION["Action Adapter"]`} />

핵심은 raw frame이나 특정 device SDK를 platform API로 고정하지 않는 것입니다. downstream 시스템은 `object.detected`와 같은 semantic event를 소비하고, action은 별도의 safety/policy 검증을 통과한 뒤 adapter를 통해 실행합니다.

## 현재 구현 범위

현재는 **early bootstrap / architecture validation** 단계입니다.

- Python package와 CLI 기반
- semantic event model
- unit test와 CI 기반
- simulation-first architecture, principle, roadmap 문서

Isaac Sim/Gazebo 통합, 실제 센서 adapter, TensorRT/Jetson 최적화, NATS/MQTT, ROS 2 bridge, actuator 제어와 fleet GitOps는 아직 계획 범위입니다.

## 읽기 순서

| 목적 | 문서 |
|---|---|
| 제품 경계와 현재 상태 | [Overview](/oss/siqoq/overview/) |
| 안정적인 contract와 adapter 구조 | [Architecture](/oss/siqoq/architecture/) |
| 실제 개발 및 검증 범위 | [Development](/oss/siqoq/development/) |
