---
title: "Mac ARM 환경 대응을 위한 K-PaaS Local Install 2.0.0"
event: "OPA 세미나"
date: 2024-11-15
slides: "https://github.com/dasomel/seminar"
tags: ["K-PaaS", "ARM64", "Mac", "Container", "Docker"]
---

## 발표 개요

Apple Silicon(M1/M2/M3) Mac 환경에서 K-PaaS를 로컬로 설치하고 운영할 수 있는 방법을 소개합니다.

## 주요 내용

### ARM64 아키텍처 대응
- 기존 x86_64 기반 이미지의 한계
- 멀티아키텍처 이미지 빌드 전략
- Harbor 레지스트리를 활용한 이미지 배포

### K-PaaS Local Install 2.0.0
- Vagrant + VirtualBox 대신 Docker 기반 환경
- Kind(Kubernetes in Docker) 활용
- 리소스 최적화 및 빠른 구동

### 실습 데모
- 설치 과정 시연
- 주요 컴포넌트 확인
- 트러블슈팅 팁

## 대상 청중

- K-PaaS에 관심 있는 개발자
- Mac ARM 환경에서 클라우드 네이티브 개발을 하고 싶은 분
- 컨테이너 기반 로컬 개발 환경 구축에 관심 있는 분
