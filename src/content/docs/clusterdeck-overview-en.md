---
title: ClusterDeck Overview
description: A macOS workstation access layer that keeps frequently recreated VM and Kubernetes environments reachable through stable Profiles.
project: ClusterDeck
path: clusterdeck/overview
order: 1450
lastModified: 2026-09-22
---

# ClusterDeck Overview

ClusterDeck stabilizes local access to frequently recreated VM and Kubernetes environments.

Its primary unit is a **Profile**, not an IP address. A Profile groups environment identity, hosts, SSH/bastion paths, remote kubeconfig location, and a local Kubernetes context.

```text
Environment Profile
  ├─ Hosts
  ├─ SSH / ProxyJump
  ├─ Remote kubeconfig
  └─ Kubernetes verification
```

ClusterDeck is not a Kubernetes resource management console. Its product boundary ends when the environment is discoverable, reachable, and verified for tools such as `kubectl`.

## First Verified Success

The desktop app starting is not the product outcome. A Profile reaches **first verified success** only when the same workflow proves all three layers:

1. **SSH** — ClusterDeck reaches the target host, directly or through the configured bastion.
2. **kubeconfig** — the remote kubeconfig is fetched and normalized into the local Profile without exposing credentials in logs or documentation.
3. **Kubernetes API** — the resulting context can make a real API call such as `kubectl get nodes`.

SSH succeeding while the Kubernetes API fails counts as a partial connection, not a successful Profile.
