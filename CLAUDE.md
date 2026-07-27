# 프로젝트 지침 (dasomel.github.io)

Next.js 15 + next-intl 정적 사이트. `output: export` → GitHub Pages, 커스텀 도메인 **cne.io.kr**.
빌드 `npm run build` · 린트 `npm run lint`(=`eslint .`) · 라우트 `app/[locale]/{posts,projects,docs,seminars,events}/[slug]`.

> 린트는 0 errors / **3 warnings** 상태가 정상이다. 남은 경고는 의도적이거나 오탐이라 룰을 끄지 않고 남겼다 —
> `no-img-element` ×2(`output: export`라 `next/image` 최적화 불가), `no-page-custom-font`(App Router 오탐).
> 새 경고가 붙으면 그건 새로 생긴 것이니 확인할 것.
> **CI는 lint를 돌리지 않는다** — `deploy.yml`의 게이트는 `npm run build` 뿐이다.

**독자는 둘이다.** 세션 오케스트레이터(Opus 5 / Fable 5)와, `agyp`가 이 파일 전문을 주입해 받는 agy 워커다.
그래서 절차 설명이 아니라 **불변식과 함정**만 적고, 워커가 그대로 따를 수 있게 명령형으로 쓴다.
글로벌 `~/.claude/CLAUDE.md`의 라우팅 독트린·팀 기본값이 그대로 적용되며, 아래는 이 저장소에만 해당하는 차이다.

## 위임 기준 (이 저장소 한정)

| 작업 | 경로 |
|---|---|
| 워크플로 YAML, `package.json`/lock, `CLAUDE.md` | 직접 (컨텍스트가 곧 판단 근거) |
| 콘텐츠 md 다건 생성/번역, 컴포넌트 작성 | **`agyp`** 레인 (Flash High) |
| `gh run`/`gh api` 로그 파헤치기, 대량 grep | 서브에이전트 — 요약 200단어 이하 |
| 배포 파이프라인 변경 | 직접 + 실제 런으로 실증 (아래 참조) |

**이 저장소에 agy를 던질 때는 반드시 `agyp`.** raw `agy -p`는 프로젝트 컨텍스트를 전혀 못 읽어서
아래 lock 규칙과 배포 트리거 불변식이 워커에게 도달하지 않는다. 모르는 워커는 lock을 재생성하고 CI를 깬다.

**워커 하드 제약** — 아래는 오케스트레이터가 판단할 일이니 워커 레인에서 직접 하지 말 것:
`npm install`/lock 갱신(보강이 필요하면 보고), `git push`·PR 머지·`gh workflow run`, dev 서버 실행 중 `npm run build`.

**빌드/배포 주장은 항상 실측으로 증명한다.** 타입체크 통과나 워크플로 `success`는 발행 성공의 증거가 아니다 —
Pages 배포 SHA(`gh api repos/dasomel/dasomel.github.io/deployments`)와 라이브 URL 응답 코드까지 확인한다.

## ⚠️ 배포 트리거: 봇 커밋은 `on: push`를 발동시키지 못한다

GitHub 재귀 실행 방지 정책 — `GITHUB_TOKEN`으로 수행한 push/merge는 다른 워크플로를 트리거하지 않는다.
`deploy.yml`은 `on: push`가 주 트리거이므로, **봇이 main에 커밋하는 모든 경로는 배포를 명시적으로 깨워야 한다.**

```yaml
permissions:
  actions: write            # dispatch에 필수
...
      - name: Trigger Pages deploy
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: gh workflow run deploy.yml --repo "${{ github.repository }}" --ref main
```

`workflow_dispatch`/`repository_dispatch`는 이 제약의 **명시적 예외**라 PAT 없이 동작한다 (2026-07-25 실증:
`update-events` 봇 push → `event=workflow_dispatch` deploy 런 생성 → Pages SHA `0fd6586` 갱신).

- 2026-07-24 사고: fallback 자동 머지 도입 직후 발행이 멈췄다. 그전까지는 사람이 매일 draft PR을 수동 머지했고
  **그 사람 push가 배포를 대신 트리거해** 결함이 가려져 있었다. 행사 데이터 봇 커밋은 그 이전부터 한 번도 자체 배포된 적이 없다.
- `deploy.yml`에 02:40 UTC 스케줄 백스톱이 있다. dispatch가 빠져도 하루 한 번은 복구되지만, **백스톱에 의존하지 말 것** —
  main에 커밋하는 새 워크플로를 추가하면 dispatch 단계도 같이 추가한다.

## 발행 파이프라인 — 목표 발행 시각은 **오전(08:25~09:30 KST)**

```
daily-digest    (21:40 UTC, 실제 ~22:30Z)  →  draft PR 생성        ≈ 07:30 KST
   └─ [선택] 보강 태스크: ✨ AI 요약 보강 커밋                      ← 창 45~90분
   └─ digest-fallback (23:25 UTC)          →  머지 + deploy dispatch ≈ 08:25 KST
update-events   (23:30 UTC)                →  봇 커밋 + dispatch
deploy (push | dispatch | 02:40 UTC 백스톱) →  Pages
```

**스케줄 지연을 상수로 보지 말 것.** GitHub 예약 실행은 항상 늦게 뜨고, 편차는 슬롯 혼잡도를 탄다.
관측치: `daily-digest`(21:40, 정시 회피) 지연 48~59분으로 매우 일정. `digest-fallback`이 정시(`0 8`)였을 때 87분·127분.
**정시(top-of-hour)를 피하는 것만으로 지연이 줄어든다** — 새 cron을 넣을 때 `0 *`를 쓰지 말 것.
시각을 앞당길 때는 앞 단계의 최대 지연 + 작업시간을 빼고 계산한다. `23:25`는 draft 생성 최악(22:41Z) 대비 44분 여유다.

