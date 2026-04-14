---
title: "K-PaaS Local Install 2.0.0 for Mac ARM Environment"
event: "Cloud Native Korea Community Day 2025"
date: 2025-09-15
slides: ""
tags: ["K-PaaS", "ARM", "Vagrant", "Kubernetes"]
---

## Presentation Overview

At Cloud Native Korea Community Day 2025, we introduce K-PaaS Local Install 2.0.0, featuring automated installation scripts for Mac ARM (Apple Silicon), based on K-PaaS version 1.6.0.

## Key Topics

### Porting to Mac ARM Architecture

A detailed walkthrough of fully porting the existing local installation structure — built on Vagrant, VirtualBox, Kubespray, and Ansible — to the Mac ARM architecture.

- Limitations of the existing x86-based installation structure
- Virtualization constraints on Apple Silicon
- Strategy for selecting and replacing ARM-compatible components

### Key Changes in K-PaaS Local Install 2.0.0
- Mac ARM-specific installation automation scripts
- Lightweight configuration based on K-PaaS 1.6.0
- Alternatives to Vagrant and VirtualBox
- Cluster provisioning with Kubespray + Ansible

### Installation Demo
- Live installation demo on Mac ARM environment
- Verification of key component operation
- Troubleshooting tips

## Target Audience

- Developers looking to run K-PaaS on Mac Apple Silicon
- Engineers interested in configuring local Kubernetes environments
- K-PaaS contributors and community members
