---
title: Siqoq Development and Verification
description: Current executable Python foundation and principles for future adapters.
project: Siqoq
path: siqoq/development
order: 1702
lastModified: 2026-09-14
---

# Siqoq Development and Verification

```bash
git clone https://github.com/dasomel/siqoq.git
cd siqoq
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
make verify
```

Current verification focuses on a small executable core such as semantic events and the CLI. New runtimes and devices should connect through adapters rather than changing the event/action contracts, and simulation and real-device paths should reuse the same fixtures where possible.

## Completion evidence

- interface or event-schema tests
- identical fixture outcomes across simulator/recorded input and real adapters
- perception → event → decision → action-result correlation
- functional parity between accelerator paths and the CPU baseline
- explicit distinction between hardware evidence and mock-only validation
