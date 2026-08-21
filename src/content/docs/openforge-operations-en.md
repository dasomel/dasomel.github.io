---
title: Operations
description: Operational documentation contract for OpenForge-based projects.
project: OpenForge
path: openforge/operations
order: 1006
lastModified: 2026-08-21
---

# Operations

An OpenForge-based project should document the lifecycle after deployment, not only installation.

## Minimum operational set

- health and readiness
- metrics, traces and structured logs
- configuration and secret boundaries
- upgrade and rollback path
- backup and restore validation
- offline/air-gap behavior where applicable
- incident response

## Evidence

Operations documentation should link to actual manifests, workflows, runbooks, and validation commands. A statement such as “backup supported” is incomplete without restore evidence.

## Release lifecycle

```text
Release
 → verify
 → deploy/canary
 → observe
 → promote
 → record evidence
 → retain last-known-good
```
