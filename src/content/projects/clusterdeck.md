---
title: "ClusterDeck"
description: "변하는 VM·Kubernetes 환경을 Profile 중심으로 발견하고 SSH·kubeconfig 연결을 자동화하는 macOS 데스크톱 도구"
github: "https://github.com/dasomel/clusterdeck"
tags: ["macOS", "Tauri", "Rust", "React", "TypeScript", "SSH", "Kubernetes", "kubeconfig", "ProxyJump"]
order: 5
type: "own"
featured: true
problem: "로컬 VM과 Kubernetes 실습·개발 환경을 자주 생성·삭제하면 IP가 바뀌고 SSH alias, Bastion/ProxyJump, 원격 kubeconfig, context 이름을 매번 수동으로 다시 연결해야 함"
solution: "사용자가 IP 대신 안정적인 Profile 이름을 유지하도록 하고 host discovery → SSH bootstrap → alias/ProxyJump → kubeconfig fetch/normalize → Kubernetes connectivity check 흐름을 하나의 macOS 데스크톱 UX로 묶음"
---

## 프로젝트 소개

**ClusterDeck**은 자주 재생성되는 VM 및 Kubernetes 환경에 대한 로컬 접속 경로를 안정적으로 유지하기 위한 macOS 중심 데스크톱 도구입니다.

일반적인 Kubernetes 관리자 콘솔이 아니라, **원격 환경을 발견하고 접속 가능한 상태로 만드는 workstation access layer**에 집중합니다. 사용자는 매번 달라지는 IP를 기억하는 대신 Profile 이름을 유지하고, ClusterDeck이 SSH와 kubeconfig 경계를 정리합니다.

```text
IP / Host Discovery
      ↓
SSH Connectivity
      ↓
SSH Bootstrap (optional)
      ↓
SSH Alias / ProxyJump
      ↓
Remote kubeconfig Fetch
      ↓
kubeconfig Normalization
      ↓
Local Profile
      ↓
Kubernetes Connectivity Check
```

## 핵심 설계

- **Tauri 2 + Rust**: SSH orchestration, filesystem, process execution, kubeconfig 처리 등 로컬 시스템 작업의 보안 경계를 backend에 둡니다.
- **React + TypeScript**: Profile, Host, Connect, Status 중심의 간결한 데스크톱 UI를 제공합니다.
- **Native OpenSSH 우선**: 자체 SSH stack을 다시 구현하지 않고 `ssh`, `scp`, `ssh-copy-id`, ProxyJump 같은 검증된 동작을 활용합니다.
- **Profile 중심 모델**: IP 주소보다 사람에게 안정적인 environment identity를 유지합니다.
- **ClusterDeck-owned config**: 사용자 전체 `~/.ssh/config`를 덮어쓰지 않고 `~/.clusterdeck/` 아래의 생성 파일만 소유합니다.

## 보안 경계

초기 비밀번호는 bootstrap용으로만 사용하고 저장하거나 로그에 남기지 않는 것을 원칙으로 합니다. 생성 kubeconfig는 제한된 파일 권한을 사용하고, 사용자 관리 SSH/Kubernetes 설정을 파괴적으로 덮어쓰지 않습니다. 지속 저장이 필요한 credential은 macOS Keychain 같은 안전한 로컬 secret store를 사용하는 방향입니다.

## MVP 범위

1. Profile CRUD
2. Multi-host discovery와 SSH bootstrap
3. SSH alias 생성
4. Bastion / ProxyJump
5. Remote kubeconfig fetch 및 normalization
6. Profile별 kubeconfig 저장
7. Kubernetes connectivity verification
8. 최소 클릭 중심 macOS UI

Cross-platform 지원과 provider-specific discovery는 core workflow 안정화 이후 범위입니다.

## 개발

```bash
pnpm install
pnpm tauri dev

pnpm build
cargo check --manifest-path src-tauri/Cargo.toml
```

## 상세 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [개요](/oss/clusterdeck/overview) | 문제 정의, 범위, Profile 중심 모델 |
| Architecture | [아키텍처](/oss/clusterdeck/architecture) | Tauri/Rust, SSH, kubeconfig 경계 |
| Getting Started | [시작하기](/oss/clusterdeck/getting-started) | 개발 환경과 기본 연결 흐름 |

## 프로젝트 관계

```text
Local VM / Kubernetes labs
        ↓
    ClusterDeck
        ↓
SSH / Bastion / kubeconfig access
        ↓
Narwhal · Beluga · test clusters
```
