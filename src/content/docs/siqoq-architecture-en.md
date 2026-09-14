---
title: Siqoq Architecture
description: Simulation-to-reality architecture centered on semantic event and action contracts.
project: Siqoq
path: siqoq/architecture
order: 1701
lastModified: 2026-09-14
---

# Siqoq Architecture

<Mermaid chart={`flowchart TB
  INPUT["Frame / Sensor Sample"] --> NORMALIZE["Sensor Adapter"]
  NORMALIZE --> INFERENCE["Inference Runtime"]
  INFERENCE --> EVENT["Semantic Event"]
  EVENT --> DECISION["Policy / Agent"]
  DECISION --> SAFETY["Safety Gate"]
  SAFETY --> ACTION["Action Adapter"]
  ACTION -. "telemetry / feedback" .-> INPUT`} />

## Stable center

`Sensor Adapter → Semantic Event` and `Validated Action → Action Adapter` are the central contracts. Laptop, simulation, edge, and fleet modes preserve them while replacing input devices, inference engines, transports, and deployment mechanisms.

## Layer responsibilities

| Layer | Responsibility |
|---|---|
| Sensor adapter | normalize recorded media, UVC cameras, and simulated sensors |
| Inference runtime | encapsulate model execution from CPU baseline to accelerator adapters |
| Semantic event | provide downstream meaning instead of exposing raw frames |
| Transport | keep in-process/stdout, NATS, and MQTT replaceable |
| Policy / agent | support deterministic policy, local agents, and optional cloud assistance |
| Safety gate | validate whether and under which conditions an action may execute |
| Action adapter | isolate mock, GPIO/relay, ROS 2, MCU, and hardware execution |
| Observability | connect traces and metrics from sensor read to action result |
