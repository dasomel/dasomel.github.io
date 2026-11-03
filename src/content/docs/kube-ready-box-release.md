---
title: "릴리스 & 배포"
description: "GitHub Release + GitHub Pages 카탈로그 배포 파이프라인, 주간 CVE 스캔 및 배포 체크리스트"
project: "Kube-Ready-Box"
order: 303
lastModified: 2026-11-03
---

## 배포 전략

Kube-Ready-Box는 `.box` 파일을 **GitHub Release asset**으로, Vagrant catalog JSON을 **GitHub Pages**(`https://dasomel.github.io/kube-ready-box/boxes/<name>.json`)로 배포합니다. 파일시스템(ext4, xfs)별로 Box를 분리하며 카탈로그 이름은 `ubuntu-24.04-ext4`, `ubuntu-24.04-xfs`, `ubuntu-26.04-ext4`, `ubuntu-26.04-xfs`, `rocky-9-ext4`, `rocky-9-xfs`, `nixos-kube-ready`입니다. 자세한 내용은 [box-distribution.md](https://github.com/dasomel/kube-ready-box/blob/main/docs/box-distribution.md)를 참고하세요.

최신 릴리스는 [v0.3.1](https://github.com/dasomel/kube-ready-box/releases/tag/v0.3.1)(2026-11-02)입니다. Ubuntu 박스 0.3.1(v0.3.1 자산), Rocky 9 박스 0.1.1과 NixOS 박스 0.2.2(libvirt)([v0.3.0](https://github.com/dasomel/kube-ready-box/releases/tag/v0.3.0) 자산)입니다. Ubuntu 0.3.1은 `vmware_desktop` arm64와 `virtualbox` amd64를 같은 카탈로그 버전에 함께 담고 있어, Vagrant가 호스트에 맞는 provider와 아키텍처를 고릅니다. Rocky는 `vmware_desktop` arm64, NixOS는 `libvirt` arm64입니다.

amd64 박스는 arm64 빌드 호스트에서 만들 수 없어 GitHub x86 러너(`build-amd64.yml`)에서 빌드하고, 같은 러너에서 VirtualBox로 띄워 설치 인자 제거, 실행 중 커널만 남음, 루트 디스크 확장, `vagrant reload`, `verify_box.sh` failures=0을 확인한 것만 배포합니다(2026-11-03 v0.3.1에 추가). 러너에서 VMware를 돌릴 수 없어 VMware amd64 박스는 없고, VirtualBox arm64 박스(빌드 호스트에서 SSH 검증 불가)와 Rocky/NixOS amd64 박스도 없습니다.

## Vagrant Cloud 종료와 마이그레이션

HashiCorp가 HCP Vagrant(Vagrant Cloud)를 종료합니다. 신규 box/registry 생성은 2026-10-01에 중단됐고, 지원은 2026-11-02에 종료되며, 호스팅된 모든 box는 2026-12-31에 폐기됩니다([공지](https://developer.hashicorp.com/hcp/docs/vagrant/hcp-vagrant-eol)). 이전의 HCP Service Principal 인증과 `vagrant cloud publish` 기반 업로드 파이프라인은 더 이상 사용하지 않습니다.

Ubuntu 버전 라인은 0.3.0으로 초기화됐습니다. 1.1.0은 Vagrant Cloud에만 올라간 버전이며 Vagrant는 1.1.0을 0.3.x보다 높게 취급하므로, 기존 사용자는 `vagrant box remove dasomel/<box> --box-version 1.1.0`을 먼저 실행해야 합니다.

```ruby
config.vm.box     = "dasomel/ubuntu-24.04-ext4"
config.vm.box_url = "https://dasomel.github.io/kube-ready-box/boxes/ubuntu-24.04-ext4.json"
```

## 배포 파이프라인

<Mermaid chart={`flowchart TB
  subgraph BUILD["빌드 (arm64 로컬 · amd64 CI)"]
    BOX(["Box 아티팩트"])
    SUM["SHA256 체크섬"]
    BOX --> SUM
  end

  subgraph DIST["배포"]
    REL["GitHub Release<br/>(.box assets)"]
    CAT["GitHub Pages<br/>(boxes/*.json catalog)"]
    REL --> CAT
  end

  subgraph SCAN["CVE 스캔"]
    CVE["box-cve-scan.yml<br/>(weekly)"]
  end

  SUM --> REL
  CAT -->|"download + checksum"| CVE

  style BOX fill:#f9fafb,stroke:#d1d5db,color:#111
  style SUM fill:#f0fdf4,stroke:#059669,color:#111
  style REL fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style CAT fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style CVE fill:#f0fdf4,stroke:#059669,color:#111
  style BUILD fill:#fafafa,stroke:#d1d5db,color:#374151
  style DIST fill:#fff,stroke:#9ca3af,color:#111
  style SCAN fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

## 주간 CVE 스캔

`.github/workflows/box-cve-scan.yml` 워크플로우가 매주 실행되어 다음을 수행합니다.

- 카탈로그에서 배포된 박스를 내려받고 체크섬을 검증합니다.
- 박스에서 dpkg/rpm 패키지 DB를 추출해 Trivy로 스캔합니다(배포판이 수정한 CVE만 대상). Ubuntu는 `vmware_desktop` arm64와 `virtualbox` amd64를 각각 스캔하며, 요청한 provider가 카탈로그에 없으면 다른 provider로 대신하지 않고 `UNKNOWN`입니다.
- CRITICAL/HIGH가 발견되면 실행이 실패하며, 이는 재빌드 신호입니다.
- NixOS 박스는 dpkg/rpm DB가 없어 `UNKNOWN`으로 보고됩니다. `UNKNOWN`은 정상으로 취급하지 않습니다.

v0.3.0과 v0.3.1(Ubuntu)은 릴리스 시점 Trivy 기준 모든 박스의 배포판 수정 가능 CVE가 0건입니다. 아직 수정이 없는 커널 CVE-2026-98432는 [security-response.md](https://github.com/dasomel/kube-ready-box/blob/main/docs/security-response.md)에서 추적합니다.

## 배포 체크리스트

### 릴리스 전 (Pre-release)
- [ ] 로컬 빌드 검증 (`packer build` 및 `vagrant up` 테스트 성공)
- [ ] CHANGELOG.md에 신규 버전 작성 및 Release Notes 갱신 (예: v0.3.0 - 2026-11-01 기준 최신, CVE 재빌드)
- [ ] Box 파일 크기 검증 (1–2 GiB 내외, root LV는 설치 시 16 GiB이며 첫 부팅 때 전체 디스크로 확장)
- [ ] 박스 버전이 기존에 배포된 버전보다 높은지 확인 (Vagrant는 높은 버전을 우선)

### 릴리스 후 (Post-release)
- [ ] GitHub Release에 `.box` asset과 체크섬이 올라갔는지 확인
- [ ] GitHub Pages 카탈로그 JSON이 새 버전과 asset URL을 가리키는지 확인
- [ ] `config.vm.box_url`로 로컬 다운로드 및 구동 테스트
- [ ] 주간 `box-cve-scan` 워크플로우 결과 확인 (CRITICAL/HIGH 시 재빌드)
