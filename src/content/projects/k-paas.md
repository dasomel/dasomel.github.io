---
title: "K-PaaS Local Sandbox"
description: "K-PaaS를 PC에서 재현하고 실험하기 위한 Local Kubernetes Sandbox"
github: "https://github.com/dasomel/k-paas"
tags: ["K-PaaS", "Kubernetes", "Kubespray", "Vagrant", "VirtualBox", "Local"]
order: 7
type: "own"
problem: "공공·클라우드 플랫폼인 K-PaaS를 실제 PC 환경에서 반복해서 설치하고 실험하기 어려움"
solution: "Vagrant와 설치 스크립트를 이용해 K-PaaS 환경을 로컬 Kubernetes Sandbox로 재현하고 학습·검증 비용을 낮춤"
---

## 프로젝트 소개

**K-PaaS Local Sandbox**는 K-PaaS 컨테이너 플랫폼을 개인 PC에서 설치하고 실험하기 위한 환경입니다.

Kubernetes 클러스터와 플랫폼 컴포넌트를 로컬에서 재현해 교육, 기능 검증, 설치 자동화 실험에 활용할 수 있도록 구성했습니다.

## 주요 특징

- Vagrant 기반 로컬 환경
- Kubespray 기반 Kubernetes 구성
- VirtualBox 지원
- 설치 스크립트 기반 반복 가능한 환경
- K-PaaS 학습·검증용 Sandbox

## 관련 링크

- **GitHub**: [dasomel/k-paas](https://github.com/dasomel/k-paas)
