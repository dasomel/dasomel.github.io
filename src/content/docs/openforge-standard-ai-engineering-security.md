---
title: AI-Assisted Engineering Security
description: Secure use of AI agents, skills, repository instructions, and generated changes.
project: OpenForge
path: openforge/standards/ai-engineering-security
order: 1018
lastModified: 2026-08-22
---

# AI-Assisted Engineering Security

OpenForge treats AI agents, repository-local instructions, plugins, and generated commands as potentially untrusted execution inputs.

## Trust model

AI output is not automatically trusted because it looks plausible or matches repository conventions. The final authority remains the repository's policies, tests, code review, and security controls.

## Agent boundaries

- limit credentials available to agents
- restrict filesystem and network access where practical
- review commands that mutate repositories or infrastructure
- separate planning from privileged execution
- keep generated changes attributable and reviewable

## Repository instructions

`AGENTS.md`, tool configuration, prompts, hooks, and scripts may influence execution. Treat them as code-adjacent control inputs and include them in change and supply-chain review.

## Verification

AI-assisted changes still pass the same build, test, security, supply-chain, and release gates as human-authored changes.

## Canonical source

[OpenForge AI-Assisted Engineering Security](https://github.com/dasomel/openforge/blob/main/docs/ai-engineering-security.md)