- `digest-fallback`은 대상을 **브랜치명(`daily-digest/*`)** 으로 찾는다. 제목의 KST 날짜로 찾던 시절에는
  digest 런 지연(cron 21:40 UTC → 실제 ~22:30Z)이 자정을 넘기면 발행이 조용히 멈출 수 있었다. 날짜 매칭으로 되돌리지 말 것.
  밀린 날짜가 여러 건이면 오름차순으로 함께 회수한다.
- 다이제스트 PR은 `draft: true`로 생성된다. 발행이 사람에게 의존하는 구조라 fallback이 실질적 발행 경로다.

## AI 보강은 CI 밖에서 돈다 — 산출물은 반드시 스크립트로 커밋한다

보강은 로컬 Mac의 Claude **구독** 세션(`~/Claude/Scheduled/daily-digest-enrich/`)이 수행한다.
API 키를 쓰지 않는 게 설계 전제라(`scripts/digest-enrich-prompt.md`) CI로 옮기면 토큰 비용이 생긴다.
대가는 이 경로가 **CI 밖**이라는 것 — Mac이 깨어 있어야 하고, 세션이 중간에 죽어도 아무도 모른다.

**보강 산출물은 손으로 커밋하지 말고 이 명령 하나로 끝낸다:**

```bash
npm run digest:enrich-publish     # 검증 → 마크다운 재생성 → 커밋 → push
```

멱등하다. 이전 실행이 남긴 잔류분을 회수하고, 이미 끝난 일은 건너뛰고, 할 게 없으면 0으로 끝난다.
상태가 이상하면 **거부한다**(잘못된 커밋이 놓친 커밋보다 나쁘다): 다른 브랜치 위, 보강 필드 0건,
원격과 분기 — 전부 비정상 종료 + 조치 안내. 강제 푸시는 하지 않는다.

- **마감은 fallback 머지 시각**(08:25 KST + 지연). 그 전에 push 되지 않으면 원문이 발행된다.
- 2026-07-24~26 연속 3일 보강이 유실됐다. 07-26은 산출물이 작업 트리에 있었는데 커밋 단계가
  실행되지 않아 2시간 넘게 방치됐다 — 워크플로는 전부 초록이었다. 이 스크립트가 그 구간을 없앤다.

**조용한 no-op을 만들지 말 것.** `gh ... || true` 로 실패를 삼키면 "머지할 것 없음"과 구분되지 않아
발행이 멈춰도 워크플로는 초록으로 뜬다. 이번 사고의 본질이 그것이다 — 실패는 `::error::` + 비정상 종료로 드러낸다.

## ⚠️ package-lock.json 규칙 (CI 빌드 깨짐 방지)

CI는 **Linux + Node 22(npm 10)** 에서 `npm ci`. macOS(Apple Silicon) 로컬과 어긋나 **로컬 통과 / CI 실패**가 난다.

1. **lock을 처음부터 새로 만들지 말 것.** 기존 lock 유지 + `npm install --package-lock-only`로 *보강*만 한다.
   전체 재생성하면 `@parcel/watcher`(next-intl 경유)의 13개 플랫폼 변종 중 호스트(`darwin-arm64`)만 남아
   CI에서 `No prebuild or local build of @parcel/watcher found`로 깨진다.
   ```bash
   node -e "const l=require('./package-lock.json');console.log(Object.keys(l.packages).filter(p=>p.includes('@parcel/watcher-')).length)"  # 13
   ```
2. **CI와 같은 npm으로 검증.** 로컬 npm 11은 관대하고 CI npm 10은 엄격하다. 푸시 전 반드시:
   ```bash
   rm -rf node_modules .next && npx -y npm@10 ci && npm run build
   ```
   `EUSAGE ... can only install packages when ... in sync` = lock 불일치.
3. **버전 드리프트 주의.** `^` 범위가 최신으로 튄다. `next-intl`은 `~4.11.2` 고정 — 함부로 올리지 말 것
   (과거 `^4.9.1`→`4.13.0` 드리프트가 `@parcel/watcher`를 끌어와 CI를 깼다).
4. **overrides는 직접 의존성 범위와 일치해야 한다.** 어긋나면 `EOVERRIDE ... conflicts with direct dependency`로
   install 자체가 실패한다. 전이 의존성만 있고 버전대가 갈리면 선택자 문법을 쓴다: `"js-yaml@^3.0.0": "^3.15.0"`.

## 개발 서버 / 빌드 동시 실행 금지

`npm run dev` 중에 같은 디렉토리에서 `npm run build`를 돌리면 `.next` 캐시가 깨져 dev 서버가
`Cannot find module './XXXX.js'`를 낸다. 검증 전 dev 서버를 먼저 종료한다.
종료 직후 `rm -rf node_modules`는 잔여 쓰기와 경합해 `Directory not empty`로 실패할 수 있다 — 프로세스 소멸을 확인하고 지운다.

## 콘텐츠

`src/content/projects/*.md`는 각 GitHub repo의 **실제 상태**를 반영한다(ko/en 1:1).
최신화 시 추측하지 말고 `gh`로 README/태그/릴리스를 확인한 사실만 반영한다.
