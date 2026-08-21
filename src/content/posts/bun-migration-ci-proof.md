---
title: "npm에서 Bun으로 전환하기 — 실패 기록부터 CI 실증까지"
description: "dasomel.github.io를 npm 기반에서 Bun 1.4 기반으로 전환한 과정과 최초 실패, CI 수정, 그리고 GitHub Actions에서 실제로 측정한 성능 개선을 기록합니다."
pubDate: 2026-08-21
tags: ["Bun", "Next.js", "GitHub Actions", "CI/CD", "Performance", "Developer Experience"]
featured: false
draft: false
---

## 들어가며

개발 도구를 바꾸는 작업은 `package.json`의 명령어 몇 개를 바꾸는 것으로 끝나지 않습니다.

특히 CI/CD가 연결된 웹 프로젝트에서는 **로컬 개발 환경, dependency lockfile, 자동화 스크립트, GitHub Actions, Pages 배포 환경이 모두 같은 runtime을 이해해야** 합니다.

이번에는 실제 운영 중인 `dasomel.github.io`에서 기존 npm 기반 workflow를 **Bun 1.4** 중심으로 전환했습니다.

결과만 보면 꽤 단순합니다.

```text
npm
  ↓
Bun 1.4
```

하지만 실제 과정은 한 번에 끝나지 않았습니다.

첫 번째 시도에서는 **빌드 스크립트가 Bun을 호출하도록 바꿨지만 GitHub Pages workflow에는 Bun runtime을 설치하지 않아 배포가 실패**했습니다. 이후 CI와 Pages workflow를 다시 정리하고, dependency install도 Bun으로 전환한 뒤 실제 Actions 실행 시간을 비교했습니다.

이 글은 "Bun이 빠르다"는 소개가 아니라, **실패를 포함한 전환 과정과 실제 CI에서 측정한 결과**를 남기는 기록입니다.

---

## 1. 전환 전 상태

기존 프로젝트는 Node.js + npm을 중심으로 구성되어 있었습니다.

대표적인 build script는 다음과 같았습니다.

```json
{
  "scripts": {
    "build": "next build && node scripts/generate-rss.js"
  }
}
```

GitHub Actions에서도 dependency 설치는 다음과 같은 방식이었습니다.

```yaml
- name: Setup Node
  uses: actions/setup-node@v6
  with:
    node-version: 24.19.0
    cache: npm

- name: Install dependencies
  run: npm ci --prefer-offline --no-audit --no-fund
```

즉, Node.js가 실행 runtime이고 npm이 package manager이면서 프로젝트 automation script도 Node.js로 실행하는 구조였습니다.

---

## 2. 왜 Bun으로 전환했는가

이번 전환의 목적은 단순히 "더 빠른 package manager"를 찾는 것이 아니었습니다.

프로젝트에는 RSS 생성, daily digest, 행사 수집, 프로젝트 metadata 갱신 등 Node.js로 작성된 automation script가 여러 개 존재합니다.

기존에는 다음과 같이 섞여 있었습니다.

```text
Next.js
  └─ Node.js

automation scripts
  └─ Node.js

package install
  └─ npm

CI
  └─ Node + npm
```

이를 다음처럼 단순화하는 것이 1차 목표였습니다.

```text
Next.js
  └─ Bun을 통해 실행

automation scripts
  └─ Bun으로 실행

package install
  └─ bun install

CI
  └─ Bun 1.4
```

다만 Next.js 자체의 빌드 엔진을 Bun으로 교체하는 것은 아닙니다. 이 프로젝트에서는 **dependency/runtime/tooling layer를 Bun으로 정리하고 Next.js/Turbopack은 그대로 사용**했습니다.

---

## 3. 첫 번째 전환: 생각보다 빨리 실패했다

첫 단계에서는 자동화 script부터 Bun을 도입했습니다.

`package.json`의 명령들을 다음과 같이 변경했습니다.

```diff
- "build": "next build && node scripts/generate-rss.js"
+ "build": "next build && bun scripts/generate-rss.js"
```

그리고 행사 수집, digest, metadata 관련 script도 Node 대신 Bun을 호출하도록 변경했습니다.

