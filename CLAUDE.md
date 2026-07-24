# 프로젝트 지침 (dasomel.github.io)

Next.js 15 + next-intl 정적 사이트. `output: export` → GitHub Pages, 커스텀 도메인 **cne.io.kr**.
빌드 `npm run build` · 라우트 `app/[locale]/{posts,projects,docs,seminars,events}/[slug]`.

> `npm run lint`(=`next lint`)는 **동작하지 않는다.** ESLint 설정이 저장소에 없어 클린 체크아웃에서
> 설정 마법사가 뜨고 멈춘다. CI(`deploy.yml`)도 lint를 돌리지 않는다 — 검증 게이트는 `npm run build` 뿐이다.
> 린트를 살리려면 `eslint.config.mjs`를 커밋하고 스크립트를 `eslint .`로 바꿔야 한다(미결).

세션 오케스트레이터(Opus 5 / Fable 5)를 독자로 가정한다. 절차 설명이 아니라 **불변식과 함정**만 적는다.
글로벌 `~/.claude/CLAUDE.md`의 라우팅 독트린·팀 기본값이 그대로 적용되며, 아래는 이 저장소에만 해당하는 차이다.

## 위임 기준 (이 저장소 한정)

| 작업 | 경로 |
|---|---|
| 워크플로 YAML, `package.json`/lock, `CLAUDE.md` | 직접 (컨텍스트가 곧 판단 근거) |
| 콘텐츠 md 다건 생성/번역, 컴포넌트 작성 | agy 레인 (Flash High) |
| `gh run`/`gh api` 로그 파헤치기, 대량 grep | 서브에이전트 — 요약 200단어 이하 |
| 배포 파이프라인 변경 | 직접 + 실제 런으로 실증 (아래 참조) |

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
- `deploy.yml`에 09:00 UTC 스케줄 백스톱이 있다. dispatch가 빠져도 하루 한 번은 복구되지만, **백스톱에 의존하지 말 것** —
  main에 커밋하는 새 워크플로를 추가하면 dispatch 단계도 같이 추가한다.

## 발행 파이프라인

```
daily-digest (21:40 UTC, 실제 시작 ~22:30Z)  →  draft PR 생성
   └─ [선택] 사람/Cowork: ✨ AI 요약 보강 커밋 후 머지
   └─ digest-fallback (08:00 UTC)            →  draft 그대로 머지 + deploy dispatch
update-events (23:30 UTC)                    →  봇 커밋 + deploy dispatch
deploy (push | dispatch | 09:00 UTC 백스톱)  →  Pages
```

- **알려진 취약점(미수정):** `digest-fallback`은 PR 제목의 KST 날짜로 대상을 찾는다. digest 런 지연이 KST 자정을 넘기면
  날짜가 어긋나 PR을 못 찾는다. 현재 마진 ~85분. 지연이 커지면 제목 매칭 대신 브랜치명(`daily-digest/*`) 기준으로 바꿀 것.
- 다이제스트 PR은 `draft: true`로 생성된다. 발행이 사람에게 의존하는 구조라 fallback이 실질적 발행 경로다.

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
