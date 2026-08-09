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

**기본값은 agy 레인이다.** 한 줄짜리 수정과 아래 '직접' 행을 빼면, 이 저장소의 일은 `agyp` 워커에게
넘기는 것이 정상 경로다. 오케스트레이터 컨텍스트는 판단에 쓰고, 읽기·쓰기 실무는 레인이 한다.

| 작업 | 경로 |
|---|---|
| 워크플로 YAML, `package.json`/lock, `CLAUDE.md` | 직접 (컨텍스트가 곧 판단 근거) |
| `gh workflow run`·PR 머지·`git push`·배포 판단 | 직접 (되돌리기 어렵다) |
| 스크립트/컴포넌트 수정, 콘텐츠 md 다건 생성·번역 | **`agyp`** (Flash High) |
| 발행 상태 점검, `gh run`/`gh api` 로그 파헤치기, 대량 grep | **`agyp`** 읽기 전용 레인 |
| 배포 파이프라인 변경 | 직접 + 실제 런으로 실증 (아래 참조) |

**레인에 던질 때 지킬 것** — 이걸 빠뜨리면 레인이 조용히 헛돌거나 저장소를 망가뜨린다:

- **프롬프트가 항상 첫 인자다.** `agyp "<프롬프트>" --model "…"`. 플래그를 앞에 두면 그게 태스크로
  먹히고 `--model`이 조용히 떨어져 나간다(종료 코드는 0). 태스크와 무관한 응답이 오면 이걸 먼저 의심한다.
- **출력은 파일로 받고 읽어들인다.** stdout을 그대로 메인 컨텍스트에 흘리지 말 것.
- **읽기 전용 레인은 프롬프트에 금지 목록을 명시한다** — 수정 금지, `git`/`gh` 쓰기 금지. 안 적으면 한다.
- **레인 결과를 그대로 믿지 말 것.** 발행·배포·빌드 주장은 오케스트레이터가 핵심 수치만 직접 재확인한다
  (2026-08-09 실측: 레인 보고 6개 항목 중 라이브 응답·Pages SHA를 직접 재검증해 일치 확인).
- **`&&` 체인으로 `agyp`를 걸지 말 것.** 앞 명령이 실패하면 레인이 아예 실행되지 않는데
  결과 파일이 없는 것과 구분이 안 된다. 세미콜론으로 끊고 종료 코드를 따로 본다.

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

## 발행 파이프라인 — 목표 발행 시각은 **07:00~08:00 KST**

```
daily-digest    (20:20 UTC, 실제 21:13~21:23Z) →  draft PR 생성        ≈ 06:15~06:25 KST
   └─ digest-fallback (21:15 UTC, 실제 22:04~22:53Z) → 머지 + deploy dispatch ≈ 07:04~07:53 KST
update-events   (23:30 UTC)                    →  봇 커밋 + dispatch
deploy (push | dispatch | 02:40 UTC 백스톱)     →  Pages

  백스톱 슬롯 (평소엔 no-op, 예약이 밀리거나 누락된 날에만 동작)
  daily-digest    22:55 UTC  →  관문 통과 시에만 수집       ≈ 07:55 KST
  digest-fallback 01:05 UTC  →  밀린 PR 회수               ≈ 10:05 KST
```

### ⚠️ 같은 날짜를 두 번 발행할 수 있다 — 관문을 제거하지 말 것

`daily-digest`에는 수집 전에 도는 **Guard against double publication** 스텝이 있다.
오늘자가 이미 main에 있거나 오늘자 PR이 열려 있으면 그 실행은 아무것도 하지 않는다.
`workflow_dispatch`의 `force` 입력이 유일한 탈출구다(잘못 만든 다이제스트를 다시 돌릴 때).

2026-08-07 사고: 수동 dispatch로 발행을 끝낸 직후 **276분 지연된** 예약 런이 뒤늦게 떠서
같은 날짜를 다시 수집하고(23건 → 18건) 삭제된 브랜치를 되살려 PR을 새로 만들었다.
예약 fallback이 그것을 머지해 이미 발행된 다이제스트를 통째로 갈아치웠다 — 워크플로는 전부 초록이었다.
**백스톱 슬롯을 추가하면 이 경합이 더 잦아진다.** 관문 없이 cron만 늘리지 말 것.

### 수집 창은 72시간이다 — `.digest-data/*.json` 을 지우지 말 것

24시간 창은 주말을 굶겼다(일·월 다이제스트가 8주 연속 1~4건). 지금은 72시간을 훑고,
**과거 14일치 `.digest-data/*.json` 에 이미 실린 링크를 걸러내** 중복을 막는다.
평일에는 어제 것이 전부 걸러져 24시간과 동일하게 동작하고, 주말에는 `PER_SOURCE_CAP`에
밀려 버려졌던 글이 회수된다(2026-08-09 실측: 3건 → 12건, 소스 1곳 → 6곳, 중복 0건).

