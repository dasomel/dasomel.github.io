# 프로젝트 지침 (dasomel.github.io)

Next.js 16 + next-intl 정적 사이트. `output: export` → GitHub Pages, 커스텀 도메인 **cne.io.kr**.
빌드 `npm run build` · 린트 `npm run lint`(=`eslint .`) · 라우트 `app/[locale]/{posts,projects,docs,seminars,events}/[slug]`.

> 린트는 0 errors / **5 warnings** 상태가 정상이다. 남은 경고는 의도적이거나 오탐이라 룰을 끄지 않고 남겼다 —
> `no-img-element` ×3(`output: export`라 `next/image` 최적화 불가), `no-page-custom-font`(App Router 오탐),
> `react-hooks/exhaustive-deps` ×1(`oss/dashboard`의 `projects`는 정적 import 데이터라 바뀌지 않는다).
> 새 경고가 붙으면 그건 새로 생긴 것이니 확인할 것.
> CI(`ci.yml`)와 `deploy.yml`은 `bun test` → `bun run lint` → `bun run build`를 돌린다(패키지 매니저는 bun).

**독자는 둘이다.** 세션 오케스트레이터(Opus 5.5 / Sonnet 5.5)와, `agyp`가 이 파일 전문을 주입해 받는 agy 워커다.
그래서 절차 설명이 아니라 **불변식과 함정**만 적고, 워커가 그대로 따를 수 있게 명령형으로 쓴다.

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

- **읽기 전용 레인은 프롬프트에 금지 목록을 명시한다** — 수정 금지, `git`/`gh` 쓰기 금지. 안 적으면 한다.
- **레인 결과를 그대로 믿지 말 것.** 발행·배포·빌드 주장은 오케스트레이터가 핵심 수치만 직접 재확인한다
  (2026-08-09 실측: 레인 보고 6개 항목 중 라이브 응답·Pages SHA를 직접 재검증해 일치 확인).
- **`&&` 체인으로 `agyp`를 걸지 말 것.** 앞 명령이 실패하면 레인이 아예 실행되지 않는데
  결과 파일이 없는 것과 구분이 안 된다. 세미콜론으로 끊고 종료 코드를 따로 본다.

raw `agy -p`는 이 파일을 못 읽어 아래 lock 규칙과 배포 트리거 불변식이 워커에게 도달하지 않는다. 반드시 `agyp`.

**워커 하드 제약** — 아래는 오케스트레이터가 판단할 일이니 워커 레인에서 직접 하지 말 것:
`bun install`/lock 갱신(보강이 필요하면 보고), `git push`·PR 머지·`gh workflow run`, dev 서버 실행 중 `npm run build`.

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

## 예약 작업 — 다이제스트는 2026-11-24 종료했다

```
project-metadata (18:00 UTC)                →  OSS 메타데이터 갱신
update-events    (23:30 UTC)                →  봇 커밋 + dispatch
deploy (push | dispatch | 02:40 UTC 백스톱)  →  Pages
```

cron 진입점은 `scheduler.yml` 하나다. 새 cron 을 넣을 때 정시(`0 *`)는 피한다 — 정시 슬롯은 지연이 크다.

**데일리 테크 다이제스트 파이프라인은 걷어냈다. 되살리지 말 것.** 수집·머지 관문·헬스 워크플로와
`digest:*` 스크립트, 보강 프롬프트를 2026-11-24 에 삭제했다. 이미 발행된 글(2026-06~11-02)과
`src/content/posts/.digest-data/*.json`, Tech Digest 목록·RSS 는 그대로 둔다.

- 종료 이유: 보강이 CI 밖(로컬 Mac·클라우드 루틴)에 의존했는데 그 루틴이 멈추자, 보강 없는 PR 을 막는
  머지 관문에 걸려 11-03~11-23 의 draft PR 21개가 쌓였다. 수집·머지 워크플로는 3주 내내 초록이었고
  헬스 체크만 실패했다 — 아무도 보지 않았다.
- `auto-merge.yml` 의 `daily-digest/*` 예외는 남겨 두었다. 옛 브랜치가 되살아나도 범용 자동 머지가
  집어삼키지 않게 하는 안전장치다.
- 교훈은 유효하다: **조용한 no-op 을 만들지 말 것.** `gh ... || true` 로 실패를 삼키면 "할 일 없음"과
  구분되지 않는다. 실패는 `::error::` + 비정상 종료로 드러낸다.

## ⚠️ 락파일 규칙 (CI 빌드 깨짐 방지)

패키지 매니저는 **bun**(`bun.lock`, 커밋됨)이고 CI는 `bun install --frozen-lockfile`(Bun 1.4.0)이다. `package-lock.json`은 없다.

1. **`bun.lock`을 처음부터 새로 만들지 말 것.** 기존 lock 유지 + 필요한 변경만 한다. 로컬 통과 / CI 실패의 원인이 된다.
2. **푸시 전 CI와 같은 명령으로 검증.** `bun install --frozen-lockfile && bun test && bun run lint && bun run build`.
3. **버전 드리프트 주의.** `^` 범위가 최신으로 튄다. 과거 `next-intl` 드리프트가 `@parcel/watcher`를 끌어와 CI를 깬 적이 있다.
4. **overrides는 직접 의존성 범위와 일치해야 한다.** 어긋나면 install 자체가 실패한다.

## ⚠️ 이 클론은 혼자 쓰는 게 아니다 — 작업 전 브랜치를 확인하라

다른 세션이 **같은 클론에서** 돌면서 브랜치를 바꿀 수 있다(다이제스트 보강 세션이 그랬고, 그 루틴은
2026-11-24 종료했지만 클론은 여전히 `daily-digest/*` 브랜치에 남아 있을 수 있다). 시작할 때 main 이었다고
계속 main 인 것이 아니다.

2026-08-18 실측: `git reset --hard origin/main` 과 커밋 두 개가 전부 `daily-digest/2026-08-18`
위에서 일어났고, `git push origin main` 은 3커밋 뒤처진 로컬 main 을 밀어 거부됐다.
`git rebase origin/main` 이 "Current branch daily-digest/2026-08-18 is up to date" 라고
답하고 나서야 알아챘다. 락 잔해와 `_scratch_probe.txt`·`__probe*.tmp` 같은 파일도 같은 출처다.

```bash
git rev-parse --abbrev-ref HEAD    # 커밋·리셋·푸시 전에 매번
```

브랜치가 어긋난 채 커밋했다면 되돌리지 말고 **main 으로 옮겨 cherry-pick** 하라 — 다른 세션이
그 브랜치를 쓰고 있을 수 있으므로 로컬 다이제스트 브랜치를 함부로 지우지 말 것.

## ⚠️ `.git` 락은 **치우지 말고 지운다**

이 저장소의 로컬 클론에는 다른 세션(과거의 아침 보강 세션 등)이 남긴 stale 락이 생긴다(`index.lock`,
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
