---
title: Troubleshooting Guide
description: Evidence-first symptom-cause-action debugging methodology and lessons-learned codification.
project: OpenForge
path: openforge/troubleshooting
order: 1008
lastModified: 2026-08-23
---

# Troubleshooting Guide

OpenForge adopts an **Evidence-First** troubleshooting approach, isolating root causes through verifiable artifacts rather than speculative debugging.

## Standard Incident Flow

```text
Symptom Identification (Failed command, error output, anomaly)
      ↓
Scope Assessment (Affected components, workflows, users)
      ↓
Evidence Collection (Logs, metrics, timestamps, reproduction steps)
      ↓
Root Cause Analysis (Code defect, config drift, supply chain change)
      ↓
Fix & Verification (Patch deployment and passing test suite)
      ↓
Regression Test Codification (Automated test guarding against recurrence)
      ↓
Lessons Log & Docs Update (Codifying knowledge into shared standards)
```

---

## Required Record Invariants

All incidents must record the following in `docs/lessons-log.md`:

1. **Exact Reproduction Command**: The command or workflow that triggers the issue
2. **Expected vs Actual Output**: Observable divergence from expected behavior
3. **Environment State**: OS, runtime, package version, and exact commit hash
4. **Preceding Changes**: PRs or dependency changes merged immediately prior
5. **Verified Fix & Regression Guard**: Patch applied and automated regression test
