---
title: GitHub Standard
description: GitHub Issues, pull requests, Actions, permissions, and change-management conventions.
project: OpenForge
path: openforge/standards/github
order: 1012
lastModified: 2026-08-22
---

# GitHub Standard

GitHub is the primary change-management surface for OpenForge projects.

## Pull requests

Changes should be reviewable, scoped, and tied to a problem or decision. PRs should describe impact, validation, security implications, and rollback considerations when relevant.

## Issues

Issues capture requirements, incidents, bugs, and engineering debt. Security-sensitive reports should use the repository's private reporting path.

## Actions

Workflow permissions follow least privilege. Forked PRs, caches, artifacts, external inputs, and release credentials are treated as explicit trust boundaries.

## Automation

Repository checks should fail early on invalid structure, naming conventions, unsafe supply-chain patterns, and required engineering contracts.

## Canonical source

[OpenForge GitHub Standard](https://github.com/dasomel/openforge/blob/main/docs/github.md)