또한 Bun 1.4를 사용한다는 명시적 요구사항을 추가했습니다.

```json
"engines": {
  "bun": ">=1.4.0"
}
```

이 변경은 CI workflow에도 적용됐지만, 처음부터 모든 workflow를 완전히 동일하게 바꾸지는 않았습니다. 초기 단계에서는 기존 npm lockfile을 유지하면서 Bun runtime을 추가하는 방식으로 위험을 낮췄습니다.

그런데 바로 문제가 발생했습니다.

### 문제는 Pages workflow였다

build script가 이제 다음을 실행합니다.

```text
next build
  ↓
bun scripts/generate-rss.js
```

그런데 GitHub Pages deployment workflow에는 Bun이 설치되어 있지 않았습니다.

즉,

```text
CI에서 Bun 사용
       ↓
✅ Bun 존재

Pages deployment
       ↓
❌ Bun 없음
       ↓
bun: command not found
```

이 문제를 해결하기 위해 실제 commit `a3388fa9`에서 Pages workflow에 다음을 추가했습니다.

```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2
  with:
    bun-version: 1.4.0

- name: Verify Bun version
  run: bun --version
```

이 수정의 핵심은 **빌드 스크립트가 사용하는 runtime을 배포 workflow에서도 명시적으로 설치하는 것**이었습니다. urlPages workflow에 Bun runtime을 추가한 commithttps://github.com/dasomel/dasomel.github.io/commit/a3388fa9b8ca4258d2573011bc2cd67d132e593d

---

## 4. 실패에서 얻은 첫 번째 원칙

이 실패는 단순한 CI 설정 누락처럼 보이지만, runtime migration에서는 중요한 교훈을 줍니다.

> **소스 코드가 요구하는 runtime과 실행 환경의 runtime은 하나의 변경 단위로 봐야 합니다.**

로컬에서 다음이 동작한다고 해서 충분하지 않습니다.

```bash
bun run build
```

다음 환경도 모두 확인해야 합니다.

```text
Local
CI validation
Automation workflow
Pages deployment
```

이번 실패도 정확히 이 지점에서 발생했습니다.

---

## 5. 두 번째 단계: automation 전체를 Bun으로 이동

첫 실패를 해결한 다음 repository 전체 automation을 다시 정리했습니다.

2026년 8월 21일의 migration commit에서는 다음과 같은 변화가 들어갔습니다.

### package manager

```text
package-lock.json
      ↓
bun.lock
```

### scripts

```text
node scripts/xxx.mjs
      ↓
bun scripts/xxx.mjs
```

### build

```text
next build && node scripts/generate-rss.js
      ↓
next build && bun scripts/generate-rss.js
```

### CI

CI에서는 Bun 1.4를 명시적으로 설치하고 버전도 검증하도록 했습니다.

```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2
  with:
    bun-version: 1.4.0

- name: Verify Bun version
  run: bun --version
```

또한 단순히 build만 실행하는 것이 아니라 Bun runtime 자체가 프로젝트 요구사항을 충족하는지 검증하는 테스트도 추가했습니다.

```text
bun test
bun run build:tools
bun run build
```

이 변경의 전체 내용은 migration commit에서 확인할 수 있습니다. urlBun 1.4 toolchain migration commithttps://github.com/dasomel/dasomel.github.io/commit/28b7ed41836b266610978d30a7c58b9582696d7d

---

## 6. CI에서 실제 속도를 비교했다

여기서 중요한 것은 "Bun이 빠르다"고 가정하지 않고 **GitHub Actions의 실제 실행 로그를 비교한 것**입니다.

비교 대상은 같은 GitHub-hosted runner인 `ubuntu-24.04`에서 실행된 workflow입니다.

### dependency 설치 시간

기존 npm 기반 실행에서는:

```text
npm ci
added 690 packages in 15s
```

로그 timestamp 기준으로 약 **15.26초**가 걸렸습니다.

Bun 전환 후에는:

```text
bun install --frozen-lockfile --no-progress
694 packages installed [8.99s]
```

약 **8.99초**였습니다.

따라서 dependency 설치만 놓고 보면:

