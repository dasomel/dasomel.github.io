---
title: Regression & Chaos Testing
description: 263 incident lessons codified into 51 CI regression checks and Chaos Mesh.
project: Narwhal
path: narwhal/testing
order: 1108
lastModified: 2026-08-23
---

# Regression & Chaos Testing

Narwhal's core maintainability is driven by codifying real-world failure post-mortems into automated regression tests.

## Three-Tier Verification Suite

1. **Cluster Verification (120+ Checks)**:
   - Node kernel parameters, VIP responsiveness, CNI forwarding, DNS, and storage mount validation
2. **SSO & IAM Verification (49 Checks)**:
   - Keycloak OIDC issuance, OAuth2 Proxy cookie validation, and RBAC boundary testing
3. **CI Regression Suite (51 Checks)**:
   - 51 specialized checks derived from 263 incident root causes and discriminators

## Chaos Engineering with Chaos Mesh

- **Network Partition Injections**: Verifying etcd quorum resilience during master node drops
- **Pod Failure Experiments**: Validating zero-downtime traffic ingress during APISIX pod crashes
