---
title: 네트워크 및 Ingress
description: Cilium eBPF CNI, MetalLB L2 로드밸런싱, APISIX API Gateway 및 DNS.
project: Narwhal
path: narwhal/networking
order: 1103
lastModified: 2026-08-23
---

# 네트워크 및 Ingress

Narwhal은 iptables 오버헤드를 완전히 제거한 eBPF 기반 초고속 네트워킹과 엔터프라이즈 API Gateway를 결합합니다.

## eBPF 기반 네트워킹 (Cilium)

- **Kube-proxy Replacement**: iptables 규칙 검색 없이 BPF 맵을 통한 O(1) 서비스 로드밸런싱
- **eBPF Host Routing**: 노드 간 패킷 전송 시 커널 네트워크 스택 우회로 레이턴시 30% 단축
- **L3/L4/L7 NetworkPolicy**: 네임스페이스 격리 및 API 엔드포인트 단위의 정밀한 트래픽 필터링

## 트래픽 인그레스 (MetalLB + APISIX)

1. **MetalLB L2 Mode**: 클러스터 외부 네트워크(`192.168.56.200`)에서 트래픽을 수신하여 APISIX Gateway로 전달
2. **Apache APISIX**: SSL/TLS 종단, Keycloak OIDC 토큰 검증, Rate Limiting 및 업스트림 서비스 동적 라우팅
3. **dnsmasq 로컬 DNS**: `*.local.narwhal.internal` 와일드카드 도메인을 `192.168.56.200`으로 자동 확인

```text
클라이언트 브라우저 (https://argocd.local.narwhal.internal)
                         │
                         ▼ (DNS: 192.168.56.200)
             MetalLB LoadBalancer Pool
                         │
                         ▼
             Apache APISIX Gateway (Port 443)
                         │
       ┌─────────────────┴─────────────────┐
       │ (OIDC Auth Header Check)          │ (Internal Service Route)
       ▼                                   ▼
  Keycloak IdP (Verify Token)         Argo CD Server (Port 8080)
```
