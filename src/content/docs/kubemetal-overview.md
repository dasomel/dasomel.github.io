---
title: KubeMetal 개요
description: Apple Silicon 하이브리드 MLOps 아키텍처 및 호스트 MLX 가속 플랫폼 개요.
project: KubeMetal
path: kubemetal/overview
order: 1800
lastModified: 2026-08-23
---

# KubeMetal 개요

**KubeMetal**은 Apple Silicon Mac 환경에서 Kubernetes 오케스트레이션과 Apple MLX 하드웨어 가속을 완벽하게 결합한 차세대 하이브리드 MLOps 데스크톱 애플리케이션입니다.

## 핵심 가치

1. **가상화 한계 극복 (Host Native Acceleration)**: VM 내부에서는 활용 불가능한 Apple Silicon GPU/NPU의 초고속 Unified Memory(최대 128GB+)를 macOS 호스트 네이티브 프로세스로 직접 가속합니다.
2. **K8s 기반 선언적 MLOps**: 모델 서빙, 파인튜닝 잡, 파이프라인 오케스트레이션을 Kubernetes CRD로 선언적으로 관리합니다.
3. **Tauri v2 + React 데스크톱 GUI**: Rust 기반의 초경량 네이티브 IPC 브리지와 미려한 React UI 대시보드를 제공합니다.
