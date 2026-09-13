---
title: "📚 10개 OSS를 다시 문서화하다 — 코드 상태에서 First Verified Success까지"
description: "Narwhal, Narwhal Portal, NFS Quota Agent, ldapium, kube-ready-box, ClusterDeck, Beluga, Beluga Manager, KubeMetal, OpenForge의 실제 소스와 문서 상태를 다시 검토하고, 문서 수가 아니라 Time to First Verified Success 중심으로 adoption journey를 재설계한 기록입니다."
pubDate: 2026-08-28
tags: ["Open Source", "Documentation", "Platform Engineering", "Kubernetes", "OpenForge", "Developer Experience", "AI-assisted Development"]
featured: true
draft: false
---

## 들어가며

OSS 문서가 많다고 해서 처음 온 사용자가 프로젝트를 이해하고 성공적으로 실행할 수 있는 것은 아닙니다.

이번에는 제가 운영하는 CnE OSS portfolio의 10개 프로젝트를 대상으로 README 개수나 문서 파일 존재 여부가 아니라 **실제 repository source와 검증 evidence를 기준으로 외부 사용자의 adoption journey를 다시 검토**했습니다.

검토 대상은 다음과 같습니다.

- Narwhal
- Narwhal Portal
- NFS Quota Agent
- ldapium
- kube-ready-box
- ClusterDeck
- Beluga
- Beluga Manager
- KubeMetal
- OpenForge

이번 작업의 기준은 한 문장으로 정리할 수 있습니다.

> **문서의 목표는 문서 수를 늘리는 것이 아니라 Time to First Verified Success를 줄이는 것이다.**

## 공통 문서 모델

10개 프로젝트를 같은 템플릿으로 만들지는 않았습니다. 대신 외부 사용자가 거쳐야 하는 흐름을 통일했습니다.

```text
Discover
  -> Understand
  -> Install
  -> Verify
  -> Operate
  -> Troubleshoot
  -> Contribute
```

그리고 README나 Quick Start가 단순히 설치 명령으로 끝나지 않도록 `Verify`를 제품별 성공 조건으로 정의했습니다.

## 프로젝트별 First Verified Success

### Narwhal

`kubectl get nodes`가 정상이라고 Narwhal 설치가 끝난 것은 아닙니다. Kubernetes, GitOps reconciliation, identity, 핵심 platform application, live verification이 함께 확인되어야 합니다.

그래서 cluster readiness와 **IDP integration success**를 분리했습니다. 정확한 버전은 `VERSIONS.md`를 source of truth로 유지하고, live cluster/SSO evidence를 별도 evidence class로 봅니다.

### Narwhal Portal

Next.js build 성공과 사용자의 Day-2 workflow 성공도 다릅니다. 인증 bootstrap 후 실제/통제된 backend data가 Dashboard 등 구현된 workspace에 표시되는 흐름을 첫 성공으로 잡았습니다. 구현 UI, fixture, planned UI도 문서에서 구분해야 합니다.

### NFS Quota Agent

이 프로젝트에서 가장 중요한 성공 조건은 DaemonSet `Running`이 아닙니다.

```text
PVC/PV
  -> NFS path mapping
  -> server-side quota applied
  -> capacity 초과 write
  -> filesystem enforcement 확인
```

unit/stub test, container command availability, Kubernetes integration, real quota-enabled filesystem E2E를 서로 다른 evidence class로 명시했습니다.

### ldapium

pod readiness 대신 실제 bind/read/write/deny behavior와 TLS/ACL/audit evidence를 확인하는 흐름을 adoption 기준으로 잡았습니다. replication, backup/restore, air-gap, mTLS는 standalone baseline 성공 이후 별도 trust boundary로 확장합니다.

### kube-ready-box

box download 성공이 아니라 VM 내부의 OS/architecture, filesystem/quota capability, Kubernetes prerequisite, 재생성 가능성을 확인해야 합니다. exact version은 release/Vagrant/Packer metadata가 source of truth가 되도록 합니다.

### ClusterDeck

초기 제품일수록 roadmap과 구현을 섞기 쉽습니다. 그래서 첫 성공을 아주 명확하게 정의했습니다.

```text
Profile
  -> SSH
  -> kubeconfig/context
  -> Kubernetes API
  -> harmless read
```

packaged app, screenshot, 지원 target도 실제 build/release evidence가 있을 때만 현재 기능으로 표현합니다.

### Beluga

