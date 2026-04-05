# [Design] Site Redesign — Non-AI, Tech Spec 디자인

## 참조 Plan
`docs/01-plan/features/site-redesign.plan.md`

---

## 1. 디자인 시스템 정의

### 1.1 색상 토큰

```
[ 제거 대상 ]
bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500  → text-gray-900
bg-gradient-to-r from-purple-600 to-pink-500             → text-gray-900
bg-gradient-to-r from-blue-600 to-cyan-500               → text-gray-900
bg-gradient-to-r from-emerald-600 to-teal-500            → text-emerald-600
bg-gradient-to-br from-gray-50 to-white                  → bg-white
bg-gradient-to-br from-blue-50 to-cyan-50                → bg-white
bg-gradient-to-br from-purple-50 to-pink-50              → bg-white
bg-gradient-to-br from-emerald-50 to-teal-50             → bg-white
bg-gradient-to-br from-amber-50 to-orange-50             → bg-white
bg-gradient-to-br from-blue-50 to-cyan-50                → bg-white
text-blue-600 (hover/link)                               → text-emerald-600
border-blue-100, border-purple-100, border-amber-100     → border-gray-100

[ 유지 / 추가 ]
text-emerald-600    엑센트 (링크 hover, 아이콘, 배지, 터미널 $)
bg-emerald-100      배지 배경
text-emerald-700    배지 텍스트
border-gray-100     카드 기본 경계
border-gray-200     카드 hover 경계
```

### 1.2 카드 공통 스타일

```html
<!-- 표준 카드 (모든 카드에 통일 적용) -->
class="bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all"

<!-- rounded-2xl → rounded-xl 로 전체 통일 -->
```

### 1.3 섹션 헤더 패턴

```html
<!-- Before -->
<h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest">Projects</h2>

<!-- After -->
<h2 class="font-mono text-xs text-gray-400">01 — Projects</h2>
```

번호 매핑 (index.astro 기준):
- `01 — Projects`
- `02 — Overview`  (Features 카드 섹션)
- `03 — Recent`

### 1.4 날짜 형식

```html
<!-- Before -->
{post.data.pubDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}

<!-- After -->
<time class="font-mono text-xs text-gray-400">
  {post.data.pubDate.toISOString().slice(0, 10)}
</time>
```

---

## 2. 파일별 구체적 변경 사항

### 2.1 `src/pages/index.astro` — 전체 재작성

#### Hero 섹션 (line 19~42)

```html
<!-- BEFORE -->
<section class="text-center mb-20">
  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
    <span class="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Cloud</span> & <span class="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">DevOps</span>
    <br class="hidden sm:block" />
    Engineer
  </h1>
  <p class="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-10">
    오픈소스 프로젝트 개발과 커뮤니티 활동을 하고 있습니다
  </p>
  ...
</section>

<!-- AFTER -->
<section class="mb-20 pt-4">
  <p class="font-mono text-xs text-gray-400 mb-6">$ whoami</p>
  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
    Cloud & DevOps<br />
    <span class="text-emerald-600">Engineer</span>
  </h1>
  <p class="text-lg text-gray-500 max-w-xl mb-10">
    오픈소스 프로젝트 개발과 커뮤니티 활동을 하고 있습니다
  </p>
  <div class="flex flex-wrap gap-4">
    <a href="/projects"
       class="px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all hover:scale-105">
      Projects
    </a>
    <a href="/seminars"
       class="px-8 py-3.5 border border-gray-200 text-gray-700 font-medium rounded-full hover:border-gray-900 hover:bg-gray-50 transition-all">
      Seminars
    </a>
  </div>
</section>
```

변경 포인트:
- `$ whoami` 터미널 프롬프트 레이블 추가
- `Cloud & DevOps` → 단색 `text-gray-900`
- `Engineer` → `text-emerald-600` 단일 엑센트
- `border-2` → `border` (더 절제된 버튼)
- `text-center` 제거 → 좌측 정렬 (더 편집적)

