# Changelog

## [2026-02-04]

### Security

- `fast-xml-parser` 보안 취약점 수정 (High severity)
  - RangeError DoS Numeric Entities Bug 해결
  - [GHSA-37qj-frw5-hhjh](https://github.com/advisories/GHSA-37qj-frw5-hhjh)

### Known Issues

- `@lhci/cli` 의존성의 `tmp` 패키지에 low severity 취약점 존재
  - 개발 도구 전용이며 production에 영향 없음
  - upstream 패키지 업데이트 대기 중
