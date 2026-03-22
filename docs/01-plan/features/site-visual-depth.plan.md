# [Plan] Site Visual Depth — 밋밋함 탈출: 시각적 깊이와 개성 추가

## Executive Summary

| 항목 | 내용 |
|------|------|
| Feature | site-visual-depth |
| 시작일 | 2026-03-21 |
| 선행 작업 | site-redesign (완료, 97% Match Rate) |
| 예상 범위 | 소-중간 규모 (시각 레이어 강화, 구조 변경 없음) |

### Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| Problem | 리디자인 후 사이트가 깨끗해졌으나 순백 배경 + 동일한 흰 카드 반복으로 시각적 깊이와 개성이 부족. 방문자의 눈에 걸리는 지점이 없음 |
| Solution | 배경 질감, 커서 애니메이션, 카드 인터랙션, 섹션 구분선 등 **레이어드 시각 요소**를 추가해 Tech Spec 정체성을 강화 |
| Function UX Effect | 스크롤마다 구체적인 시각 포인트가 있어 콘텐츠가 부각되고 엔지니어적 감성이 느껴짐 |
| Core Value | "고의적으로 설계된" 느낌 — AI 템플릿의 과잉 장식이 아닌, 정밀하고 의도된 디테일 |

---

## 1. 현황 진단 — 밋밋함의 원인

### 1.1 현재 문제점

| # | 문제 | 위치 | 영향도 |
|---|------|------|--------|
| 1 | 페이지 배경이 순백 — 카드와 배경이 구분 없음 | BaseLayout.astro (body bg 미설정) | 높음 |
| 2 | Hero 섹션이 텍스트만 떠 있음 — 시각적 앵커 없음 | index.astro Hero section | 높음 |
| 3 | 모든 카드가 동일한 `bg-white border-gray-100` 반복 | 전체 페이지 카드 | 중간 |
| 4 | 섹션 간 구분이 여백뿐 — 시각적 리듬 없음 | 모든 `<section>` 간격 | 중간 |
| 5 | `font-mono text-xs text-gray-400` 레이블이 배경과 거의 구별 안 됨 | 모든 섹션 헤더 | 중간 |
| 6 | hover 시 `shadow-sm` — 거의 보이지 않는 피드백 | 카드 hover 상태 | 낮음 |
| 7 | 터미널 레이블(`$ whoami`)이 정적 텍스트로만 존재 — 생동감 없음 | Hero 터미널 레이블 | 낮음 |

### 1.2 핵심 원인

```
순백(#fff) 배경 + 흰 카드(bg-white) = 명도 대비 0% → 플랫함의 주범
```

---

## 2. 개선 방향 — "Depth through Restraint"

### 2.1 2026 디자인 트렌드 근거

- **Textured Minimalism**: 완벽히 정제된 평면을 탈피, 의도적 질감으로 온기 추가
- **Neo-Brutalism 디테일**: 거친 그리드, 오버사이즈 타이포, 노출된 구조
- **Terminal Identity 강화**: 생동감 있는 터미널 요소 (커서, 윈도우 크롬)
- **레이어드 표면**: 배경→카드→텍스트 3단 깊이로 시각적 계층 형성

### 2.2 핵심 원칙 (site-redesign 방향성 유지)

1. AI 패턴 금지 유지 — 멀티 컬러 그라데이션, pastel 카드 재사용 없음
2. emerald-600 단일 엑센트 유지
3. 모든 추가 요소는 **빼도 기능에 문제 없는** 순수 시각 레이어
4. Tailwind CSS 유틸리티만으로 구현 — 외부 라이브러리 추가 없음

---

## 3. 구현 항목

### Phase 1 — 배경 깊이 (임팩트 최대, 변경 최소)

#### 3.1 페이지 배경: `gray-50`으로 전환
- **파일**: `src/layouts/BaseLayout.astro`
- **변경**: `<body>` 에 `class="... bg-gray-50"` 추가
- **효과**: `bg-white` 카드들이 `bg-gray-50` 위에 올라와 자연스러운 입체감 형성
- **Before**: 흰 배경 + 흰 카드 = 구분 없음
- **After**: 연회색 배경 + 흰 카드 = 카드가 떠오르는 느낌

