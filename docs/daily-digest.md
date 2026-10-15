# Daily Tech Digest — 파이프라인 가이드

Cloud / Kubernetes / AI / DevOps RSS를 GitHub Actions에서 수집하고,
Claude 구독 예약 작업이 한국어·영어 상세 요약을 보강한다.
**보강은 필수**이며, 외부 모델 API를 호출하는 단계는 없다.

## 실행 순서

1. `scheduler.yml` → `daily-digest.yml`: 수집 JSON과 한·영 초안을
   `daily-digest/YYYY-MM-DD` 브랜치에 저장하고 draft PR을 만든다.
2. 외부 보강 예약 작업: 원문을 확인하고 모든 기사의 `summaryKo`,
   `summaryEn`(각 최소 5문장), `insightKo`, `insightEn`을 채운다.
3. `npm run digest:enrich-publish -- --date YYYY-MM-DD`:
   마크다운 재생성 → strict 검사 → 커밋 → push → 머지 워크플로 요청.
   이미 push된 변경도 같은 명령으로 머지 요청을 재시도할 수 있다.
4. `digest-fallback.yml`: 보강 검증, main 중복 발행 확인 후 검사한
   PR 커밋만 squash merge한다. ready 전환 후 실패한 PR도 재시도한다.
5. `deploy.yml`: fallback의 `workflow_run` 완료 이벤트를 받아 main을
   빌드·배포한다. 워크플로 성공만으로 발행을 판정하지 말고 Pages 배포
   SHA와 한·영 라이브 URL을 확인한다.

이미 main에 발행된 날짜의 보강 수정도 지원한다. 이 경우 publisher는
main에 push하며 기존 push 배포 경로를 사용한다.

## 예약과 외부 의존성

모든 GitHub cron의 정의는 `.github/workflows/scheduler.yml`에 있다.
수집은 UTC 20:20 / 22:55, 머지는 21:15 / 01:05, 건강 검사는 00:35다.
GitHub 예약은 지연될 수 있으며, 수집·보강·머지의 실제 순서는 시각만으로
보장되지 않는다. 보강 완료 시 머지를 명시적으로 요청하는 이유다.

보강 예약은 이 저장소의 Actions가 실행하지 않는다. Claude 예약 작업의
활성 상태, 실행 이력, 저장소 접근 권한을 별도로 확인해야 한다.
저장소의 프롬프트 파일 수정만으로 기존 원격 작업의 지침이 갱신되지는 않는다.

보강 작업에는 `scripts/digest-enrich-prompt.md`를 적용한다. 오늘 수집이
늦으면 미발행 `daily-digest/*` PR을 날짜순으로 확인한다. 수집물이 없을 때
정상 완료로 처리하거나 첫 기사만 보고 전체 보강 완료를 판단하면 안 된다.

## 검증과 장애 복구

```bash
# 진단만 하는 기본 모드는 경고 후 0으로 끝날 수 있다.
bun scripts/check-enrichment.mjs --date YYYY-MM-DD

# 발행 및 건강 검사에는 반드시 strict 모드를 사용한다.
bun scripts/check-enrichment.mjs --strict --date YYYY-MM-DD

# 파일 재생성과 검증만 수행한다. 커밋·push는 하지 않는다.
bun scripts/generate-daily-digest.mjs --enrich --date YYYY-MM-DD
bun scripts/check-enrichment.mjs --strict --date YYYY-MM-DD

# 보강 저장 및 자동 머지 요청. 저장소 쓰기 권한을 가진 예약 작업용이다.
npm run digest:enrich-publish -- --date YYYY-MM-DD
```

strict 검사는 데이터 누락, 기사 0건, 부분 보강, 짧은 요약, 한·영 게시물
누락, JSON과 마크다운 요약 불일치를 실패로 처리한다. 건강 검사는 main의
발행 상태를 검사하므로 PR에만 있는 글도 실패한다. 검사 실패를 해결하기
위해 보강 기준이나 이중 발행 방어를 우회하지 않는다.

`force`로 만든 교체본은 이미 main에 같은 날짜가 있으면 자동 머지하지
않는다. 수동 검토 대상이며 자동으로 닫지도 않는다.

## 2026-10-15 조사 기록

- 기준 main: `129dc10711e3946dc8cd445734dcdeef9b4f48bf`.
- [수집 실행 38653237033](https://github.com/dasomel/dasomel.github.io/actions/runs/38653237033):
  08:19 KST에 [PR #389](https://github.com/dasomel/dasomel.github.io/pull/389)
  생성. 35건 모두 AI 보강 필드가 없었다.
- [머지 실행 38656860770](https://github.com/dasomel/dasomel.github.io/actions/runs/38656860770):
  `AI 보강이 하나도 없다 (0/35건)`, `merged=0 blocked=1`.
  수집 성공은 발행 성공을 의미하지 않았다.
- 전날 [건강 검사 38515964182](https://github.com/dasomel/dasomel.github.io/actions/runs/38515964182)는
  발행 데이터가 없다는 경고를 남기고도 성공했다. 기본 검사 모드가 원인이다.
- 로컬 보강 예약에는 2026-09-23 원격 이전 기록이 있다. 로컬 비활성 상태만으로
  원격 작업도 중지됐다고 결론 내릴 수 없다. 오늘 보강이 실행되지 않은 이유는
  원격 예약 실행 이력에서 추가 확인해야 한다.

## 데이터와 콘텐츠 규칙

원본은 `src/content/posts/.digest-data/YYYY-MM-DD.json`이다. 기사에는
`source`, `category`, `title`, `link`, `date`, `excerpt`가 있고, 보강은
네 개의 summary/insight 필드만 추가한다. `enrich-apply.mjs`는 링크·개수·
언어·요약 길이를 검증한 뒤 JSON에 반영한다.

게시물은 `daily-digest-YYYY-MM-DD.md`와
`daily-digest-YYYY-MM-DD-en.md`를 한 쌍으로 관리한다. `--enrich` 생성기는
누락 필드를 발췌문으로 대체할 수 있지만, 그 결과는 strict 발행 검사를
통과하지 못한다.

수집 창은 72시간이며 과거 14일의 JSON 링크로 중복을 제거한다.
`.digest-data` 파일을 삭제하거나 gitignore에 넣지 않는다. 피드 목록과
소스별 상한은 `scripts/lib/digest-feeds.mjs`를 기준으로 한다.
