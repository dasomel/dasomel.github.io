---
title: "AI와 디자인 시스템으로 CNE 사이트 전체 UI를 다시 정리한 과정"
description: "Projects, Project Detail, Notes, Tech Digest, Docs, Speaking까지 하나의 디자인 원칙으로 정리하고, AI를 실행 파트너로 활용해 실제 OSS 사이트에 적용한 과정을 정리했습니다."
pubDate: 2026-08-22
tags: ["Design System", "AI", "UI/UX", "Accessibility", "Open Source"]
featured: false
---

최근 CNE 사이트의 UI를 한 번에 크게 바꾸기보다, **하나의 디자인 시스템을 먼저 정의하고 실제 화면에 반복 적용하면서 전체 경험을 수렴시키는 작업**을 진행했습니다.

이번 작업에서 AI는 "예쁜 화면을 만들어주는 도구"라기보다, 이미 정한 디자인 원칙을 여러 화면에 빠르게 적용하고 비교하며 수정하는 **실행 파트너**에 가까웠습니다.

결과적으로 Projects, Project Detail, Notes, Tech Digest, Docs, Speaking, About, 공통 Header까지 주요 화면의 시각적 언어를 하나의 방향으로 맞췄습니다.

## 문제는 페이지 하나가 아니었다

처음 보이기 시작한 문제는 단순했습니다.

Light/Dark 모드에서 surface 대비가 일정하지 않았고, 어떤 페이지에서는 카드가 너무 강하게 떠 보이고 다른 페이지에서는 경계가 너무 약했습니다. 모바일에서는 정보가 갑자기 좁아지거나, 중요한 정보와 보조 정보의 시각적 우선순위가 뒤섞이는 부분도 있었습니다.

Projects는 특히 이런 문제가 명확했습니다.

검색과 필터, 결과 수, 카드, GitHub 액션이 모두 필요한 기능이었지만 각각을 개별적으로 강조하면 화면 전체가 복잡해졌습니다. 그래서 문제를 "카드 하나를 예쁘게 만드는 것"이 아니라 **정보의 우선순위를 다시 정의하는 것**으로 바꿨습니다.

## 먼저 디자인 시스템을 기준점으로 만들었다

이번 리뉴얼에서 가장 중요한 결정은 컴포넌트보다 먼저 **surface와 typography의 관계를 정의한 것**입니다.

기본 surface hierarchy는 다음과 같이 정리했습니다.

```text
bg
 └─ bg-subtle
     └─ surface
         └─ surface-hi
```

코드와 운영 정보를 표현하는 영역은 별도의 `code-*` 토큰을 사용하고, 설명용 문서 박스에는 `doc-panel-*` 토큰을 사용했습니다.

색상의 역할도 분리했습니다.

- Teal: 브랜드, 링크, focus, 주요 강조
- Amber: evidence와 semantic signal
- Border: 정보 영역을 구분하는 기본 경계
- Shadow: 구조를 대신하지 않고 hover/elevation을 보조

이렇게 역할을 먼저 정해두니 페이지마다 임의의 색상이나 배경을 추가할 필요가 줄었습니다.

## Projects를 작은 제품처럼 다듬었다

Projects는 이번 작업에서 가장 많은 검증이 이루어진 화면입니다.

처음에는 검색과 tag filter를 하나의 explorer surface로 묶고, 결과 수와 active state를 명확하게 보여주는 것부터 시작했습니다.

이후 다음 순서로 개선했습니다.

```text
검색/필터
  ↓
empty state
  ↓
mobile filter
  ↓
keyboard focus
  ↓
hover interaction
  ↓
card density
  ↓
section rhythm
  ↓
entry hierarchy
  ↓
action hierarchy
  ↓
surface contrast
```

여기서 중요한 변화는 **primary action과 secondary action을 분리한 것**입니다.

프로젝트 카드에서 프로젝트 자체로 들어가는 동작이 가장 중요한데 GitHub나 기타 source 링크가 같은 무게를 가지면 사용자가 어느 곳을 눌러야 할지 바로 판단하기 어렵습니다.

그래서 프로젝트 제목과 상세 진입을 primary로 두고 repository/source 관련 동작은 secondary로 낮췄습니다.

