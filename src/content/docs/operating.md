---
title: "컨테이너 플랫폼 동작원리"
description: "K-PaaS 컨테이너 플랫폼의 동작 방식"
order: 2
date: 2024-06-17
lastModified: 2024-06-17
---

## 개요

- 컨테이너 플랫폼은 Kubernetes Cluster 및 운영에 필요한 Storage 서버로 구성
- Description을 기반으로 컨테이너화 된 어플리케이션을 배포하는 방식으로 동작
- 이렇게 배포된 어플리케이션은 최적의 노드로 배치하고, Description에 정의된 상태를 유지

## 단독 배포 아키텍처

![컨테이너 플랫폼 아키텍처](/images/kpaas/containerPlatfrom_map01.png)
