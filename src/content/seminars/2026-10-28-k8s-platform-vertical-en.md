---
title: "Vertical Integration of Kubernetes Platform Engineering with AI Agents"
event: "Kubernetes Korea Group Meetup, Session 2"
date: 2026-10-28
slides: "https://cne.io.kr/slides/k8s-platform-vertical/#1"
tags: ["Kubernetes", "Platform Engineering", "AI Agent", "Open Source", "Evidence"]
---

## Topic: From Building the Cluster to Operations Tools, Developer Experience, and Verification

A Kubernetes platform needs far more than installation, and failures keep recurring at the seams between the pieces. The talk organizes my experience of building and connecting those pieces as open source with a team of AI agents, using a Day-0/1/2 frame. It is scheduled for Wednesday, October 28, 2026 at 19:00. The slides are in Korean.

## Outline

- **The problem and the Day-0/1/2 frame**: the seven areas a platform needs, and the vertical integration map
- **Role of each project**: Kube-Ready-Box (Day-0), Narwhal (Day-0 to 2), NFS Quota Agent, Narwhal Portal, ClusterDeck (Day-2), and the related project KubeMetal
- **Verification across the whole span**: OpenForge evidence classes and KPIs, and discussions with outside developers
- **Running an AI agent team**: how it works, a day's flow, failure cases, lessons

## Key messages

- Connecting separate projects at their seams makes one platform lifecycle, and failures are kept as regression checks.
- A lower evidence class must not claim a stronger runtime property, and a completion claim is not evidence.
- Most outside discussions are still open, and no adoption or collaboration is confirmed.

## Related

- [Talk write-up: Vertical Integration of a Kubernetes Platform with AI Agents](/en/posts/k8s-platform-vertical-2026/)
- [View the slides](https://cne.io.kr/slides/k8s-platform-vertical/#1)
- [OSS overview](https://cne.io.kr/oss/)
