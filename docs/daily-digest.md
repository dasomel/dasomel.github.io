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
npm run digest -- --enrich      # JSON → 마크다운 (AI 필드 우선, 없으면 발췌 폴백)
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
  2. Claude가 각 기사에 summaryKo/summaryEn/insightKo/insightEn 추가
  3. JSON 덮어쓰기
  4. npm run digest -- --enrich → 보강된 마크다운 재생성
```

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

      // Cowork/Claude가 나중에 추가 (선택) — --enrich 시 우선 사용
      "summaryKo": "한국어 요약 2-3문장",
      "summaryEn": "English summary, 2-3 sentences",
      "insightKo": "왜 중요한가 (Cloud/DevOps 관점) 1문장",
      "insightEn": "Why it matters, 1 sentence"
    }
  ]
}
```

### 폴백 규칙 (`--enrich`)

- `summaryKo`/`summaryEn`가 있으면 본문으로 사용, 없으면 `excerpt`로 폴백.
- `insightKo`/`insightEn`가 있으면 `> 💡 왜 중요한가` 블록으로 표시, 없으면 생략.
- 한 기사가 summary/excerpt 모두 없으면 "⚡ 빠른 소식" 불릿으로만 노출.

## Cowork 스케줄 태스크 작성 예시 (Phase 2)

> 매일 09:30 KST 실행. `src/content/posts/.digest-data/`에서 오늘 날짜
> JSON을 찾아 각 article에 `summaryKo`, `summaryEn`, `insightKo`,
> `insightEn`을 채워 JSON을 덮어쓴 뒤, `npm run digest -- --enrich`를
> 실행하고 변경된 포스트를 커밋·PR로 올린다. (요약은 Cloud/DevOps
> 엔지니어 관점, 한국어/영어 각각.)

## 카테고리 매핑 (소스 기반, AI 불필요)

| 카테고리 | 피드 |
|---|---|
| Kubernetes & Cloud Native (`k8s`) | Kubernetes, CNCF, AWS Containers |
| AI & ML (`ai`) | OpenAI, Hugging Face |
| 클라우드 업데이트 (`cloud`) | Google Cloud |
| DevOps & 인프라 (`devops`) | HashiCorp, The New Stack, Grafana |
