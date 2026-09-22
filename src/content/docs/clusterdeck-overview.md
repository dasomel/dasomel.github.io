---
title: ClusterDeck 개요
description: 변하는 VM·Kubernetes 환경을 Profile 중심으로 연결하는 macOS workstation access layer.
project: ClusterDeck
path: clusterdeck/overview
order: 1450
lastModified: 2026-09-22
---

# ClusterDeck 개요

ClusterDeck은 자주 재생성되는 VM과 Kubernetes 환경의 **접속 경로를 안정화**하는 macOS 중심 데스크톱 도구입니다.

핵심 사용 단위는 IP가 아니라 **Profile**입니다. Profile은 환경의 이름, host 집합, SSH 접근 경로, bastion 여부, remote kubeconfig 위치와 local context를 묶습니다.

```text
Environment Profile
  ├─ Hosts
  ├─ SSH / ProxyJump
  ├─ Remote kubeconfig
  └─ Kubernetes verification
```

ClusterDeck은 Kubernetes 리소스 관리 콘솔이 아닙니다. 사용자가 `kubectl`, 기존 운영 UI, 개발 도구를 사용할 수 있도록 **연결 가능한 상태까지 만드는 것**이 제품 경계입니다.

## 첫 검증된 성공(First Verified Success)

데스크톱 앱이 뜨는 것만으로는 완료가 아닙니다. 한 Profile이 다음 세 계층을 모두 실제로 통과해야 "첫 검증된 성공"입니다.

1. **SSH** — bastion을 거치든 직접이든 대상 host에 실제로 닿는다.
2. **kubeconfig** — remote kubeconfig를 가져와 credential을 로그·문서에 노출하지 않고 local Profile로 normalize한다.
3. **Kubernetes API** — normalize된 context로 `kubectl get nodes` 같은 실제 API 호출이 된다.

SSH만 성공하고 Kubernetes API가 실패하면 부분 연결일 뿐 성공한 Profile로 보지 않습니다.

## MVP 경계

- Profile CRUD
- host discovery 및 SSH connectivity probe
- 선택적 public-key bootstrap
- SSH alias / ProxyJump
- remote kubeconfig fetch 및 normalize
- Profile별 local kubeconfig
- `kubectl get nodes` 기반 connectivity verification

Cross-platform 및 provider-specific discovery는 core macOS workflow 안정화 이후 단계입니다.
