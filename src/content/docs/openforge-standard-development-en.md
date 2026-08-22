---
title: Development Standard
description: Code quality, tests, tooling, and engineering change discipline.
project: OpenForge
path: openforge/standards/development
order: 1019
lastModified: 2026-08-22
---

# Development Standard

OpenForge expects development practices to make changes reproducible, reviewable, and maintainable.

## Baseline

- formatter and linter rules are source-controlled
- tests cover important behavior and regression cases
- local development commands are documented
- code intelligence and static analysis are used where practical
- generated code and repository tooling are treated as engineering assets

## Quality gates

CI should validate formatting, tests, static analysis, repository contracts, and security-sensitive checks before merge.

## Change evidence

Behavior changes should include tests or another explicit validation method. Large or risky changes should record design decisions and compatibility impact.

## Canonical source

[OpenForge Development Standard](https://github.com/dasomel/openforge/blob/main/docs/development.md)