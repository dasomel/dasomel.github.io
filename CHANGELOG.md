# Changelog

## [2026-04-15]

### Design — Narrative Authority 사이트 전체 재설계

- **홈페이지**: Hero 개인화 ("개발자에서 클라우드 인프라까지, N년의 여정"), Impact Bar (동적 계산), Featured Work (문제→해결 스토리 카드), Speaking Highlights
- **About**: 내러티브 인트로, 역할 카드 3개, 커뮤니티 활동 (CloudBro/OPA/OPDC), 멘토링 9건, 전문가 활동 7건, 수상 이력 12건, 연구보고서 5편, 컨퍼런스 월, 오픈소스 기여, 프로필 이미지
- **Speaking**: Summary Stats, Highlights, 타임라인 UI
- **Work**: 태그 필터, 케이스 스터디 카드 (문제/해결 2컬럼), 컴팩트 카드
- **Blog**: 태그 필터, 추천글 상단 고정, 읽기 시간 표시
- **네비게이션**: Projects→Work, Seminars→Speaking, Posts→Blog 라벨 변경
- **디자인 시스템**: 전 페이지 CSS 변수 기반 디자인 토큰 통일

### Features

- `rehype-pretty-code` + `shiki` 코드 블록 구문 하이라이트 추가
- `remark-gfm` GFM 테이블 지원 추가
- `mermaid` 아키텍처 다이어그램 렌더링 지원
- 공통 컴포넌트: `ImpactStats`, `TagFilter`, `FeaturedCard`
- Terraboard 아키텍처 ASCII → Mermaid 다이어그램 변환
- OpenMetadata, KakaoCloud Terraform Provider 오픈소스 기여 반영

### Content

- 2025~2026년 세미나 8건 추가 (CloudBro, 숭실대, OpenInfra Days Korea 등)
- 2016~2024년 누락 세미나 13건 추가
- 수상 이력 실데이터 12건 반영
- 멘토링 활동 9건, 전문가 활동 7건, 연구보고서 5편 반영
- 문구 수정: K-PaaS Lite 파운더, 커뮤니티 참여 표현 변경

### Fixes

- Docs 사이드바 `/ko` 로케일 프리픽스 누락 수정
- MDX `prose` 이중 래핑 제거
- GFM 테이블 렌더링 수정

## [2026-02-26]

### Security

- npm 의존성 보안 취약점 수정 (`npm audit fix`)
  - `basic-ftp` 5.1.0→5.2.0: Path Traversal 취약점 수정 (Critical) ([GHSA-5rq4-664w-9x2c](https://github.com/advisories/GHSA-5rq4-664w-9x2c))
  - `rollup` 4.55.1→4.59.0: Arbitrary File Write via Path Traversal 취약점 수정 (High) ([GHSA-mw96-cpmx-2vgc](https://github.com/advisories/GHSA-mw96-cpmx-2vgc))

### Known Issues

- `@lhci/cli` 의존성 체인의 `tmp` 패키지 Low severity 취약점 4건 잔존
  - 개발 도구(Lighthouse CI) 전용이며 production에 영향 없음
  - `--force` 적용 시 `@lhci/cli` 다운그레이드로 기능 손상 → upstream 업데이트 대기 중

## [2026-02-25]

### Security

- npm 의존성 보안 취약점 수정 (`npm audit fix`)
  - `fast-xml-parser` Critical severity 취약점 2건 수정
    - DOCTYPE 엔티티 확장을 통한 DoS ([GHSA-jmr7-xgp7-cmfj](https://github.com/advisories/GHSA-jmr7-xgp7-cmfj))
    - 정규식 인젝션을 통한 엔티티 인코딩 우회 ([GHSA-m7jm-9gc2-mpf2](https://github.com/advisories/GHSA-m7jm-9gc2-mpf2))
  - `devalue` 취약점 2건 수정
    - 희소 배열을 통한 CPU/메모리 증폭 ([GHSA-33hq-fvwr-56pm](https://github.com/advisories/GHSA-33hq-fvwr-56pm))
    - 프로토타입 오염 ([GHSA-8qm3-746x-r74r](https://github.com/advisories/GHSA-8qm3-746x-r74r))
  - `qs` arrayLimit 우회 DoS 수정 ([GHSA-w7fw-mjwx-w883](https://github.com/advisories/GHSA-w7fw-mjwx-w883))

### Known Issues

- `@lhci/cli` 의존성 체인의 `minimatch` ReDoS 취약점 (High) 8건 잔존
  - 개발 도구(Lighthouse CI) 전용이며 production에 영향 없음
  - `--force` 적용 시 `@lhci/cli` 다운그레이드로 기능 손상 → upstream 업데이트 대기 중

## [2026-02-04]

### Security

- `fast-xml-parser` 보안 취약점 수정 (High severity)
  - RangeError DoS Numeric Entities Bug 해결
  - [GHSA-37qj-frw5-hhjh](https://github.com/advisories/GHSA-37qj-frw5-hhjh)

### Known Issues

- `@lhci/cli` 의존성의 `tmp` 패키지에 low severity 취약점 존재
  - 개발 도구 전용이며 production에 영향 없음
  - upstream 패키지 업데이트 대기 중
