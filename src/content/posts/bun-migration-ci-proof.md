---
title: "npm에서 Bun으로 전환하기 — 실패 기록부터 CI 실증까지"
description: "dasomel.github.io를 npm 기반에서 Bun 1.4 기반으로 전환한 과정, 최초 실패, 실제 CI 성능 측정, 그리고 PR/배포 빌드 중복 제거를 기록합니다."
pubDate: 2026-08-21
tags: ["Bun", "Next.js", "GitHub Actions", "CI/CD", "Performance", "Developer Experience"]
featured: false
draft: false
---

## 들어가며

개발 도구를 바꾸는 작업은 `package.json`의 명령어 몇 개를 바꾸는 것으로 끝나지 않습니다.

특히 CI/CD가 연결된 웹 프로젝트에서는 **application code, dependency lockfile, automation script, GitHub Actions, 실제 배포 runner가 모두 같은 runtime contract를 이해해야** 합니다.

이번에는 실제 운영 중인 `dasomel.github.io`를 기존 Node.js + npm 중심 환경에서 **Bun 1.4 중심 toolchain**으로 전환했습니다.

최종 구조만 보면 단순합니다.

```text
npm
  ↓
Bun 1.4
```

하지만 실제 migration은 한 번에 끝나지 않았습니다. 첫 시도에서는 GitHub Pages 배포가 `bun: not found`로 실패했고, 이후 runtime provisioning을 보완했습니다. 그 다음 `npm → bun install`, `package-lock.json → bun.lock`, `bun test`, `bun build`까지 단계적으로 전환했습니다.

마지막에는 PR CI와 Pages Deploy가 같은 Next.js production build를 각각 수행하던 구조까지 정리했습니다.

이 글은 **최종 성공 결과만 보여주는 글이 아니라 실패 → 원인 분석 → 수정 → 실증 → pipeline 최적화**의 전체 과정을 기록한 engineering log입니다.

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

GitHub Actions도 npm을 사용했습니다.

```yaml
- name: Setup Node
  uses: actions/setup-node@v6
  with:
    node-version: 24.19.0
    cache: npm

- name: Install dependencies
  run: npm ci --prefer-offline --no-audit --no-fund
```

RSS, Daily Digest, 행사 수집, 프로젝트 metadata 갱신 등의 automation script도 Node.js로 실행됐습니다.

즉 전체 구조는 다음과 같았습니다.

```text
Next.js
  └─ Node.js

automation scripts
  └─ Node.js

package install
  └─ npm

CI / Deploy
  └─ Node + npm
```

---

## 2. 왜 Bun으로 전환했는가

목표는 단순히 package install을 빠르게 만드는 것이 아니었습니다.

repository에 여러 Node.js automation script가 존재하기 때문에 **package manager, script runtime, test tooling을 하나의 toolchain으로 통일**하는 것이 더 중요했습니다.

목표 구조는 다음과 같았습니다.

```text
Next.js
  └─ Bun을 통해 CLI 실행

automation scripts
  └─ Bun

package install
  └─ bun install

lockfile
  └─ bun.lock

CI / Deploy
  └─ Bun 1.4
```

여기서 중요한 구분이 있습니다.

**Next.js의 내부 compiler/Turbopack을 Bun으로 교체한 것은 아닙니다.** Next.js는 그대로 사용하고, 그 위의 dependency/runtime/tooling layer를 Bun으로 통일했습니다.

---

## 3. 첫 번째 전환: Pages 배포가 실패했다

첫 단계에서는 automation script부터 Bun으로 바꿨습니다.

```diff
- "build": "next build && node scripts/generate-rss.js"
+ "build": "next build && bun scripts/generate-rss.js"
```

행사 수집, digest, metadata 관련 script도 `node scripts/...`에서 `bun scripts/...`로 변경했습니다.

또한 프로젝트가 Bun 1.4 이상을 요구하도록 선언했습니다.

```json
"engines": {
  "bun": ">=1.4.0"
}
```

CI에는 Bun을 설치했지만, 이때 **GitHub Pages deployment workflow에는 Bun 설치가 빠져 있었습니다.**

결국 실제 배포에서 다음 흐름으로 실패했습니다.

```text
Next.js build
    ↓
성공
    ↓
bun scripts/generate-rss.js
    ↓
Pages runner에 Bun 없음
    ↓
bun: not found
```

핵심은 Next.js build 자체의 문제가 아니었습니다. **소스가 요구하는 runtime과 deploy runner의 runtime provisioning이 일치하지 않았던 것**입니다.

이 문제는 `a3388fa9` commit에서 Pages workflow에 다음을 추가하면서 해결했습니다.

```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2
  with:
    bun-version: 1.4.0

- name: Verify Bun version
  run: bun --version
```

