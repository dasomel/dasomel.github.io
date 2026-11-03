---
title: Packer Builds & Releases
description: HashiCorp Packer build pipelines and GitHub Release/Pages distribution and weekly CVE scanning.
project: Kube-Ready-Box
path: kube-ready-box/operations
order: 1403
lastModified: 2026-11-03
---

# Packer Builds & Releases

Packer box builds and the GitHub Release/Pages distribution pipeline.

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

## Release Distribution (GitHub Release + Pages)

- After verifying the SHA256 checksums of the built `.box` artifacts, they are uploaded as GitHub Release assets and the `boxes/<name>.json` catalog on GitHub Pages is updated. Consumers set `config.vm.box = "dasomel/ubuntu-24.04-ext4"` and `config.vm.box_url = "https://dasomel.github.io/kube-ready-box/boxes/ubuntu-24.04-ext4.json"`.
- The latest release is [v0.3.1](https://github.com/dasomel/kube-ready-box/releases/tag/v0.3.1) (2026-11-02, Ubuntu boxes rebuilt). Ubuntu ships `vmware_desktop` arm64 and `virtualbox` amd64 (added 2026-11-03); Rocky ships `vmware_desktop` arm64 and NixOS `libvirt` arm64. The amd64 boxes are built on GitHub's x86 runners (`build-amd64.yml`) and shipped only after they boot-verify with VirtualBox on the same runner. There are no VMware amd64, VirtualBox arm64, or Rocky/NixOS amd64 boxes.
- The Ubuntu version line was reset to 0.3.0. Because the Vagrant Cloud-only 1.1.0 ranks above 0.3.x, existing users must run `vagrant box remove dasomel/<box> --box-version 1.1.0`.
- HCP Vagrant (Vagrant Cloud) is being shut down: new creation stopped 2026-10-01, support ends 2026-11-02, hosted boxes are decommissioned 2026-12-31 ([announcement](https://developer.hashicorp.com/hcp/docs/vagrant/hcp-vagrant-eol)).
- The weekly `.github/workflows/box-cve-scan.yml` downloads the shipped boxes from the catalog, verifies checksums, extracts the dpkg/rpm databases and runs Trivy (fixable CVEs only). CRITICAL/HIGH fail the run as a rebuild signal; NixOS is reported `UNKNOWN` (no dpkg/rpm database).

See [Release & Distribution](/oss/en/kube-ready-box/release) for the full flow.
