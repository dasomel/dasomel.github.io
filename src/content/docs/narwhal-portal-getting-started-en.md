---
title: Development Setup
description: pnpm local setup, environment variables, and Skaffold live reload workflows.
project: Narwhal Portal
path: narwhal-portal/getting-started
order: 1202
lastModified: 2026-08-23
---

# Development Setup

Step-by-step guide for local portal development and cluster inner-loop workflows.

## 1. Standalone Execution (pnpm)

```bash
# Clone repository and install dependencies
git clone https://github.com/dasomel/narwhal-portal.git
cd narwhal-portal
pnpm install

# Setup local environment variables
cp .env.example .env.local

# Start development server on port 3000
pnpm dev
```

## 2. Skaffold Live Inner-Loop Development

Develop directly against your local Kubernetes cluster with automated synchronization:

```bash
# Start Skaffold dev mode with automatic port forwarding
skaffold dev --port-forward
```

- File modifications sync instantly into running development containers.
- Dependency changes automatically trigger incremental multi-stage image rebuilds.
