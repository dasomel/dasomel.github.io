# [Plan] Site Redesign — Non-AI, Tech Spec 디자인 개선

## Executive Summary

| 항목 | 내용 |
|------|------|
| Feature | site-redesign |
| 시작일 | 2026-03-21 |
| 예상 범위 | 중간 규모 (UI 레이어 전체, 콘텐츠 변경 없음) |

### Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| Problem | 현재 사이트가 다중 색상 그라데이션 텍스트, 파스텔 카드, 균일한 rounded-2xl 등 AI 생성 템플릿처럼 보여 개인 브랜드 정체성이 없음 |
| Solution | "Tech Spec" 터미널 미학을 기반으로 단일 엑센트 컬러, 모노스페이스 타이포그래피, 편집적 섹션 구조로 전환 |
| Function UX Effect | 방문자가 Cloud & DevOps 엔지니어의 전문성과 개성을 즉각적으로 느낄 수 있는 명확하고 절제된 디자인 |
| Core Value | 인간이 직접 설계한 느낌 — 정밀하되 따뜻하고, 기술적이되 읽기 쉬운 개인 사이트 |

---

## 1. 현황 분석

### 1.1 기술 스택
- **Framework**: Astro 5 + Tailwind CSS 3 + MDX
- **Fonts**: Inter, Noto Sans KR, JetBrains Mono (이미 로드됨)
- **Theme color**: `#16a34a` (emerald-600) — PWA manifest, theme-color
- **Deployment**: GitHub Pages (dasomel.github.io)
- **Bilingual**: 한국어(기본) / 영어(`/en/*`)

### 1.2 현재 디자인 진단 — AI 스러운 패턴 목록

| # | 증상 | 위치 | 심각도 |
|---|------|------|--------|
| 1 | 멀티 컬러 그라데이션 텍스트 (`from-blue-600 via-cyan-500 to-teal-500` + `from-purple-600 to-pink-500`) | index.astro:21, about.astro:16 | 높음 |
| 2 | 파스텔 그라데이션 카드 (blue, purple, emerald 각각) | index.astro:83~117 | 높음 |
| 3 | 모든 요소에 `rounded-2xl` 적용 — 개성 없는 균일한 둥글기 | 전체 | 중간 |
| 4 | `text-sm font-semibold text-gray-400 uppercase tracking-widest` 섹션 헤더 | index.astro:47, 123 | 중간 |
| 5 | Awards 섹션의 amber/blue 혼재 색상 카드 | about.astro:64~81 | 중간 |
| 6 | Hero 영역이 텍스트+버튼만으로 단조로움, 공간 활용 없음 | index.astro:19~42 | 중간 |
| 7 | `from-gray-50 to-white` 카드 그라데이션의 과도한 반복 | 전체 카드 | 낮음 |

---

## 2. 디자인 방향 — "Tech Spec" Terminal Aesthetic

### 2.1 영감 및 근거

2026년 개발자 포트폴리오 트렌드 조사 결과:
- **Anti-AI 운동**: 그라데이션/완벽한 레이아웃 탈피, 개성과 의도 표현
- **Tech Spec 미학**: 엔지니어링 정밀성 — 모노스페이스 폰트, 숫자 코드, 그리드 구조, 단일 엑센트 색상
- **터미널 포트폴리오**: DevOps/Cloud 엔지니어에게 가장 어울리는 정체성 표현
- **Editorial 타이포그래피**: 큰 글자, 강한 위계, 여백의 의도적 활용

참고 인물: 이미 `$ dasomel` 터미널 로고가 있음 — 이 방향을 전체로 확장

### 2.2 핵심 디자인 원칙

1. **단일 엑센트**: emerald-600 하나만. blue/purple/pink 제거
2. **모노스페이스 정체성**: JetBrains Mono를 레이블/메타데이터에 적극 활용
3. **편집적 섹션 번호**: `01 —`, `02 —` 스타일로 섹션 구분 (uppercase tracking 대신)
4. **평면 카드**: 파스텔 그라데이션 제거 → 흰 배경 + 얇은 1px 경계선
5. **타이포그래피 위계**: 크기 대비를 키워 스캔하기 쉬운 구조
6. **여백의 의도**: 요소 간격을 정돈하여 숨쉬는 공간 확보

---

## 3. 변경 범위

### Phase 1 — 컬러 & 타이포그래피 정제 (필수, 높은 임팩트)

#### 3.1 Hero 섹션 (`src/pages/index.astro`)
- **Before**: 멀티 그라데이션 텍스트 h1
- **After**:
  - 메인 타이틀: 단색 `text-gray-900`, 그라데이션 제거
  - `Cloud & DevOps` 중 한 단어만 emerald accent — 절제된 포인트
  - 소개 문구 위에 JetBrains Mono로 작은 role 태그 추가 (`$ role: cloud-devops-engineer`)
  - 버튼: 현재 pill 스타일 유지하되 hover 효과 개선

#### 3.2 섹션 헤더 스타일 전환 (전체 페이지)
- **Before**: `text-sm font-semibold text-gray-400 uppercase tracking-widest`
- **After**: `font-mono text-xs text-gray-400` + 번호 접두사 (`01 — Projects`)

