---
title: Packer 빌드 & 릴리스
description: Vagrant Cloud 배포 파이프라인 및 버전 관리.
project: Kube-Ready-Box
path: kube-ready-box/operations
order: 1400
lastModified: 2026-08-23
---

# Packer 빌드 & 릴리스

GitHub Actions를 통한 자동화된 박스 빌드 및 배포 절차입니다.

## 릴리스 절차
```bash
cd packer
packer init .
packer build -only=vmware-iso.arm64 ubuntu-26.04.pkr.hcl
```

## 관련 링크

- [Kube-Ready-Box 저장소](https://github.com/dasomel/kube-ready-box)
- [프로젝트 홈](/oss/kube-ready-box/)
