# Daily Digest 보강 — 근거 검증 레인 프롬프트

작성 레인(`digest-enrich-lane-prompt.md`)이 만든 요약을 **다른 세션이** 원문과 대조해 검사한다.
작성과 검증을 같은 컨텍스트에서 하면 자기 글을 통과시킨다 — 그래서 반드시 분리한다.

## 왜 사람이 읽어야만 잡혔나 (이 레인이 존재하는 이유)

기계 검증(`scripts/enrich-apply.mjs`)은 형식만 본다: 필드 유무, 링크 일치, 영문 필드의 CJK,
알려진 오역 단어. 2026-08-13~16 배치는 그 검사를 **전부 통과했는데도** 이런 것들이 들어 있었다:

- Gemini 3.7 Flash 요약에 `hybrid reasoning`·`deployment scripts`·`bug fixes`·`large codebases` —
  원문에 없는 능력을 지어냈다. 정작 원문의 핵심(도입가 절반, 2027-01-01 인상,
  FrontierCode 34.4%→43.6%)은 빠졌다.
- 멀티테넌시 요약에 "fifty engineers manage hundreds of active changes" — 원문에 없는 숫자.
- 애플 요약에서 Alibaba·Qwen·Baidu·Reuters를 전부 빠뜨리고 일반적인 개발자 조언으로 채웠다.

정규식으로는 못 잡는다. 지어낸 주장이 대부분 **소문자 일반명사구**라 고유명사·숫자 매칭에
걸리지 않기 때문이다. 원문을 읽고 판단하는 수밖에 없다.

## 쓰는 법

```bash
agyp "$(sed -e "s#SPEC_IN#$IN#" -e "s#SPEC_OUT#$OUT#" scripts/digest-enrich-verify-prompt.md)" \
  --model "Gemini 3.6 Flash (High)" > "$LOG" 2>&1
```

`SPEC_IN` 은 `{link, title, excerpt, summaryKo, summaryEn, insightKo, insightEn}` 배열이다.

---

기술 기사 요약의 **사실 검증** 작업이다. 문체나 길이는 판단하지 마라. 근거만 본다.

## 입력
`SPEC_IN` 경로의 JSON 배열. 각 원소에 기사 `link` 와 그 기사에 대해 작성된 요약이 들어 있다.

## 해야 할 일

각 원소마다:

1. **`link` 의 원문을 반드시 열어서 읽어라.** 못 열면 그 항목은 `"fetched": false` 로 표시하고
   판정하지 마라 — 추측으로 통과시키지도, 실패시키지도 마라.
2. `summaryKo` / `summaryEn` / `insightKo` / `insightEn` 의 **모든 사실 주장**을 원문과 대조하라.
   특히 제품 기능명, 능력 서술, 수치, 버전, 가격, 날짜, 기업·인물 이름.
3. 원문에서 확인되지 않는 주장을 찾아라. **일반적으로 그럴듯한지가 아니라, 이 기사에 있는지**가 기준이다.
4. 원문의 가장 중요한 사실(제목·리드·수치)이 요약에서 빠졌는지 보라.

`insightKo`/`insightEn` 은 해석이므로 원문에 없는 **의견**은 괜찮다. 다만 원문에 없는 **사실**을
새로 끌어들였다면 지적하라.

## 출력

`SPEC_OUT` 경로에 **JSON 배열만** 써라. 다른 텍스트·설명·코드펜스 금지.
입력과 같은 순서, 같은 개수:

```json
[
  {
    "link": "<입력의 link 그대로>",
    "fetched": true,
    "verdict": "ok" | "unsupported" | "incomplete",
    "unsupported": ["원문에 없는 주장을 인용구로", "..."],
    "missed": ["원문의 핵심인데 요약에 빠진 사실", "..."],
    "note": "한 줄 설명 (ok 면 빈 문자열)"
  }
]
```

- `verdict`: 지어낸 주장이 하나라도 있으면 `unsupported`. 지어낸 건 없는데 핵심 사실이
  빠졌으면 `incomplete`. 둘 다 아니면 `ok`.
- `unsupported` 에는 **요약 원문 그대로** 인용하라(치환 키로 쓴다). 요약하거나 바꾸지 마라.
- 확신이 없으면 `ok` 로 두지 말고 `note` 에 이유를 적어라. 놓치는 것보다 과잉 지적이 낫다.

## 하지 말 것

- 저장소 파일을 수정하지 마라. `git` / `gh` / `npm` 명령을 쓰지 마라.
- 요약을 다시 쓰지 마라 — 이 레인은 판정만 한다. 수정은 오케스트레이터가 한다.
- 문체·길이·번역 품질은 판단 대상이 아니다.

## 마지막에

`ok` / `unsupported` / `incomplete` / 원문 확보 실패 건수를 한 줄로 보고하라.
