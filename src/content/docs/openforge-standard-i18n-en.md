---
title: Internationalization Standard
description: Multilingual UI resource structures, translation keys, and locale consistency.
project: OpenForge
path: openforge/standards/i18n
order: 1037
lastModified: 2026-08-22
---

# Internationalization Standard

Internationalization should be designed from the beginning for applications with a user interface.

## Initial locales

```text
en-US — English
ko-KR — 한국어
```

## Rules

- Detect browser locale on first visit.
- Allow manual locale selection.
- Persist the selected locale.
- Never hard-code user-facing strings.
- Use translation keys.
- Localize dates, times and numbers appropriately.
- Keep backend APIs and domain models locale-neutral.
- Do not translate real resource names such as topics, tables, jobs or namespaces.
- Add both English and Korean translations for every new user-facing key.
- CI should detect missing translation keys when practical.

## Resources

```text
locales/
├── en-US/
└── ko-KR/
```

## Canonical source

- [Internationalization Standard](https://github.com/dasomel/openforge/blob/main/docs/i18n.md)