#### Projects Preview 섹션 헤더 (line 46~51)

```html
<!-- BEFORE -->
<h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest">Projects</h2>
<a href="/projects" class="text-gray-400 hover:text-gray-900 text-sm transition-colors">View all →</a>

<!-- AFTER -->
<h2 class="font-mono text-xs text-gray-400">01 — Projects</h2>
<a href="/projects" class="font-mono text-xs text-gray-400 hover:text-emerald-600 transition-colors">view all →</a>
```

#### Projects 카드 (line 53~78)

```html
<!-- BEFORE -->
<div class="p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-lg transition-all group">
  ...
  <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">

<!-- AFTER -->
<div class="p-5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all group">
  ...
  <h3 class="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
```

#### Features 카드 3종 (line 82~118)

```html
<!-- BEFORE: 3가지 다른 컬러 그라데이션 카드 -->
<div class="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl">
  <div class="w-10 h-10 bg-blue-500 rounded-xl ...">
<div class="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl">
  <div class="w-10 h-10 bg-purple-500 rounded-xl ...">
<div class="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl">
  <div class="w-10 h-10 bg-emerald-500 rounded-xl ...">

<!-- AFTER: 동일 스타일, 아이콘만 outline 방식으로 -->
<div class="p-6 bg-white border border-gray-100 rounded-xl">
  <div class="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
    <svg class="w-5 h-5 text-gray-600" ...>

<!-- 3개 모두 동일 패턴 적용 -->
```

#### Features 섹션 헤더 없음 → 추가

현재 Features 섹션은 헤더 없이 카드만 있음. 섹션 레이블 추가:

```html
<!-- AFTER: Features 섹션 앞에 추가 -->
<div class="flex items-center justify-between mb-6">
  <h2 class="font-mono text-xs text-gray-400">02 — Overview</h2>
</div>
<section class="grid md:grid-cols-3 gap-4 mb-20">
```

#### Recent Posts 섹션 헤더 (line 123~126)

```html
<!-- BEFORE -->
<h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest">Recent</h2>
<a href="/posts" class="text-gray-400 hover:text-gray-900 text-sm transition-colors">View all →</a>

<!-- AFTER -->
<h2 class="font-mono text-xs text-gray-400">03 — Recent</h2>
<a href="/posts" class="font-mono text-xs text-gray-400 hover:text-emerald-600 transition-colors">view all →</a>
```

#### Recent Posts 카드 (line 130~149)

```html
<!-- BEFORE -->
<a class="block p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-md transition-all group">
  <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
  <time class="text-xs text-gray-400 whitespace-nowrap">
    {post.data.pubDate.toLocaleDateString('ko-KR')}

<!-- AFTER -->
<a class="block p-5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all group">
  <h3 class="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
  <time class="font-mono text-xs text-gray-400 whitespace-nowrap">
    {post.data.pubDate.toISOString().slice(0, 10)}
```

---

### 2.2 `src/pages/about.astro` — 전체 재작성

#### Hero 헤더 (line 7~21)

```html
<!-- BEFORE -->
<header class="text-center mb-16">
  <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
    <span class="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Cloud</span> & <span class="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">DevOps</span> Engineer
  </h1>
  <p class="text-lg text-gray-500">오픈소스 프로젝트와 커뮤니티 활동을 하고 있습니다</p>
</header>

<!-- AFTER -->
<header class="mb-16">
  <div class="mb-8">
    <img src="/images/dasomel.jpg" alt="dasomel"
         class="w-28 h-28 rounded-full object-cover ring-2 ring-gray-100" />
  </div>
  <p class="font-mono text-xs text-gray-400 mb-3">$ cat profile.json</p>
  <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
    Cloud & DevOps <span class="text-emerald-600">Engineer</span>
  </h1>
  <p class="text-gray-500">오픈소스 프로젝트와 커뮤니티 활동을 하고 있습니다</p>
</header>
```

