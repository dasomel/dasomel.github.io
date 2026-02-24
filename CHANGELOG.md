# Changelog

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
