---
title: Packer Builds & Releases
description: HashiCorp Packer build pipelines and Vagrant Cloud publishing automation.
project: Kube-Ready-Box
path: kube-ready-box/operations
order: 1403
lastModified: 2026-08-23
---

# Packer Builds & Releases

Automated Packer build and Vagrant Cloud distribution workflows.

## Packer Build Commands

```bash
cd packer

# Validate HCL template
packer validate ubuntu-26.04.pkr.hcl

# Build ARM64 VMware box
packer build -only=vmware-iso.arm64 ubuntu-26.04.pkr.hcl

# Build AMD64 VirtualBox box
packer build -only=virtualbox-iso.amd64 ubuntu-26.04.pkr.hcl
```
