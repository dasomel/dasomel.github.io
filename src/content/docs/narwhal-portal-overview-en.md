---
title: Portal Overview
description: Narwhal Portal architecture, developer UX, and platform integration scope.
project: Narwhal Portal
path: narwhal-portal/overview
order: 1200
lastModified: 2026-08-23
---

# Portal Overview

**Narwhal Portal** is the centralized management portal and developer workbench for the Narwhal Kubernetes IDP.

## Core Value

1. **Single Pane of Glass**: Aggregates telemetry and management across 35 platform components into a unified interface.
2. **Next.js 16 & React 19 Stack**: Maximizes rendering performance via Server Components with fluid client interactions.
3. **Type-Safe gRPC Integration**: High-throughput, low-latency communication via compiled Protocol Buffers contracts.

## Core Feature Modules

- **Cluster Health Telemetry**: Real-time visualization of node resources, etcd status, and ingress health
- **GitOps Delivery Management**: Argo CD application status inspection and one-click reconciliation
- **IAM & Role-Based Access**: Role-based feature isolation governed by Keycloak OIDC session tokens
- **Release Catalog & Runbooks**: Platform changelog exploration and operational runbooks