그래서 **발행이 커밋된 과거 데이터에 의존한다.** 이 JSON들을 정리하거나 `.gitignore`에 넣으면
중복 제거가 조용히 약해져 같은 기사가 다시 실린다. 오늘자 파일은 대조 대상에서 제외되므로
같은 날 재실행은 안전하다.

**스케줄 지연을 상수로 보지 말 것.** GitHub 예약 실행은 항상 늦게 뜨고, 편차는 슬롯 혼잡도를 탄다.
관측치(2026-08-05 재측정): `daily-digest` 지연 53/58/63분(min/p50/max, 14회)으로 매우 일정.
`digest-fallback`은 49/94/98분으로 **편차가 크고**, 드물게 600분대로 튄다(11회 중 2회). 그날은 02:40 백스톱이 회수한다.
**정시(top-of-hour)를 피하는 것만으로 지연이 줄어든다** — 새 cron을 넣을 때 `0 *`를 쓰지 말 것.
`digest-fallback`이 정시(`0 8`)였을 때 87분·127분까지 밀려 발행이 오후로 넘어간 적이 있다.

**두 cron은 항상 같이 움직인다.** `digest-fallback`은 머지할 draft PR이 이미 있어야 동작하므로,
`daily-digest`의 **최악 완료 시각**이 `digest-fallback`의 **최소 실행 시각**보다 앞서야 한다.
현재 배치는 draft 생성 최악 21:25Z 대 fallback 최소 실행 22:04Z로 39분 여유다.
이 여유가 무너지면 머지할 PR이 없어 발행이 조용히 건너뛰어진다 — 한쪽만 당기지 말 것.

- `digest-fallback`은 대상을 **브랜치명(`daily-digest/*`)** 으로 찾는다. 제목의 KST 날짜로 찾던 시절에는
  digest 런 지연이 자정을 넘기면 발행이 조용히 멈출 수 있었다. 날짜 매칭으로 되돌리지 말 것.
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

- **마감은 fallback 머지 시각**(07:04~07:53 KST). 그 전에 push 되지 않으면 원문이 발행된다.
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

## ⚠️ `.git` 락은 **치우지 말고 지운다**

이 저장소의 로컬 클론에는 아침 보강 세션이 남긴 stale 락이 자주 생긴다(`index.lock`,
`refs/heads/main.lock`, `objects/maintenance.lock`). `git pull`이
`cannot lock ref` / `Unable to create ... .lock: File exists`로 죽으면 그것이다.

**락을 다른 이름으로 옮기지 말 것.** `mv index.lock index.lock.old.$(date +%s)` 같은 회피는
그 자체로 인덱스를 깨뜨릴 수 있고, 잔해가 다음날 세션에 또 걸려 같은 회피를 부른다.
2026-06-16~08-08 사이에 그렇게 쌓인 파일이 `.git/`에 약 70개 있었다
(`index.lock.old.*`, `.lock.movedaway.*`, `.lock.stale.*`, `.stale-trash/`, `__t`, `__wtest`).
한 번은 이 경합 중 checkout이 끊겨 다이제스트 파일 9개가 지워졌다.

절차는 이렇다:

```bash
# 1. 진짜 git 프로세스가 있는지 본다 (agy 프롬프트 문자열이 pgrep 에 걸리니 lsof 로 확인)
lsof .git/index.lock 2>/dev/null
# 2. git 이 실제로 인식하는 락만 고른다 — 이름이 정확히 .lock 으로 끝나는 것
find .git -name '*.lock' -not -path '*/.stale-trash/*' -ls
# 3. 프로세스가 없고 파일이 낡았으면 지운다. 이름을 바꾸지 않는다.
rm -f .git/index.lock .git/refs/heads/main.lock .git/objects/maintenance.lock
```

`.lock.old` / `.lock.bak` / `.lock.stale` 류는 git이 인식하지 않는 순수 쓰레기다 — 지워도 안전하지만,
**`.git/` 안을 일괄 삭제하기 전에는 반드시 사람에게 확인받는다.**

## 개발 서버 / 빌드 동시 실행 금지

`npm run dev` 중에 같은 디렉토리에서 `npm run build`를 돌리면 `.next` 캐시가 깨져 dev 서버가
`Cannot find module './XXXX.js'`를 낸다. 검증 전 dev 서버를 먼저 종료한다.
종료 직후 `rm -rf node_modules`는 잔여 쓰기와 경합해 `Directory not empty`로 실패할 수 있다 — 프로세스 소멸을 확인하고 지운다.

## 콘텐츠

`src/content/projects/*.md`는 각 GitHub repo의 **실제 상태**를 반영한다(ko/en 1:1).
최신화 시 추측하지 말고 `gh`로 README/태그/릴리스를 확인한 사실만 반영한다.
