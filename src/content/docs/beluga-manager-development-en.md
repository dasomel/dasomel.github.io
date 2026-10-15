---
title: Local Development Guide
description: Running and verifying the Domain API and web console from manager/ in the beluga repository.
project: Beluga
path: beluga/manager-development
order: 1507
lastModified: 2026-10-15
---

# Local Development Guide

There is nothing separate to clone. Clone beluga and run every command from `manager/`. Node.js 22 or newer is required, and `manager/` is an npm workspace with its own `package.json` and lockfile.

```bash
git clone https://github.com/dasomel/beluga.git
cd beluga/manager
npm install
```

## Layout

```text
manager/
├── packages/
│   ├── web/              # React 19 + Vite SPA
│   ├── domain-api/       # Hono + @hono/zod-openapi
│   └── policy-compiler/  # policyctl CLI
└── docs/adr/             # Architecture Decision Records
```

## Run

```bash
npm run dev       # web console at http://localhost:5180
npm run dev:api   # Domain API at http://localhost:8787 (API docs: /api/v1/docs)
```

By default the API returns fixtures from `packages/domain-api/src/stub-data/`, so no Beluga cluster is needed. This setup shows UI/API behavior only and is not evidence of real upstream integration. The frontend origin (5180) and API address (8787) are fixed by CORS and `config.json`.

## Verify

```bash
npm run typecheck
npm test
npm run build
npm run audit                    # dependency vulnerability and license policy
npm run policyctl               # policy compiler CLI
make verify                      # docs and repository structure checks
make dev-up / make dev-down      # containerized stack via compose
```

CI is the root `.github/workflows/manager-ci.yml`, which runs only for `manager/**` changes (`working-directory: manager`). Repository-wide checks (lint, docs, SAST) also cover `manager/`.

Issues are tracked in beluga with the `area:manager` label. The 22 open beluga-manager issues were transferred as #239-#260.
