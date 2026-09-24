---
title: "The Manual Steps I Kept Repeating on Every Cluster Rebuild, So I Built ClusterDeck"
description: "Why re-creating a Kubernetes cluster kept breaking SSH, kubeconfig, hosts, and CA trust by hand, and how a Profile fixed it"
pubDate: 2026-09-24
tags: ["Kubernetes", "Cloud Native", "Platform Engineering", "Open Source", "DevTools", "Tauri", "Rust", "ClusterDeck"]
projects: ["clusterdeck"]
featured: false
draft: false
---

I kept re-creating Kubernetes clusters until I finally built a tool for it. Doing this once or twice is fine, but repeating cluster-rebuild tests turned the same manual chores into a real chore of their own.

## The problem: the same checklist on every rebuild

Every time I recreated a cluster, I had to redo the same steps in order.

- the VM's IP address changes
- SSH connection details need to be reconfigured
- kubeconfig has to be fetched and edited
- `/etc/hosts` needs an update for internal domains
- the cluster's CA certificate needs to be trusted on local macOS
- and finally, the actual Kubernetes API connection needs to be re-verified

None of these is hard on its own. The problem was that all six steps reset to zero every time a cluster got deleted and rebuilt. One IP change cascades into the SSH alias, the kubeconfig server address, the `/etc/hosts` entry, and the trusted CA all going stale together.

## The idea: a Profile, borrowed from SwitchHosts

I remembered using SwitchHosts to switch between hosts files for different dev environments. That led to a simple question: what if cluster access could be managed and switched the same way, as a single Profile? That question is where ClusterDeck started.

The core idea is to anchor on a **name a human remembers**, not an IP address. When a cluster gets rebuilt and its IP or access details change, the Profile name stays the same — only the local access configuration underneath it gets rebuilt.

## What ClusterDeck does: eight steps around one Profile

ClusterDeck is a macOS-first desktop app built for VM/Kubernetes environments that get created and destroyed often, and whose IPs change. It wraps the manual steps above into one flow, organized around a Profile:

<Mermaid chart={`flowchart LR
    A["IP / Host Discovery"] --> B["SSH Connectivity"]
    B --> C["SSH Key Bootstrap"]
    C --> D["Bastion / ProxyJump"]
    D --> E["Remote kubeconfig Fetch & Normalization"]
    E --> F["/etc/hosts management"]
    F --> G["Cluster CA trust management"]
    G --> H["Kubernetes Connectivity Check"]
`} />

Spelled out: discover the host, confirm SSH works, bootstrap keys if needed, set up ProxyJump when a bastion is involved, fetch and normalize the remote kubeconfig, adjust `/etc/hosts` when internal domains are needed, trust the CA, and finally verify the actual Kubernetes API connection.

## Design points

**The Profile name stays put; only what's under it gets replaced.** When a cluster is rebuilt and its IP or access details change, the Profile name a person remembers doesn't change — only the SSH/kubeconfig/hosts/CA state tied to that name gets refilled. You never have to second-guess whether "this cluster" is still the same cluster.

**CA certificates are registered in the local macOS Login Keychain.** Clusters commonly use self-signed CAs, and without trusting them locally, TLS verification keeps failing. ClusterDeck handles that registration, and also lets you check which CAs are currently trusted and remove that trust again when needed. Adding trust with no way to undo it would just become its own kind of manual debt.

## What it's not

ClusterDeck is still an early MVP, and it isn't trying to become a Kubernetes management console. It doesn't deploy workloads or give you a cluster-state dashboard — it's focused narrowly on making the "rebuild the cluster → rebuild local access → verify the connection actually works" loop I kept going through a little less annoying.

## Links

- GitHub: [dasomel/clusterdeck](https://github.com/dasomel/clusterdeck)
- Project page: [/en/projects/clusterdeck](/en/projects/clusterdeck)

If you're in a similar spot, frequently spinning up and tearing down local VM or Kubernetes test environments, feedback is welcome.
