---
title: "Frontend Toolchain"
description: "블로그 소스가 사용하는 핵심 프레임워크와 도구의 현재 버전, upstream 상태, 업그레이드 전략"
project: "Site"
order: 20
lastModified: 2026-08-20
---

## 기준

이 문서는 `dasomel.github.io` 자체가 사용하는 프론트엔드 도구를 upstream 기준으로 점검한 기록입니다. 버전은 **2026-08-20** 기준이며, 최신 버전이라고 해서 무조건 즉시 적용하지 않고 현재 코드와 호환되는지까지 함께 판단합니다.

## Runtime

| 구성 | 현재 사이트 | upstream 기준 | 판단 |
|---|---:|---:|---|
| Node.js | GitHub Pages build **24.19.0** | 24.19.0 LTS | 적용 |
| Next.js | 15.5.x 계열 | 16.2.9 stable / 15.5.23 backport | 메이저 전환 별도 검증 |
| React | 19.x | 19.2.8 stable | minor refresh 후보 |
| next-intl | 4.x | 4.13.6 | minor refresh 후보 |

Node.js 24.19.0은 현재 LTS 라인으로 GitHub Pages 빌드 런타임을 22에서 올렸습니다.

## Markdown / MDX

| 구성 | 현재 사이트 | upstream 기준 | 판단 |
|---|---:|---:|---|
| next-mdx-remote | 6.0.0 | 6.0.0 | **upstream archived** — migration 필요 |
| rehype-pretty-code | 0.14.x | 0.14.5 | patch refresh 후보 |
| Shiki | 4.x | 4.4.3 | minor refresh 후보 |
| remark-gfm | 4.0.x | 4.0.1 | 최신 안정 버전과 동일 |
| gray-matter | 4.0.x | 4.0.3 | 최신 안정 버전과 동일 |

`next-mdx-remote` 저장소는 2026-04-09에 archive 되었으므로 새 기능이나 보안 수정에 대한 장기적인 upstream 유지보수를 기대하기 어렵습니다. 단기적으로는 현재 구현을 유지하되, 장기적으로 Next.js의 공식 MDX 통합(`@next/mdx`) 또는 정적 빌드 기반 MDX 파이프라인으로 이전하는 것을 목표로 합니다.

## UI / CSS

| 구성 | 현재 사이트 | upstream 기준 | 판단 |
|---|---:|---:|---|
| Tailwind CSS | 3.4.x | 4.3.3 | 메이저 migration 별도 검증 |
| tailwind-merge | 2.x | 2.6.1 (Tailwind 3 계열) / 3.6.0 (Tailwind 4) | Tailwind 3 유지 |
| Lucide React | 0.x | 1.31.0 | 메이저 migration 별도 검증 |
| PostCSS | 8.5.x | 8.5.26 | patch refresh 후보 |
| Autoprefixer | 10.4.x | 10.5.4 | minor refresh 후보 |

Tailwind 4와 Lucide 1.x는 현재 사이트 코드의 utility/class 및 icon API 호환성을 먼저 검증한 뒤 별도 PR로 올리는 것이 안전합니다.

## Build / Quality

| 구성 | 현재 사이트 | upstream 기준 | 판단 |
|---|---:|---:|---|
| ESLint | 9.x | 10.8.1 | 메이저 migration 별도 검증 |
| TypeScript | 5.x | 5.9.3 stable / 7.0.2 latest | 5.9 계열 유지 |
| Mermaid | 11.16.1 | 11.16.1 | 최신 |
| reading-time | 1.5.0 | 1.5.0 | 최신 |
| clsx | 2.1.1 | 2.1.1 | 최신 |

TypeScript 7은 최신이지만 현재 Next.js/MDX 생태계의 호환성 검증 범위를 넓히므로 5.9 계열을 유지합니다.

## 업그레이드 원칙

```text
upstream release
      ↓
compatibility check
      ↓
lockfile refresh
      ↓
static build (344+ pages)
      ↓
visual / route verification
      ↓
merge
```

이 사이트에서는 **최신 버전 그 자체보다 재현 가능한 정적 빌드와 실제 페이지 검증을 우선**합니다.

## 다음 검증 대상

1. React 19.2.x / next-intl 4.13.x / Shiki 4.4.x / rehype-pretty-code 0.14.x의 안정 refresh
2. `next-mdx-remote` → `@next/mdx` 또는 대체 MDX pipeline migration
3. Next.js 16.2.x migration
4. Tailwind CSS 4 migration
5. ESLint 10 migration
6. Lucide 1.x migration
