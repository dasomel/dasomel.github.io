---
title: Packer 빌드 & 릴리스
description: HashiCorp Packer 빌드 파이프라인 및 GitHub Release/Pages 배포 및 주간 CVE 스캔.
project: Kube-Ready-Box
path: kube-ready-box/operations
order: 1403
lastModified: 2026-11-01
---

# Packer 빌드 & 릴리스

Packer 박스 빌드와 GitHub Release/Pages 배포 파이프라인입니다.

## Packer 빌드 명령어

```bash
cd packer

# HCL 템플릿 검증
packer validate ubuntu-26.04.pkr.hcl

# ARM64 VMware 이미지 빌드
packer build -only=vmware-iso.arm64 ubuntu-26.04.pkr.hcl

# AMD64 VirtualBox 이미지 빌드
packer build -only=virtualbox-iso.amd64 ubuntu-26.04.pkr.hcl
```

## 릴리스 배포 (GitHub Release + Pages)

- 빌드 완료된 `.box` 아티팩트의 SHA256 체크섬을 검증하고 GitHub Release asset으로 올린 뒤, GitHub Pages의 `boxes/<name>.json` 카탈로그를 갱신합니다. 사용 시에는 `config.vm.box = "dasomel/ubuntu-24.04-ext4"`와 `config.vm.box_url = "https://dasomel.github.io/kube-ready-box/boxes/ubuntu-24.04-ext4.json"`을 지정합니다.
- 최신 릴리스는 [v0.3.0](https://github.com/dasomel/kube-ready-box/releases/tag/v0.3.0)(2026-11-01)이며 **arm64 전용**입니다(Ubuntu/Rocky `vmware_desktop`, NixOS `libvirt`). VirtualBox와 amd64 박스는 포함되지 않습니다.
- Ubuntu 버전 라인은 0.3.0으로 초기화됐습니다. Vagrant Cloud에만 있던 1.1.0이 0.3.0보다 높게 취급되므로 기존 사용자는 `vagrant box remove dasomel/<box> --box-version 1.1.0`을 실행해야 합니다.
- HCP Vagrant(Vagrant Cloud)는 종료 중입니다: 신규 생성 중단 2026-10-01, 지원 종료 2026-11-02, 호스팅 box 폐기 2026-12-31 ([공지](https://developer.hashicorp.com/hcp/docs/vagrant/hcp-vagrant-eol)).
- 주간 `.github/workflows/box-cve-scan.yml`이 카탈로그의 박스를 내려받아 체크섬을 검증하고 dpkg/rpm DB를 추출해 Trivy(수정 가능 CVE만)로 스캔합니다. CRITICAL/HIGH는 재빌드 신호로 실행을 실패시키며, NixOS는 DB가 없어 `UNKNOWN`으로 보고됩니다.

자세한 흐름은 [릴리스 & 배포](/oss/kube-ready-box/release) 문서를 참고하세요.
