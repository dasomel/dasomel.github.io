---
title: Siqoq Overview
description: Goals and current implementation boundary of simulation-to-edge Physical AI infrastructure.
project: Siqoq
path: siqoq/overview
order: 1700
lastModified: 2026-09-14
---

# Siqoq Overview

Siqoq does not replace model-training frameworks, robot SDKs, ROS 2, or Kubernetes. It connects them where useful while stabilizing contracts between simulation and real edge runtimes.

## Problems being addressed

- simulated and real cameras creating different downstream APIs
- accelerator choices leaking into application logic
- policy or agent code calling hardware actuators without an explicit safety boundary
- inability to trace the complete perception-to-action loop

## Implemented versus planned

| State | Scope |
|---|---|
| Implemented | Python package, CLI, semantic event model, and test/CI foundation |
| Next validation | recorded media/webcam, OpenCV and ONNX Runtime baseline, mock actions |
| Planned | simulators, Jetson/TensorRT, NATS/MQTT, ROS 2, and fleet/GitOps |

The documentation describes the target architecture without presenting planned work as executable behavior.
