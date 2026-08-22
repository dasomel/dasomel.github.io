---
title: 노드 검증 체크리스트
description: Node Readiness Attestation 및 30개 무결성 점검.
project: Kube-Ready-Box
path: kube-ready-box/verification
order: 1400
lastModified: 2026-08-23
---

# 노드 검증 체크리스트

부팅 후 노드가 쿠버네티스 설치에 적합한지 검증하는 테스트입니다.

## 검증 항목
- `br_netfilter`, `overlay` 커널 모듈 로드 확인
- XFS `pquota` 마운트 플래그 확인
- containerd 서비스 실행 상태 및 cgroup v2 마운트 확인

## 관련 링크

- [Kube-Ready-Box 저장소](https://github.com/dasomel/kube-ready-box)
- [프로젝트 홈](/oss/kube-ready-box/)
