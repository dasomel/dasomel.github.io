---
title: "Building Multiple OSS Projects Led Me to Build a Standard"
description: "How repeated repository, CI/CD, security, and documentation decisions across open-source projects evolved into OpenForge, a shared engineering standard."
pubDate: 2026-08-28
tags: ["Open Source", "Engineering", "OpenForge", "Platform Engineering"]
featured: false
draft: true
---

> **OpenForge Engineering Series — 1/7**
>
> This series records how recurring problems across multiple OSS projects became shared engineering standards, and how those standards were tested through real adoption.

When you start one open-source project, you can focus mostly on the product. As the number of projects grows, questions unrelated to the core feature begin to repeat.

How should the README be structured? How should Korean documentation be maintained? What should CI verify? How should dependency updates be automated? How much security and supply-chain governance is appropriate? What should an AI coding agent always read?

The difficult part was not any single question. It was **making the same engineering decisions again in every repository**.

## I needed decision criteria, not just a template

Copying files from a well-maintained repository looks like an easy solution.

But projects have different characteristics. A Kubernetes platform, desktop operator, admin console, developer tool, and documentation site should not automatically inherit identical CI and security controls.

What I needed was a way to answer:

- What should be common across OSS projects?
- What should vary by project type?
- Why was a rule chosen?
- Did it work in real repositories?
- Which parts can be automated safely?

That became [OpenForge](https://github.com/dasomel/openforge).

## OpenForge started changing roles

It began closer to a blueprint for recurring repository structure, documentation, and CI/CD work.

Real adoption expanded the scope:

```text
Repository Structure
Documentation / i18n
CI/CD
Security / Supply Chain
Release / Upgrade
AI-assisted Engineering
ADR / Decision Management
Design System
Compliance Assessment
```

The important shift was from "add this file" to **why a rule exists and where it should apply**.

## Extract standards from reference projects

Rather than inventing standards first, OpenForge tries to start from problems that recur in real projects.

```text
Reference OSS
    ↓
Real problem / operating experience
    ↓
Decision
    ↓
OpenForge Standard
    ↓
Template / CI / Policy
    ↓
Adoption by other OSS
    ↓
Feedback
```

A naming inconsistency such as `README_ko.md`, `README.ko.md`, and `README-ko.md` may look minor. Across many repositories, however, consistent naming improves search, automation, and link generation.

The opposite is also true. Copying the same UI or security workflow into every project is not necessarily good standardization. The boundary of standardization is itself an engineering decision.

## An untested standard is still an assumption

A recurring distinction became important: "the document exists" is not the same as "the standard works."

That led OpenForge in several directions:

- Split AI coding-agent guidance into small contracts and deterministic tooling.
- Record durable shared decisions with ADRs.
- Use Figma and `DESIGN.md` to define shared design semantics without erasing project identity.
- Measure adoption across 14 OSS repositories with 35 stable metrics.
- Enforce selected rules with CI and branch protection.
- Turn audit gaps back into real repository pull requests.

OpenForge is therefore becoming less like a template repository and more like a **knowledge base for engineering practices that are accumulated and tested**.

## What this series covers

This series is not only about the final documents. It records why the structure was needed, where standardization became excessive, what was automated, and what remained a project-specific judgment.

The next article starts with one of the areas that required the most iteration: **how repository instructions for AI coding agents should be structured**.

## References

- [OpenForge](https://github.com/dasomel/openforge)
- [OpenForge Reference Metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md)

**Next:** OpenForge Engineering Series 2/7 — A Longer AGENTS.md Was Not the Answer
