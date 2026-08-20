---
title: "🤖 How I Build Open Source with AI — Lessons from Developing Narwhal"
description: "How I use ChatGPT, Claude, Gemini, and Copilot together in real open-source development, and how AI is changing my role as an engineer while building Narwhal and other Cloud Native projects."
pubDate: 2026-08-19
tags: ["AI", "Open Source", "Narwhal", "Kubernetes", "Cloud Native", "Platform Engineering", "AI Agent"]
featured: false
draft: false
---

## Introduction

Recently I have been thinking a lot about AI-first software development and how AI is changing the way we build software.

Using Copilot for autocomplete, Claude Code or Gemini CLI to modify several files, or asking ChatGPT to write code is no longer unusual.

But after maintaining open-source projects for months, I have found a different problem becoming more important:

> **The important question is not only how well AI can write code, but what software we can keep building and improving with AI.**

I currently use ChatGPT, Claude, Gemini, and GitHub Copilot together. The goal is not to compare model benchmarks. The goal is to understand how these tools fit into a real open-source engineering workflow.

The clearest example is [Narwhal](https://github.com/dasomel/narwhal), an open-source Kubernetes Internal Developer Platform.

This post describes how I use AI in that workflow, and how the developer's role is changing as AI becomes better at implementation.

---

## 1. What am I actually building with AI?

The largest project in this ecosystem is Narwhal.

Narwhal integrates Kubernetes with GitOps, IAM/SSO, service mesh, observability, registry, storage, backup, policy, API gateway, and a management portal.

The hard part is not installing Kubernetes. The hard part is making independent projects work together reliably.

```text
Kubernetes
    +
GitOps
SSO / IAM
API Gateway
Service Mesh
Observability
Registry
Storage
Backup
Security / Policy
Management Portal
        ↓
    One platform
```

A cluster can contain Keycloak, APISIX, Istio, Argo CD, Grafana, Gitea, Harbor, and many other components. Each can work perfectly on its own and still fail at the seams.

Claims can be incompatible, TLS chains can diverge, chart upgrades can break configuration, and an air-gapped environment can expose an external dependency that nobody noticed before.

Narwhal therefore treats integration itself as part of the product.

---

## 2. The valuable knowledge is integration knowledge

One of the biggest lessons from Narwhal is that not every problem is a coding problem.

A failure may come from Kubernetes, a Helm chart, a Keycloak setting, or compatibility between two otherwise healthy systems.

That is why I keep operational lessons in the repository instead of letting incidents disappear into chat history.

The process is roughly:

```text
Incident
   ↓
Lesson
   ↓
Discriminator
   ↓
Regression Test
```

The goal is not only to remember how a problem was fixed, but to record how to distinguish the next similar problem from the previous one.

This becomes especially important when AI is involved. AI can generate code very quickly, but repository-native failure knowledge is still one of the most valuable sources of truth.

---

## 3. Using AI is not the same as developing with AI

A simple AI coding loop looks like this:

```text
Problem
  ↓
AI writes code
  ↓
Run it
  ↓
Error
  ↓
Ask AI to fix it
```

That works for small tasks. It becomes much less useful as a repository grows.

Once a project has dozens of files, GitHub Actions, Kubernetes manifests, Helm charts, regression tests, and operational conventions, asking an AI to rediscover everything from scratch becomes expensive and unreliable.

That is one of the motivations behind [Luna Chat Coder](https://github.com/Osteoporosis/luna-chat-coder).

The important questions become:

```text
What repository state are we using?
Where are we working?
What may be changed?
How is the result validated?
How can we recover it?
```

The repository should retain enough of that context so that the next AI session can continue from evidence rather than guesses.

---

## 4. I use several AI tools together

My current workflow uses:

```text
ChatGPT
Claude
Gemini
GitHub Copilot
```

I treat them as different engineering tools rather than trying to find one model that does everything.

A typical workflow looks like:

```text
Idea / architecture
       ↓
Review with multiple models
       ↓
Implementation
       ↓
Tests
       ↓
Failure analysis
       ↓
Another model reviews the result
       ↓
GitHub
```

The final result should not depend on which model generated the first draft.

The source of truth is the Git repository, and the final authority is the test suite and real runtime behavior.

Using several models also gives me a useful second opinion: one model can find something another missed.

---

## 5. AI changes role when the project becomes an ecosystem

A Kubernetes platform upgrade can affect many components at once.

For example:

```text
Kubernetes version change
       ↓
Cilium
       ↓
Istio compatibility
       ↓
APISIX / cert-manager
       ↓
Keycloak OIDC
       ↓
Argo CD / Grafana / Gitea / Harbor
       ↓
Regression tests
```

The strongest benefit I see from AI in this environment is not raw code generation. It is the speed at which AI can explore a repository and trace the likely blast radius of a change.

Instead of repeatedly searching files manually, I can ask an agent to identify what might be affected and then validate the result against manifests, scripts, tests, and cluster state.

The principle is simple:

> **AI increases exploration speed; the system remains responsible for verification.**

---

## 6. Narwhal Portal is another AI-assisted project

[Narwhal Portal](https://github.com/dasomel/narwhal-portal) is a separate management portal built around the same ecosystem.

It covers areas such as dashboard, onboarding, catalog, nodes, cost, compliance, security, governance, architecture, templates, tools, and settings.

The challenge is not just writing React components. Changes often cross several layers:

```text
Kubernetes API
    ↓
Backend API
    ↓
TanStack Query
    ↓
React UI
    ↓
User permissions / Keycloak
```

AI is useful here when it understands that the repository is a system rather than a collection of unrelated files.

That is why architecture notes, conventions, security rules, and development workflow are kept in the repository while AI is used as the implementation accelerator.

---

## 7. kube-ready-box is another part of the same puzzle

Narwhal also creates a reproducibility problem: how do I create the base environment again and again?

That led to [kube-ready-box](https://github.com/dasomel/kube-ready-box), which creates a prepared Ubuntu-based Vagrant Box for Kubernetes development and practice.

The relationship looks like:

```text
Packer
  ↓
Ubuntu
  ↓
Kubernetes prerequisites
  ↓
Vagrant
  ↓
Narwhal cluster
```

The projects are not isolated. They form an engineering ecosystem.

```text
kube-ready-box
       ↓
    Narwhal
       ↓
Narwhal Portal
       ↓
 Kubernetes IDP
```

AI-assisted development becomes more useful when the relationships between repositories are explicit and testable.

---

## 8. In AI-era open source, maintenance matters more than the first version

AI can make the first version much faster.

The harder part of open source is keeping a system alive through version upgrades, dependency changes, architecture changes, and new requirements.

```text
v0.1
 ↓
v0.2
 ↓
v1.0
 ↓
Kubernetes upgrade
 ↓
dependency upgrade
 ↓
new architecture
 ↓
new requirements
```

That is why I put effort into tests, lessons, release workflows, and repository evidence instead of treating AI-generated code as the product itself.

The real product is the system that remains understandable and verifiable after the next change.

---

## Closing thought

AI has reduced the cost of producing code. That makes judgment, verification, and system context more valuable rather than less valuable.

My goal with these projects is therefore not to prove that AI can write a lot of code.

It is to see whether AI can help one engineer build, verify, operate, and continuously improve a real open-source ecosystem without losing engineering discipline.
