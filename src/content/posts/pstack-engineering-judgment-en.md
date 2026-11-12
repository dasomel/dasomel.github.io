---
title: "Distilling a 23-Playbook Plugin into 30 Lines: pstack and Engineering Judgment"
description: "A record of installing the pstack skill collection, removing it, and moving only its new ideas into the global prompts of three coding agents, with the selection criteria and how loading was verified"
pubDate: 2026-11-13
tags: ["AI Agent", "Claude Code", "Codex", "Prompt Engineering", "Context Engineering", "OpenForge", "Engineering Judgment"]
featured: false
draft: false
---

On 2026-11-13 I installed [pstack](https://github.com/cursor/plugins/tree/main/pstack) in Claude Code, read through it, and removed the plugin the same day. I kept only the parts that were new to me and moved them, in about 30 lines, into the global prompts of three agents. This post records what I took, what I left, and why. It is a record of a decision, not a results report, and I say so up front.

## What pstack is

pstack is a skill collection for AI coding agents published by Lauren Tan (poteto). Its motto is "if you want to go fast, go deep first." The version I examined was 0.15.36:

- A `/poteto-mode` entry skill that reads a request and routes it to one of 23 playbooks (feature, bug-fix, refactoring, shipping, and so on).
- 24 principle skills, each a one-page statement of a judgment rule such as "fix root causes" or "explain the number."
- Multi-model skills (arena, swarm, interrogate) that put the same problem to several models and compare.

I installed it with `/plugin marketplace add cursor/plugins` and `pstack@cursor-plugins`. It is MIT licensed.

## Why I did not keep the plugin

Two things bothered me after installing it.

1. **It overlaps with what I already run.** My setup already has orchestration built on oh-my-claudecode and superpowers. With two sets of rules for triage, delegation, and verification, the agent has to guess which one wins on every request.
2. **Its default routing points at a model that is not in my stack.** The default for delegated code work is a model I do not use. It can be reconfigured, but needing to reconfigure it told me this part was not for me.

The deeper reason is my own context-engineering rules: write judgment rather than rules, delete constraints that conflict, say a thing once, and size context files by cost because they are re-sent every turn. Loading 23 playbook bodies permanently runs against all of that, so I distilled instead.

## Where it went

Each agent reads its global instructions differently, so the text went into three files.

| File | Read by | What went in |
|---|---|---|
| `~/.claude/shared/worker-contract.md` | Claude sessions, and injected into Antigravity (agy) workers | Evidence rules, an "Engineering judgment" section |
| `~/.codex/AGENTS.md` | Codex | The same nine principles, inline (Codex has no `@import`) |
| `~/.claude/CLAUDE.md` | The Claude orchestrator | Rules for handling workers, and classifying a fork before asking the human |

One shared file that the others reference would be ideal. Codex cannot import, so only that copy is a manual summary, with a comment saying to sync it by hand.

## Selection criteria

I took only what was new, using three tests.

- It does not duplicate a rule I already have.
- I can say in a sentence or two what behavior changes.
- It is not tied to a particular vendor or tool.

## The nine principles

| Principle | What changes in practice |
|---|---|
| Smallest change, subtraction first | Remove dead weight before building; no speculative guards or abstractions. If the evidence rules out the requested change, show it and stop. |
| Root cause, not symptom | Reproduce first. Fix the first place the system went wrong, and every other instance of the same fault. |
| Attack the premise | After two failed fixes that share an assumption, write the assumption down and test it directly before a third attempt. |
| Build the lever | For repeated or non-trivial work, write a re-runnable script or check. A lesson written twice becomes a lint or check, not more prose. |
| Verifiable units | Small steps that each end in a check; verify one before starting the next. Failing test first. |
| Test behavior, not implementation | A test fails when behavior breaks and survives a refactor. Expected values come from the requirement, never from running the code under test. |
| Explain the number | Before trusting or reporting a measurement: what result would change a decision, run count and spread, what limits it, and whether it is really measuring errors, cached work, or code that never ran. |
| Shared state | Concurrent lanes get their own files, branches, and keys, merged at the read boundary. Operations converge when re-run or resumed after a crash. |
| Candor | "No" and "this does not earn its place" are valid answers. Agreement is not the default. |

The added text reads like this:

```text
Root cause, not symptom. Reproduce first. Fix the first place the system went wrong, and every
other instance of the same fault. A guard, retry, clamp, or swallowed error is a fix only when the
state it handles is legitimate.
```

Four more lines of evidence rules went in alongside. Check the real artifact, not a proxy (file mtimes, a worker's self-report, and cached output are proxies). Label every claim in the same sentence as measured, inferred, or a guess. Never hand over a check you could run yourself. Never cite a link or reference you did not read.

The orchestrator got five rules.

- It owns every worker's output: review the diff or evidence and write its own summary; never pass a worker's "done" through.
- A new round (fix, retry, follow-up) goes to a fresh worker with consolidated scope: the original brief, every later directive, the prior report and branch. Resume an existing worker only when the state lives in it.
- A deterministic script beats a fan-out.
- A second opinion is the same prompt to a different vendor; agreement is high-signal.
- Before asking the human, classify the fork. A fact observable by running something is not theirs to answer, so run it. Reversible work proceeds and gets reported. Ask only for product or preference calls, or before an irreversible or outward-facing action.

## One contradiction, resolved

An existing rule said "clamp values." pstack's root-cause principle says a clamp can hide a bug. They cannot both stand, so I rewrote the old sentence: validate and clamp at system boundaries, and trust internal types past them, because a clamp deeper in hides a bug. Deleting the older conflicting rule before adding the new one was the "delete conflicting constraints" rule applied to itself.

## What I left out

- **Vendor-specific model routing.** I already have a routing doctrine, and model names churn.
- **Cursor-only features.** pstack's own Claude Code adapter notes that those steps are skipped.
- **English prose-style rules.** My writing and conversations are not English-first, so they do not fit.
- **The 23 playbook bodies.** Too expensive to load permanently, and they overlap with my orchestration.
- **The "proceed with commits and external actions without asking" autonomy.** It conflicts with my existing "never push or commit unless asked" rule, so the existing rule stayed.

## How I checked that it loads

Instructions are not read just because they were written, so I checked three things.

1. A fresh Claude session was asked to list the titles of the new section from its standing instructions. It returned all nine.
2. A Codex run (lightweight model, no tools) was asked the same and also returned all nine.
3. I assembled the Antigravity worker context and confirmed it contains the new text. The agy model itself was not invoked.

I also confirmed that the auto-managed oh-my-claudecode block in CLAUDE.md is byte-identical to its backup, so the edits stayed outside it.

## Limits

To be plain about it: **I have not measured any effect on agent behavior or output quality.** The checks above show only that the text is loaded. Loading is not compliance. This post records what I adopted and why; whether it helps is a hypothesis I will test by using it.

I am also proposing the same guidance to the OpenForge standards repo as [`docs/engineering-judgment.md`](https://github.com/dasomel/openforge/blob/main/docs/engineering-judgment.md). That change is being added and may still be under review when you read this.

The original is at [pstack](https://github.com/cursor/plugins/tree/main/pstack). My descriptions are in my own words from reading the installed copy, and I did not quote the source at length.