변경 포인트:
- `text-center` 제거 → 좌측 정렬
- `text-center` 제거로 프로필 이미지도 좌측 배치
- 폰트 크기 한 단계 축소 (덜 과장됨)
- `ring-4` → `ring-2` (더 절제됨)
- `$ cat profile.json` 터미널 레이블

#### Career 섹션 헤더 (line 26)

```html
<!-- BEFORE -->
<h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Career</h2>

<!-- AFTER -->
<h2 class="font-mono text-xs text-gray-400 mb-6">01 — Career</h2>
```

#### Career 카드 (line 27~58) — 타임라인 스타일로 전환

```html
<!-- BEFORE -->
<div class="space-y-4">
  <div class="p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-bold text-gray-900">한국공학대학교</h3>
      <span class="text-sm text-gray-400">2026.03 ~ 현재</span>
    </div>
    ...
  </div>

<!-- AFTER -->
<div class="space-y-0 border-l border-gray-100 ml-1">
  <div class="pl-6 pb-8 relative">
    <div class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
    <div class="p-5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-all">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-bold text-gray-900">한국공학대학교</h3>
        <span class="font-mono text-xs text-gray-400 whitespace-nowrap ml-4">2026.03 ~</span>
      </div>
      <ul class="text-gray-600 text-sm space-y-1.5">...
    </div>
  </div>
  <!-- 나머지 career 항목도 동일 패턴 -->
</div>
```

#### Awards 섹션 헤더

```html
<!-- BEFORE -->
<h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Awards</h2>

<!-- AFTER -->
<h2 class="font-mono text-xs text-gray-400 mb-6">02 — Awards</h2>
```

#### Awards 카드 (line 64~81) — 색상 통일

```html
<!-- BEFORE: amber/blue 혼재 색상 -->
<div class="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl">
<div class="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl">

<!-- AFTER: 모두 동일 스타일 -->
<div class="p-4 bg-white border border-gray-100 rounded-xl">
  <p class="font-bold text-gray-900 text-sm">OPA Awards - 커뮤니티 히어로</p>
  <p class="font-mono text-xs text-gray-400 mt-1">2025</p>
</div>
```

#### Community 섹션 헤더 & 카드

```html
<!-- 헤더 -->
<!-- BEFORE -->
<h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Community</h2>
<!-- AFTER -->
<h2 class="font-mono text-xs text-gray-400 mb-6">03 — Community</h2>

<!-- 카드 -->
<!-- BEFORE -->
<a class="block p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all group">
  <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
<!-- AFTER -->
<a class="block p-5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all group">
  <h3 class="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
```

---

### 2.3 `src/pages/projects.astro`

#### 페이지 헤더 h1

```html
<!-- BEFORE -->
<h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
  <span class="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Open Source</span> Projects
</h1>

<!-- AFTER -->
<h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
  Open Source <span class="text-emerald-600">Projects</span>
</h1>
```

#### 섹션 헤더 (My Projects / Fork Projects)

```html
<!-- BEFORE -->
<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
  <span class="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">My Projects</span>
  <span class="ml-3 text-sm text-gray-400 font-normal">자체 프로젝트</span>
</h2>
<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
  <span class="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Fork Projects</span>

<!-- AFTER -->
<h2 class="font-mono text-xs text-gray-400 mb-6">01 — My Projects</h2>
<h2 class="font-mono text-xs text-gray-400 mb-6">02 — Fork Projects</h2>
```

#### 프로젝트 카드 (공통)

```html
<!-- BEFORE -->
<div class="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-lg transition-all group">
  <h2 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
  <div class="flex items-center text-sm text-blue-600 font-medium">자세히 보기

<!-- AFTER -->
<div class="p-6 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all group">
  <h2 class="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
  <div class="flex items-center font-mono text-xs text-emerald-600">자세히 보기
```

