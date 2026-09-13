# 보안 정책 (Security Policy)

[English](SECURITY.md) | 한국어

## 지원 대상 버전

| 버전 | 지원 여부 |
| ---- | -------- |
| 최신 main 브랜치 | :white_check_mark: |

## 보안 범위 및 정적 콘텐츠

`dasomel.github.io`는 GitHub Pages에 호스팅되는 Next.js 기반 정적 기술 블로그 및 커뮤니티 포털입니다.
- 사용자 인증 정보나 서버 데이터베이스, 인프라 비밀번호를 처리하지 않습니다.
- XSS 방지를 위해 모든 MDX 및 HTML 렌더링 파이프라인에서 입력 살균 처리를 수행합니다.

## 취약점 보고 절차 (Reporting a Vulnerability)

보안 취약점은 공개 이슈로 등록하지 마시고, GitHub Private Vulnerability Reporting을 통해 비공개로 보고해 주십시오. 48시간 이내에 접수 확인 및 조치 계획을 안내합니다.

참조: [OpenForge Security Standard](https://github.com/dasomel/openforge/blob/main/docs/security.md)
