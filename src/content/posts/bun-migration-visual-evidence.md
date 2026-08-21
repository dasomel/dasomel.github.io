---
title: "Bun 1.4 전환 실증 — 속도와 CI 구조를 그래프로 보기"
description: "dasomel.github.io의 Bun 1.4 전환 결과를 GitHub Actions 실측 수치와 시각화로 정리합니다."
pubDate: 2026-08-21
tags: ["Bun", "CI/CD", "GitHub Actions", "Performance", "Next.js", "Engineering"]
featured: false
draft: false
---

## 한눈에 보는 결과

이번 전환에서 가장 중요한 숫자는 세 가지입니다.

| 지표 | 기존 | Bun 전환 후 | 변화 |
| --- | ---: | ---: | ---: |
| Dependency 설치 | 15.26s | **8.99s** | **약 41% 단축** |
| Next.js compile | 10.3s | 9.8s | 거의 동일 |
| 초기 전체 CI | 49.5s | **38.5s** | **약 22% 단축** |

<Mermaid chart={`xychart-beta
    title "Dependency installation time"
    x-axis ["npm ci", "bun install"]
    y-axis "seconds" 0 --> 16
    bar [15.26, 8.99]
`} />

> Bun의 가장 확실한 개선은 Next.js compiler가 아니라 dependency 설치와 tooling layer에서 나타났습니다.

## 1. 왜 전환했는가

기존에는 Node.js와 npm이 각각 다른 역할을 맡았습니다.

<Mermaid chart={`flowchart LR
    A[Next.js] --> N[Node.js]
    B[Automation scripts] --> N
    C[Dependencies] --> P[npm]
    D[CI / Deploy] --> P
    N --> E[실행 환경]
    P --> E
`} />

목표는 Bun을 단순 runtime이 아니라 **package manager + automation runtime + test runner + build tooling**으로 사용하는 것이었습니다.

```text
package-lock.json  →  bun.lock
npm ci             →  bun install
node scripts/...   →  bun scripts/...
npm 중심 CI        →  Bun 1.4 중심 CI
```

Next.js 자체의 Turbopack을 Bun으로 교체한 것은 아닙니다. Next.js는 계속 동일한 build engine을 사용합니다.

## 2. 첫 번째 시도는 실패했다

첫 전환에서는 `package.json`의 build script를 먼저 바꿨습니다.

```diff
- "build": "next build && node scripts/generate-rss.js"
+ "build": "next build && bun scripts/generate-rss.js"
```

CI에는 Bun을 설치했지만 GitHub Pages deployment workflow에는 Bun provisioning이 빠져 있었습니다.

<Mermaid chart={`flowchart TD
    A[Next.js build] --> B[Success]
    B --> C[bun scripts/generate-rss.js]
    C --> D{Pages runner에 Bun 존재?}
    D -- No --> E[bun: not found]
    E --> F[배포 실패]
    D -- Yes --> G[배포 계속]
`} />

실패 원인은 Next.js가 아니라 **source가 요구하는 runtime과 deployment runner가 제공하는 runtime의 불일치**였습니다.

이후 Pages workflow에 `oven-sh/setup-bun@v2`와 Bun 1.4 검증 단계를 추가해 문제를 해결했습니다.

## 3. Dependency 설치가 얼마나 빨라졌나

실제 GitHub-hosted `ubuntu-24.04` runner에서 비교했습니다.

```text
npm ci        15.26s
bun install    8.99s
               └─ 6.27s 감소
```

<Mermaid chart={`xychart-beta
    title "Install time: npm vs Bun"
    x-axis ["npm ci", "bun install"]
    y-axis "seconds" 0 --> 16
    bar [15.26, 8.99]
`} />

**약 41% 단축**입니다.

이 수치는 일반적인 벤치마크가 아니라 이 저장소의 실제 CI 실행 결과입니다.

## 4. 그런데 Next.js build는 거의 그대로였다

Bun migration 후 Next.js compile은 약 9.8초, 기존은 약 10.3초였습니다.

