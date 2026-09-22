---
title: ClusterDeck Architecture
description: Local systems architecture across Tauri UI, Rust core, OpenSSH, and kubeconfig boundaries.
project: ClusterDeck
path: clusterdeck/architecture
order: 1451
lastModified: 2026-09-22
---

# ClusterDeck Architecture

ClusterDeck keeps security-sensitive local systems operations in the Rust backend while React presents Profile and connection state.

```text
Tauri UI (React / TypeScript)
        ↓ Tauri Commands
Rust Application Core
  ├─ Profile Service
  ├─ Discovery Service
  ├─ SSH / Bastion Service
  ├─ Kubeconfig Service
  └─ Cluster Health Service
        ↓
OpenSSH / kubectl / local filesystem
```

The MVP prefers native OpenSSH rather than implementing a full SSH client, owns generated files only under `~/.clusterdeck/`, and keeps generated kubeconfigs separate from unrelated user-managed configuration.

## Trust boundary (Keychain / `/etc/hosts`)

Outside kubeconfig and SSH, ClusterDeck touches only two things, both opt-in. Trusting a cluster's CA adds it to the **login keychain** (never System), scoped to the SSL/TLS trust policy only. `/etc/hosts` is written only when opted in per Profile, confined to one marked block (`# >>> ClusterDeck BEGIN (profile: <id>) >>>`) via an admin-privileged prompt.
