---
title: Repository Standard
description: OSS repository structure, required files, and maintainability baseline.
project: OpenForge
path: openforge/standards/repository
order: 1011
lastModified: 2026-08-22
---

# Repository Standard

Repository structure is part of the project's engineering contract. A new contributor should be able to identify how to build, test, release, govern, and secure the project without reverse-engineering hidden conventions.

## Baseline

- predictable top-level structure
- README, license, security and contribution guidance
- issue and pull-request templates
- CODEOWNERS or an explicit ownership model where appropriate
- versioned automation and policy files
- reproducible developer setup
- no secrets or environment-specific credentials in source control

## Change discipline

Repository-wide configuration is executable behavior. Changes to workflow files, package manifests, scripts, hooks, or repository policies require impact analysis across every workflow that can consume them.

## Single-maintainer consideration

OpenForge does not require a fixed maintainer count. Controls scale according to change risk, automation coverage, and recovery capability.

## Canonical source

[OpenForge Repository Standard](https://github.com/dasomel/openforge/blob/main/docs/repository.md)