<Mermaid chart={`xychart-beta
    title "Next.js compile time"
    x-axis ["Before", "Bun"]
    y-axis "seconds" 0 --> 12
    bar [10.3, 9.8]
`} />

차이는 작습니다.

따라서 이번 사례에서 **“Bun이 Next.js를 빠르게 만들었다”라고 표현하는 것은 부정확**합니다.

더 정확한 표현은:

> Bun이 dependency와 automation layer의 반복 비용을 줄였다.

입니다.

## 5. 전체 CI는 얼마나 줄었나

초기 migration 단계의 전체 CI도 실제 Actions run에서 비교했습니다.

```text
Before  ≈ 49.5s
After   ≈ 38.5s
```

<Mermaid chart={`xychart-beta
    title "Whole CI runtime"
    x-axis ["Before", "Bun migration"]
    y-axis "seconds" 0 --> 55
    bar [49.5, 38.5]
`} />

약 **11초, 22% 단축**입니다.

중요한 점은 Bun migration 후에 오히려 검증 단계가 늘어났다는 것입니다.

```text
bun install
bun test
bun build smoke test
Next.js build
RSS generation
```

즉 단순히 검증 단계를 제거해서 빨라진 결과가 아닙니다.

## 6. 그 다음에는 CI 구조 자체를 개선했다

Bun migration 이후 PR과 deployment pipeline을 다시 살펴보니 같은 production build를 두 번 수행하고 있었습니다.

<Mermaid chart={`flowchart LR
    A[Pull Request] --> B[PR CI]
    B --> C[Next.js production build]
    C --> D[Merge]
    D --> E[Pages Deploy]
    E --> F[Next.js production build]
`} />

불필요한 중복입니다.

이를 다음처럼 변경했습니다.

<Mermaid chart={`flowchart TD
    A[Pull Request] --> B[Fast PR CI]
    B --> B1[bun install --frozen-lockfile]
    B --> B2[bun test]
    B --> B3[bun build smoke test]
    B --> B4[bun lint]
    B4 --> C[Merge]
    C --> D[Pages Deploy]
    D --> D1[bun install --frozen-lockfile]
    D --> D2[bun test]
    D --> D3[bun lint]
    D --> D4[bun run build]
    D4 --> D5[GitHub Pages]
`} />

역할을 명확하게 나눴습니다.

| Pipeline | 책임 |
| --- | --- |
| PR CI | **머지해도 되는가?** |
| Pages Deploy | **production build와 배포가 가능한가?** |

PR에서는 production build를 제거했고, 실제 production build는 main의 Pages deployment 경계에서 한 번만 수행합니다.

## 7. 최종 toolchain

<Mermaid chart={`flowchart TD
    D[Developer] --> B[Bun 1.4]
    B --> I[bun install]
    B --> T[bun test]
    B --> X[bun build]
    B --> N[Next.js CLI]
    P[Pull Request] --> C[Fast CI]
    C --> T2[bun test]
    C --> X2[Bun bundle smoke test]
    C --> L[bun lint]
    M[main] --> G[Pages Deploy]
    G --> R[bun run build]
    G --> H[GitHub Pages]
`} />

결국 이번 전환의 결과는 단순히 `npm → Bun`이 아닙니다.

```text
Runtime
+ Package Manager
+ Lockfile
+ Automation
+ Test
+ Build tooling
+ CI responsibility
```

를 하나의 일관된 toolchain으로 정리한 것입니다.

## 결론

실측 결과만 보면:

```text
Dependency install   15.26s → 8.99s   ≈ 41% 개선
Initial CI           49.5s → 38.5s    ≈ 22% 개선
Next.js compile      10.3s → 9.8s     ≈ 변화 작음
```

그리고 pipeline 구조까지 개선해 PR에서 불필요한 production build를 제거했습니다.

이번 사례에서 가장 중요한 것은 속도 숫자 하나가 아니라 **실패 → 원인 분리 → runtime 보완 → 실측 → pipeline 단순화**의 순서였습니다.