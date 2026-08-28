---
title: ClusterDeck 아키텍처
description: Tauri UI, Rust core, OpenSSH, kubeconfig가 나뉘는 로컬 시스템 도구 아키텍처.
project: ClusterDeck
path: clusterdeck/architecture
order: 1451
lastModified: 2026-08-28
---

# ClusterDeck 아키텍처

ClusterDeck은 local systems tool의 보안 민감 작업을 Rust backend에 두고, React UI는 Profile과 상태를 표현하는 구조입니다.

```text
Tauri UI (React / TypeScript)
        ↓ Tauri Commands
Rust Application Core
  ├─ Profile Service
  ├─ Discovery Service
  ├─ SSH / Bastion Service
  ├─ Kubeconfig Service
  └─ Cluster Health Service
        ↓
OpenSSH / kubectl / local filesystem
```

## SSH 경계

MVP는 자체 SSH client를 다시 구현하지 않고 native OpenSSH를 우선 사용합니다. `ssh`, `scp`, `ssh-copy-id`, ProxyJump의 기존 동작을 재사용하고 ClusterDeck은 orchestration과 결과 상태를 담당합니다.

`~/.ssh/config` 전체를 재작성하지 않고 다음처럼 ClusterDeck 소유 파일만 관리하는 것이 기본 모델입니다.

```text
~/.ssh/config
  Include ~/.clusterdeck/ssh/*.conf
```

## kubeconfig 경계

remote control-plane host에서 kubeconfig를 가져와 parse/validation 후 endpoint 및 cluster/user/context 이름을 Profile 기준으로 normalize합니다. 생성 파일은 `~/.clusterdeck/kubeconfigs/`에 별도로 유지해 기존 사용자 kubeconfig를 함부로 덮어쓰지 않습니다.

## 검증

최소 상태는 SSH, kubeconfig, Kubernetes API를 구분해 보여줍니다.

```text
SSH             ✓
Kubeconfig      ✓
Kubernetes API  ✓
```
