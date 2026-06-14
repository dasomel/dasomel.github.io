# 프로젝트 지침 (dasomel.github.io)

Next.js 15 + next-intl 정적 사이트(GitHub Pages, `output: export`). 빌드: `npm run build`, 린트: `npm run lint`.

## ⚠️ package-lock.json 재생성 규칙 (CI 빌드 깨짐 방지)

CI는 **Linux + Node 22(npm 10)** 에서 `npm ci`로 설치한다. macOS(특히 Apple Silicon) 로컬에서 lock을 생성하면 두 가지가 어긋나 **로컬은 통과하지만 CI는 실패**한다. 반드시 아래를 지킨다.

1. **플랫폼별 optional 네이티브 의존성을 모두 보존할 것.**
   `next-intl` → `@parcel/watcher`는 13개 플랫폼 변종(`linux-x64-glibc` 등)을 갖는다. macOS에서 `package-lock.json`을 **삭제 후 재생성**하면 호스트(`darwin-arm64`)만 기록되어 CI(linux)에서 `No prebuild or local build of @parcel/watcher found` 빌드 에러가 난다.
   - **lock을 처음부터 새로 만들지 말 것.** 기존 lock을 유지한 채 `npm install --package-lock-only`로 *보강*만 하면 기존 플랫폼 변종이 보존된다.
   - 부득이 새로 만들었다면, 머지/푸시 전에 13개 변종 존재를 확인:
     ```bash
     node -e "const l=require('./package-lock.json');console.log(Object.keys(l.packages).filter(p=>p.includes('@parcel/watcher-')).length)"  # 13 이어야 함
     ```

2. **CI와 동일한 npm으로 검증할 것.** 로컬 npm 11은 `npm ci`에 관대하지만(예: `@swc/helpers@0.5.23` 중첩 항목 생략 허용) CI npm 10은 엄격하다. 푸시 전 반드시:
   ```bash
   rm -rf node_modules && npx -y npm@10 ci && npm run build
   ```
   `npm ci`가 `EUSAGE ... can only install packages when ... in sync`로 실패하면 lock 불일치다.

3. **버전 드리프트 주의.** `package-lock.json`을 새로 생성하면 `^` 범위 의존성이 최신으로 튄다. 과거 `next-intl`이 `^4.9.1`→`4.13.0`으로 드리프트하며 `@parcel/watcher` 빌드 의존성을 새로 끌어와 CI가 깨졌다. 현재 `next-intl`은 `~4.11.2`로 고정되어 있으니 함부로 올리지 말 것.

## 개발 서버 / 빌드 동시 실행 금지

`npm run dev` 실행 중에 같은 디렉토리에서 `npm run build`를 돌리면 `.next` 캐시가 깨져 dev 서버가 `Cannot find module './XXXX.js'` 런타임 에러를 낸다. 빌드 검증이 필요하면 dev 서버를 먼저 종료한다.

## 콘텐츠

`src/content/projects/*.md`는 각 GitHub repo의 실제 상태를 반영한다(ko/en 1:1). 최신화 시 추측하지 말고 `gh`로 README/태그/릴리스를 확인한 사실만 반영한다.
