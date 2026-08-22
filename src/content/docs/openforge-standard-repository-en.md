---
title: Repository Standard
description: Repository structure, required files, and maintainability baseline for OSS.
project: OpenForge
path: openforge/standards/repository
order: 1011
lastModified: 2026-08-22
---

# Repository Standard

Repository structure is part of the engineering contract. Contributors should be able to discover how to build, test, release, govern, and secure the project without reverse-engineering hidden conventions.

## Baseline

- predictable top-level structure
- README, license, security, and contribution guidance
- issue and pull-request templates
- explicit ownership where appropriate
- versioned automation and policy files
- reproducible developer setup
- no secrets or environment credentials in source control

## Change discipline

Repository configuration is executable behavior. Workflow files, manifests, scripts, hooks, and policies require impact analysis across every workflow that can consume them.

## Maintainer model

OpenForge does not require a fixed maintainer count. Governance scales with change risk, automation coverage, and recovery capability.

## Canonical source

[OpenForge Repository Standard](https://github.com/dasomel/openforge/blob/main/docs/repository.md)