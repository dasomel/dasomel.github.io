# Daily Tech Digest — 파이프라인 가이드

Cloud / Kubernetes / AI / DevOps RSS 피드를 매일 수집해 한/영 다이제스트
포스트를 자동 생성하는 시스템. **추가 API 비용 없음** — 수집은 GitHub
Actions, AI 요약(선택)은 Claude 구독(Cowork) 스케줄 태스크로 처리한다.

## 구성 요소

| 파일 | 역할 |
|---|---|
| `scripts/collect-feeds.mjs` | RSS 수집 → `.digest-data/YYYY-MM-DD.json` 저장 |
| `scripts/generate-daily-digest.mjs` | JSON → KO/EN 마크다운 포스트 생성 |
| `scripts/lib/digest-feeds.mjs` | 피드 목록·카테고리 매핑·발췌 등 공용 헬퍼 |
| `.github/workflows/daily-digest.yml` | 매일 00:00 UTC(09:00 KST) cron + 수동 실행 |

## npm 스크립트

```bash
npm run digest:collect          # RSS 수집 → JSON
npm run digest                  # JSON → 마크다운 (원문 발췌)
npm run digest -- --enrich      # JSON → 마크다운 (AI 요약 우선, 없으면 번역/발췌 폴백)
npm run digest:enrich-publish   # 검증 → 재생성 → 커밋 → push (멱등, 보강·번역 공용)
npm run digest -- --date 2026-06-14   # 특정 날짜 재생성
```

## 데이터 흐름

```
[GitHub Actions / 매일]
  collect-feeds.mjs → .digest-data/YYYY-MM-DD.json (원시 데이터)
  generate-daily-digest.mjs → daily-digest-YYYY-MM-DD(.en).md (원문 발췌)
  → draft PR 생성

[Cowork 스케줄 태스크 / 선택 · Phase 2]
  1. .digest-data/YYYY-MM-DD.json 읽기
  2. Claude가 각 기사에 필드 추가 — 아래 둘 중 하나
       보강: summaryKo/summaryEn/insightKo/insightEn  (요약 + 인사이트)
       번역: titleKo/excerptKo                        (제목·발췌문만 옮김)
  3. JSON 덮어쓰기
  4. npm run digest:enrich-publish → 재생성 + 커밋 + push (멱등)
```

### 두 계층 — 보강과 번역

수집 소스가 전부 영어라, **아무것도 안 하면 한국어 포스트도 제목·본문이 영어**로
나간다. fallback 으로 발행된 날의 글이 그 상태다.

| | 채우는 필드 | 출력량 | 성격 |
|---|---|---|---|
| **보강** | `summaryKo` `summaryEn` `insightKo` `insightEn` | 기사당 5-7문장 ×2 + 1문장 ×2 | 요약 + "왜 중요한가" |
| **번역** | `titleKo` `excerptKo` | 기사당 제목 1 + 발췌 1-2문장 | 원문을 옮기기만 |

번역은 출력량이 보강의 대략 1/10 이라 **보강 창(약 47분)** 안에 훨씬 안정적으로
끝나고, 요약과 달리 원문에 없는 사실이 끼어들 여지가 거의 없다. 여력이 있으면
보강을 우선하고, 번역은 **원문 그대로 나가는 것을 막는 하한선**으로 쓴다.

둘은 배타적이지 않다 — 같이 채우면 본문은 요약이 이기고 제목은 번역본을 쓴다.

## JSON 스키마 — `.digest-data/YYYY-MM-DD.json`

```jsonc
{
  "date": "2026-06-15",            // KST 날짜
  "generatedAt": "2026-06-15T00:00:00.000Z",
  "count": 5,
  "articles": [
    {
      // collect-feeds.mjs가 기록 (필수)
      "source": "Kubernetes",            // 피드 이름
      "category": "k8s",                 // k8s | ai | cloud | devops
      "title": "원문 제목",
      "link": "https://...",
      "date": "2026-06-14T15:00:00.000Z",
      "excerpt": "RSS 발췌 1-2문장 (없으면 \"\")",

      // Cowork/Claude가 나중에 추가 (선택) — 번역 계층. 플래그 불필요.
      "titleKo": "한국어로 옮긴 제목",
      "excerptKo": "한국어로 옮긴 발췌문 (원문이 잘려 있으면 잘린 채로)",

      // Cowork/Claude가 나중에 추가 (선택) — 보강 계층. --enrich 시 우선 사용
      "summaryKo": "한국어 요약 2-3문장",
      "summaryEn": "English summary, 2-3 sentences",
      "insightKo": "왜 중요한가 (Cloud/DevOps 관점) 1문장",
      "insightEn": "Why it matters, 1 sentence"
    }
  ]
}
```

