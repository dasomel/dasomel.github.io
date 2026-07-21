---
title: "릴리스 & 배포"
description: "Vagrant Cloud 업로드 파이프라인, HCP 인증 메커니즘 및 배포 체크리스트"
project: "Kube-Ready-Box"
order: 303
lastModified: 2026-07-21
---

## Vagrant Cloud 배포 전략

Kube-Ready-Box는 아키텍처와 Provider에 따라 유연한 배포 방식을 취합니다. 24.04와 26.04 버전 모두 동일한 파이프라인을 공유하며, 파일시스템(ext4, xfs)별로 Box를 각각 분리하여 제공합니다.

- **AMD64 (Intel/AMD)**: GitHub Actions를 통해 자동 빌드 및 배포 (`build-amd64.yml`)
- **ARM64 (Apple Silicon)**: 로컬에서 빌드 후 `upload-boxes.sh` 스크립트를 통한 수동 배포

## HCP 인증 메커니즘 (Vagrant Cloud)

Vagrant Cloud 배포 시 단기(1시간) OAuth 토큰 만료 문제를 방지하기 위해 HCP(HashiCorp Cloud Platform) Service Principal을 사용하여 인증합니다.
*보안 원칙: 어떠한 자격증명 값도 코드베이스나 문서에 평문으로 남기지 않습니다.*

1. **Service Principal 계정 발급**: `hcp iam sp keys create vagrant-registry-publisher --output-cred-file=/tmp/hcp-cred.json` 명령어를 통해 안전하게 키를 발급받습니다. (HCP의 키 할당량 제한(최대 2개)으로 인해 오래된 키는 먼저 삭제(`delete`)해야 할 수 있습니다.)
2. **검증 및 갱신**: GitHub CLI(`gh secret set`)를 활용하여 GitHub Secrets(`HCP_CLIENT_ID`, `HCP_CLIENT_SECRET`)를 갱신합니다. **반드시 Repository Secret과 Environment(production) Secret을 양쪽 모두 갱신**하여 덮어쓰기로 인한 `unauthorized` 오류를 방지해야 합니다.
3. **폐기**: 임시 파일(`/tmp/hcp-cred.json`)은 즉시 삭제합니다.

## 업로드 파이프라인

업로드 과정은 Provider 추가 및 파일 매핑으로 이루어집니다. 다음은 ARM64와 AMD64 빌드가 Vagrant Cloud에 업로드되고 릴리스되는 전체 과정을 보여줍니다.

<Mermaid chart={`flowchart TB
  subgraph LOCAL["로컬 빌드 (ARM64)"]
    LBOX(["Box 아티팩트"])
    UP["upload-boxes.sh"]
    LBOX --> UP
  end

  subgraph CI["GitHub Actions (AMD64)"]
    CBOX(["Box 아티팩트"])
    GH["build-amd64.yml"]
    CBOX --> GH
  end

  subgraph VC["Vagrant Cloud (원격)"]
    VER["Version 생성<br/>(vagrant cloud publish)"]
    PROV["Provider 생성<br/>(vmware_desktop / virtualbox)"]
    UPL["Box 업로드<br/>(ext4 / xfs 매핑)"]
    REL["Release 상태 전환"]
    
    VER --> PROV
    PROV --> UPL
    UPL --> REL
  end

  UP -->|"HCP SP 인증"| VER
  GH -->|"HCP SP 인증"| VER

  style LBOX fill:#f9fafb,stroke:#d1d5db,color:#111
  style CBOX fill:#f9fafb,stroke:#d1d5db,color:#111
  style UP fill:#f0fdf4,stroke:#059669,color:#111
  style GH fill:#f0fdf4,stroke:#059669,color:#111
  style VER fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style PROV fill:#f0fdf4,stroke:#059669,color:#111
  style UPL fill:#f0fdf4,stroke:#059669,color:#111
  style REL fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style LOCAL fill:#fafafa,stroke:#d1d5db,color:#374151
  style CI fill:#fafafa,stroke:#d1d5db,color:#374151
  style VC fill:#fff,stroke:#9ca3af,color:#111
`} />

### 수동 업로드 (ARM64)
로컬에서 `bash upload-boxes.sh` 스크립트를 실행하면:
- Vagrant Cloud 로그인 상태를 확인합니다.
- 빌드된 ext4 및 xfs 파일시스템별로 VMware와 VirtualBox의 Provider를 순차적으로 업로드(publish)합니다.
- *참고: 특정 우분투 버전을 업로드하려면 `UBUNTU_VERSION=26.04 bash upload-boxes.sh`를 사용합니다.*

### 자동 업로드 (AMD64)
GitHub에 Tag(예: `v0.2.3`)를 푸시하면 GitHub Actions 워크플로우가 자동으로:
- Packer를 통해 Box를 빌드합니다.
- 신규 버전이면 `vagrant cloud publish`로 버전을 생성합니다.
- 기존 버전이면 `provider create`와 `upload` 명령어로 Box를 추가하고, 릴리스 상태로 전환합니다.

*권장 순서*: 로컬에서 ARM64 버전을 먼저 수동 업로드하여 버전을 생성한 뒤, GitHub에 Tag를 푸시하여 AMD64 버전을 추가하는 것이 안전합니다.

## 배포 체크리스트

안전한 릴리스를 위해 다음 사항들을 반드시 확인합니다.

### 업로드 전 (Pre-release)
- [ ] 로컬 빌드 검증 (`packer build` 및 `vagrant up` 테스트 성공)
- [ ] Vagrant Cloud / HCP 로그인 유효성 확인
- [ ] CHANGELOG.md에 신규 버전 작성 및 Release Notes 갱신 (예: v1.1.0 - 2026-07-18 기준 최신, 보안 하드닝 및 K8s 전제조건 추가)
- [ ] Box 파일 크기 검증 (Thin Provisioning 기준 2~3.5GB 내외)

### 업로드 후 (Post-release)
- [ ] Vagrant Cloud 웹 대시보드에서 Provider(vmware_desktop, virtualbox) 및 Architecture(arm64, amd64) 태그 정상 반영 확인
- [ ] 버전의 릴리스(Released) 상태 점검
- [ ] `vagrant init dasomel/ubuntu-26.04-xfs`를 통한 로컬 다운로드 및 구동 테스트
- [ ] GitHub Release 생성 및 버전 노트 작성
