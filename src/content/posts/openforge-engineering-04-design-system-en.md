---
title: "A Design System That Does Not Make Every OSS Look the Same"
description: "How OpenForge uses Figma and DESIGN.md to share semantic tokens and accessibility while preserving each OSS project's product identity."
pubDate: 2026-08-28
tags: ["Design System", "Figma", "Open Source", "OpenForge", "UI/UX"]
featured: false
draft: true
---

> **OpenForge Engineering Series — 4/7**

A shared design system often suggests one component library: standard buttons, inputs, colors, spacing, and a common visual language used everywhere.

The OSS projects covered by OpenForge, however, have different jobs. A platform portal, operations dashboard, desktop operator, admin console, and developer tool have different workflows and information-density requirements.

So the goal was not "make every product look the same."

## Share meaning before appearance

The common layer focuses on semantic tokens and accessibility.

```text
Shared
- semantic color roles
- typography roles
- spacing principles
- focus / keyboard behavior
- status semantics
- accessibility baseline
- common interaction contracts

Project-specific
- product accent
- navigation model
- information density
- dashboard composition
- domain-specific visualization
- brand identity
```

A `success` state can share the same semantic role without every project hard-coding the same green value. At the same time, an operations dashboard and a developer portal do not need identical navigation or density.

## Figma is more than a place to store screens

Figma became one of the sources used to explore and compare a shared design language, rather than merely a place to draw final screens.

Shared tokens, component states, and accessibility patterns can be organized centrally while adoption varies by project archetype.

That also creates a need for a contract between Figma and implementation.

## DESIGN.md is the repository-side contract

UI projects use `DESIGN.md` to record how the repository interprets the OpenForge design system.

Typical concerns include:

```text
Archetype
Token mapping
Navigation pattern
Density
Accessibility expectations
Project-specific exceptions
Figma reference
```

The purpose is not to document every CSS value. It is to make the **boundary between the shared design system and the product implementation** explicit.

## Why archetypes matter

Applying identical design rules to every repository might make compliance scoring simpler, but it can make products worse.

OpenForge therefore distinguishes archetypes such as Platform Portal, Operations Dashboard, Desktop Operator, Admin Console, Developer Tool, and Data Control Plane.

The more useful success criteria are:

- Is the same meaning represented consistently?
- Are keyboard and focus fundamentals predictable?
- Are state and risk levels understandable across products?
- Is the project's domain workflow preserved?

## Connecting design to compliance

A design-system document alone does not show whether repositories actually adopted it.

The compliance model therefore includes stable metrics such as `DESIGN-001` and `DESIGN-002`. For applicable UI projects, it checks for a design contract and structural token mapping.

An early version could have accepted a document simply because it contained the word `tokens`. Fixtures were later added to distinguish casual prose from a real structured token mapping.

The same lesson applies to design systems:

**A document existing is not the same as a contract being adopted.**

## Standardize the boundary of standardization

The most important OpenForge design-system decision was not a particular color or component. It was deciding how much should be shared.

Semantics, accessibility, and interaction contracts can be common while product identity and domain workflow remain distinct.

The next article explains how these contracts were turned into **35 stable metrics used to measure adoption across 14 OSS repositories**.

## References

- [OpenForge OSS Design System](https://github.com/dasomel/openforge/blob/main/docs/design-system.md)
- [OpenForge ADR](https://github.com/dasomel/openforge/tree/main/docs/adr)

**Previous:** 3/7 — Why Does Code Survive While Engineering Decisions Disappear?  
**Next:** 5/7 — Can We Measure Whether Standards Are Actually Adopted?
