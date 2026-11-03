---
title: "Release & Distribution"
description: "GitHub Release + GitHub Pages catalog distribution pipeline, weekly CVE scan, and deployment checklist"
project: "Kube-Ready-Box"
order: 303
lastModified: 2026-11-03
---

## Distribution Strategy

Kube-Ready-Box distributes `.box` files as **GitHub Release assets** and the Vagrant catalog JSON through **GitHub Pages** (`https://dasomel.github.io/kube-ready-box/boxes/<name>.json`). Boxes are split per filesystem (ext4, xfs); catalog names are `ubuntu-24.04-ext4`, `ubuntu-24.04-xfs`, `ubuntu-26.04-ext4`, `ubuntu-26.04-xfs`, `rocky-9-ext4`, `rocky-9-xfs`, and `nixos-kube-ready`. See [box-distribution.md](https://github.com/dasomel/kube-ready-box/blob/main/docs/box-distribution.md).

The latest release is [v0.3.1](https://github.com/dasomel/kube-ready-box/releases/tag/v0.3.1) (2026-11-02): Ubuntu boxes 0.3.1 (v0.3.1 assets); Rocky 9 boxes 0.1.1 and NixOS 0.2.2 (libvirt) stay [v0.3.0](https://github.com/dasomel/kube-ready-box/releases/tag/v0.3.0) assets. Ubuntu 0.3.1 carries both `vmware_desktop` arm64 and `virtualbox` amd64 in the same catalog version, so Vagrant picks the provider and architecture that match the host. Rocky ships `vmware_desktop` arm64 and NixOS `libvirt` arm64.

The amd64 boxes cannot be built on the arm64 build host, so `build-amd64.yml` builds them on GitHub's x86 runners and ships only boxes that boot on the same runner with VirtualBox and pass the checks: no installer arguments, only the running kernel left, root disk growth, `vagrant reload`, and `verify_box.sh` failures=0 (added to v0.3.1 on 2026-11-03). The runners cannot run VMware, so there is no VMware amd64 box; there are also no VirtualBox arm64 boxes (SSH cannot be verified on the build host) and no Rocky/NixOS amd64 boxes.

## Vagrant Cloud Shutdown and Migration

HashiCorp is shutting down HCP Vagrant (Vagrant Cloud): new box/registry creation stopped on 2026-10-01, support ends 2026-11-02, and all hosted boxes are decommissioned on 2026-12-31 ([announcement](https://developer.hashicorp.com/hcp/docs/vagrant/hcp-vagrant-eol)). The former HCP Service Principal authentication and `vagrant cloud publish` upload pipeline are no longer used.

The Ubuntu version line was reset to 0.3.0. 1.1.0 was a Vagrant Cloud-only upload, and Vagrant ranks 1.1.0 above 0.3.x, so existing users must first run `vagrant box remove dasomel/<box> --box-version 1.1.0`.

```ruby
config.vm.box     = "dasomel/ubuntu-24.04-ext4"
config.vm.box_url = "https://dasomel.github.io/kube-ready-box/boxes/ubuntu-24.04-ext4.json"
```

## Distribution Pipeline

<Mermaid chart={`flowchart TB
  subgraph BUILD["Build (arm64 local · amd64 CI)"]
    BOX(["Box Artifacts"])
    SUM["SHA256 checksums"]
    BOX --> SUM
  end

  subgraph DIST["Distribution"]
    REL["GitHub Release<br/>(.box assets)"]
    CAT["GitHub Pages<br/>(boxes/*.json catalog)"]
    REL --> CAT
  end

  subgraph SCAN["CVE Scan"]
    CVE["box-cve-scan.yml<br/>(weekly)"]
  end

  SUM --> REL
  CAT -->|"download + checksum"| CVE

  style BOX fill:#f9fafb,stroke:#d1d5db,color:#111
  style SUM fill:#f0fdf4,stroke:#059669,color:#111
  style REL fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style CAT fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style CVE fill:#f0fdf4,stroke:#059669,color:#111
  style BUILD fill:#fafafa,stroke:#d1d5db,color:#374151
  style DIST fill:#fff,stroke:#9ca3af,color:#111
  style SCAN fill:#fafafa,stroke:#d1d5db,color:#374151
`} />

## Weekly CVE Scan

The `.github/workflows/box-cve-scan.yml` workflow runs weekly and:

- Downloads the shipped boxes from the catalog and verifies their checksums.
- Extracts the dpkg/rpm package databases from each box and scans them with Trivy (distro-fixable CVEs only). Ubuntu is scanned separately for `vmware_desktop` arm64 and `virtualbox` amd64; a provider missing from the catalog is `UNKNOWN`, never replaced by another provider.
- Fails the run on CRITICAL/HIGH findings, which is the signal to rebuild.
- Reports NixOS as `UNKNOWN` because it has no dpkg/rpm database. `UNKNOWN` is never treated as healthy.

At release, v0.3.0 and v0.3.1 (Ubuntu) had 0 distro-fixable CVEs per Trivy on every box. Kernel CVE-2026-98432, which has no fix yet, is tracked in [security-response.md](https://github.com/dasomel/kube-ready-box/blob/main/docs/security-response.md).

## Deployment Checklist

### Pre-release
- [ ] Verify local build (successful `packer build` and `vagrant up` testing)
- [ ] Write the new version entry in CHANGELOG.md and update Release Notes (e.g., v0.3.0 - latest as of 2026-11-01, CVE rebuild)
- [ ] Verify Box file size (around 1-2 GiB; the root LV is 16 GiB at install and grows to the full disk on first boot)
- [ ] Confirm the box version is higher than previously distributed versions (Vagrant prefers the higher version)

### Post-release
- [ ] Confirm the `.box` assets and checksums are attached to the GitHub Release
- [ ] Confirm the GitHub Pages catalog JSON points to the new version and asset URLs
- [ ] Perform a local download and boot test via `config.vm.box_url`
- [ ] Check the weekly `box-cve-scan` workflow result (rebuild on CRITICAL/HIGH)
