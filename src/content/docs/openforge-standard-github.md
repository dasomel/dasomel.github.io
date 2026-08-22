---
title: GitHub 운영 표준
description: Issue, PR, 브랜치 보호 및 협업 메인테이너 워크플로 베이스라인.
project: OpenForge
path: openforge/standards/github
order: 1013
lastModified: 2026-08-23
---

# GitHub 운영 표준

GitHub는 모든 변경 사항을 투명하게 기록하고 검증하는 협업 플랫폼입니다.

## 표준 운영 규칙

- **Issue Templates**: 버그 리포트, 기능 제안, 기술 질문, 보안 취약점 보고용 서식을 제공합니다.
- **PR Template**: 변경 배경, 해결 방법, 테스트 증거(명령어 및 실행 결과), 연관 이슈 번호를 필수로 기재합니다.
- **Branch Protection**: 기본 브랜치(`main`)에 대한 직접 푸시를 금지하고, CI 통과 및 승인 후 Squash Merge를 원칙으로 합니다.
- **라벨링 체계**: `kind/*`, `area/*`, `status/*`, `risk/*` 접두사로 이슈와 PR을 체계적으로 분류합니다.

## 원문 및 권위 소스 (Canonical Source)

- [GitHub Standard](https://github.com/dasomel/openforge/blob/main/docs/github.md)