---

### 2.4 `src/pages/posts/index.astro`

#### 페이지 헤더 h1

```html
<!-- BEFORE -->
<h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
  <span class="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Posts</span>
</h1>

<!-- AFTER -->
<h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Posts</h1>
```

#### 포스트 카드

```html
<!-- BEFORE -->
<a class="block p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-md transition-all">
  <time class="text-sm text-gray-400">
    {post.data.pubDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
  </time>
  <h2 class="text-xl font-bold text-gray-900 mt-1 mb-2 group-hover:text-blue-600 transition-colors">
  <span class="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">#{tag}</span>

<!-- AFTER -->
<a class="block p-5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all">
  <time class="font-mono text-xs text-gray-400">
    {post.data.pubDate.toISOString().slice(0, 10)}
  </time>
  <h2 class="text-xl font-bold text-gray-900 mt-1 mb-2 group-hover:text-emerald-600 transition-colors">
  <span class="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-xs font-mono text-gray-500">{tag}</span>
```

태그 변경: `rounded-full` → `rounded`, `bg-gray-100` → `bg-gray-50 border border-gray-100` (더 기술적 느낌)

---

### 2.5 `src/components/Header.astro`

#### 활성 상태 스타일 변경

```html
<!-- BEFORE -->
currentPath.startsWith(item.href) && item.href !== '/'
  ? 'text-gray-900 bg-gray-100'
  : 'text-gray-500 hover:text-gray-900',

<!-- AFTER -->
currentPath.startsWith(item.href) && item.href !== '/'
  ? 'text-gray-900'
  : 'text-gray-500 hover:text-gray-900',
```

배경 pill 제거, 텍스트 색상만으로 활성 표시 (더 절제됨)

---

### 2.6 `src/components/Footer.astro`

#### 서명 스타일 추가

```html
<!-- BEFORE -->
<p class="text-sm text-gray-400">© {currentYear} dasomel</p>

<!-- AFTER -->
<div class="flex flex-col sm:flex-row items-start sm:items-center gap-1">
  <p class="font-mono text-xs text-gray-400">© {currentYear} dasomel</p>
  <span class="hidden sm:inline font-mono text-xs text-gray-200">·</span>
  <p class="font-mono text-xs text-gray-300">built with astro</p>
</div>
```

---

## 3. 영문 페이지 동기화

`src/pages/en/index.astro`와 `src/pages/en/about.astro`는 한국어 버전과 동일한 패턴으로 변경.
번역 텍스트만 영문 유지, 클래스 변경은 동일하게 적용.

---

## 4. 변경 순서 (구현 체크리스트)

- [ ] `src/pages/index.astro` — Hero + 섹션헤더 + 카드
- [ ] `src/pages/about.astro` — Hero + 타임라인 + Awards + Community
- [ ] `src/pages/projects.astro` — h1 + 섹션헤더 + 카드
- [ ] `src/pages/posts/index.astro` — h1 + 카드 + 날짜
- [ ] `src/components/Header.astro` — 활성 상태
- [ ] `src/components/Footer.astro` — 서명
- [ ] `src/pages/en/index.astro` — 동일 패턴
- [ ] `src/pages/en/about.astro` — 동일 패턴

---

## 5. 검증 기준

- `bg-gradient-to-r`, `bg-gradient-to-br` 클래스가 모든 대상 파일에서 제거됨 (`grep`으로 확인)
- `text-blue-600`, `text-purple-600`, `text-cyan-500`, `text-pink-500` 가 UI 클래스에서 제거됨
- `rounded-2xl` → `rounded-xl` 로 전환됨
- `font-mono text-xs text-gray-400` 섹션 헤더 패턴이 일관되게 적용됨
- 빌드 성공: `npm run build` 오류 없음
- 브라우저에서 `/`, `/about`, `/projects`, `/posts`, `/en/` 시각적 확인
