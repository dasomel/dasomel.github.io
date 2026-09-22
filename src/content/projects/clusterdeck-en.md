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

Bootstrap passwords are one-time inputs and should not be stored or logged. Generated kubeconfigs use restrictive permissions, and destructive merges to user-managed SSH/Kubernetes configuration are avoided.

Outside `~/.clusterdeck/`, ClusterDeck touches exactly three things, each opt-in or confined to its own marked block:

- **Login Keychain** — trusting a cluster's CA (opt-in per discovered endpoint, or from Settings → Trusted CAs) adds it to your **login keychain** (never System), scoped to the SSL/TLS trust policy only. Inspect or remove it in Keychain Access.app or from ClusterDeck itself.
- **`/etc/hosts`** — off by default, opt-in per Profile. When enabled, writes stay inside one marked block per profile (`# >>> ClusterDeck BEGIN (profile: <id>) >>>`) via an admin-privileged prompt.
- **`~/.ssh/config`** — gets a single `Include ~/.clusterdeck/ssh/*.conf` line; per-profile SSH options live in that included directory, not in your own config.

## Download

[v0.1.0](https://github.com/dasomel/clusterdeck/releases/tag/v0.1.0) ships as a macOS (Apple Silicon) `.dmg`. There is no Apple Developer ID certificate yet, so macOS shows an "unidentified developer" warning on first launch — right-click the app and choose Open to run it anyway.

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

Running from source remains the recommended path; the `.dmg` is a secondary distribution channel, not a replacement for it.

## Documentation

| Topic | Page |
|---|---|
| Overview | [Overview](/oss/en/clusterdeck/overview) |
| Architecture | [Architecture](/oss/en/clusterdeck/architecture) |
| Getting Started | [Getting Started](/oss/en/clusterdeck/getting-started) |
