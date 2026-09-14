---
title: Siqoq 개요
description: Simulation-to-edge Physical AI infrastructure의 목표와 현재 구현 경계.
project: Siqoq
path: siqoq/overview
order: 1700
lastModified: 2026-09-14
---

# Siqoq 개요

Siqoq는 model training framework, robot SDK, ROS 2 또는 Kubernetes를 대체하지 않습니다. 이들을 필요에 따라 연결하면서 simulation과 실제 edge 실행 환경 사이의 contract를 안정화하는 프로젝트입니다.

## 해결하려는 문제

- simulated camera와 real camera가 다른 downstream API를 만드는 문제
- accelerator 선택이 application logic까지 전파되는 문제
- policy/agent가 hardware actuator를 직접 호출하는 안전 경계 문제
- perception부터 action까지 하나의 trace로 설명하기 어려운 문제

## 현재와 계획의 구분

| 구분 | 범위 |
|---|---|
| 구현됨 | Python package, CLI, semantic event model, test/CI 기반 |
| 다음 검증 | recorded media/webcam, OpenCV·ONNX Runtime baseline, mock action |
| 계획 | simulator, Jetson/TensorRT, NATS/MQTT, ROS 2, fleet/GitOps |

현재 문서는 target architecture를 설명하지만, 계획 항목을 실행 가능한 기능으로 주장하지 않습니다.