이 작업은 [Projects entry hierarchy](https://github.com/dasomel/dasomel.github.io/pull/211), [card action hierarchy](https://github.com/dasomel/dasomel.github.io/pull/212), [surface contrast](https://github.com/dasomel/dasomel.github.io/pull/214)로 이어졌습니다.

## Project Detail은 Case Study로 재정의했다

프로젝트 상세 화면은 단순한 프로젝트 소개 페이지가 아니라 **engineering case study**로 읽히도록 구조를 정리했습니다.

전체 흐름은 다음과 같습니다.

```text
Hero
 ↓
Problem / Response
 ↓
Source Snapshot
 ↓
Signals
 ↓
Docs / Notes / Tech Digest
 ↓
Engineering Content
```

특히 긴 본문은 읽기 폭을 제한하고 H2/H3의 간격과 divider를 다시 잡았습니다.

관련 콘텐츠도 Docs, Notes, Tech Digest가 같은 목록처럼 보이지 않도록 역할별로 구분했습니다.

즉, 프로젝트의 "정보량"을 줄인 것이 아니라 **정보의 종류가 다르다는 사실을 시각적으로 드러낸 것**입니다.

관련 작업은 [Project Detail mobile reading rhythm](https://github.com/dasomel/dasomel.github.io/pull/213), [case-study hierarchy](https://github.com/dasomel/dasomel.github.io/pull/215), [related content groups](https://github.com/dasomel/dasomel.github.io/pull/216)에서 정리했습니다.

## Notes / Tech Digest / Docs도 같은 시스템으로 묶었다

콘텐츠 화면은 서로 다른 성격을 가지고 있습니다.

- Notes: Engineering Notes
- Tech Digest: Tech Signal
- Docs: Reference

완전히 같은 페이지로 만들 필요는 없지만, typography와 surface hierarchy까지 각각 달라지면 사이트 전체가 다른 제품처럼 보입니다.

그래서 공통 collection surface를 만들고 다음과 같은 rhythm을 적용했습니다.

```text
Hero
 ↓
Context / Notice
 ↓
Featured content
 ↓
Archive
```

여기에 카드의 keyboard focus, title wrapping, reduced-motion, metadata rhythm을 공통으로 적용했습니다.

최근에는 PostList도 제목을 가장 강한 scan target으로 만들고, 날짜와 읽기 시간을 compact metadata로 묶어 긴 글 목록을 더 빨리 훑을 수 있게 했습니다.

이 부분은 [collection interaction states](https://github.com/dasomel/dasomel.github.io/pull/217), [collection rhythm](https://github.com/dasomel/dasomel.github.io/pull/218), [post list scanability](https://github.com/dasomel/dasomel.github.io/pull/219)로 이어졌습니다.

## AI는 디자인을 결정하지 않았다

이번 작업에서 AI를 사용하면서 가장 중요했던 부분은 **AI가 디자인 방향을 결정하지 않도록 한 것**입니다.

먼저 사람이 정한 원칙이 있었습니다.

```text
Engineering first
Editorial hierarchy
Quiet surfaces
One primary accent
Evidence over ornament
Motion with purpose
```

AI는 이 원칙을 실제 코드에 적용하고, 기존 구현과 비교하고, 서로 다른 페이지에서 같은 규칙이 깨지는 부분을 찾는 데 사용했습니다.

예를 들어 Projects에서 카드 하나를 수정한 뒤 끝내는 것이 아니라,

> 이 hierarchy가 Project Detail에서도 유지되는가?
>
> Dark mode에서도 같은 surface 관계가 유지되는가?
>
> 모바일에서 정보의 우선순위가 바뀌지 않는가?
>
> 키보드 focus와 reduced-motion에서도 문제가 없는가?

같은 질문을 반복해서 적용했습니다.

이런 방식에서는 AI가 만든 결과보다 **AI에게 계속 같은 기준을 적용하게 만드는 것이 더 중요**합니다.

## 접근성과 반응형을 마지막에 따로 붙이지 않았다

이번 리뉴얼에서 focus state와 reduced-motion은 별도의 "마지막 체크"가 아니라 디자인 시스템의 일부로 다뤘습니다.

카드와 링크에는 `focus-visible` 상태를 명확하게 적용했고, hover transform은 터치 환경을 고려해 제한했습니다. 사용자가 reduced motion을 선호하는 경우에는 의미 없는 이동 효과가 사라지도록 했습니다.

모바일에서도 단순히 desktop을 한 열로 줄이지 않았습니다.

제목의 줄바꿈, metadata의 밀도, Section spacing, navigation surface까지 화면 폭이 줄어들 때 어떤 정보가 먼저 보여야 하는지를 다시 확인했습니다.

## 마지막에는 더 이상 작은 PR을 만들지 않았다

이 작업은 여러 단계의 PR로 진행됐지만, 마지막에는 방향을 바꿨습니다.

계속 작은 부분을 고치다 보면 디자인 개선 자체가 끝나지 않습니다. 그래서 최종 단계에서는 남은 UI, accessibility, responsive, theme 관련 작업을 **한 번에 cross-site consistency pass로 묶었습니다.**

마지막 PR인 [#220](https://github.com/dasomel/dasomel.github.io/pull/220)은 Header focus, mobile navigation, About/Speaking interaction, narrow-screen behavior, 최종 UI QA checklist를 함께 정리하면서 이번 redesign cycle을 종료했습니다.

## 이번 작업에서 얻은 결론

이번 경험을 통해 가장 크게 느낀 것은 **디자인 시스템은 문서가 아니라 반복 적용되는 판단 기준**이라는 점입니다.

색상 토큰만 만들어 놓는다고 디자인 시스템이 되는 것은 아닙니다.

Projects에서 정한 hierarchy가 Project Detail에서도 유지되고, Notes에서 정한 metadata rhythm이 Tech Digest에서도 자연스럽고, Light/Dark와 Mobile에서도 같은 의미 구조가 유지되어야 합니다.

그리고 AI를 활용하는 경우에는 이 점이 더 중요합니다.

AI에게 매번 "좀 더 예쁘게"라고 요청하는 것보다,

```text
이 컴포넌트의 primary action은 무엇인가?
이 surface의 역할은 무엇인가?
이 정보가 보조 정보라면 왜 같은 강도로 보이는가?
Dark mode에서도 같은 의미 구조를 유지하는가?
Mobile에서도 동일한 우선순위가 유지되는가?
```

처럼 **디자인 시스템의 질문을 반복하는 것이 훨씬 일관된 결과를 만든다**고 느꼈습니다.

이번 CNE redesign은 이제 일단락했습니다.

앞으로는 디자인을 계속 미세 조정하기보다 새로운 기능이나 실제 사용성 문제가 생겼을 때 디자인 시스템을 확장하는 방향으로 운영하려고 합니다.

결국 이번 작업의 목표는 "더 예쁜 사이트"라기보다 **Open Source Engineering Workbench라는 CNE의 성격이 어느 화면에서도 같은 언어로 느껴지는 것**이었습니다.