이 실패가 이번 migration에서 가장 중요한 첫 번째 신호였습니다.

> **Runtime migration은 source code만 바꾸는 작업이 아니라 실행 환경 전체를 바꾸는 작업이다.**

---

## 4. 두 번째 단계: Bun-native toolchain으로 전환

Pages runtime 문제가 해결된 후 본격적으로 package manager까지 전환했습니다.

```text
package-lock.json
      ↓
bun.lock
```

그리고 dependency installation을:

```bash
npm ci
```

에서:

```bash
bun install --frozen-lockfile
```

로 변경했습니다.

Automation script도 전부 Bun 기준으로 맞췄습니다.

```text
node scripts/*.mjs
        ↓
bun scripts/*.mjs
```

그리고 Bun-native 검증을 추가했습니다.

```text
bun test
bun build
```

이제 Bun은 단순히 설치된 runtime이 아니라 **package manager + runtime + test runner + build tooling** 역할을 담당합니다.

---

## 5. GitHub Actions에서 실제 속도를 측정했다

"Bun이 빠르다"는 가정만으로 migration을 평가하지 않고 GitHub Actions 실행 로그에서 실제 시간을 비교했습니다.

비교 환경은 같은 GitHub-hosted `ubuntu-24.04` runner입니다.

### Dependency 설치

기존 npm 기반 실행:

```text
npm ci
≈ 15.26s
```

Bun 전환 후:

```text
bun install --frozen-lockfile --no-progress
694 packages installed [8.99s]
```

측정 결과:

```text
npm ci       15.26s
bun install   8.99s
-------------------
약 6.27초 단축
약 41% 개선
```

즉 이번 migration에서 가장 명확한 성능 개선은 **dependency installation**에서 확인됐습니다.

---

## 6. Next.js build는 거의 빨라지지 않았다

반대로 Next.js 자체 build는 큰 차이가 없었습니다.

실제 로그에서 Next.js compile 단계는 양쪽 모두 10초 안팎이었고 전체 production build 흐름도 약 23~24초 수준이었습니다.

```text
Bun 도입
   ↓
dependency install      ✅ 크게 개선
Next.js/Turbopack build ≈ 거의 동일
```

이 결과는 자연스럽습니다.

이번 migration은 Next.js의 내부 build engine을 교체한 것이 아니라 **package manager와 JavaScript automation runtime을 변경한 것**이기 때문입니다.

따라서 "Bun으로 바꾸면 Next.js build가 2배 빨라진다"와 같은 결론은 이 프로젝트의 실측 결과와 맞지 않습니다.

---

## 7. 전체 migration 단계의 CI도 빨라졌다

초기 Bun-native migration 단계에서 전체 CI job도 비교했습니다.

기존 구조는 약:

```text
checkout
Node setup
npm cache
npm ci
next build
RSS generation
cleanup
```

**약 49.5초**였습니다.

Bun migration 후에는:

```text
checkout
Bun setup
bun cache
bun install
bun test
bun build smoke test
next build
RSS generation
cleanup
```

**약 38.5초**였습니다.

따라서:

```text
49.5s
  ↓
38.5s
```

약 **11초**, 약 **22% 단축**입니다.

여기서 중요한 점은 Bun migration 후에는 `bun test`와 Bun bundle smoke test까지 추가됐다는 것입니다.

즉 **검증 단계는 늘었는데 전체 CI 시간은 더 짧아졌습니다.**

---

## 8. 그런데 한 번 더 pipeline을 개선할 수 있었다

migration이 끝난 뒤 CI 구조 자체를 다시 살펴봤습니다.

PR CI에서:

```text
bun run build
   ↓
Next.js production build
```

를 수행하고, merge 후 Pages Deploy에서도:

```text
bun run build
   ↓
Next.js production build
```

를 다시 수행하고 있었습니다.

즉 같은 변경에 대해 **production build를 두 번 수행**하고 있었습니다.

이건 runtime migration과 별개의 optimization이지만, 실제 migration 과정에서 발견했기 때문에 같이 정리했습니다.

---

## 9. PR CI는 빠르게, Production build는 Deploy에서 한 번

현재는 역할을 명확하게 분리했습니다.

### PR CI

PR에서는 production build를 제거하고 다음만 수행합니다.

```text
bun install --frozen-lockfile
        ↓
bun test
        ↓
bun build smoke test
        ↓
bun lint
```

PR CI의 질문은 단순합니다.

> **"이 변경을 main에 병합해도 되는가?"**

### Pages Deploy

main에 merge되면 실제 production build는 Pages workflow에서만 수행합니다.

