---
title: "2026년 8월 OSS 구현 현황 — 아이디어가 아니라 main에 들어간 것들"
description: "Narwhal, NFS Quota Agent, KubeMetal, ldapium, OpenForge의 2026년 8월 현재 구현 상태를 실제 main과 검증 근거 기준으로 다시 정리했다."
pubDate: 2026-08-28
tags: ["Open Source", "Kubernetes", "Platform Engineering", "MLOps", "OpenLDAP", "AI Engineering"]
featured: true
draft: false
---

## 왜 다시 정리했나

최근 여러 OSS를 동시에 개발하면서 한 가지 문제가 생겼습니다.

코드는 빠르게 바뀌는데 README, 프로젝트 소개, 블로그가 그 속도를 따라가지 못하면 외부에서 보는 프로젝트와 실제 `main`의 모습이 달라집니다.

그래서 이번에는 로드맵이나 이슈가 아니라 **현재 default branch에 실제로 들어간 구현과 재현 가능한 검증 근거**만 기준으로 다시 정리했습니다.

기준은 단순합니다.

```text
Implementation
   ↓
Evidence / Test
   ↓
OSS Documentation
   ↓
Blog / Storytelling
```

아직 이슈에만 있는 기능이나 설계 문서만 존재하는 기능은 여기서 `implemented`라고 부르지 않습니다.

---

## Narwhal — 플랫폼을 설치하는 것보다 통합을 검증하는 쪽으로

