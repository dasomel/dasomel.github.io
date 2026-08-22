---
title: 시스템 구조
description: XFS 파티셔닝, 커널 파라미터, cgroupv2 베이스라인.
project: Kube-Ready-Box
path: kube-ready-box/architecture
order: 1400
lastModified: 2026-08-23
---

# 시스템 구조

Packer 파이프라인에서 구성되는 시스템 레이아웃입니다.

## 주요 설정
- Filesystem: XFS (`pquota`, `prjquota` 마운트 옵션)
- Sysctl: `net.bridge.bridge-nf-call-iptables = 1`, `net.ipv4.ip_forward = 1`
- Resource Limits: `fs.inotify.max_user_watches = 524288`

## 관련 링크

- [Kube-Ready-Box 저장소](https://github.com/dasomel/kube-ready-box)
- [프로젝트 홈](/oss/kube-ready-box/)
