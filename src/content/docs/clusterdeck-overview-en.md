---
title: ClusterDeck Overview
description: A macOS workstation access layer that keeps frequently recreated VM and Kubernetes environments reachable through stable Profiles.
project: ClusterDeck
path: clusterdeck/overview
order: 1450
lastModified: 2026-08-28
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
