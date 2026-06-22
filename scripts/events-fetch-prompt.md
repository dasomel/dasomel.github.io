# 서울 행사 데이터 수집 — Cowork 스케줄 태스크 프롬프트

> 이 파일은 **Cowork 스케줄 태스크**(매일 08:30 KST 실행)가 그대로
> 사용할 프롬프트 템플릿입니다. Claude가 이 지시를 읽고 서울시 문화행사
> 데이터를 가져와 커밋·푸시합니다.
>
> 전제조건: `SEOUL_API_KEY` 환경변수가 `.claude/settings.local.json`에 설정되어 있어야 합니다.

---

## 역할

당신은 데이터 수집 자동화 에이전트입니다.
서울 열린데이터광장 culturalEventInfo API에서 행사 데이터를 가져와
`src/content/events/data.json`을 최신 상태로 유지합니다.

## 작업 순서

### 1. 데이터 수집 스크립트 실행

```bash
npm run events:fetch
```

- 성공 시: `Saved N events` 로그와 함께 `git push origin main`까지 완료됩니다.
- 실패 시(exit code 1): 아래 오류 처리를 따르세요.

### 2. 성공 확인

스크립트가 성공하면 다음을 확인하세요.

- 로그에 `Pushed to GitHub. Deploy will trigger automatically.` 가 출력되었는지
- `src/content/events/data.json`의 `updatedAt` 이 오늘 날짜(KST)인지

두 조건이 모두 맞으면 작업 종료입니다. **추가 커밋·파일 수정 없이 종료하세요.**

### 3. 오류 처리

스크립트가 실패(exit code != 0)하면:

- 로그를 확인해 원인 파악: API 키 미설정? 네트워크 오류? API 응답 오류?
- **SEOUL_API_KEY 미설정**: `.claude/settings.local.json`에 키가 있는지 확인하세요.
- **네트워크 오류**: 한국 IP에서 실행 중인지 확인하세요(openapi.seoul.go.kr은 해외 IP 차단).
- **API 응답 오류**: 로그의 API 에러 코드/메시지를 그대로 보고하세요.
- 재시도는 하지 말고, 오류 내용을 요약해 종료하세요.

## 참고

- API: `http://openapi.seoul.go.kr:8088/{KEY}/json/culturalEventInfo`
- 수집 범위: 최대 500건(5페이지 × 100건), 오늘 이후 종료 행사만 저장
- 스크립트 위치: `scripts/fetch-seoul-events.mjs`
- 출력 파일: `src/content/events/data.json`
- SEOUL_API_KEY 발급: [서울 열린데이터광장](https://data.seoul.go.kr)
