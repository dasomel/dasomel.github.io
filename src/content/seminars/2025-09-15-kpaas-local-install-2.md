---
title: "Mac ARM 환경 대응을 위한 K-PaaS Local Install 2.0.0"
event: "Cloud Native Korea Community Day 2025"
date: 2025-09-15
slides: ""
tags: ["K-PaaS", "ARM", "Vagrant", "Kubernetes"]
---

## 발표 개요

Cloud Native Korea Community Day 2025에서 K-PaaS 1.6.0 버전을 기반으로 Mac ARM(Apple Silicon)용 설치 자동화 스크립트를 탑재한 K-PaaS Local Install 2.0.0을 선보입니다.

## 주요 내용

### Mac ARM 아키텍처 이식

Vagrant, VirtualBox, Kubespray, Ansible 조합으로 구성된 기존 로컬 설치 구조를 Mac ARM 아키텍처로 완벽히 이식하는 과정을 상세히 다룹니다.

- 기존 x86 기반 설치 구조의 한계
- Apple Silicon 환경에서의 가상화 제약
- ARM 호환 컴포넌트 선정 및 교체 전략

### K-PaaS Local Install 2.0.0 주요 변경사항
- Mac ARM 전용 설치 자동화 스크립트
- K-PaaS 1.6.0 기반 경량화 구성
- Vagrant 및 VirtualBox 대체 방안
- Kubespray + Ansible 기반 클러스터 프로비저닝

### 설치 시연
- Mac ARM 환경에서의 설치 과정 데모
- 주요 컴포넌트 동작 확인
- 트러블슈팅 팁

## 대상 청중

- Mac Apple Silicon 환경에서 K-PaaS를 운영하려는 개발자
- Kubernetes 로컬 환경 구성에 관심 있는 엔지니어
- K-PaaS 기여자 및 커뮤니티 멤버