```text
bun install --frozen-lockfile
        ↓
bun test
        ↓
bun lint
        ↓
bun run build
        ↓
GitHub Pages deploy
```

Pages Deploy의 질문은 다릅니다.

> **"실제 production build와 배포가 가능한가?"**

이렇게 하면 PR마다 수백 개의 정적 페이지를 다시 생성하지 않아도 되고, production build 자체는 최종 배포 직전에 반드시 수행됩니다.

실제 적용한 PR CI에서는 `bun test`, Bun bundle smoke test, lint가 모두 성공했고, Next.js production build 단계는 제거되었습니다.

---

## 10. 최종 구조

현재 toolchain은 다음과 같습니다.

```text
Developer
   │
   └─ Bun 1.4
       ├─ bun install
       ├─ bun test
       ├─ bun build
       └─ Next.js CLI

Pull Request
   │
   └─ Fast CI
       ├─ bun install --frozen-lockfile
       ├─ bun test
       ├─ bun build smoke test
       └─ bun lint

main
   │
   └─ GitHub Pages Deploy
       ├─ bun install --frozen-lockfile
       ├─ bun test
       ├─ bun lint
       ├─ bun run build
       └─ Pages deploy
```

이 구조에서 중요한 것은 **Bun을 추가한 것이 아니라 repository 전체의 runtime contract를 명확하게 만든 것**입니다.

---

## 11. 최종 실증 결과

| 항목 | 기존 | Bun 전환 후 | 결과 |
| --- | ---: | ---: | --- |
| Dependency install | 15.26s | 8.99s | 약 41% 단축 |
| Next.js compile | 약 10.3s | 약 9.8s | 큰 차이 없음 |
| 전체 초기 CI | 약 49.5s | 약 38.5s | 약 22% 단축 |
| Test | 별도 Bun test 없음 | `bun test` | 검증 추가 |
| Bundle smoke test | 없음 | `bun build` | 검증 추가 |
| PR production build | 실행 | 제거 | 중복 제거 |
| Main production build | 실행 | 실행 | 최종 배포 경계에서 유지 |

따라서 이번 결과를 가장 정확하게 표현하면:

> **Bun으로 바꿨더니 Next.js가 갑자기 빨라진 것이 아니다. Dependency와 automation layer를 Bun으로 통합하면서 실제 CI가 약 22% 짧아졌고, 이후 PR/Deploy의 중복 production build도 제거해 pipeline 효율을 추가로 높였다.**

---

## 12. 마이그레이션에서 얻은 engineering lesson

### Runtime migration은 application code migration과 다르다

```text
package.json 변경
≠
전체 system migration 완료
```

CI, Pages, automation workflow, cache, lockfile까지 함께 봐야 합니다.

### 실제 workflow에서 측정해야 한다

"Bun이 npm보다 빠르다"라는 일반적인 설명보다 이 프로젝트에서 실제로:

```text
15.26s → 8.99s
```

를 측정한 것이 더 중요했습니다.

### Build가 빨라지지 않아도 migration은 의미가 있다

Next.js build가 거의 동일했기 때문에 오히려 개선 영역을 정확하게 분리할 수 있었습니다.

### PR과 Deploy는 같은 역할을 할 필요가 없다

PR은 빠른 품질 검증을 담당하고 production build는 실제 배포 경계에서 수행하도록 분리하는 것이 이 프로젝트에서는 더 효율적이었습니다.

---

## 마무리

이번 Bun 전환은 처음부터 깔끔하게 끝난 작업이 아니었습니다.

첫 시도에서는 실제 배포가 실패했습니다.

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

그 다음 `npm → bun install`, `package-lock.json → bun.lock`, `bun test`, `bun build`까지 확대해 실제 Bun-native toolchain으로 전환했습니다.

마지막으로 PR CI와 Pages Deploy의 production build 중복도 제거했습니다.

최종 실증 결과는:

```text
Dependency install
npm ci        15.26s
bun install    8.99s
             ↓
            약 41% 개선

전체 초기 migration CI
≈49.5s
   ↓
≈38.5s
   ↓
약 22% 개선
```

반면 Next.js build 자체는 거의 동일했습니다.

그래서 이번 결과를 가장 정확하게 표현하면 다음과 같습니다.

> **Runtime migration은 코드 몇 줄을 바꾸는 작업이 아니라 실행 경계 전체를 변경하는 engineering 작업이다.**

그리고 CI/CD에서는 한 단계 더 나아가:

> **PR은 빠르게 검증하고, production build는 실제 배포 경계에서 한 번만 수행한다.**

이번 migration의 가장 큰 성과는 단순한 속도 향상이 아니라, **실패를 통해 구조적 문제를 발견하고 실제 측정으로 개선을 증명한 것**이었습니다.
