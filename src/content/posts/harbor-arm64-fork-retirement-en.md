---
title: "Retiring my Harbor arm64 fork: the day upstream caught up"
description: "Why I forked Harbor for multi-arch images after Bitnami's free images stopped, why I shut it down when v2.16.0 shipped official arm64, and what 11 months of running a fork taught me"
pubDate: 2026-11-21
tags: ["Harbor", "Container Registry", "ARM64", "Multi-Arch", "Bitnami", "GitHub Actions", "Supply Chain Security"]
featured: false
draft: false
---

On 2026-11-21 I stopped the automated sync and release builds of the [dasomel/harbor](https://github.com/dasomel/harbor) fork. Harbor v2.16.0 (2026-11-10) now ships official arm64 images. This post records why the fork existed, what it built, and why it is time to let it go.

## Why it started: the Bitnami images stopped

I had been running Harbor on arm64 with Bitnami's multi-arch images. When Bitnami's free image catalog ended in August 2025, its Harbor images stopped getting updates. Docker Hub shows the current state:

| Repository | State (checked 2026-11-21) |
|---|---|
| `bitnamilegacy/harbor-core` | last tag `2.13.2-debian-12-r3` (2025-08-19), `amd64, arm64` |
| `bitnami/harbor-core` | no public tags, now a "Bitnami Secure Image" |

The official Harbor images were amd64 only. To keep running a current Harbor on ARM64, I had to build it myself, so in December 2025 I forked goharbor/harbor and set up multi-arch builds.

## What the fork did

- **amd64 + arm64 multi-arch images**: built both architectures with buildx, merged them into one manifest, and published to `ghcr.io/dasomel/goharbor/`, with image names compatible with the official Helm chart.
- **Supply chain security**: every image carries an SPDX SBOM, SLSA provenance, and a Cosign keyless signature.
- **Automation**: merged upstream on a schedule and automatically built a fork release whenever upstream published a new GA tag.
- **Result**: multi-arch releases from v2.15.0 through v2.15.4.

## Why stop now

Harbor v2.16.0 supports arm64 officially. The release ships `harbor-offline-installer-v2.16.0-arm64.tgz`, and `goharbor/harbor-core:v2.16.0` on Docker Hub is an `amd64, arm64` manifest. That work landed upstream in [PR #22311](https://github.com/goharbor/harbor/pull/22311) (Full Multi-Architecture Enablement); it was not a contribution from this fork.

With the reason for the fork gone, I ended the automated builds. If you need arm64, use upstream v2.16 or later.

v2.15.5 did not get an arm64 build. The 2.15 line's base image, `goharbor/photon:5.0-legacy`, became amd64-only after it was republished on 2026-11-09. Switching to the 2.16 base (`photon:5.0`) would build, but it changes the base OS, so I did not ship that on a maintenance line. The fork's last release is v2.15.4.

## What 11 months of running a fork taught me

### 1. A fork is maintenance work

Tracking upstream every three hours ran more than 1,700 workflows. The sync script kept the fork's copy of fork-specific files on conflict, which meant those files never received upstream changes and quietly went stale. When I cleaned up, the fork's `CI.yml` was still on Go 1.25.6 while upstream was on 1.27.3.

### 2. `ubuntu-latest` is not a contract

When GitHub-hosted `ubuntu-latest` moved to Ubuntu 26.04 on 2026-10-19, CI broke without a single code change. `sudo -E env ... make go_check` in the test scripts no longer carried `GOPATH`, so the lint tool was looked up in `/root/go/bin`, and the API test jobs could not start Docker inside their container. Pinning the runner to `ubuntu-24.04` brought all six jobs back to green. If reproducibility matters, pin your runner version.

### 3. Multi-arch is a base-image problem more than a code problem

Most build failures came not from Harbor's code but from whether the base OS image had an arm64 manifest. As v2.15.5 showed, upstream republishing a single base tag is enough to cut off arm64 builds.

### 4. Scheduled runs are not guaranteed

Scheduled workflows in the fork repository stopped several times, for days or weeks. Manual dispatch was refused with `Actions has been disabled for this repository`, and later recovered on its own. I never confirmed the exact cause. The lesson: do not hang a whole release pipeline on scheduled runs of free runners.

### 5. What you rely on from an outside distributor may become yours to own

As Bitnami showed, free distribution can change at any time. And when upstream fills the gap, letting go without regret is part of operating well.

Thanks to everyone who used the fork's images.
