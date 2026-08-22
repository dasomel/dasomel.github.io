---
title: Packer 빌드 & 릴리스
description: HashiCorp Packer 빌드 파이프라인 및 Vagrant Cloud 퍼블리싱 자동화.
project: Kube-Ready-Box
path: kube-ready-box/operations
order: 1403
lastModified: 2026-08-23
---

# Packer 빌드 & 릴리스

GitHub Actions 기반의 자동화된 Packer 박스 빌드 및 릴리스 파이프라인입니다.

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

## Vagrant Cloud 릴리스

- 빌드 완료된 `.box` 아티팩트에 대한 SHA256 체크섬을 검증하고 `dasomel/ubuntu-26.04-xfs` 네임스페이스로 자동 업로드합니다.
