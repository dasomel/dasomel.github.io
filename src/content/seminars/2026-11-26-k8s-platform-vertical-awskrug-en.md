---
title: "Vertical Integration of Kubernetes Platform Engineering with AI Agents"
event: "AWSKRUG Connect Meetup, Session 4"
date: 2026-11-26
slides: "https://cne.io.kr/slides/k8s-platform-vertical-awskrug/#1"
tags: ["Kubernetes", "Platform Engineering", "AI Agent", "Open Source", "AWS", "Evidence"]
---

## Topic: From Building the Cluster to Operations Tools, Developer Experience, and Verification

Even when AWS managed services fill each area of a platform, the seams between those areas and the verification of every upgrade are left to the user. Once on-premises, air-gapped, or data-sovereignty requirements appear, you take those areas on yourself. Starting from that situation, the talk organizes my experience of building and connecting the main areas of a Kubernetes platform as open source with a team of AI agents, using a Day-0/1/2 frame. It is scheduled for Thursday, November 26, 2026 at 19:00 at Sparkplus Gangnam Branch 4. The slides are in Korean.

## Outline

- **The AWS view and the Day-0/1/2 frame**: the seven platform areas and their AWS counterparts, the seams, and the vertical integration map
- **Role of each project**: Kube-Ready-Box (Day-0), Narwhal (Day-0 to 2), NFS Quota Agent, Narwhal Portal, ClusterDeck (Day-2)
- **Recent releases**: Narwhal v1.4.0 and v1.5.0 (incidents that changed the design, and the limits that remain), Kube-Ready-Box security rebuilds and its move to a new distribution channel, broader verification in NFS Quota Agent v0.6.0
- **Verification across the whole span**: OpenForge evidence classes and portfolio metrics, and discussions with outside developers
- **Running an AI agent team**: how it works, failure cases, lessons

## Key messages

- Connecting separate projects at their seams makes one platform lifecycle, and failures are kept as regression checks.
- A lower evidence class must not claim a stronger runtime property, and a completion claim is not evidence.
- The talk does not claim these projects were verified on AWS or EKS, and most outside discussions are still open.

## Related

- [Write-up of the October 28 meetup talk: Vertical Integration of a Kubernetes Platform with AI Agents](/en/posts/k8s-platform-vertical-2026/)
- [View the slides](https://cne.io.kr/slides/k8s-platform-vertical-awskrug/#1)
- [OSS overview](https://cne.io.kr/oss/)
