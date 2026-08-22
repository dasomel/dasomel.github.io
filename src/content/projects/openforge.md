---
title: "OpenForge"
description: "오픈소스 프로젝트를 일관된 품질과 구조로 만들고 운영하기 위한 Project Blueprint와 Engineering Standards"
github: "https://github.com/dasomel/openforge"
tags: ["Open Source", "Engineering Standards", "Security", "Supply Chain", "CI/CD", "AI Engineering"]
order: 2
type: "own"
featured: true
problem: "새로운 OSS 프로젝트를 만들 때마다 Repository 구조, 문서, GitHub 운영, CI/CD, 보안, 공급망, 릴리스와 운영 기준을 반복해서 구성해야 하며, 변경 영향과 성숙도를 일관되게 평가하기 어려움"
solution: "실제 OSS 개발 경험에서 반복되는 Engineering Foundation을 Repository Blueprint, Standards, reusable Templates, Lifecycle, Reference Metrics로 체계화"
---

## 프로젝트 소개

**OpenForge**는 오픈소스 프로젝트를 만들고 발전시키고 유지하기 위한 공통 **Project Blueprint + Engineering Standards**입니다.

단순한 문서 모음이 아니라, 실제 OSS에서 반복적으로 발생하는 문제를 **표준 → 템플릿 → 적용 → 증거 → 학습 → 표준 개선**의 흐름으로 축적하는 Engineering Foundation을 목표로 합니다.

```text
Project Definition
      ↓
Repository Bootstrap
      ↓
Documentation / Architecture
      ↓
Standards + Templates
      ↓
Implementation / CI / Security
      ↓
Release / Operations
      ↓
Evidence / Lessons / Metrics
      ↓
OpenForge Improvement
```

특정 프로그래밍 언어, 클라우드, 런타임 또는 애플리케이션 아키텍처를 강제하지 않고, 프로젝트 상황에 따라 기준을 적용하거나 ADR로 예외를 기록할 수 있도록 설계합니다.

## 핵심 범위

- Repository / Documentation / GitHub Standard
- CI/CD 및 CI Resilience
- Security / Supply Chain / Package & Artifact Identity
- Change Management / Impact Analysis
- Upgrade / Compatibility Engineering
- Reproducible Build / Developer Environment Security
- AI-assisted Engineering Security
- Container / Kubernetes / IaC Security
- Secrets / Machine Identity / Vulnerability Management
- Incident Response / Release Security / Security Exceptions
- Maintainer Governance / OSS Compliance / Internationalization
- Reference Implementation Metrics
- GitHub, CI/CD, Kubernetes, GitOps, Identity, Observability, Backup, Offline 및 Design Templates

## 차별점

OpenForge의 기준은 실제 프로젝트에 적용할 수 있는 **implementation starting point**를 제공하면서도, 템플릿을 보편적인 drop-in configuration으로 취급하지 않습니다. 버전, 권한, 경로, 이미지, 도메인, Identity와 Threat Model은 대상 프로젝트에 맞게 조정해야 합니다.

또한 단독 maintainer OSS도 고려하여 사람 수 자체를 강제하기보다 **변경 위험과 자동화된 통제 수준**을 중심으로 governance를 설계합니다.

## Reference Projects

OpenForge는 다음과 같은 실제 OSS 프로젝트의 반복 가능한 Engineering Practice를 참고 구현으로 축적합니다.

- Narwhal / Narwhal Portal
- nfs-quota-agent
- kube-ready-box
- KubeMetal
- ldapium
- Beluga Manager

이 프로젝트들은 OpenForge의 강제 종속성이 아니라, 기준을 실제 환경에 적용하고 개선하는 **Reference Implementation**입니다.

## 문서

`/oss/openforge/`에서는 OpenForge의 개념, 표준, Blueprint, Template, Metrics와 실제 적용 관점의 trade-off 및 운영 경험을 정리합니다.

정식 구현 자산의 Source of Truth는 OpenForge repository입니다.

## 관련 링크

- **GitHub**: [dasomel/openforge](https://github.com/dasomel/openforge)
- **Standards**: [OpenForge Documentation](https://github.com/dasomel/openforge/tree/main/docs)
- **Templates**: [Reusable Templates](https://github.com/dasomel/openforge/tree/main/templates)
