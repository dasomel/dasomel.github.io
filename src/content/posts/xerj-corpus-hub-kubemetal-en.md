---
title: "KubeMetal featured as an AI agent reference in XERJ Corpus Hub"
description: "A KubeMetal implementation separating Colima VM profiles is now available as an AI agent reference in XERJ Corpus Hub."
pubDate: 2026-10-22
tags: ["Open Source", "XERJ", "KubeMetal", "AI Agent", "Kubernetes", "MLOps", "Platform Engineering"]
projects: ["kubemetal"]
featured: false
draft: false
---

I recently received encouraging news about my open-source work: **an implementation from KubeMetal has been included as an AI-agent reference in XERJ Corpus Hub**, and a [contributor page](https://hub.xerj.org/contributors/dasomel) is now available.

## What are XERJ and Corpus Hub?

[XERJ](https://github.com/xerj-org/xerj) is an open-source search project intended to help AI agents retrieve relevant code and supporting material. Instead of repeatedly reading large numbers of files, an agent can look for concrete implementation examples.

Corpus Hub makes open-source implementations available as searchable reference material. Inclusion means that code can be referenced; it does **not** constitute a certification of the entire project or adoption as an official standard.

## The KubeMetal implementation

[KubeMetal](https://github.com/dasomel/kubemetal) explores combining Kubernetes-based MLOps services with native MLX compute on Apple Silicon macOS hosts.

The referenced change **separates Colima VM profiles to manage the Kubernetes runtime independently**. It illustrates three engineering considerations:

- **Virtualization isolation:** separating Colima profiles and resource boundaries for local workloads.
- **Responsibility boundaries:** distinguishing the VM-based Kubernetes control plane from native host MLX execution.
- **Reproducibility:** making local AI/MLOps runtime configuration more consistent and manageable.

These are useful implementation patterns to consider when combining local Kubernetes and AI workloads. Performance and isolation properties still require validation in each target environment.

## An open-source and AI-agent feedback loop

I've been building open-source projects in Kubernetes, cloud-native infrastructure, and platform engineering with AI coding agents. This milestone highlights an interesting loop: **code developed with assistance from AI agents can become reference material for other agents**.

Publishing source code is only the beginning. Documenting trade-offs, constraints, and architectural decisions makes implementations more useful to both people and agents. I'll continue focusing on verifiable implementations and practical documentation.

Thank you to Ivan at XERJ for highlighting this contribution.

## Links

- [XERJ Contributor — dasomel](https://hub.xerj.org/contributors/dasomel)
- [KubeMetal GitHub](https://github.com/dasomel/kubemetal)
- [XERJ GitHub](https://github.com/xerj-org/xerj)
