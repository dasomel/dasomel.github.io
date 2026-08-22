---
title: Security & Incident Response
description: Incident triage, mitigation, communication, and lessons-learned codification.
project: OpenForge
path: openforge/standards/incident-response
order: 1032
lastModified: 2026-08-23
---

# Security & Incident Response

Incidents and security events represent critical opportunities to harden systems and processes.

## 4-Step Incident Lifecycle

1. **Containment & Mitigation**: Isolate affected components and execute rollbacks to restore service.
2. **Root Cause Analysis**: Correlate logs, metrics, and change history to determine root causes.
3. **Regression Test Codification**: Author automated test cases preventing identical failures.
4. **Lessons Log Integration**: Codify post-mortem findings into `docs/lessons-log.md` to improve standards.

## Canonical Source

- [Security & Incident Response](https://github.com/dasomel/openforge/blob/main/docs/incident-response.md)