```text
npm ci       15.26s
bun install   8.99s
-------------------
차이          6.27s
개선율       약 41%
```

정도가 측정됐습니다.

---

## 7. 그런데 Next.js build는 거의 빨라지지 않았다

여기서 재미있는 결과가 하나 나왔습니다.

기존 build의 Next.js 컴파일 단계는 약 **10.3초**였고,

Bun 전환 후에는 약 **9.8초**였습니다.

전체 Next.js build 흐름도 약 **23초대**로 거의 비슷했습니다.

즉,

```text
Bun 도입
   ↓
dependency 설치 개선      ✅ 크게 개선
Next.js/Turbopack build   ≈ 거의 동일
```

이었습니다.

이 결과는 자연스럽습니다.

이번 작업은 Next.js의 내부 빌드 엔진을 바꾼 것이 아니라 **package manager와 JavaScript automation runtime을 Bun으로 바꾼 것**이기 때문입니다.

따라서 이 프로젝트에서 Bun 도입의 가장 확실한 성능 효과는 **dependency installation과 tooling startup 영역**에 나타났습니다.

---

## 8. 전체 CI job 시간도 줄었다

실제 workflow 전체를 비교하면 차이는 더 분명해집니다.

### 기존 workflow

```text
checkout
Node setup
npm cache restore
Bun setup
npm ci
next build
RSS generation
cleanup
```

약 **49초대**였습니다.

### 현재 workflow

```text
checkout
Bun setup
bun cache restore
bun install
bun test
bun build smoke test
next build
RSS generation
cleanup
```

약 **38.5초**였습니다.

즉 전체 job 기준으로:

```text
기존       ≈ 49.5s
현재       ≈ 38.5s
-------------------
약 11초 단축
약 22% 개선
```

을 확인했습니다.

중요한 것은 현재 workflow가 단순히 기존 단계를 제거한 결과가 아니라는 점입니다.

현재는 오히려 다음 검증 단계가 추가되어 있습니다.

```text
bun test
bun run build:tools
```

즉 **검증을 늘리면서도 전체 CI가 더 짧아졌습니다.**

---

## 9. GitHub Actions 로그에서 확인한 실제 결과

이번 비교에서 사용한 로그의 핵심 수치는 다음과 같습니다.

| 항목 | npm 기반 | Bun 기반 |
| --- | ---: | ---: |
| dependency install | 15.26s | 8.99s |
| Next.js compile | 10.3s | 9.8s |
| 전체 build 흐름 | 약 23s | 약 24s |
| 전체 CI job | 약 49.5s | 약 38.5s |
| 테스트 | 기존 없음 | `bun test` |
| tool bundle smoke test | 없음 | `bun build` |

따라서 이번 migration을 한 줄로 정리하면 다음과 같습니다.

> **Next.js 빌드 자체를 극적으로 빠르게 만든 것은 아니지만, dependency와 automation layer를 Bun으로 통합하면서 전체 CI 시간을 약 22% 줄였다.**

---

## 10. 전환 과정에서 한 번 더 문제가 있었다

migration 마지막 단계에서는 CI가 정상화됐지만 Pages workflow에서 Bun setup이 중복으로 들어간 부분도 발견했습니다.

즉,

```text
Setup Bun
Verify Bun
...
Setup Bun
Verify Bun
```

형태가 만들어졌습니다.

기능적으로는 동작하지만 필요 없는 중복이었습니다.

그래서 마지막으로 `756b3662` commit에서 **Pages deployment의 Bun setup을 하나로 정리**했습니다.

이 과정까지 포함하면 이번 작업은 단순한 migration이 아니라 다음과 같은 검증/정리 사이클이었습니다.

```text
1. Bun 도입
      ↓
2. Pages 실패
      ↓
3. runtime 누락 원인 분석
      ↓
4. Pages에 Bun 명시
      ↓
5. dependency까지 Bun으로 전환
      ↓
6. test/smoke test 추가
      ↓
7. 실제 CI 시간 비교
      ↓
8. 중복 setup 제거
```

이것이 실제 운영 프로젝트에서 runtime을 바꾸는 과정에 더 가깝습니다.

---

