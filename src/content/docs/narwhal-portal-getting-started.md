---
title: 개발 환경 설정
description: pnpm 로컬 개발 환경, 환경변수 설정 및 Skaffold 라이브 리로딩 가이드.
project: Narwhal Portal
path: narwhal-portal/getting-started
order: 1202
lastModified: 2026-08-23
---

# 개발 환경 설정

Narwhal Portal을 로컬 머신 또는 쿠버네티스 클러스터에서 개발하고 실행하는 방법입니다.

## 1. 로컬 Standalone 실행 (pnpm)

```bash
# 저장소 클론 및 패키지 설치
git clone https://github.com/dasomel/narwhal-portal.git
cd narwhal-portal
pnpm install

# 환경변수 파일 복사 및 설정
cp .env.example .env.local

# 개발 서버 실행 (포트 3000)
pnpm dev
```

## 2. Skaffold 기반 클러스터 라이브 개발 (Inner-Loop)

로컬 쿠버네티스 클러스터에 포털을 배포하고 코드 수정 시 즉시 컨테이너에 반영합니다:

```bash
# Skaffold 개발 모드 실행
skaffold dev --port-forward
```

- 소스 파일 수정 시 컨테이너 내부로 파일이 자동 동기화(File Sync)됩니다.
- 패키지 추가나 Dockerfile 변경 시 자동으로 컨테이너를 증분 재빌드합니다.
