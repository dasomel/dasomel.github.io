---
name: luna-chat-coder
description: Reliable repository development from chat for dasomel.github.io using sandbox-first execution, exact GitHub state, and bounded Actions fallback.
license: MIT
metadata:
  version: "0.1.1"
---

# Luna Chat Coder

Use this skill for repository-development tasks performed from ChatGPT.

## Core policy

1. Discover early, activate late. Reading this skill does not imply using GitHub Actions.
2. Resolve the target repository/PR/branch to an exact commit before substantial edits.
3. Prefer the disposable sandbox work container for repository inspection, editing, build, lint, testing, and debugging.
4. Inspect capabilities already available before installing or downloading dependencies.
5. The repository defines its own runtimes, dependencies, architecture, tooling, and verification requirements. Do not introduce substitutes merely because they are easier.
6. Treat GitHub commit/PR state as durable source truth. Do not reconstruct verified source from conversation prose when exact repository bytes exist.
7. Preserve unrelated work and assume other agents, CI, and humans may modify the repository concurrently.
8. Diagnose GitHub/API/Actions failures before retrying; do not blindly repeat failed operations.
9. Choose the simplest exact and reliable publication path. Small textual changes may use normal GitHub file writes; larger exact changes may use native Git or patch/bundle transport when appropriate.
10. Completion claims must be based on checks actually run against the relevant state.

## Repository-specific rules

- Keep `CLAUDE.md` intact. It contains project-specific operational knowledge, including the `agyp` lane and publication invariants.
- Keep `.github/workflows/daily-digest.yml`, `digest-fallback.yml`, `deploy.yml`, `digest-health.yml`, and `update-events.yml` behavior intact unless the task explicitly changes automation.
- Preserve the repository's build/lint baseline and existing lockfile.
- For content changes, inspect nearby posts and existing frontmatter before writing.
- For bilingual daily digests, maintain the `daily-digest-YYYY-MM-DD.md` / `daily-digest-YYYY-MM-DD-en.md` pairing.
- If an English digest exists without a Korean counterpart, treat the missing Korean artifact as a content defect to repair.
- If a Korean post exists but lacks translation/enrichment expected by current policy, compare it with the source data and repair only the missing content.

## Actions fallback

GitHub Actions is a bounded fallback, not the primary workstation. Use it only when the sandbox cannot provide a required capability, an exact transport is materially safer, or the sandbox itself is unavailable. Define exact source identity, inputs, operations, outputs, and verification for any mission.

## Recovery

When chat/sandbox context is lost or source identity is ambiguous, prefer recovery in this order:

```text
commit / PR head
    > immutable Git or Actions artifact
    > surviving sandbox working tree
    > conversation reconstruction
```

Never delete unfamiliar remote state merely because it appears old.
