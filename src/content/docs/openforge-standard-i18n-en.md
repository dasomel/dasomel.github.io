---
title: Internationalization Standard
description: Multilingual UI resource structures, translation keys, and locale consistency.
project: OpenForge
path: openforge/standards/i18n
order: 1037
lastModified: 2026-08-23
---

# Internationalization Standard

User-facing projects must design for internationalization from day one.

## i18n Standards

- **Core Locales**: English (`en-US`) and Korean (`ko-KR`) supported as baseline locales.
- **Modular Resource Bundles**: Translations maintained in structured JSON resource files (`messages/en.json`, `messages/ko.json`).
- **Missing Key Gating**: Automated CI checks ensure complete key parity across all supported languages.

## Canonical Source

- [Internationalization Standard](https://github.com/dasomel/openforge/blob/main/docs/i18n.md)
