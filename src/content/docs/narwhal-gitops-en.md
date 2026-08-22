---
title: GitOps Workflow
description: Argo CD + Gitea App-of-Apps declarative delivery architecture.
project: Narwhal
path: narwhal/gitops
order: 1100
lastModified: 2026-08-23
---

# GitOps Workflow

All infrastructure and platform workloads in Narwhal are managed declaratively using Argo CD's App-of-Apps pattern.

## Deployment Flow
1. Application manifests defined in `gitops/applications/`
2. Git commits pushed to self-hosted Gitea
3. Argo CD Application Controller detects drift and executes automated sync
4. Sync Waves enforce strict ordering (CRDs → CNI/Storage → IAM → User Workloads)

## Related Links

- [Narwhal Repository](https://github.com/dasomel/narwhal)
- [Narwhal English Portal](/oss/en/narwhal/)
