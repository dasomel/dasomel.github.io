---
title: "ClusterDeck"
description: "A macOS desktop tool that discovers frequently recreated VM/Kubernetes environments and automates SSH and kubeconfig access around stable Profiles"
github: "https://github.com/dasomel/clusterdeck"
tags: ["macOS", "Tauri", "Rust", "React", "TypeScript", "SSH", "Kubernetes", "kubeconfig", "ProxyJump"]
order: 5
type: "own"
featured: true
problem: "Frequently recreated VM and Kubernetes labs change IP addresses, forcing users to rebuild SSH aliases, bastion/ProxyJump paths, remote kubeconfigs, and local contexts by hand"
solution: "Keep a stable Profile identity while automating host discovery → SSH bootstrap → alias/ProxyJump → kubeconfig fetch/normalization → Kubernetes connectivity verification in one macOS desktop workflow"
---

## Overview

**ClusterDeck** is a macOS-first desktop tool for keeping local access to frequently recreated VM and Kubernetes environments stable.

It is not a general Kubernetes management console. Its boundary is the **workstation access layer**: discover a remote environment, make SSH access usable, fetch and normalize kubeconfig, then verify Kubernetes connectivity.

```text
IP / Host Discovery
      ↓
SSH Connectivity
      ↓
SSH Bootstrap (optional)
      ↓
SSH Alias / ProxyJump
      ↓
Remote kubeconfig Fetch
      ↓
kubeconfig Normalization
      ↓
Local Profile
      ↓
Kubernetes Connectivity Check
```

## Design

- **Tauri 2 + Rust** for filesystem, process execution, SSH orchestration, and kubeconfig handling.
- **React + TypeScript** for a compact Profile/Host/Connect/Status UX.
- **Native OpenSSH first** instead of reimplementing SSH behavior.
- **Profile-oriented identity** so users think in environments rather than changing IP addresses.
- **ClusterDeck-owned configuration** under `~/.clusterdeck/` without rewriting unrelated user SSH/Kubernetes configuration.

## Security boundary

Bootstrap passwords are one-time inputs and should not be stored or logged. Generated kubeconfigs use restrictive permissions, destructive merges should be reversible, and persistent credentials should use a secure local store such as macOS Keychain.

## MVP

1. Profile CRUD
2. Multi-host discovery and SSH bootstrap
3. SSH alias generation
4. Bastion / ProxyJump
5. Remote kubeconfig fetch and normalization
6. Per-Profile kubeconfig storage
7. Kubernetes connectivity verification
8. Minimal-click macOS UI

Cross-platform and provider-specific discovery remain later phases.

## Development

```bash
pnpm install
pnpm tauri dev
pnpm build
cargo check --manifest-path src-tauri/Cargo.toml
```

## Documentation

| Topic | Page |
|---|---|
| Overview | [Overview](/oss/en/clusterdeck/overview) |
| Architecture | [Architecture](/oss/en/clusterdeck/architecture) |
| Getting Started | [Getting Started](/oss/en/clusterdeck/getting-started) |
