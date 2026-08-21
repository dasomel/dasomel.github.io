---
title: Troubleshooting
description: Evidence-first troubleshooting model for OpenForge projects.
project: OpenForge
path: openforge/troubleshooting
order: 1008
lastModified: 2026-08-21
---

# Troubleshooting

Use an evidence-first structure rather than a collection of guesses.

## Incident format

```text
Symptom
  ↓
Scope
  ↓
Evidence
  ↓
Root cause
  ↓
Fix
  ↓
Regression test
  ↓
Documentation update
```

## Minimum report

- exact command/workflow
- expected result
- observed result
- relevant logs
- environment/runtime versions
- change that preceded the failure
- verified fix
- prevention or regression coverage

## Example

A build starts using a new runtime only in one workflow. Another deployment workflow fails because it assumed the runtime was globally installed. The durable fix is not merely installing the runtime in that workflow; the change contract must include workflow-wide runtime inventory and regression validation.
