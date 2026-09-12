---
title: "표준프레임워크 기여를 시작하며: 실제 PR과 리뷰에서 배운 점"
description: "전자정부 표준프레임워크(eGovFrame) 실제 PR 사례와 리뷰 피드백을 바탕으로 작은 문제 발견부터 검증, 머지까지의 과정을 정리한 2026년 기여 가이드 발표자료를 소개합니다."
pubDate: 2026-09-13
tags: ["eGovFrame", "Contribution", "Open Source", "Seminar"]
projects: ["egovframe-launcher"]
featured: true
draft: false
---

오픈소스 기여는 거창한 신규 프레임워크를 개발하거나 대규모 아키텍처를 개편하는 일에서만 시작되지 않습니다. 실제 사용자가 문서를 따라 하다가 막히는 지점을 바로잡거나, 런타임 환경에서 발생하는 예외를 작게 보완하는 일처럼 일상에서 마주치는 불편을 발견하고 해결책을 제안하는 것이 기여의 건강한 출발점입니다.

이 글은 2021년 [표준프레임워크 GitHub 컨트리뷰터 되어보기(실전편)](/ko/seminars/2021-06-09-github-contributor-2021/)과 2025년 [템플릿 프로젝트 컨트리뷰션 해보기!](/ko/seminars/2025-07-24-template-contribution/) 세미나의 2026년 후속 자료입니다. 그동안 전자정부 표준프레임워크(eGovFrame) 여러 저장소에 실제로 제안했던 Pull Request와 메인테이너의 리뷰 회신에서 배운 구체적인 경험을 20장의 슬라이드로 정리했습니다.

