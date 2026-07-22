---
title: "Networking"
description: "Network architecture and access configuration guide for the Narwhal cluster (Cilium, MetalLB, APISIX)"
project: "Narwhal"
order: 102
lastModified: 2026-07-17
---

## Network Stack Summary

The Narwhal cluster constructs its network layer using a high-performance eBPF-based CNI and an L2 load balancer.

| Component | Version | Role |
|---|---|---|
| **Cilium** | v1.19.4 | CNI plugin, operates in kube-proxy replacement mode |
| **Hubble** | v1.19.4 | Network traffic observability and visualization |
| **MetalLB** | v0.16.1 | Bare-metal LoadBalancer using L2 mode (`192.168.56.200`) |
| **kube-vip** | v1.1.2 | Provides a VIP for Control Plane high availability (`192.168.56.100`) |
| **APISIX** | 3.15.0 | API Gateway and OIDC authentication handling |

## Traffic Routing Flow

Client requests are routed from DNS resolution, through the APISIX gateway, and finally to the backend pods.

1. **DNS Resolution**: Browser request → `dnsmasq` (Master-1/2/3) → Resolves the `*.local.narwhal.internal` domain to `192.168.56.200`
2. **Load Balancing**: MetalLB ingresses the `192.168.56.200` traffic into the APISIX LoadBalancer service via L2 Advertisement
3. **Routing & Gateway**: APISIX routes to the backend service based on the Hostname defined in the `ApisixRoute` CRD configurations
4. **Authentication**: Integrated Keycloak OIDC authentication via the APISIX `openid-connect` plugin

## Control Plane HA (kube-vip)

- **Static Pod Configuration**: kube-vip runs as a Static Pod prior to the API server bootstrap phase.
- **ARP Leader Election**: Performs ARP-based leader election among the 3 master nodes to assign the `192.168.56.100` VIP to the active node.
- Immediately fails over the VIP to another master node in the event of a node failure.

## Local DNS Configuration (dnsmasq)

To facilitate smooth domain access in a development environment, dnsmasq runs on the master nodes to resolve the `.internal` top-level domain.

- **Reserved TLD**: `local.narwhal.internal` is an ICANN reserved private domain, preventing conflicts with public DNS resolution.
- **Client Configuration**: For macOS, it is recommended to create the `/etc/resolver/local.narwhal.internal` file and specify the Master node IPs (e.g., `192.168.56.10`) as nameservers.
- **Worker Node DNS**: The worker node's `systemd-resolved` forwards `*.local.narwhal.internal` requests to the master's dnsmasq to support image pulls from the Harbor registry.

## APISIX API Gateway & OIDC

Deployed in the `platform-system` namespace, APISIX handles routing and SSO authentication uniformly using the `ApisixRoute` CRD.

<Mermaid chart={`sequenceDiagram
  participant U as "Browser"
  participant GW as "APISIX<br/>(openid-connect)"
  participant IDP as "Keycloak"
  participant APP as "Backend Service"

  U->>GW: "1. HTTP Request (Unauthenticated)"
  GW->>U: "2. Redirect to Keycloak Login"
  U->>IDP: "3. User Authenticates"
  IDP-->>U: "4. Redirect to Callback (Code)"
  U->>GW: "5. Callback Request (with Code)"
  GW->>IDP: "6. Exchange Code for Token"
  IDP-->>GW: "7. Return Token"
  GW->>APP: "8. Proxy Request"
  APP-->>U: "9. Return Response"
`} />

```yaml
# ApisixRoute Example
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: argocd
  namespace: devtools
spec:
  http:
    - name: argocd
      match:
        hosts:
          - "argocd.local.narwhal.internal"
        paths:
          - "/*"
      backends:
        - serviceName: argocd-server
          servicePort: 80
```

- **TLS**: Performs TLS termination based on self-signed certificates via the `ApisixTls` CRD.
- **Known Issue**: `apisix-etcd` uses an `emptyDir` volume. Data is wiped upon pod restart, and due to a bug in the Ingress Controller (v1.8.0), an "empty prefix returns HTTP 404" issue can occur. This causes the controller to fall into a deadlock state during the bootstrap phase, preventing synchronization of new routing rules. Recovery requires inserting dummy route data into etcd (refer to `apisix-etcd-recovery.md`).