#### 3.3 Features 카드 3종 (`index.astro:83~117`)
- **Before**: blue/purple/emerald 파스텔 그라데이션 카드
- **After**: 단일 스타일 흰 카드, 아이콘 색상만 emerald 단일 컬러
  - 아이콘 배경: `bg-gray-900` (모든 카드 동일) 또는 각각 outline 스타일

#### 3.4 Awards 섹션 (`about.astro:64~81`)
- **Before**: amber/blue 혼재 색상
- **After**: 모두 동일한 스타일 + 연도를 JetBrains Mono로

### Phase 2 — 구조적 개선 (임팩트 높음)

#### 3.5 About 페이지 Career 타임라인
- 현재: 단순 카드 스택
- 개선: 왼쪽에 타임라인 라인 + 연도를 모노스페이스 표기
- 형태: `border-l-2 border-gray-100` 타임라인 패턴

#### 3.6 Posts 목록 날짜 형식
- 현재: `toLocaleDateString('ko-KR')` → `2025년 1월 1일`
- 개선: JetBrains Mono로 `2025-01-01` ISO 형식 (기술적 느낌)

#### 3.7 Footer 개선
- 현재: 아이콘만 있는 미니멀한 footer
- 개선: 좌측에 `$ dasomel --version 1.0` 스타일 서명 추가

### Phase 3 — 선택적 개선 (낮은 우선순위)

#### 3.8 Dark mode 토글 (선택)
- 현재 디자인이 light-only
- 터미널 미학에 다크모드가 잘 어울림
- Tailwind `dark:` 클래스 추가 방식으로 구현 가능

#### 3.9 Header 활성 상태 개선
- 현재: `bg-gray-100` 배경 pill
- 개선: 하단 라인(`border-b-2 border-emerald-600`) 방식으로 변경

---

## 4. 변경 파일 목록

| 파일 | 변경 내용 | 우선순위 |
|------|-----------|----------|
| `src/pages/index.astro` | Hero 그라데이션 제거, 섹션 헤더, Features 카드 | P0 |
| `src/pages/about.astro` | 헤더 그라데이션 제거, Awards 통일, Career 타임라인 | P0 |
| `src/components/Header.astro` | 활성 상태 스타일 개선 | P1 |
| `src/components/Footer.astro` | 서명 스타일 추가 | P1 |
| `src/pages/posts/index.astro` | 날짜 형식 변경 | P1 |
| `src/pages/en/index.astro` | index.astro와 동일한 변경 적용 | P1 |
| `src/pages/en/about.astro` | about.astro와 동일한 변경 적용 | P1 |
| `src/styles/global.css` | 공통 유틸리티 추가 가능성 | P2 |

---

## 5. 구현 가이드라인

### 5.1 색상 사용 규칙
```
배경:   white / gray-50
텍스트: gray-900 (제목), gray-600 (본문), gray-400 (메타)
경계:   gray-100 (기본), gray-200 (hover)
엑센트: emerald-600 ONLY (링크 hover, 아이콘, 배지, 활성 상태)
제거:   blue-600, cyan-500, teal-500, purple-600, pink-500, amber-*
```

### 5.2 타이포그래피 규칙
```
제목 (h1):      Inter 또는 Noto Sans KR, font-bold, text-gray-900
섹션 레이블:    JetBrains Mono, text-xs, text-gray-400  (예: "01 — Projects")
메타데이터:     JetBrains Mono, text-xs, text-gray-400  (날짜, 태그)
본문:           Inter/Noto Sans KR, text-gray-600
코드/터미널:    JetBrains Mono (유지)
```

### 5.3 카드 스타일 규칙
```
기본 카드:   bg-white border border-gray-100 rounded-xl
hover 카드:  hover:border-gray-200 hover:shadow-sm transition-all
제거:        bg-gradient-to-br from-*-50, rounded-2xl (→ rounded-xl로 통일)
```

### 5.4 섹션 헤더 마크업 패턴
```html
<!-- Before -->
<h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest">Projects</h2>

<!-- After -->
<h2 class="font-mono text-xs text-gray-400">01 — Projects</h2>
```

---

## 6. 완료 기준 (Done Criteria)

- [ ] 멀티 컬러 그라데이션 텍스트가 모든 페이지에서 제거됨
- [ ] 파스텔 그라데이션 카드(blue, purple, emerald, amber)가 단일 스타일로 통일됨
- [ ] 섹션 헤더가 편집적 번호 스타일로 변경됨
- [ ] JetBrains Mono가 메타데이터/레이블에 일관되게 사용됨
- [ ] 엑센트 색상이 emerald-600 단일로 통일됨
- [ ] 영문 페이지(`/en/*`)에도 동일한 변경이 적용됨
- [ ] 기존 기능(한/영 토글, 반응형, PWA) 정상 작동 확인

---

## 7. 리스크

| 리스크 | 대응 |
|--------|------|
| 영문 페이지 누락 | `/en/index.astro`, `/en/about.astro` 체크리스트 포함 |
| 다크모드 미구현 시 터미널 느낌 반감 | Phase 3로 분리, Phase 1~2만으로도 충분한 개선 |
| 기존 콘텐츠 가독성 저하 | 변경 후 실제 브라우저에서 다크/밝은 환경 확인 |
