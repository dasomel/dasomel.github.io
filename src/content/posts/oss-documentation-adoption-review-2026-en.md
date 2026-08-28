---
title: "📚 Re-documenting 10 OSS Projects — From Source State to First Verified Success"
description: "A source- and evidence-based documentation review of Narwhal, Narwhal Portal, NFS Quota Agent, ldapium, kube-ready-box, ClusterDeck, Beluga, Beluga Manager, KubeMetal, and OpenForge, redesigned around Time to First Verified Success."
pubDate: 2026-08-28
tags: ["Open Source", "Documentation", "Platform Engineering", "Kubernetes", "OpenForge", "Developer Experience", "AI-assisted Development"]
featured: true
draft: false
---

## Introduction

More documentation does not automatically make an open-source project easier to adopt.

I reviewed ten projects in the CnE OSS portfolio against their actual repository source and verification evidence rather than counting README sections or documentation files: Narwhal, Narwhal Portal, NFS Quota Agent, ldapium, kube-ready-box, ClusterDeck, Beluga, Beluga Manager, KubeMetal, and OpenForge.

The principle is simple:

> **Documentation should reduce Time to First Verified Success, not maximize document count.**

## A shared adoption model

The projects are intentionally different, so they should not be forced into identical repositories. What can be shared is the external adoption journey:

```text
Discover -> Understand -> Install -> Verify -> Operate -> Troubleshoot -> Contribute
```

The key change is `Verify`. A Quick Start should end in a product outcome, not merely a successful install command.

## What first success means by project

### Narwhal

`kubectl get nodes` is only cluster readiness. Narwhal first success also requires observable GitOps reconciliation, identity, core platform applications, and live verification. Exact component versions remain owned by `VERSIONS.md`, while cluster and SSO checks remain distinct evidence classes.

### Narwhal Portal

A successful Next.js build is not a Day-2 user journey. First success means completing the authentication bootstrap, reaching the intended backend boundary, and rendering an implemented workspace with real or controlled data. Implemented UI, fixtures, and planned UI should be labeled separately.

### NFS Quota Agent

The product outcome is filesystem enforcement:

```text
PVC/PV -> NFS path -> server quota -> over-capacity write -> enforcement
```

Stubbed unit tests, built-container command availability, Kubernetes integration, and real quota-enabled filesystem E2E are separate evidence classes.

### ldapium

First success is a real LDAP bind/read/write/deny flow with the expected TLS, ACL, and audit behavior. Replication, backup/restore, air-gap, and mTLS expand the trust boundary only after the standalone baseline works.

### kube-ready-box

Downloading a box is not enough. A ready environment proves guest OS/architecture, filesystem/quota capabilities, Kubernetes prerequisites, and reproducibility. Release/Vagrant/Packer metadata should own exact versions.

### ClusterDeck

For an early product, the shortest useful contract is explicit:

```text
Profile -> SSH -> kubeconfig/context -> Kubernetes API -> harmless read
```

Packaged-app claims, screenshots, and supported targets should follow actual build/release evidence.

### Beluga

Healthy Kafka, Flink, Trino, and Airflow pods do not prove the data platform. First success carries a small deterministic record through a documented E2E data path to its final query or visualization surface.

### Beluga Manager

Architecture can easily outrun implementation. Documentation should distinguish `Implemented`, `Integrated`, and `Planned`, and provide one runnable read-only vertical slice before requiring the full target architecture.

### KubeMetal

Local-first onboarding comes before advanced external-cluster scenarios. First success proves the intentional split between Kubernetes/Colima/K3s control-plane services and native macOS MLX/Metal compute through a small model/MLflow workflow. Mocked adapters do not prove native runtime behavior.

### OpenForge

OpenForge adoption should begin with one real repository problem and one relevant standard/template, followed by deterministic validation or audit evidence. Portfolio scores are standards-compliance evidence, not product maturity or popularity scores.

## Documentation claims need evidence levels

AI-assisted development can make both source and documentation grow quickly. That makes it easier for plans, placeholder screenshots, unpublished artifacts, or mock-only behavior to look like current product capability.

A useful claim hierarchy is:

```text
Design / Issue
    -> Source implemented
    -> Static / unit verification
    -> Integration verification
    -> Runtime / E2E evidence
    -> Release / adoption evidence
```

A document should not make a stronger claim than its evidence supports.

## Converging information architecture

Across the portfolio, user-facing documentation should converge where practical toward:

```text
What / Why
Current status and scope
Prerequisites
Quick Start
Verify first success
Known limitations / compatibility
Architecture
Operations / troubleshooting
Documentation map
Contributing / support
License
```

The goal is not identical repositories. The goal is to make the starting point and success condition obvious.

## OpenForge as the documentation feedback loop

OpenForge began with baseline artifacts such as README, SECURITY, CONTRIBUTING, and CHANGELOG. The next layer is adoption architecture and evidence quality:

```text
Repository source of truth
       -> Current implementation status
       -> Adoption guide
       -> First verified success
       -> Operations / troubleshooting
       -> Evidence-backed documentation refresh
```

Documentation becomes a maintained engineering interface rather than a cleanup task at the end of development.

## Closing

Operating multiple OSS projects has made one lesson increasingly clear: good documentation defines the boundary of the product. It explains what exists, what is planned, which evidence supports which claim, and how a new user can prove the project's value.

The question I want to keep asking across the portfolio is:

> **Can a newcomer reach the real value of this project through the shortest path, with evidence and without inflated claims?**

When the answer is yes, documentation becomes part of the engineering system itself.