### 폴백 규칙

필드별로 독립 폴백한다. 일부 기사만 채워도 안전하다.

| 대상 | 우선순위 |
|---|---|
| 한국어 본문 | `summaryKo`(`--enrich` 시) → `excerptKo` → `excerpt` |
| 영어 본문 | `summaryEn`(`--enrich` 시) → `excerpt` |
| 한국어 제목 | `titleKo` → `title` |
| 영어 제목 | `title` |

- `titleKo`/`excerptKo`는 **플래그 없이 항상** 사용된다. 없으면 원문으로 폴백하므로
  쓰는 쪽이 언제나 낫고, 별도 모드를 두면 틀릴 여지만 는다.
- `insightKo`/`insightEn`가 있으면 `> 💡 왜 중요한가` 블록으로 표시, 없으면 생략.
  (`--enrich` 시에만)
- 한 기사가 summary/excerpt 모두 없으면 "⚡ 빠른 소식" 불릿으로만 노출.
- **푸터는 실제로 렌더된 계층만 주장한다.** 요약이 하나도 안 들어갔는데 "AI가
  요약했습니다"라고 쓰지 않는다 — 번역만 됐으면 번역했다고, 아무것도 없으면
  발췌를 그대로 가져왔다고 쓴다.

## Cowork 스케줄 태스크 작성 예시 (Phase 2)

> 매일 09:30 KST 실행. `src/content/posts/.digest-data/`에서 오늘 날짜
> JSON을 찾아 각 article에 `summaryKo`, `summaryEn`, `insightKo`,
> `insightEn`을 채워 JSON을 덮어쓴 뒤, `npm run digest -- --enrich`를
> 실행하고 변경된 포스트를 커밋·PR로 올린다. (요약은 Cloud/DevOps
> 엔지니어 관점, 한국어/영어 각각.)

**바로 사용할 수 있는 전체 프롬프트 템플릿** — Cowork 스케줄 태스크에 내용을 그대로 붙여 넣는다.

| 계층 | 프롬프트 |
|---|---|
| 보강 (요약 + 인사이트) | [`scripts/digest-enrich-prompt.md`](../scripts/digest-enrich-prompt.md) |
| 번역 (제목·발췌문만) | [`scripts/digest-translate-prompt.md`](../scripts/digest-translate-prompt.md) |

## 카테고리 매핑 (소스 기반, AI 불필요)

피드는 한 매체가 다이제스트를 도배하지 않도록 여러 발행처로 넓게 분산돼 있다.
전체 목록·URL은 `scripts/lib/digest-feeds.mjs`의 `FEEDS`가 단일 출처(33개 피드,
2026-06-27 기준 전부 RSS 유효성 검증 완료).

| 카테고리 | 피드 |
|---|---|
| Kubernetes & Cloud Native (`k8s`) | Kubernetes, CNCF, AWS Containers, Docker, Istio, Cilium, Sysdig |
| AI & ML (`ai`) | OpenAI, Hugging Face, Google Research, Google AI |
| 클라우드 업데이트 (`cloud`) | Google Cloud, AWS Architecture, Azure, Cloudflare, Red Hat |
| DevOps & 인프라 (`devops`) | HashiCorp, The New Stack, Grafana, AWS DevOps, Datadog, Honeycomb, GitLab, Snyk, Netflix, Meta Engineering, GitHub, Stripe, Dropbox, 우아한형제들, 카카오, 토스, LINE |

### 소스 쏠림 방지 — `PER_SOURCE_CAP`

`collect-feeds.mjs`는 24시간 윈도우로 수집한 뒤, **소스당 최신 3건**(`PER_SOURCE_CAP = 3`)
까지만 남기고 전역 상한(`MAX_ARTICLES = 60`)을 적용한다. 다작 매체(예: The New Stack)가
하루치를 독점하던 문제를 막고, 매일 더 다양한 출처가 노출되도록 한다. 값만 바꾸면 조정 가능.
