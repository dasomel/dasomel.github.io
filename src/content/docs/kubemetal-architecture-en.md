---
title: System Architecture
description: Tauri v2 bridge, host MLX compute engine, and K3s controllers.
project: KubeMetal
path: kubemetal/architecture
order: 1800
lastModified: 2026-08-23
---

# System Architecture

Structured across UI, Rust bridge, host compute, and Kubernetes control plane.

## Architecture Stack
- **UI Layer**: React 19 + Tailwind CSS + Lucide Icons
- **Backend Bridge**: Tauri v2 IPC (Rust asynchronous process manager)
- **Host Compute**: Apple MLX framework with Metal GPU acceleration
- **Control Plane**: K3s / Colima local Kubernetes cluster

## Related Links

- [KubeMetal Repository](https://github.com/dasomel/kubemetal)
- [English Project Home](/oss/en/kubemetal/)
