---
title: Node Verification
description: Node Readiness Attestation and 30 kernel/storage integrity verification checks.
project: Kube-Ready-Box
path: kube-ready-box/verification
order: 1404
lastModified: 2026-08-23
---

# Node Verification

Integrity verification checklist ensuring node readiness for immediate cluster initialization.

## Essential Verification Steps

1. **Kernel Modules**:
   ```bash
   lsmod | grep -E 'br_netfilter|overlay'
   ```
2. **XFS pquota Mount Flags**:
   ```bash
   mount | grep 'xfs' | grep 'pquota'
   ```
3. **IP Forwarding**:
   ```bash
   sysctl net.ipv4.ip_forward  # Output: 1
   ```
4. **containerd & cgroup v2**:
   ```bash
   systemctl is-active containerd
   cat /sys/fs/cgroup/cgroup.controllers
   ```