## 11. 왜 npm을 바로 버리지 않고 단계적으로 전환했는가

이번 작업에서는 처음부터 모든 것을 한 번에 바꾸지 않았습니다.

그 이유는 lockfile과 deployment 환경을 동시에 바꾸면 문제가 발생했을 때 원인을 분리하기 어려워지기 때문입니다.

초기에는:

```text
Node + npm
        +
Bun runtime
```

형태로 진입했고,

안정화 후:

```text
Bun runtime
+ Bun install
+ bun.lock
+ Bun scripts
```

형태로 전환했습니다.

이런 단계적 migration 덕분에 첫 번째 실패도 "Bun 자체의 문제"가 아니라 **Pages workflow에 runtime provisioning이 빠진 문제**라는 것을 빠르게 분리할 수 있었습니다.

---

## 12. 이번 작업에서 얻은 engineering lesson

이번 migration에서 가장 중요한 결과는 6초의 속도 개선 자체가 아니었습니다.

### Runtime migration은 application code migration과 다르다

```text
package.json 변경
≠
전체 system migration 완료
```

CI, Pages, automation workflow, cache, lockfile까지 같이 봐야 합니다.

### 성능은 실제 workflow에서 측정해야 한다

"Bun이 npm보다 빠르다"라는 일반적인 주장보다 현재 프로젝트에서 실제로 다음을 측정한 것이 더 중요했습니다.

```text
15.26s → 8.99s
```

그리고 전체 workflow도:

```text
≈49.5s → ≈38.5s
```

로 줄어드는 것을 확인했습니다.

### build가 빨라지지 않아도 migration은 의미가 있다

Next.js build가 거의 동일했기 때문에 오히려 결과가 더 명확했습니다.

Bun의 효과를 과장하지 않고 **어디가 실제로 빨라졌는지** 구분할 수 있었습니다.

---

## 13. 최종 구조

현재 프로젝트의 tooling 방향은 다음과 같습니다.

```text
┌───────────────────────────────┐
│       dasomel.github.io       │
├───────────────────────────────┤
│ Next.js 16 + Turbopack        │
│ React 19                      │
│                               │
│ Bun 1.4                       │
│ ├─ package manager            │
│ ├─ automation runtime        │
│ ├─ test runner               │
│ └─ build tooling             │
│                               │
│ GitHub Actions                │
│ ├─ CI                         │
│ ├─ daily digest               │
│ ├─ metadata update            │
│ ├─ event update               │
│ └─ Pages deployment           │
└───────────────────────────────┘
```

핵심은 **Bun을 넣는 것 자체가 목적이 아니라 repository 전체에서 runtime contract를 명확하게 만드는 것**입니다.

---

## 마무리

이번 Bun 전환은 처음부터 깔끔하게 끝난 작업이 아니었습니다.

첫 시도에서는 실제로 배포가 실패했습니다.

```text
build script
   ↓
bun 호출
   ↓
Pages runner
   ↓
Bun 없음
   ↓
실패
```

그 실패를 통해 runtime provisioning이라는 누락된 조건을 확인했고, 이후 CI와 Pages workflow를 모두 정리했습니다.

최종적으로는 실제 GitHub Actions에서 다음 결과를 확인했습니다.

```text
Dependency install
npm ci        15.26s
bun install    8.99s
             ↓
            -41%

전체 CI
≈49.5s
   ↓
≈38.5s
   ↓
약 -22%
```

반면 Next.js build 자체는 거의 동일했습니다.

그래서 이번 결과를 가장 정확하게 표현하면 다음과 같습니다.

> **Bun으로 바꿨더니 Next.js가 갑자기 빨라진 것이 아니다.**
>
> **프로젝트의 dependency와 automation runtime을 Bun으로 통합했고, 그 결과 실제 CI의 반복 작업이 약 22% 짧아졌다.**

그리고 개인적으로 이번 작업에서 가장 의미 있었던 부분은 성능 숫자보다 **실패를 기록하고, 원인을 분리하고, 수정 후 다시 측정했다는 것**입니다.

운영 프로젝트의 tooling migration은 성공한 최종 상태보다 이런 과정이 훨씬 많은 것을 가르쳐 줍니다.
