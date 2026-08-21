---
title: Concepts
description: Core ideas behind the OpenForge engineering model.
project: OpenForge
path: openforge/concepts
order: 1001
lastModified: 2026-08-21
---

# Concepts

OpenForge separates **policy**, **implementation**, and **evidence**.

## Three layers

| Layer | Purpose | Example |
|---|---|---|
| Standard | Defines the expected engineering outcome | Supply Chain Security Standard |
| Template | Provides a reusable starting implementation | Kubernetes Deployment baseline |
| Reference implementation | Shows project-specific adaptation | Narwhal deployment |

## Trust model

A provenance document, signature, or SBOM is evidence, not an assertion that an artifact is safe. Verification must consider source, build inputs, workflow identity, artifact contents, and the intended deployment context.

## Change model

A dependency/runtime/toolchain change is a workflow-wide change. A build command that starts using Bun, for example, changes every workflow that can execute that command.

## Governance model

OpenForge is designed for both single-maintainer and multi-maintainer projects. Governance scales with change risk and automated controls rather than requiring a fixed number of people.
