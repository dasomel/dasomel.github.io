---
title: "Release & Distribution"
description: "Vagrant Cloud upload pipeline, HCP credential mechanism, and deployment checklist"
project: "Kube-Ready-Box"
order: 303
lastModified: 2026-07-21
---

## Vagrant Cloud Distribution Strategy

Kube-Ready-Box utilizes a flexible distribution approach depending on architecture and Provider. Both the 24.04 and 26.04 versions share the same pipeline, providing separate Boxes for each filesystem (ext4, xfs).

- **AMD64 (Intel/AMD)**: Automatically built and deployed via GitHub Actions (`build-amd64.yml`).
- **ARM64 (Apple Silicon)**: Built locally and deployed manually using the `upload-boxes.sh` script.

## HCP Credential Mechanism (Vagrant Cloud)

To avoid short-lived (1-hour) OAuth token expiration issues during Vagrant Cloud deployment, authentication is performed using an HCP (HashiCorp Cloud Platform) Service Principal.
*Security Principle: No credential values are ever left in plaintext within the codebase or documentation.*

1. **Issue Service Principal Key**: Generate the key securely using `hcp iam sp keys create vagrant-registry-publisher --output-cred-file=/tmp/hcp-cred.json`. (Due to HCP's key quota limits (max 2), you may need to `delete` older keys first.)
2. **Verify and Update**: Use the GitHub CLI (`gh secret set`) to update the GitHub Secrets (`HCP_CLIENT_ID`, `HCP_CLIENT_SECRET`). **You must update both the Repository Secret and the Environment (production) Secret** to prevent `unauthorized` errors caused by masking.
3. **Discard**: The temporary file (`/tmp/hcp-cred.json`) is deleted immediately.

## Upload Pipeline

The upload process consists of adding Providers and mapping files. The following flowchart shows the entire process of how ARM64 and AMD64 builds are uploaded to Vagrant Cloud and released.

<Mermaid chart={`flowchart TB
  subgraph LOCAL["Local Build (ARM64)"]
    LBOX(["Box Artifacts"])
    UP["upload-boxes.sh"]
    LBOX --> UP
  end

  subgraph CI["GitHub Actions (AMD64)"]
    CBOX(["Box Artifacts"])
    GH["build-amd64.yml"]
    CBOX --> GH
  end

  subgraph VC["Vagrant Cloud (Remote)"]
    VER["Create Version<br/>(vagrant cloud publish)"]
    PROV["Create Provider<br/>(vmware_desktop / virtualbox)"]
    UPL["Upload Box<br/>(ext4 / xfs mapping)"]
    REL["Transition to Released"]
    
    VER --> PROV
    PROV --> UPL
    UPL --> REL
  end

  UP -->|"HCP SP Auth"| VER
  GH -->|"HCP SP Auth"| VER

  style LBOX fill:#f9fafb,stroke:#d1d5db,color:#111
  style CBOX fill:#f9fafb,stroke:#d1d5db,color:#111
  style UP fill:#f0fdf4,stroke:#059669,color:#111
  style GH fill:#f0fdf4,stroke:#059669,color:#111
  style VER fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style PROV fill:#f0fdf4,stroke:#059669,color:#111
  style UPL fill:#f0fdf4,stroke:#059669,color:#111
  style REL fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style LOCAL fill:#fafafa,stroke:#d1d5db,color:#374151
  style CI fill:#fafafa,stroke:#d1d5db,color:#374151
  style VC fill:#fff,stroke:#9ca3af,color:#111
`} />

### Manual Upload (ARM64)
Executing `bash upload-boxes.sh` locally will:
- Verify the Vagrant Cloud login status.
- Sequentially upload (publish) the VMware and VirtualBox Providers for each built filesystem (ext4 and xfs).
- *Note: To upload a specific Ubuntu version, use `UBUNTU_VERSION=26.04 bash upload-boxes.sh`.*

### Automated Upload (AMD64)
Pushing a Tag (e.g., `v0.2.3`) to GitHub automatically triggers the GitHub Actions workflow to:
- Build the Box using Packer.
- Create a new version via `vagrant cloud publish` if it is a new release.
- Use `provider create` and `upload` commands to add the Box to an existing version, then transition it to a released state.

*Recommended Sequence*: It is safest to manually upload the ARM64 versions locally first to create the initial version, and then push the Tag to GitHub to append the AMD64 versions.

## Deployment Checklist

Ensure the following points are verified for a safe release.

### Pre-release
- [ ] Verify local build (successful `packer build` and `vagrant up` testing)
- [ ] Validate Vagrant Cloud / HCP login status
- [ ] Write the new version entry in CHANGELOG.md and update Release Notes (e.g., v1.1.0 - latest as of 2026-07-18, focusing on security hardening and K8s prereqs)
- [ ] Verify Box file size (around 2~3.5GB based on Thin Provisioning)

### Post-release
- [ ] Confirm that Provider (`vmware_desktop`, `virtualbox`) and Architecture (`arm64`, `amd64`) tags are correctly reflected in the Vagrant Cloud web dashboard
- [ ] Check if the version is in the Released state
- [ ] Perform a local download and boot test via `vagrant init dasomel/ubuntu-26.04-xfs`
- [ ] Create a GitHub Release and attach the version notes