```html
<!-- Before -->
<body class="min-h-screen flex flex-col">

<!-- After -->
<body class="min-h-screen flex flex-col bg-gray-50">
```

#### 3.2 Hero 섹션: 도트 그리드 배경 패턴
- **파일**: `src/pages/index.astro`, `src/pages/en/index.astro`
- **변경**: Hero `<section>`에 CSS 배경 패턴 추가
- **효과**: 엔지니어링 드로잉/그래프 용지 느낌 — DevOps 정체성과 완벽히 일치
- **구현**: Tailwind `[style]` prop 또는 inline style

```html
<!-- Hero section에 도트 그리드 패턴 -->
<section class="mb-20 pt-4 relative"
  style="background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px); background-size: 28px 28px;">
```

> 참고: `#d1d5db` = `gray-300`, opacity 약 40% — gray-50 배경 위에 아주 연하게 보임

### Phase 2 — 터미널 생동감 (정체성 강화)

#### 3.3 블링킹 커서 애니메이션
- **파일**: `src/styles/global.css` + `index.astro`, `about.astro`, `projects.astro`, `posts/index.astro` (en/* 포함)
- **변경**: `$ whoami▋` 스타일로 커서 캐릭터 추가 + CSS 애니메이션

```css
/* global.css에 추가 */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cursor-blink {
  animation: blink 1.2s step-end infinite;
  margin-left: 1px;
}
```

```html
<!-- 터미널 레이블 수정 -->
<p class="font-mono text-xs text-gray-400 mb-6">
  $ whoami<span class="cursor-blink text-emerald-500">▋</span>
</p>
```

#### 3.4 터미널 윈도우 크롬 (Hero 전용)
- **파일**: `src/pages/index.astro`, `src/pages/en/index.astro`
- **변경**: Hero의 `$ whoami` 블록을 미니 터미널 윈도우로 감싸기
- **효과**: macOS 터미널 창처럼 보이는 micro-detail — 과하지 않게 상단 3dot만

```html
<!-- 터미널 크롬 컴포넌트 -->
<div class="inline-block mb-8">
  <div class="bg-gray-100 rounded-t px-3 py-1.5 flex items-center gap-1.5">
    <span class="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
    <span class="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
    <span class="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
  </div>
  <div class="bg-white border border-t-0 border-gray-200 rounded-b px-4 py-3">
    <p class="font-mono text-xs text-gray-400">
      $ whoami<span class="cursor-blink text-emerald-500">▋</span>
    </p>
  </div>
</div>
```

### Phase 3 — 섹션 리듬 & 카드 인터랙션

#### 3.5 섹션 헤더: 수평 구분선 패턴
- **파일**: 전체 페이지 섹션 헤더
- **변경**: 섹션 번호 옆에 확장되는 얇은 구분선 추가
- **효과**: 신문/잡지 레이아웃의 편집적 리듬감

```html
<!-- Before -->
<h2 class="font-mono text-xs text-gray-400 mb-6">01 — Projects</h2>

<!-- After -->
<div class="flex items-center gap-4 mb-6">
  <h2 class="font-mono text-xs text-gray-400 whitespace-nowrap">01 — Projects</h2>
  <div class="flex-1 border-t border-dashed border-gray-200"></div>
</div>
```

#### 3.6 카드: 왼쪽 액센트 보더 (hover)
- **파일**: `index.astro`, `projects.astro`, `posts/index.astro` (en/* 포함)
- **변경**: 카드 왼쪽에 emerald 보더가 hover 시 나타나는 transition 추가
- **효과**: 각 카드가 hover 시 명확한 시각적 피드백 제공

```html
<!-- Before -->
<div class="p-5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all group">

<!-- After -->
<div class="p-5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all group
            border-l-2 border-l-transparent group-hover:border-l-emerald-500">
```

> 주의: `border-l-2`와 기존 `border` 충돌 방지를 위해 `border-l` 방향만 별도 지정

#### 3.7 Hero H1: 더 큰 타이포그래피 스케일
- **파일**: `index.astro`, `en/index.astro`
- **변경**: 최대 화면에서 h1 크기 확장 (`xl:text-8xl` 추가)
- **효과**: 강한 타이포그래픽 존재감 — 스캔 시 즉각 포착

```html
<!-- Before -->
<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold ...">

<!-- After -->
<h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold ...">
```

---

## 4. 변경 파일 목록

| 파일 | 변경 내용 | 우선순위 |
|------|-----------|----------|
| `src/layouts/BaseLayout.astro` | body `bg-gray-50` 추가 | P0 |
| `src/styles/global.css` | `.cursor-blink` 애니메이션 추가 | P0 |
| `src/pages/index.astro` | Hero 도트 그리드, 터미널 크롬, 커서, 섹션 구분선, 카드 L보더, H1 확장 | P0 |
| `src/pages/en/index.astro` | 동일 | P0 |
| `src/pages/about.astro` | 섹션 구분선, 커서, 카드 L보더 | P1 |
| `src/pages/en/about.astro` | 동일 | P1 |
| `src/pages/projects.astro` | 섹션 구분선, 커서, 카드 L보더 | P1 |
| `src/pages/en/projects.astro` | 동일 | P1 |
| `src/pages/posts/index.astro` | 섹션 구분선, 커서, 카드 L보더 | P1 |
| `src/pages/en/posts/index.astro` | 동일 | P1 |

---

## 5. 구현 가이드라인

### 5.1 배경 깊이 시스템

```
페이지 배경:  bg-gray-50 (#f9fafb) ← 새로 추가
카드 표면:    bg-white   (#ffffff) ← 기존 유지
텍스트:       gray-900/600/400     ← 기존 유지
```

### 5.2 도트 패턴 스펙

```css
/* 강도 조절 가이드 */
light:  radial-gradient(circle, #e5e7eb 1px, transparent 1px)  /* gray-200 */
medium: radial-gradient(circle, #d1d5db 1px, transparent 1px)  /* gray-300 — 권장 */
dark:   radial-gradient(circle, #9ca3af 1px, transparent 1px)  /* gray-400 */

/* 간격: 28px (촘촘) / 32px (여유) / 40px (드문드문) */
background-size: 28px 28px;
```

### 5.3 border-l 카드 패턴

```
기본 상태: border-l-2 border-l-transparent
hover 상태: group-hover:border-l-emerald-500
전환: transition-all (기존 클래스로 커버)
```

### 5.4 커서 애니메이션 사용처

| 페이지 | 레이블 |
|--------|--------|
| index | `$ whoami` |
| about | `$ cat profile.json` |
| projects | `$ ls ./projects` |
| posts | `$ ls ./posts` |

---

## 6. 완료 기준 (Done Criteria)

- [ ] 페이지 배경이 `bg-gray-50` — 카드(bg-white)와 명도 대비가 생겨 입체감 확인
- [ ] Hero 섹션에 도트 그리드 패턴이 배경으로 보임 (매우 연하게)
- [ ] 터미널 레이블 끝에 블링킹 커서(`▋`) 가 애니메이션 동작
- [ ] 섹션 헤더 번호 옆에 `border-dashed` 수평선이 확장
- [ ] 카드 hover 시 왼쪽에 emerald 세로선 나타남
- [ ] 빌드 성공 (0 errors)
- [ ] 영문 페이지(`/en/*`) 동일하게 적용 확인
- [ ] 기존 기능 정상 (반응형, 한/영 토글, PWA)

---

## 7. 리스크

| 리스크 | 대응 |
|--------|------|
| 도트 패턴이 너무 진하거나 산만함 | 색상을 `gray-200`으로 낮추거나 Hero 섹션에만 한정 |
| `border-l-2`가 기존 `border` 클래스와 충돌 | Tailwind `border-l` 방향 단독 지정으로 우선순위 처리 |
| 커서 애니메이션이 읽기 방해 | `step-end` 방식 사용으로 부드럽게 깜박임, 눈에 피로 없음 |
| `bg-gray-50`이 기존 콘텐츠(이미지 등) 색상과 충돌 | 대부분 흰 카드 안에 있어 영향 없음 |
