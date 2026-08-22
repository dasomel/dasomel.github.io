---
title: GitHub Standard
description: GitHub Issue, PR, Actions, permissions, and change-management conventions.
project: OpenForge
path: openforge/standards/github
order: 1012
lastModified: 2026-08-22
---

# GitHub Standard

GitHub is the primary change-management surface for OpenForge projects.

## Pull requests

Changes should be reviewable, scoped, and linked to a problem or decision. PRs should explain impact, validation, security implications, and rollback considerations when relevant.

## Issues

Issues capture requirements, incidents, bugs, and engineering debt. Security-sensitive material should use the repository's private reporting path rather than public issues.

## Actions

Workflow permissions should be least-privilege. External inputs, forked PRs, caches, artifacts, and release credentials are treated as trust boundaries.

## Automation

Repository checks should fail early on invalid structure, naming conventions, unsafe supply-chain patterns, and required engineering contracts.

## Canonical source

[OpenForge GitHub Standard](https://github.com/dasomel/openforge/blob/main/docs/github.md)