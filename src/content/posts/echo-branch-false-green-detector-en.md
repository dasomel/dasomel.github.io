---
title: "A CI Job Can Print FAIL and Still Report Success"
description: "How OpenForge's false-green detector grew from a swallowed `|| true` pattern to a second, structurally different shape, and the real narwhal/beluga bugs it caught along the way"
pubDate: 2026-09-24
tags: ["Open Source", "CI/CD", "OpenForge", "Testing", "Platform Engineering", "Evidence"]
featured: false
draft: false
---

A green CI check is supposed to mean "this passed." Two real bugs across OpenForge's downstream OSS portfolio showed that assumption breaking in two different ways — and neither involved a missing test.

## The first shape: a discarded exit code

The obvious version of this problem is a validator whose failure is thrown away on purpose:

```bash
markdownlint '**/*.md' || true
```

If `markdownlint` finds real errors, the shell still returns `0`, because `|| true` unconditionally overrides it. [OpenForge issue #71](https://github.com/dasomel/openforge/issues/71) tracked this exact case in narwhal's `lint.yml`: the `Markdown Lint (docs)` job was emitting real errors on `main` while reporting green.

The fix — [PR #86](https://github.com/dasomel/openforge/pull/86) — added a detector to OpenForge's portfolio audit (`templates/scripts/audit-agent-engineering.py`) that scans workflow files, verify scripts, and `.claude/commands/*.md` for validator/linter/test/build commands whose exit status is unconditionally discarded (`|| true`, `|| :`, `; exit 0`). It also had to *not* flag legitimate uses of the same idiom — `grep ... || true` on an expected empty match, or a diagnostic `kubectl get ... || true` printed after a failure was already recorded. [`tests/test_agent_engineering_audit.py`](https://github.com/dasomel/openforge/blob/main/tests/test_agent_engineering_audit.py) carries the regression fixtures for both the true positives and the allowed probes.

## The second shape: every branch prints something and exits 0

A week later, two unrelated repositories surfaced a different failure that the same detector didn't catch, because nothing was discarded — the script just never wired its own result to its own exit code.

narwhal's `Makefile` had this `validate` target ([tracked in #91](https://github.com/dasomel/openforge/issues/91), fixed in [narwhal PR #197](https://github.com/dasomel/narwhal/pull/197)):

```make
validate:
	@for f in gitops/apps/*.yaml gitops/resources/*.yaml; do \
		yq eval '.' "$$f" > /dev/null && echo "OK: $$f" || echo "FAIL: $$f"; \
	done
```

Both branches of `&&`/`||` end in `echo`, which always succeeds. So the loop printed `FAIL: <file>` on a malformed GitOps manifest and `make validate` still reported success — no `|| true` in sight. It was found independently, twice, by two fresh-session agents replaying the `narwhal-verification` and `narwhal-cluster-debug` skills as part of [OpenForge #54](https://github.com/dasomel/openforge/issues/54)'s skill-maturity replay pass.

A related version of the same failure family turned up in beluga at the same time: `make validate` had no check at all comparing `VERSIONS.md` (the documented single source of truth for image tags) against what the Helm charts actually deployed, so `python:3.11-slim` in the doc had silently drifted from `python:3.12-slim` in the manifests. [Beluga PR #128](https://github.com/dasomel/beluga/pull/128) closed that gap by adding the comparison.

[PR #92](https://github.com/dasomel/openforge/pull/92) extended `templates/scripts/swallowed_failure_detector.py` to catch the narwhal shape: a conditional (`&&`/`||`, or `if/else`) where every branch that reports a known validator's result ends in a command that itself succeeds, with no `exit $fail` anywhere after the loop. It reuses the existing validator-program classification from #71 so it doesn't fire on arbitrary `echo` usage, and it specifically treats yq's `... > /dev/null` syntax-check idiom as a validator call, narrower than the bare program name so ordinary `yq` data queries aren't misclassified.

## A review catch worth keeping the evidence for

The first version of the exit-status-propagation check in PR #92 had its own bug: the scan for a trailing `exit $fail` ran to the literal end of file, with no notion of "this Makefile target" or "this shell function" as a boundary. A two-target Makefile with the bug in target A and an unrelated `exit $$rc` in target B would suppress the real finding in A. An independent review pass caught it before the PR was pushed, and the fix — a shared `_block_tail()` helper that stops at the next non-tab line for Makefiles or the next function definition for shell scripts — shipped in the same PR, with two new regression tests reproducing the exact cross-target false negative.

```text
$ python3 -m pytest -q
207 passed, 4 subtests passed
```

## What the portfolio scan actually found

After [OpenForge PR #96](https://github.com/dasomel/openforge/pull/96) regenerated the portfolio matrix (`portfolio/agent-audit.json`) against the extended detector, the false-green count across the tracked repositories went from 0 to 12 — narwhal alone accounts for 4 of them, with one apiece in beluga, beluga-manager, kubemetal, clusterdeck, ldapium, nfs-quota-agent, egovframe-launcher, and siqoq.

Two of narwhal's four are still open as of this writing: `.claude/commands/check.md` and `.claude/commands/verify.md` both still contain the same `yq eval ... > /dev/null && echo "OK: $f" || echo "FAIL: $f"` pattern in their documented verification steps, unfixed even though the Makefile target it was copied from was. That's the honest state of the portfolio right now, not a claim that the problem is closed everywhere it was found — the detector's job is to keep it visible until it is.

## The pattern, not just the bug

Neither shape is exotic. Both are "the script prints the right thing" being treated as equivalent to "the script returns the right thing," in code that a human wrote and a human reviewed. A validator that can't fail is not a validator — it's a print statement wearing a validator's name, and the only way to keep a growing portfolio honest about that distinction is to check for it the same way you'd check for anything else the diff can't be trusted to self-report.