[발표자료 바로 보기](https://cne.io.kr/slides/egovframe-contribution/#1)

발표자료는 키보드 방향키(←, →)와 스페이스바로 넘겨볼 수 있으며, 하단 컨트롤러에서 전체 목차, 발표자 메모, 전체화면 버튼을 지원합니다.

---

## 시작할 주제 찾기

기여할 주제를 찾을 때 가장 중요한 것은 거대한 기능을 고민하기보다 주변의 작은 문제를 세심하게 관찰하는 일입니다. 슬라이드에서는 초심자가 탐색해 볼 수 있는 후보를 세 가지 갈래로 제안합니다.

첫째는 **사용 설명**입니다. 설치 가이드의 깨진 링크, 누락된 단계, 문서 제목 체계 오류처럼 처음 접하는 개발자가 겪는 안내 문제를 바로잡는 일입니다. 문서 저장소인 `egovframe-docs`에 제목 단계를 정리해 제안했던 [PR #729](https://github.com/eGovFramework/egovframe-docs/pull/729)가 대표적입니다.

둘째는 **작은 품질 문제**입니다. 재현 조건이 뚜렷한 버그나 규칙이 명확한 유틸리티 로직을 다루는 것입니다. 파일 다운로드 시 원본 파일명 처리와 다운로드 헤더를 다룬 [PR #1167](https://github.com/eGovFramework/egovframe-common-components/pull/1167)이나 전화번호 마스킹 유틸리티를 다룬 [PR #916](https://github.com/eGovFramework/egovframe-common-components/pull/916)처럼 작은 단위 테스트로 입증할 수 있는 주제가 좋습니다.

셋째는 **안전한 운영**입니다. 실제로 사용되는 취약 라이브러리의 보안 업데이트나 컨테이너 배포 설정 보완입니다. 취약점이 확인된 의존성을 갱신한 [PR #61](https://github.com/eGovFramework/egovframe-msa-edu/pull/61)이나 9개 디플로이먼트에 헬스체크 설정을 추가한 [PR #74](https://github.com/eGovFramework/egovframe-msa-edu/pull/74), 업로드 경로를 설정으로 빼고 영구 볼륨을 연결한 [PR #121](https://github.com/eGovFramework/egovframe-template-simple-backend/pull/121)이 여기에 해당합니다.

코드를 수정하기 전에는 반드시 저장소의 역할, 기본 브랜치(대개 `main`), 최근 열린 PR과의 중복 여부를 먼저 확인해야 합니다. 저장소의 성격에 맞지 않는 변경은 아무리 코드가 깔끔해도 수용되기 어렵습니다.

---

## 실제 반영 사례

2026년 9월 12일 공개 GitHub 조회 기준으로 eGovFramework 조직에 제안한 기록은 병합 219건, 열린 PR 4건, 병합 없이 닫힌 PR 262건입니다. 이 건수는 오랜 활동의 배경일 뿐 기여의 목표가 아니며, 성공적인 병합뿐 아니라 닫힌 제안에서도 각각 다른 배움을 얻었습니다. 슬라이드에 소개된 대표 사례 세 가지를 정리합니다.

### 파일 다운로드 이름 처리 (common-components #1167)

공통컴포넌트에서 파일 다운로드 이름을 생성할 때 가이드 문서에 명시된 원본 파일명 속성 키(`orginFile`)와 실제 코드의 키가 맞지 않고 다운로드 헤더 처리가 어긋나는 문제가 있었습니다. 메인테이너의 리뷰 요청에 따라 가이드 속성 키로 통일하고, 헤더 문자열을 조합하는 로직에 대해 5개의 단위 테스트 케이스를 추가하여 보완했습니다. 실제 HTTP 응답 전송 자체를 모킹한 것은 아니었지만, 요구된 범위의 헤더 생성 검증을 충실히 채워 2026년 8월 26일 성공적으로 병합(merged)되었습니다. ([PR #1167 원문](https://github.com/eGovFramework/egovframe-common-components/pull/1167))

### 컨테이너 업로드 경로와 지속 저장소 설정 (template-simple-backend #121)

읽기 전용 컨테이너 파일시스템 환경에서 템플릿 백엔드를 구동할 경우, 기본 업로드 경로에 파일을 쓸 수 없어 업로드가 실패하는 문제가 있었습니다. 업로드 경로를 환경설정으로 외부화하고 쿠버네티스 영구 볼륨 클레임(`egovframe-template-simple-backend-files`)과 컨테이너 마운트 경로(`/app/files`)를 구성해 재기동 후에도 파일이 보존되도록 개선했습니다. PR 본문에는 YAML 설정과 마운트 경로 구성을 확인했으나 실제 쿠버네티스 클러스터에서 브라우저부터 데이터 저장까지 이어지는 E2E 검증은 수행하지 못했다는 한계를 정직하게 밝혔고, 변경사항은 병합(merged)되었습니다. ([PR #121 원문](https://github.com/eGovFramework/egovframe-template-simple-backend/pull/121))

### 독립 유틸리티 테스트 단독 추가 제안 (common-components #1166)

공통컴포넌트 유틸리티에 대한 단위 테스트만을 독립적으로 추가하는 PR을 제출했으나 메인테이너에 의해 병합 없이 종료(closed)되었습니다. 메인테이너는 `egovframe-common-components` 저장소가 실무 적용 패턴을 보여주는 샘플이자 템플릿 성격이므로 테스트 코드만을 단독 추가하는 것은 해당 저장소의 관리 범위와 목적에 부합하지 않는다고 설명했습니다. 반려 사유를 통해 저장소마다 고유한 운영 원칙이 있음을 배웠고, 이후에는 기능 수정에 부수된 검증 형태로 테스트를 제안하거나 저장소 성격에 맞는 주제로 방향을 전환하는 계기가 되었습니다. ([PR #1166 원문](https://github.com/eGovFramework/egovframe-common-components/pull/1166))

---

## 리뷰 후 수정

Pull Request를 보내면 메인테이너의 회신은 일반 댓글, 리뷰 본문, 코드 라인 인라인 코멘트 세 곳 중 어디로든 올 수 있습니다. 리뷰는 내 코드를 지적하는 자리가 아니라 코드의 동작을 저장소의 기대 수준과 일치시키는 협업 과정입니다.

피드백이 오면 요구사항을 정확히 짚어 행동으로 옮겨야 합니다. 앞서 언급한 [PR #1167](https://github.com/eGovFramework/egovframe-common-components/pull/1167)처럼 요청받은 단위 테스트를 빠르게 보강하거나, [PR #28](https://github.com/eGovFramework/egovframe-ai-rag/pull/28) 및 [PR #29](https://github.com/eGovFramework/egovframe-ai-rag/pull/29)처럼 AI 스트리밍 오류 발생 시 폴백 메시지가 사용자 응답까지 올바르게 전달되도록 `Flux.just(fallbackHandler.getFallbackMessage(e))` 코드를 연결하는 식입니다.

또한 검증의 한계를 숨기지 않는 태도가 중요합니다. [PR #121](https://github.com/eGovFramework/egovframe-template-simple-backend/pull/121)처럼 경로 구성은 확인했으나 클러스터 E2E 테스트는 거치지 못했음을 PR 본문에 솔직히 적어야 리뷰어가 확인해야 할 지점을 명확히 파악할 수 있습니다. 닫힌 PR을 마주했을 때도 감정적으로 밀어붙이기보다 피드백을 통해 저장소의 수용 범위를 다시 배우고 다음 기여의 사전 점검 기준으로 삼는 유연함이 필요합니다.

---

## AI 활용과 검증

최근 기여 과정에서 AI 도구를 활용하는 경우가 많아졌습니다. 슬라이드 14페이지에서는 AI를 활용해 초안을 작성하고 이를 작성자가 직접 확인 가능한 변경으로 바꾸는 전략을 소개합니다. 여기서 제시된 질문들은 활용 방법의 예시일 뿐, 특정 PR이 AI로 작성되었다는 이력을 뜻하지는 않습니다.

AI에게 탐색과 비교를 맡기더라도 실제 검증은 반드시 사람이 수행해야 합니다.

1. **"오류가 난 뒤 응답까지 이어지는 함수를 찾아줘"** 라는 질문으로 경로를 탐색했다면, 작성자는 원본 코드베이스에서 해당 함수가 실제로 호출되고 예외가 처리되는지 코드를 끝까지 따라가며 확인해야 합니다.
2. **"수정 전후의 차이와 빠진 경우를 비교해줘"** 라는 요청으로 초안을 얻었다면, 변경된 파일이 기존 기능이나 다른 모듈에 예상치 못한 부작용을 일으키지 않는지 파일 단위로 검토합니다.
3. **"정상 응답과 오류 안내를 확인할 테스트를 제안해줘"** 로 테스트 케이스를 생성했다면, 로컬 환경에서 테스트를 직접 빌드·실행해 통과 여부를 확인하고 기대한 응답이 반환되는지 점검합니다.

아울러 개발 도구로서 AI를 활용하는 것과, 프레임워크 자체에 신규 AI 기능을 제안하는 것은 전혀 다른 문제입니다. `egovframe-ai-rag`나 awesome-egovframe [PR #4](https://github.com/eGovFramework/awesome-egovframe/pull/4)처럼 AI 관련 저장소에 기여할 때도 큰 규모의 구조 변경은 PR을 올리기 전에 GitHub Issues를 통해 방향성을 먼저 논의하는 편이 안전합니다.

---

## 초심자의 첫걸음

첫 PR의 기본 흐름은 명확합니다.

```text
저장소 고르기 → 원본 확인 → Fork 및 브랜치 분리 → 한 가지 문제 수정 → 근거로 검증 → PR 작성과 회신
```

새 브랜치를 만들 때 `git switch -c fix/docs-link`처럼 작업 목적을 드러내고, 작업 후에는 `git diff --check`로 불필요한 공백이나 들여쓰기 오류가 없는지 확인합니다.

직접 코드를 고치는 일 외에도, 유용한 프로젝트를 알리고 실행 준비를 쉽게 만드는 방법으로 기여할 수 있습니다.

**awesome-egovframe**은 표준프레임워크 주변의 유용한 공개 도구와 라이브러리를 모아 소개하는 공식 커뮤니티 큐레이션 저장소입니다. AI 스타터([PR #4](https://github.com/eGovFramework/awesome-egovframe/pull/4)), 공공데이터 연동([PR #5](https://github.com/eGovFramework/awesome-egovframe/pull/5)), 관측성 도구([PR #6](https://github.com/eGovFramework/awesome-egovframe/pull/6)), 국산 암호화 SEED/LEA([PR #9](https://github.com/eGovFramework/awesome-egovframe/pull/9)), 개인정보 접속기록([PR #10](https://github.com/eGovFramework/awesome-egovframe/pull/10)), RAG 평가 도구([PR #11](https://github.com/eGovFramework/awesome-egovframe/pull/11)), 그리고 실행 보조 도구([PR #14](https://github.com/eGovFramework/awesome-egovframe/pull/14))까지 제안한 7건이 모두 병합되었습니다. 유용한 오픈소스를 발굴하고 저장소 공개 여부, 라이선스, README 설명, 최근 관리 상태를 확인해 목록에 추가하는 것도 훌륭한 생태계 기여입니다.

**eGovFrame Launcher**는 복잡한 표준프레임워크 예제 프로젝트를 원클릭으로 clone, build, 기동, 브라우저 오픈까지 돕는 로컬 개발용 GUI 도구입니다. 샘플 프로젝트를 직접 실행해보면서 문서 설명과 다른 점이나 실행 중 발생하는 콘솔 에러 로그를 찾아내는 것 자체가 문서 개선과 버그 수정 기여의 좋은 출발점이 될 수 있습니다.

오늘 당장 시작할 수 있는 일은 거창하지 않습니다. 자주 사용하는 저장소 하나를 열어보고 마주친 불편 하나를 아래 네 줄의 형식으로 차분히 기록해보는 것입니다.

```text
문제 = 사용자가 겪는 불편
근거 = 왜 문제인지 입증하는 로그나 문서
수정 = 한 가지 주제에 집중한 작은 변경
확인 = 실제 실행과 테스트로 검증한 결과
```

---

## 관련 자료

- [발표자료 바로 보기](https://cne.io.kr/slides/egovframe-contribution/#1)
- [awesome-egovframe 저장소](https://github.com/eGovFramework/awesome-egovframe)
- [eGovFrame Launcher 프로젝트 소개](/ko/projects/egovframe-launcher/)
- [2021년 세미나: 나도 해보자! 표준프레임워크 GitHub 컨트리뷰터 되어보기(실전편)](/ko/seminars/2021-06-09-github-contributor-2021/)
- [2025년 세미나: 템플릿 프로젝트 컨트리뷰션 해보기!](/ko/seminars/2025-07-24-template-contribution/)

### 발표자료에 언급된 공개 PR 목록

- **egovframe-common-components**
  - [PR #916](https://github.com/eGovFramework/egovframe-common-components/pull/916): 전화번호 마스킹 유틸리티 함수 및 단위 테스트 (병합)
  - [PR #1031](https://github.com/eGovFramework/egovframe-common-components/pull/1031): 4개 VO의 중복 getter/setter 코드 Lombok 정리 (병합)
  - [PR #1166](https://github.com/eGovFramework/egovframe-common-components/pull/1166): 독립 유틸리티 단위 테스트 추가 제안 (저장소 목적 부합성 확인 후 종료)
  - [PR #1167](https://github.com/eGovFramework/egovframe-common-components/pull/1167): 파일 다운로드 이름 속성 키 통일 및 헤더 테스트 보완 (병합)
- **egovframe-template-simple-backend**
  - [PR #121](https://github.com/eGovFramework/egovframe-template-simple-backend/pull/121): 업로드 경로 설정화 및 PVC 마운트 구성 (병합)
- **egovframe-docs**
  - [PR #729](https://github.com/eGovFramework/egovframe-docs/pull/729): 문서 제목 단계(H3) 정리 (병합)
- **egovframe-msa-edu**
  - [PR #61](https://github.com/eGovFramework/egovframe-msa-edu/pull/61): CVE-2024-38999 취약점 대응 webjars-locator-core 의존성 갱신 (병합)
  - [PR #74](https://github.com/eGovFramework/egovframe-msa-edu/pull/74): 9개 Deployment 대상 readinessProbe 서비스 점검 설정 추가 (병합)
- **egovframe-ai-rag**
  - [PR #28](https://github.com/eGovFramework/egovframe-ai-rag/pull/28): 스트리밍 오류 발생 시 폴백 메시지 Flux 응답 연결 (병합)
  - [PR #29](https://github.com/eGovFramework/egovframe-ai-rag/pull/29): 오류 응답 화면 연결 보완 (병합)
- **awesome-egovframe**
  - [PR #4](https://github.com/eGovFramework/awesome-egovframe/pull/4): AI 스타터 프로젝트 등재 (병합)
  - [PR #5](https://github.com/eGovFramework/awesome-egovframe/pull/5): 공공데이터 연동 도구 등재 (병합)
  - [PR #6](https://github.com/eGovFramework/awesome-egovframe/pull/6): 관측성 도구 등재 (병합)
  - [PR #9](https://github.com/eGovFramework/awesome-egovframe/pull/9): 국산 암호화 도구 등재 (병합)
  - [PR #10](https://github.com/eGovFramework/awesome-egovframe/pull/10): 개인정보 접속기록 도구 등재 (병합)
  - [PR #11](https://github.com/eGovFramework/awesome-egovframe/pull/11): RAG 평가 도구 등재 (병합)
  - [PR #14](https://github.com/eGovFramework/awesome-egovframe/pull/14): egovframe-launcher 도구 등재 (병합)