Kafka, Flink, Trino, Airflow pod가 모두 healthy여도 data platform의 목적을 달성했다고 볼 수 없습니다. 작은 deterministic record를 실제 documented E2E data path로 흘려 최종 query/visualization까지 확인하는 것을 첫 성공으로 정의했습니다.

### Beluga Manager

아키텍처가 구현보다 앞서가는 초기 프로젝트이기 때문에 문서에 세 가지 상태를 사용하도록 했습니다.

```text
Implemented
Integrated
Planned
```

전체 target architecture가 완성되기 전에도 하나의 read-only vertical slice를 실행하고 검증할 수 있어야 합니다.

### KubeMetal

advanced external-cluster 시나리오보다 local-first path를 앞에 둡니다. Kubernetes/Colima/K3s의 control-plane 서비스와 macOS MLX/Metal native compute가 실제로 연결되는 작은 model/MLflow workflow를 첫 성공으로 봅니다.

mocked adapter나 healthy pod는 native ML runtime evidence를 대신하지 않습니다.

### OpenForge

OpenForge는 모든 standard를 repository에 한꺼번에 복사하는 프로젝트가 아닙니다.

하나의 실제 문제를 고르고, 하나의 standard/template을 적용하고, validator/audit으로 evidence를 확인하는 것이 첫 성공입니다. portfolio score도 제품 성숙도 점수가 아니라 **engineering standards compliance evidence**로 명확히 구분합니다.

## 문서가 코드보다 앞서가면 안 된다

이번 검토에서 가장 반복적으로 확인한 원칙은 `Implemented`와 `Planned`를 분리하는 것입니다.

AI-assisted development를 사용하면 코드와 문서가 빠르게 늘어납니다. 하지만 구현 예정인 architecture, placeholder screenshot, 아직 publish되지 않은 artifact, mock test로만 검증된 runtime을 현재 기능처럼 쓰기 쉬워집니다.

그래서 문서 claim도 evidence hierarchy를 가져야 합니다.

```text
Design / Issue
    ↓
Source implemented
    ↓
Static / unit verification
    ↓
Integration verification
    ↓
Runtime / E2E evidence
    ↓
Release / adoption evidence
```

상위 evidence가 없으면 더 강한 claim을 하지 않는 방식입니다.

## 공통 Documentation Information Architecture

앞으로 portfolio README와 사용자 문서는 가능한 범위에서 다음 순서로 수렴시킬 생각입니다.

```text
What / Why
Current status and scope
Prerequisites
Quick Start
Verify first success
Known limitations / compatibility
Architecture
Operations / troubleshooting
Documentation map
Contributing / support
License
```

중요한 것은 모든 repository가 똑같은 파일 구조를 갖는 것이 아닙니다. 각 프로젝트의 runtime과 사용자 경험은 다르지만, **처음 온 사람이 어디에서 시작하고 무엇을 성공으로 봐야 하는지는 빠르게 알 수 있어야 합니다.**

## OpenForge와 문서화

OpenForge의 documentation standard도 이 방향으로 바뀌고 있습니다.

기존에는 README, SECURITY, CONTRIBUTING, CHANGELOG 같은 파일 존재 여부가 중요한 baseline이었다면, 이제는 한 단계 더 나아가 외부 사용자의 adoption journey와 evidence quality를 봅니다.

```text
Repository source of truth
       ↓
Current implementation status
       ↓
Adoption guide
       ↓
First verified success
       ↓
Operations / troubleshooting
       ↓
Evidence-backed documentation refresh
```

문서도 release artifact와 마찬가지로 유지보수 대상입니다.

## 마무리

10개 OSS를 동시에 운영하면서 느낀 점은 문서화가 개발 마지막 단계의 정리 작업이 아니라는 것입니다.

좋은 문서는 프로젝트의 경계를 정의합니다. 무엇이 구현됐는지, 무엇이 아직 계획인지, 어떤 테스트가 어떤 claim을 증명하는지, 사용자가 어디까지 도달해야 첫 성공인지 설명합니다.

앞으로도 portfolio 전체에서 문서 수보다 다음 질문을 더 중요하게 보려고 합니다.

> **처음 온 사용자가 가장 짧은 경로로, 과장 없는 evidence를 가지고, 이 프로젝트의 실제 가치를 확인할 수 있는가?**

그 질문에 답할 수 있을 때 문서는 README를 넘어 실제 engineering interface가 됩니다.
