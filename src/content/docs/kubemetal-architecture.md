---
title: 시스템 아키텍처
description: Tauri v2 IPC 브리지, 호스트 MLX 가속 엔진 및 로컬 K8s 컨트롤 플레인 결합 구조.
project: KubeMetal
path: kubemetal/architecture
order: 1801
lastModified: 2026-08-27
---

# 시스템 아키텍처

KubeMetal의 하이브리드 아키텍처는 데스크톱 UI, 호스트 연산 엔진 및 K8s 제어 플레인을 유기적으로 결합합니다.

<Mermaid chart={`flowchart TB
  UI["KubeMetal Desktop UI\nReact 19 · Tailwind CSS · Tauri v2"]
  UI -->|"Tauri v2 IPC"| MLX["macOS Host MLX Engine\nApple MLX · Metal · LoRA · MLX inference"]
  UI -->|"Kubernetes client"| K8S["Local Kubernetes\nColima · K3s control plane"]
  K8S --> OPS["MLOps operators / CRDs"]
  K8S --> PIPE["Model pipelines / services"]
  MLX -.->|"host-accelerated model lifecycle"| PIPE`} />

이 구조의 핵심은 **Kubernetes가 플랫폼 제어와 서비스 수명주기를 담당하고, macOS Host가 Apple Silicon 가속 연산을 담당한다는 역할 분리**입니다. Desktop UI는 두 실행 영역을 하나의 사용 경험으로 연결합니다.