[Narwhal](https://github.com/dasomel/narwhal)은 이제 단순히 많은 Cloud Native 컴포넌트를 묶은 Kubernetes 배포 프로젝트라고 설명하기 어렵습니다.

현재 `main`의 핵심은 **integration seam을 반복해서 검증하는 IDP**입니다.

현재 README가 기록하는 구현 규모는 다음과 같습니다.

- 35개 GitOps-managed applications
- 51개 CI regression checks
- 120+ live cluster verification checks
- 49개 SSO verification checks
- 263개 integration incident records
- air-gap bundle에 104 container images와 27 Helm charts

여기서 가장 중요한 것은 숫자 자체보다 장애를 테스트로 바꾸는 방식입니다.

```text
Incident
  → Lesson
  → Discriminator
  → Regression Check
  → Upgrade Gate
```

즉 "한 번 해결한 장애"를 문서에서 끝내지 않고 다음 업그레이드에서 다시 깨지는지 자동으로 확인합니다.

현재 Kubernetes v1.35 HA control plane 위에 Cilium/Hubble, kube-vip, MetalLB, APISIX, Argo CD/Gitea, Keycloak, Istio Ambient, Prometheus/Grafana/Loki/Tempo, Harbor, OpenBao, Kyverno, SeaweedFS, Velero, CloudNative-PG와 Narwhal Portal까지 하나의 운영 경계로 다룹니다.

최근에는 OpenForge baseline도 반영해서 문서 naming, Security Policy, GitHub templates와 공통 engineering 규칙까지 맞추기 시작했습니다.

상세 현재 상태: [Narwhal IMPLEMENTATION-STATUS](https://github.com/dasomel/narwhal/blob/main/docs/IMPLEMENTATION-STATUS.md)

---

## NFS Quota Agent — PVC의 숫자를 실제 파일시스템 제한으로

[NFS Quota Agent](https://github.com/dasomel/nfs-quota-agent)는 여전히 문제 정의가 가장 명확한 프로젝트 중 하나입니다.

Kubernetes PVC가 `10Gi`라고 적혀 있어도 NFS 서버의 실제 디렉터리에 그 제한이 자동 적용되는 것은 아닙니다.

이 프로젝트는 그 차이를 NFS 서버 측 파일시스템에서 직접 메웁니다.

현재 구현 범위는:

- XFS project quota
- ext4 project quota
- Btrfs qgroup quota
- CSI NFS / native NFS path mapping
- PV annotation 기반 적용 상태
- NFS server node 전용 DaemonSet
- Prometheus metrics / ServiceMonitor / PrometheusRule
- Web UI
- audit log / usage history
- orphan cleanup + dry-run
- advisory namespace quota policy

까지 확장됐습니다.

최근에는 supply-chain 쪽도 강화해서 CI outbound traffic을 실제 allowlist로 제한하는 egress control까지 `main`에 반영했습니다.

여기서 중요한 경계는 Kubernetes controller처럼 보여도 실제로는 **Linux filesystem을 변경하는 privileged storage agent**라는 점입니다. 그래서 nodeSelector와 hostPath 범위가 단순 배포 옵션이 아니라 보안 설계입니다.

상세 현재 상태: [NFS Quota Agent IMPLEMENTATION-STATUS](https://github.com/dasomel/nfs-quota-agent/blob/main/docs/IMPLEMENTATION-STATUS.md)

---

## KubeMetal — Kubernetes와 Apple GPU를 억지로 한곳에 넣지 않기

[KubeMetal](https://github.com/dasomel/kubemetal)의 가장 중요한 구현은 여전히 **Control / Compute Separation**입니다.

```text
Colima / K3s
  → MLflow / SeaweedFS / control-plane services

macOS Host
  → MLX / Metal / fine-tuning / serving
```

Apple Silicon의 Metal GPU를 Linux VM의 Kubernetes Pod로 넘기기 어렵기 때문에, GPU 작업은 macOS host process로 실행하고 Kubernetes는 MLOps control plane을 담당합니다.

현재 앱에는 8개 workspace가 구현돼 있습니다.

- Dashboard
- kagent Ops
- Pipeline
- Model Hub
- MLX Studio
- Data
- Access Console
- Air-Gap Management

Model Hub에서 Hugging Face 모델을 가져오고, host MLX에서 LoRA fine-tuning을 수행하고, MLflow에 등록하고, model serving까지 이어지는 흐름이 실제 앱 경계 안에 있습니다.

외부 Kubernetes cluster는 기본적으로 full-stack을 덮어씌우지 않습니다. D30 모델에서는 kagent agent만 설치하고 KubeMetal은 diagnostics/operations surface로 동작합니다. 필요한 경우에만 D26 full-stack external deployment를 선택하며, 이 경우 StorageClass, Kyverno, Argo CD ownership, bridge reachability 등을 preflight에서 확인합니다.

또 하나 실제로 중요했던 부분은 macOS code signing이었습니다. packaged app에서 LAN Kubernetes API에 접근하려면 local-network permission identity가 안정적이어야 해서 signing이 배포 품질이 아니라 기능 경계가 됐습니다.

상세 현재 상태: [KubeMetal IMPLEMENTATION-STATUS](https://github.com/dasomel/kubemetal/blob/main/docs/IMPLEMENTATION-STATUS.md)

---

## ldapium — "OpenLDAP 이미지"에서 운영 가능한 디렉터리 스택으로

[ldapium](https://github.com/dasomel/ldapium)은 최근 가장 빠르게 범위가 넓어진 프로젝트입니다.

처음에는 OpenLDAP 2.6.14를 upstream source에서 직접 빌드하고 Helm과 UI를 제공하는 packaging 프로젝트에 가까웠습니다. 지금 `main`은 그보다 훨씬 많은 운영 검증을 포함합니다.

### TLS

현재는 단순 LDAPS 지원이 아니라:

- TLS 1.2 protocol floor
- explicit cipher baseline
- certificate expiry E2E
- rolling certificate rotation
- two-step CA rotation
- StartTLS 389 live verification
- optional mTLS / SASL EXTERNAL

까지 검증합니다.

특히 mTLS는 구현하면서 중요한 경계를 발견했습니다. trusted CA가 서명한 인증서가 `authzRegexp`에 매핑되지 않아도 raw certificate subject identity로 인증될 수 있어서, client CA를 디렉터리 전용으로 좁혀야 한다는 운영 조건까지 문서화했습니다.

### Authorization / Audit

또한:

- LDAP ACL negative tests
- auditlog write attribution
- accesslog read/bind auditing
- failed bind evidence
- rootdn / normal-user actor distinction
- unified NDJSON audit export
- replication conflict raw evidence
- HTTP internal error redaction
- DIT browser의 `userPassword` redaction

까지 들어갔습니다.

### 실제 운영 검증

운영 쪽도 초기 smoke test를 넘어섰습니다.

- scheduled backup integrity manifest
- 3-node DR recovery
- 실제 OpenLDAP 이전 버전 → 현재 버전 rolling upgrade
- upgrade 중 write availability 측정
- network partition chaos
- same-entry replication conflict
- offline install with `imagePullPolicy=Never`
- `cn=config` drift detection
- kubeconform rendered-manifest validation
- 20K / 1M entry scale benchmark tooling
- Playwright browser E2E

이 정도가 되면서 ldapium은 "OpenLDAP Docker image"보다 **directory server 운영 계약과 실패 경계를 테스트하는 프로젝트**라고 보는 편이 더 정확해졌습니다.

상세 현재 상태: [ldapium IMPLEMENTATION-STATUS](https://github.com/dasomel/ldapium/blob/main/docs/IMPLEMENTATION-STATUS.md)

---

## OpenForge — 문서 표준에서 executable portfolio governance로

[OpenForge](https://github.com/dasomel/openforge)도 성격이 달라졌습니다.

처음에는 OSS repository structure, CI/CD, security, documentation 같은 공통 기준을 모으는 blueprint 성격이 강했습니다.

현재는 그 기준을 **실제로 여러 repository에 적용하고 측정하는 실행형 governance 도구**까지 포함합니다.

현재 구현에는:

- repository / docs / CI / security / supply-chain standards
- Agent Engineering standard
- AI/plugin trust boundary
- ADR governance
- design-system standard + Figma reference
- branch-protection standard
- AGENTS / CODING_STANDARDS / DESIGN / ADR templates
- portable portfolio audit engine
- stable metric IDs
- scorecard / delta comparison
- gap issue generation
- parser / false-positive regression fixtures

가 포함돼 있습니다.

portfolio audit은 현재 14개 repository와 35개 engineering/maturity metric을 기준으로 동작하고, 첫 adoption wave 이후 scorecard에는 61.6% adoption snapshot이 기록돼 있습니다.

중요한 변화는 OpenForge가 더 이상 "이렇게 하면 좋다"는 문서만 제공하지 않는다는 점입니다.

```text
Standard
   ↓
Executable Check
   ↓
Portfolio Audit
   ↓
Gap Issue
   ↓
Repository Adoption
```

Narwhal, NFS Quota Agent, ldapium 등에도 실제 baseline이 적용되기 시작했습니다.

상세 현재 상태: [OpenForge IMPLEMENTATION-STATUS](https://github.com/dasomel/openforge/blob/main/docs/IMPLEMENTATION-STATUS.md)

---

## 공통적으로 바뀐 개발 방식

이번에 여러 프로젝트를 다시 보면서 공통점이 하나 생겼습니다.

기능 목록을 늘리는 것보다 **실제로 동작한다고 말할 수 있는 근거를 남기는 것**에 더 많은 비중을 두기 시작했습니다.

예전에는:

```text
구현 → README 한 줄
```

이었다면 지금은 점점:

```text
구현
  ↓
negative / live / regression test
  ↓
운영 경계 기록
  ↓
README / architecture / operations 문서
  ↓
블로그
```

형태가 되고 있습니다.

앞으로도 블로그에는 이슈에 적어둔 계획보다 **main에 들어간 구현, 실패하면서 확인한 경계, 재현 가능한 증거**를 중심으로 기록하려고 합니다.
