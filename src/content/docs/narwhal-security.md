---
title: "보안 & SSO"
description: "Keycloak OIDC 기반의 통합 인증 및 클러스터 전역 보안 하드닝"
project: "Narwhal"
order: 104
lastModified: 2026-07-17
---

## 통합 인증 (Single Sign-On)

Narwhal은 **Keycloak OIDC (OpenID Connect)**를 기반으로 클러스터 내 모든 주요 컴포넌트에 대한 통합 인증(SSO)을 제공합니다. 애플리케이션의 특징에 따라 두 가지 방식으로 SSO가 적용됩니다.

| 연동 방식 | 대상 애플리케이션 | 설명 |
|-----------|-------------------|------|
| **Native SSO (Group A)** | ArgoCD, Grafana, Gitea, Harbor, Headlamp, OpenBao | 각 애플리케이션이 자체적으로 제공하는 OIDC/OAuth 기능을 활용하여 Keycloak과 직접 통신합니다. |
| **APISIX OIDC (Group B)** | Hubble UI, Prometheus, Alertmanager, Velero UI | 자체 SSO를 지원하지 않는 애플리케이션들을 위해 APISIX API Gateway의 `openid-connect` 플러그인을 사용하여 앞단에서 인증을 처리합니다. |
| **Browser PKCE (Group C)** | Kubernetes Dashboard | 브라우저 기반의 PKCE(S256) 방식을 사용하여 클라이언트 시크릿 없이 안전하게 토큰을 교환합니다. |

모든 인증된 트래픽은 내부 Narwhal Root CA를 신뢰하도록 구성되어 있으며, 각 서비스별 전용 Keycloak Client와 시크릿 매퍼(Audience, Groups 등)가 자동 생성됩니다.

## 보안 컴포넌트

클러스터 전반의 시크릿 관리, 정책 집행, 인증서 발급은 다음 도구들이 담당합니다.

- **OpenBao:** 플랫폼의 중앙 시크릿 매니저입니다. OIDC 인증을 통해 UI 접근을 제어하며, Kubernetes-auth 기반의 동적 시크릿 주입을 수행합니다.
- **Kyverno:** Kubernetes 네이티브 정책 엔진으로, 클러스터 전반에 걸쳐 Admission(승인) 및 Background 정책을 강제합니다. (Fail-closed 방식으로 동작)
  - **의도된 예외 1건**: Chaos Mesh의 `chaos-daemon`은 다른 파드의 네트워크/IO 네임스페이스에 장애를 주입해야 하므로 `privileged` + `hostPID`가 필수입니다(차트 DaemonSet에 하드코딩되어 values로 끌 수 없음). 따라서 `disallow-privileged-containers` / `disallow-host-namespaces` 정책에서 **`chaos-testing` 네임스페이스에 한정해서만** 제외됩니다. 자세한 내용은 [테스트 & 카오스 엔지니어링](/ko/docs/narwhal-testing) 문서를 참고하세요.
- **cert-manager:** `ClusterIssuer` 및 `Certificate` CRD를 통해 클러스터 내 TLS 인증서의 발급 및 갱신을 자동화합니다. 내부 Root CA 및 `*.local.narwhal.internal` 와일드카드 인증서를 지원합니다.

## 컴플라이언스 하드닝 (Compliance Hardening)

Narwhal은 기본적으로 CIS Benchmark (1.23), NSA (1.0) 및 Pod Security Standards (PSS) 가이드를 준수하도록 하드닝되어 있습니다.

- **Control-plane 보호:** Kube API Server, Controller Manager, Scheduler에서 `--profiling=false`를 설정하여 불필요한 정보 노출을 차단합니다.
- **Secret 암호화 (At Rest):** 모든 Kubernetes Secret은 디스크 저장 시 `aescbc` 방식으로 암호화되며, 3개의 Master 노드 간에 동일한 암호화 키가 공유됩니다.
- **API 감사 로그 (Audit Logging):** `--audit-policy-file`을 적용하여 중요한 RBAC 및 Secret 접근은 메타데이터 로그를 남기고, 단순 헬스체크 트래픽은 무시하도록 설정했습니다.
- **노드 파일 권한 제어:** kubelet 설정 파일 및 정적 파드(Static Pod) 매니페스트 파일 등의 권한을 `chmod 600`으로 제한합니다.
- **워크로드 최소 권한 (Least Privilege):** Portal 및 Valkey 등의 워크로드는 `runAsNonRoot`, 모든 Capability 드롭, `allowPrivilegeEscalation: false`, `seccompProfile: RuntimeDefault` 정책을 적용받습니다.

> **예외 처리 (Risk-Accepted Exceptions):** CNI(Cilium), Service Mesh(Istio ztunnel), 스토리지 등 플랫폼 구동에 필수적인 시스템 파드들은 불가피하게 Privileged, hostNetwork, NET_ADMIN 등의 권한을 허용받도록 설계되어 있습니다.

## 실무 보안 적용 사례 (Security Posture in Practice)

개발 및 배포 과정에서 실제로 적용된 주요 보안 개선 사항은 다음과 같습니다.

- **평문 시크릿의 외부화:** Harbor에서 사용되던 3개의 평문 공유 시크릿을 `harbor-shared-secrets`라는 별도의 Kubernetes Secret 리소스로 분리했습니다 (16자리 `secretKey` 랜덤 생성 및 `existingSecret` 참조 활용).
- **Git 히스토리 영구 삭제:** GitHub 공개 리포지토리로 푸시하기 전, `git filter-repo` 도구를 사용하여 프로젝트 히스토리 전체에서 실수로 커밋된 평문 시크릿들을 완벽히 삭제(Purge)했습니다.
- **이미지 태그 불변성 (Immutability) 강제:** Harbor 배포 시 사용하던 모든 `:latest` 태그를 명시적인 버전(`:v2.15.1`)으로 고정(Pinning)했습니다.
  - **발생했던 문제 (Root Cause):** Base Box(`ubuntu-26.04-xfs`)의 containerd 캐시에 이미 `amd64` 아키텍처용 `:latest` 레이어가 구워져 있었습니다. `:latest` 태그는 변경 가능(Mutable)하므로 새 노드에서 이미지를 다시 가져오지 않았고, 이로 인해 `arm64` 기반 호스트에서 `exec format error`가 발생했습니다.
  - **해결 방안:** 특정 버전을 고정하여 containerd가 강제로 올바른 아키텍처의 이미지를 다시 Pull하도록 강제하여 문제를 해결했습니다.
