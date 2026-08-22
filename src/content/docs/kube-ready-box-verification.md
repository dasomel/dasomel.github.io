---
title: 노드 검증 체크리스트
description: Node Readiness Attestation 및 30개 커널/스토리지 무결성 점검 항목.
project: Kube-Ready-Box
path: kube-ready-box/verification
order: 1404
lastModified: 2026-08-23
---

# 노드 검증 체크리스트

Kube-Ready-Box 부팅 직후 노드가 쿠버네티스 요구조건을 충족하는지 검증하는 체크리스트입니다.

## 필수 검증 항목

1. **커널 모듈 로드 확인**:
   ```bash
   lsmod | grep -E 'br_netfilter|overlay'
   ```
2. **XFS pquota 마운트 플래그 확인**:
   ```bash
   mount | grep 'xfs' | grep 'pquota'
   ```
3. **IP 포워딩 활성화 확인**:
   ```bash
   sysctl net.ipv4.ip_forward  # 출력: 1
   ```
4. **containerd 소켓 및 cgroup v2 확인**:
   ```bash
   systemctl is-active containerd
   cat /sys/fs/cgroup/cgroup.controllers
   ```
