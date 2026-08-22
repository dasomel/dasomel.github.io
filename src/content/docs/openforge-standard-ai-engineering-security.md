---
title: AI 지원 엔지니어링 보안 표준
description: AI 에이전트 신뢰 경계, 프롬프트 인젝션 방어 및 샌드박스 격리.
project: OpenForge
path: openforge/standards/ai-engineering-security
order: 1028
lastModified: 2026-08-23
---

# AI 지원 엔지니어링 보안 표준

AI 코딩 에이전트와 LLM 도구는 강력한 개발 생산성을 제공하지만, 잠재적으로 신뢰할 수 없는 실행 입력(Untrusted Input)으로 간주해야 합니다.

## AI 보안 통제 원칙

- **신뢰 경계 설정**: AI 에이전트에게 프로덕션 배포 권한이나 원격 Git 푸시 권한을 부여하지 않습니다.
- **프롬프트 인젝션 방어**: 외부 Issue, PR 본문, 웹 콘텐츠를 처리할 때 악의적 지시문이 시스템 프롬프트를 덮어쓰지 못하도록 입력값을 격리합니다.
- **샌드박스 실행 제어**: AI가 생성한 스크립트와 명령어는 격리된 컨테이너 환경에서 검증 후 적용합니다.
- **인간 최종 승인**: 모든 코드 변경과 릴리스는 메인테이너의 명시적 검토와 승인을 거쳐야 합니다.

## 원문 및 권위 소스 (Canonical Source)

- [AI-Assisted Engineering Security](https://github.com/dasomel/openforge/blob/main/docs/ai-engineering-security.md)
