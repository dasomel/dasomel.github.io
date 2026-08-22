---
title: Packer Builds & Releases
description: Vagrant Cloud release pipelines and version management.
project: Kube-Ready-Box
path: kube-ready-box/operations
order: 1400
lastModified: 2026-08-23
---

# Packer Builds & Releases

Automated box build and publishing workflows.

## Build Command
```bash
cd packer
packer init .
packer build -only=vmware-iso.arm64 ubuntu-26.04.pkr.hcl
```

## Related Links

- [Kube-Ready-Box Repository](https://github.com/dasomel/kube-ready-box)
- [English Project Home](/oss/en/kube-ready-box/)
