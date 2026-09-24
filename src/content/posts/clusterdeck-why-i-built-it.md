---
title: "클러스터를 다시 만들 때마다 반복하던 수작업, 그래서 ClusterDeck을 만들었다"
description: "IP가 바뀔 때마다 SSH·kubeconfig·hosts·CA를 손으로 맞추던 반복 작업을 Profile 하나로 묶기까지"
pubDate: 2026-09-24
tags: ["Kubernetes", "Cloud Native", "Platform Engineering", "Open Source", "DevTools", "Tauri", "Rust", "ClusterDeck"]
projects: ["clusterdeck"]
featured: false
draft: false
---

Kubernetes 클러스터를 계속 재생성하다가 결국 도구를 하나 만들었습니다. 한두 번이면 참을 만한데, 재생성 테스트를 반복하다 보니 매번 똑같은 수작업이 쌓였습니다.

## 문제: 재생성할 때마다 반복되는 목록

클러스터를 새로 만들 때마다 다음을 순서대로 다시 해야 했습니다.

- VM의 IP가 바뀐다
- SSH 접속 정보를 다시 맞춘다
- kubeconfig를 가져와 수정한다
- 내부 도메인을 위해 `/etc/hosts`를 변경한다
- 클러스터가 쓰는 CA 인증서를 로컬 macOS에 신뢰 등록한다
- 마지막으로 실제 Kubernetes API 연결까지 다시 확인한다

각각은 별로 어렵지 않습니다. 문제는 이 여섯 단계가 클러스터를 지우고 다시 만들 때마다 원점에서 반복된다는 것이었습니다. IP 하나가 바뀌면 SSH alias, kubeconfig의 서버 주소, `/etc/hosts` 항목, 신뢰된 CA까지 전부 도미노처럼 같이 어긋납니다.

## 아이디어: SwitchHosts에서 가져온 Profile

예전에 여러 개발 환경의 hosts 파일을 손쉽게 전환할 때 SwitchHosts를 썼던 기억이 났습니다. "클러스터 접속 환경도 Profile 하나로 관리하고 전환할 수 있으면 어떨까?" 그 질문에서 ClusterDeck을 만들기 시작했습니다.

핵심은 IP 주소가 아니라 **사람이 기억하는 이름**을 기준으로 삼는 것입니다. 클러스터를 다시 만들어서 IP나 접속 환경이 바뀌어도, Profile 이름은 그대로 유지한 채 그 이름 아래에서 필요한 로컬 접속 환경만 다시 구성하면 됩니다.

## ClusterDeck이 하는 일: 하나의 Profile을 중심으로 한 8단계

ClusterDeck은 자주 생성·삭제되거나 IP가 변경되는 VM/Kubernetes 환경을 대상으로 하는 macOS-first 데스크톱 앱입니다. 위에서 나열한 수작업들을 하나의 Profile을 중심으로 이렇게 묶습니다.

<Mermaid chart={`flowchart LR
    A["IP / Host Discovery"] --> B["SSH Connectivity"]
    B --> C["SSH Key Bootstrap"]
    C --> D["Bastion / ProxyJump"]
    D --> E["Remote kubeconfig Fetch & Normalization"]
    E --> F["/etc/hosts 관리"]
    F --> G["Cluster CA 인증서 신뢰 관리"]
    G --> H["Kubernetes Connectivity Check"]
`} />

풀어 쓰면 이렇습니다 — 호스트를 찾고, SSH가 되는지 확인하고, 필요하면 키를 부트스트랩하고, bastion을 거쳐야 하면 ProxyJump를 설정하고, 원격 kubeconfig를 가져와 정규화하고, 내부 도메인이 필요하면 `/etc/hosts`를 맞추고, CA를 신뢰하고, 마지막으로 실제 Kubernetes API 연결까지 검증합니다.

## 설계 포인트

**Profile 이름은 유지되고, 그 아래 내용만 교체됩니다.** 클러스터를 다시 만들면서 IP나 접속 환경이 바뀌어도 사람이 기억하는 Profile 이름은 그대로 두고, 그 이름에 연결된 SSH/kubeconfig/hosts/CA 상태만 다시 채워 넣는 식으로 동작합니다. 매번 "이 클러스터가 그 클러스터 맞나"를 헷갈리지 않아도 됩니다.

**CA 인증서는 로컬 macOS Login Keychain에 등록합니다.** 클러스터가 자체 서명 CA를 쓰는 경우가 흔한데, 이걸 로컬에서 신뢰하지 않으면 TLS 검증에서 계속 걸립니다. ClusterDeck은 이 등록을 대신해 주는 동시에, 지금 어떤 CA가 신뢰 상태인지 확인하고 필요하면 다시 제거하는 것까지 지원합니다. 신뢰를 추가만 하고 되돌릴 방법이 없으면 그것도 결국 수작업 부채가 되기 때문입니다.

## 하지 않는 것

ClusterDeck은 아직 초기 MVP 단계이고, Kubernetes 관리 콘솔을 만들려는 프로젝트가 아닙니다. 워크로드를 배포하거나 클러스터 상태를 대시보드로 보여주는 도구가 아니라, 제가 반복적으로 겪던 "클러스터를 다시 만들고 → 로컬 접속 환경을 다시 구성하고 → 실제 접속까지 검증하는" 과정을 조금 덜 귀찮게 만드는 데 초점을 둔 도구입니다.

## 링크

- GitHub: [dasomel/clusterdeck](https://github.com/dasomel/clusterdeck)
- 프로젝트 소개: [/ko/projects/clusterdeck](/ko/projects/clusterdeck)

비슷하게 로컬 VM이나 Kubernetes 테스트 환경을 자주 만들고 지우시는 분이 있다면 피드백을 환영합니다.
