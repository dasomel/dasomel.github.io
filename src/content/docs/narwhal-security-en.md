---
title: Security & SSO
description: Keycloak OIDC, Istio Ambient ztunnel mTLS, OpenBao, and Kyverno governance.
project: Narwhal
path: narwhal/security
order: 1104
lastModified: 2026-08-23
---

# Security & SSO

Narwhal enforces zero-trust security principles across all layers of the platform stack.

## Core Security Pillars

1. **Centralized IAM & SSO (Keycloak)**:
   - Single Sign-On (SSO) across ArgoCD, Grafana, Gitea, and Narwhal Portal
   - Standardized OpenID Connect (OIDC) token federation
2. **Sidecar-Less mTLS (Istio Ambient)**:
   - Transparent L4 mutual TLS encryption handled by node-level `ztunnel` without sidecar memory overhead
   - 80% reduction in pod memory footprint
3. **Secret Governance (OpenBao)**:
   - Vault-compatible dynamic secret injection preventing hardcoded credentials
4. **Policy Enforcement (Kyverno)**:
   - Automated Pod Security Standards (PSS Baseline/Restricted) validation
   - Mandating non-root execution and read-only root filesystems
