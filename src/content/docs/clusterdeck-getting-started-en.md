---
title: ClusterDeck Getting Started
description: macOS development setup and the Profile-oriented SSH/kubeconfig connection flow.
project: ClusterDeck
path: clusterdeck/getting-started
order: 1452
lastModified: 2026-08-28
---

# ClusterDeck Getting Started

The initial scope is macOS-first and uses Tauri 2, Rust, React, and TypeScript.

```bash
pnpm install
pnpm tauri dev
```

Validate both frontend and Rust backend:

```bash
pnpm build
cargo check --manifest-path src-tauri/Cargo.toml
```

## Connection flow

1. Create a stable environment Profile.
2. Discover hosts by CIDR or explicit address.
3. Probe SSH connectivity.
4. Optionally bootstrap a public key.
5. Configure ProxyJump when a bastion is required.
6. Fetch kubeconfig from a control-plane host.
7. Normalize endpoint and context names around the Profile.
8. Verify the Kubernetes API using the local Profile kubeconfig.

Never place real passwords, private keys, kubeconfigs, tokens, certificates, or infrastructure addresses in public documentation, issues, tests, or screenshots.
