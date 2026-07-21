---
title: "네트워킹"
description: "Narwhal 클러스터의 네트워킹 스택 및 접근 설정 (Cilium, MetalLB, APISIX)"
project: "Narwhal"
order: 102
lastModified: 2026-07-17
---

## 네트워크 스택 요약

Narwhal 클러스터는 고성능 eBPF 기반 CNI와 L2 로드밸런서를 통해 네트워크 계층을 구성합니다.

| 컴포넌트 | 버전 | 역할 |
|---|---|---|
| **Cilium** | v1.19.4 | CNI 플러그인, kube-proxy 대체 모드로 동작 |
| **Hubble** | v1.19.4 | 네트워크 트래픽 관찰 및 시각화 |
| **MetalLB** | v0.16.1 | L2 모드 기반 Bare-metal LoadBalancer (`192.168.56.200`) |
| **kube-vip** | v1.1.2 | 컨트롤 플레인 고가용성 보장을 위한 VIP 제공 (`192.168.56.100`) |
| **APISIX** | 3.15.0 | API Gateway 및 OIDC 인증 처리 |

## 트래픽 라우팅 흐름

클라이언트 요청은 DNS 해석부터 APISIX 게이트웨이를 거쳐 최종 백엔드 파드로 전달됩니다.

1. **DNS Resolution**: 브라우저 요청 → `dnsmasq` (Master-1/2/3) → `*.local.narwhal.internal` 도메인을 `192.168.56.200`으로 해석
2. **Load Balancing**: MetalLB가 L2 Advertisement를 통해 `192.168.56.200` 트래픽을 APISIX 로드밸런서 서비스로 인입
3. **Routing & Gateway**: APISIX가 `ApisixRoute` CRD 설정을 기반으로 Hostname에 따라 백엔드 서비스로 라우팅
4. **Authentication**: APISIX `openid-connect` 플러그인을 통한 Keycloak OIDC 통합 인증

## Control Plane HA (kube-vip)

- **정적 파드 구성**: kube-vip는 API 서버 부트스트랩 이전 단계에서 정적 파드(Static Pod) 형태로 실행됩니다.
- **ARP Leader Election**: 3대의 마스터 노드 간에 ARP 기반 리더 선출을 수행하여 `192.168.56.100` VIP를 활성 노드에 할당합니다.
- 노드 장애 발생 시 즉각적으로 VIP를 다른 마스터 노드로 절체(Failover)합니다.

## 로컬 DNS 구성 (dnsmasq)

개발 환경에서의 원활한 도메인 접속을 위해 마스터 노드에서 dnsmasq를 구동하여 `.internal` 최상위 도메인을 처리합니다.

- **예약된 TLD**: `local.narwhal.internal`은 ICANN 예약 사설 도메인으로, 공개 DNS 해석 충돌을 방지합니다.
- **클라이언트 설정**: macOS의 경우 `/etc/resolver/local.narwhal.internal` 파일을 생성하여 Master 노드의 IP(예: `192.168.56.10`)를 네임서버로 지정하는 방식을 권장합니다.
- **워커 노드 DNS**: 워커 노드의 `systemd-resolved`는 `*.local.narwhal.internal` 요청을 마스터의 dnsmasq로 포워딩하여 Harbor 레지스트리 등의 이미지 풀을 지원합니다.

## APISIX API Gateway & OIDC

`platform-system` 네임스페이스에 배포된 APISIX는 `ApisixRoute` CRD를 사용하여 라우팅과 SSO 인증을 통합 처리합니다.

<Mermaid chart={`sequenceDiagram
  participant U as "Browser"
  participant GW as "APISIX<br/>(openid-connect)"
  participant IDP as "Keycloak"
  participant APP as "Backend Service"

  U->>GW: "1. HTTP 요청 (미인증)"
  GW->>U: "2. Keycloak 로그인 리다이렉트"
  U->>IDP: "3. 사용자 인증"
  IDP-->>U: "4. Callback 리다이렉트 (Code)"
  U->>GW: "5. Callback 요청 (Code 포함)"
  GW->>IDP: "6. Code를 Token으로 교환"
  IDP-->>GW: "7. Token 발급"
  GW->>APP: "8. 백엔드 라우팅"
  APP-->>U: "9. 응답 반환"
`} />

```yaml
# ApisixRoute 예시
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

- **TLS**: `ApisixTls` CRD를 통해 self-signed 인증서 기반 TLS 종료(Termination)를 수행합니다.
- **알려진 이슈**: `apisix-etcd`는 `emptyDir` 볼륨을 사용합니다. 파드 재시작 시 데이터가 초기화되며, Ingress Controller(v1.8.0)의 버그로 인해 "empty prefix returns HTTP 404" 문제가 발생할 수 있습니다. 이로 인해 컨트롤러가 부트스트랩(bootstrap) 단계에서 데드락 상태에 빠져 새로운 라우팅 규칙을 동기화하지 못하는 증상이 있으며, 임시 라우트 데이터를 etcd에 삽입하여 복구해야 합니다 (`apisix-etcd-recovery.md` 참조).
