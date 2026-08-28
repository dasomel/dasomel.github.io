---
title: ClusterDeck 시작하기
description: macOS 개발 환경 준비와 Profile 기반 SSH·kubeconfig 연결 흐름.
project: ClusterDeck
path: clusterdeck/getting-started
order: 1452
lastModified: 2026-08-28
---

# ClusterDeck 시작하기

현재 초기 범위는 macOS 중심입니다. 개발은 Tauri 2, Rust, React, TypeScript를 사용합니다.

```bash
pnpm install
pnpm tauri dev
```

기본 검증은 frontend production build와 Rust backend check를 함께 수행합니다.

```bash
pnpm build
cargo check --manifest-path src-tauri/Cargo.toml
```

## 연결 흐름

1. 환경 이름으로 Profile을 생성합니다.
2. CIDR 또는 명시적 주소로 host를 발견합니다.
3. SSH connectivity를 확인합니다.
4. 필요한 경우 public key bootstrap을 수행합니다.
5. Bastion이 있으면 ProxyJump 경로를 구성합니다.
6. control-plane host에서 kubeconfig를 가져옵니다.
7. endpoint와 context를 Profile 기준으로 normalize합니다.
8. local Profile kubeconfig로 Kubernetes API를 검증합니다.

## 보안 주의

실제 IP, password, private key, kubeconfig, bearer token, certificate를 공개 문서·이슈·스크린샷에 포함하지 않습니다. bootstrap password는 일회성 입력으로 취급하고 저장·로그 출력을 피합니다.
