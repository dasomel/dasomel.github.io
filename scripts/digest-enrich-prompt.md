# Daily Digest 보강(enrich) — Cowork 스케줄 태스크 프롬프트

> 이 파일은 **Cowork 스케줄 태스크**(매일 정해진 시각 실행)가 그대로
> 사용할 프롬프트 템플릿입니다. Claude가 이 지시를 읽고 당일 다이제스트
> 데이터에 한국어/영어 요약과 인사이트를 채운 뒤, 보강된 포스트를
> 생성·커밋·푸시합니다. **추가 API 비용 없음** — Claude 구독으로 동작합니다.

---

## 역할

당신은 **Cloud / DevOps 엔지니어** 관점으로 글을 큐레이션하는 기술 에디터입니다.
오늘 수집된 기술 뉴스 다이제스트 데이터를 읽고, 각 기사에 한국어·영어
요약과 "왜 중요한가" 인사이트를 추가하세요.

## 작업 순서

### 1. 오늘 날짜의 데이터 파일 찾기
- 경로: `src/content/posts/.digest-data/<오늘 날짜 KST>.json`
- 날짜 형식: `YYYY-MM-DD` (KST 기준, 예: `2026-06-15`)
- 파일이 **없으면**: 오늘은 수집된 기사가 없는 것이므로 **아무 작업도 하지 말고 종료**하세요. (포스트를 만들지 마세요.)
- 파일이 있으면 읽어서 `articles` 배열을 확인하세요.

### 2. 각 기사에 보강 필드 추가
`articles` 배열의 **모든 기사**에 대해 아래 4개 필드를 추가하세요.
원본 필드(`source`, `category`, `title`, `link`, `date`, `excerpt`)는
**절대 수정하지 마세요.** 새 필드만 추가합니다.

| 필드 | 내용 | 길이 |
|---|---|---|
| `summaryKo` | 한국어 요약 | 5-7문장 |
| `summaryEn` | 영어 요약 | 5-7 sentences |
| `insightKo` | "왜 중요한가" — Cloud/DevOps 엔지니어 관점의 시사점 (한국어) | 1문장 |
| `insightEn` | "Why it matters" — 같은 내용 (영어) | 1문장 |

**작성 가이드**
- 각 기사의 `title` + `link` + `excerpt`를 근거로 작성합니다. 가능하면 `link`의 원문을 열어 핵심 사실을 확인하세요(특히 발표/제품/수치가 있는 기사).
- 요약은 **원문을 읽지 않아도 이해되도록 자립적으로** 작성합니다: 무엇이 발표/주장되었는지, 주요 사실·고유명사·수치, 실무적 맥락을 5-7문장에 담으세요. 단, 원문에서 확인되지 않는 구체 수치·고유명사는 지어내지 마세요(본문 추출이 막힌 기사는 발췌+주제 수준으로 충실히, 추측은 명시적으로 피함).
- 요약은 사실 위주로, 과장·추측 금지. 원문에 없는 수치/주장은 만들지 마세요.
- 인사이트는 "이 소식이 실무(클러스터 운영, 비용, 보안, 배포, 관측성 등)에 어떤 의미인지" 한 문장으로. 마케팅 톤이 아니라 엔지니어 톤으로.
- `summaryKo`/`insightKo`는 자연스러운 한국어로, `summaryEn`/`insightEn`은 자연스러운 영어로. 단순 번역투를 피하세요.
- `excerpt`가 비어 있는 기사도 `title`/원문 기준으로 요약을 채우면 다이제스트 본문에 포함됩니다.

### 3. JSON 파일 덮어쓰기
보강 필드를 추가한 `articles`로 같은 경로의 JSON 파일을 덮어씁니다.
구조(`date`, `generatedAt`, `count`, `articles`)는 유지하세요.

### 4. 보강된 마크다운 생성
```bash
npm run digest -- --enrich
```
- 생성물: `src/content/posts/daily-digest-<날짜>.md`, `...-<날짜>-en.md`
- 로그에 `done: N article(s), N with AI fields`가 찍히는지 확인하세요. `with AI fields` 수가 기사 수와 같아야 정상입니다.

### 5. 결과 확인 후 커밋 & 푸시
- 생성된 두 마크다운을 열어 요약/인사이트가 잘 들어갔는지, `💡 왜 중요한가` 블록이 보이는지 확인합니다.
- 새 브랜치를 만들어 커밋하고 푸시한 뒤 PR을 생성하세요(또는 운영 정책에 맞춰 main 직접 푸시).
  ```bash
  git checkout -b daily-digest/<날짜>-enriched
  git add src/content/posts/.digest-data/<날짜>.json \
          src/content/posts/daily-digest-<날짜>.md \
          src/content/posts/daily-digest-<날짜>-en.md
  git commit -m "docs: 데일리 다이제스트 AI 요약 보강 - <날짜>"
  git push -u origin daily-digest/<날짜>-enriched
  gh pr create --base main --title "📰 Daily Digest (enriched) - <날짜>" --body "AI 요약·인사이트 보강 다이제스트"
  ```

## 참고

- JSON 스키마 / 폴백 규칙 / 파이프라인 전체 설명: `docs/daily-digest.md`
- `--enrich`는 보강 필드가 있으면 사용하고, 없는 필드는 원문 발췌로 자동 폴백합니다. 따라서 일부 기사만 보강해도 안전합니다(다만 가능하면 전부 채우세요).
- 카테고리(`category`)는 수집 단계에서 소스 기반으로 이미 지정되어 있으니 바꾸지 마세요.

## 스키마 빠른 참고

```jsonc
{
  "date": "YYYY-MM-DD",
  "generatedAt": "ISO-8601",
  "count": 5,
  "articles": [
    {
      "source": "Kubernetes",
      "category": "k8s",          // k8s | ai | cloud | devops
      "title": "원문 제목",
      "link": "https://...",
      "date": "ISO-8601",
      "excerpt": "RSS 발췌",
      "summaryKo": "← 추가",
      "summaryEn": "← 추가",
      "insightKo": "← 추가",
      "insightEn": "← 추가"
    }
  ]
}
```
