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

## Project introduction

**Siqoq** validates the infrastructure contracts that must survive the move from simulation to real edge systems before attempting to build a complete Physical AI product.

<Mermaid chart={`flowchart LR
  SENSOR["Simulation / Sensor"] --> PERCEPTION["Perception Runtime"]
  PERCEPTION --> EVENT["Semantic Event"]
  EVENT --> POLICY["Policy / Agent"]
  POLICY --> SAFETY["Safety Gate"]
  SAFETY --> ACTION["Action Adapter"]`} />

Raw frames and device SDKs do not become the platform API. Downstream systems consume semantic events such as `object.detected`, while actions pass through explicit policy and safety checks before an adapter reaches hardware.

## Current implementation boundary

Siqoq is currently an **early bootstrap / architecture validation** project.

- Python package and CLI foundation
- semantic event model
- unit-test and CI foundation
- simulation-first architecture, principles, and roadmap

Isaac Sim/Gazebo integration, real sensor adapters, TensorRT/Jetson acceleration, NATS/MQTT, a ROS 2 bridge, actuator control, and fleet GitOps remain planned work.

## Reading path

| Goal | Document |
|---|---|
| Product boundary and current status | [Overview](/oss/en/siqoq/overview/) |
| Stable contracts and adapter structure | [Architecture](/oss/en/siqoq/architecture/) |
| Executable development and verification scope | [Development](/oss/en/siqoq/development/) |
