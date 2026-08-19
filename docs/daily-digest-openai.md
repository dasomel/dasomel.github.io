# Daily Digest OpenAI 자동 보강

## 실행 흐름

```text
05:20 KST  Daily Tech Digest
   ├─ RSS 수집
   ├─ 한국어/영어 Markdown 생성
   └─ draft PR 생성

06:30 KST  OpenAI enrichment
   ├─ .digest-data/YYYY-MM-DD.json 읽기
   ├─ OpenAI Structured Outputs로 summaryKo/summaryEn/insightKo/insightEn 생성
   ├─ `npm run digest -- --enrich`로 KO/EN Markdown 재생성
   └─ `npm run digest:check` 검증

06:45 KST  Digest fallback
   ├─ AI 4개 필드가 모든 기사에 존재하는지 최종 검증
   └─ 통과한 draft PR만 자동 merge

merge → Deploy to GitHub Pages
```

## GitHub Secret

Repository Settings → Secrets and variables → Actions → New repository secret에서 다음을 추가합니다.

- Name: `OPENAI_API_KEY`
- Value: OpenAI API project key

API 호출용 key는 ChatGPT 구독과 별도입니다. 운영에 사용할 project API key와 사용 한도를 별도로 관리하세요.

## 모델

기본 모델은 `gpt-5.6-luna`입니다. workflow의 `OPENAI_MODEL` 환경변수로 변경할 수 있습니다.

## 수동 실행

GitHub Actions → **Daily Digest AI Enrichment** → Run workflow에서 날짜를 지정할 수 있습니다.

## 실패 동작

OpenAI API 호출 또는 enrichment 검증이 실패하면 해당 draft PR은 자동 발행되지 않습니다. 다음 fallback 슬롯에서 다시 확인합니다. 이미 main에 발행된 날짜는 자동으로 교체하지 않습니다.

기존 Claude/Cowork enrichment 레인은 이번 전환에서 삭제하지 않았습니다. 새로운 OpenAI 레인이 정상 동작하는 것이 확인된 뒤 제거할 수 있습니다.
