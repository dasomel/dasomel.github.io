---
title: 시스템 아키텍처
description: Tauri v2 브리지, 호스트 MLX 엔진 및 K3s 컨트롤러.
project: KubeMetal
path: kubemetal/architecture
order: 1800
lastModified: 2026-08-23
---

# 시스템 아키텍처

KubeMetal은 프론트엔드, Rust 백엔드, 호스트 연산 엔진 및 K8s 클러스터로 구성됩니다.

## 아키텍처 계층
- **UI Layer**: React 19 + Tailwind CSS + Lucide Icons
- **Backend Bridge**: Tauri v2 IPC (Rust 기반 비동기 프로세스 관리)
- **Host Compute**: Apple MLX 프레임워크 기반 Metal 가속 런타임
- **Control Plane**: K3s / Colima 로컬 쿠버네티스

## 관련 링크

- [KubeMetal 저장소](https://github.com/dasomel/kubemetal)
- [프로젝트 홈](/oss/kubemetal/)
