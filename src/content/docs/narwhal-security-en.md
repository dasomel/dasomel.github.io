---
title: Security & SSO
description: Keycloak OIDC, OpenBao secrets, and Kyverno policy governance.
project: Narwhal
path: narwhal/security
order: 1100
lastModified: 2026-08-23
---

# Security & SSO

Zero-trust security principles are applied across all platform layers.

## Security Components
- **IAM / SSO**: Keycloak centralized identity provider with OIDC federation
- **Secrets Management**: OpenBao (Vault fork) managing short-lived dynamic credentials
- **Policy Engine**: Kyverno enforcing Pod Security Standards (PSS) admission rules
- **Certificates**: cert-manager managing automated internal CA certificate lifecycles

## Related Links

- [Narwhal Repository](https://github.com/dasomel/narwhal)
- [Narwhal English Portal](/oss/en/narwhal/)
