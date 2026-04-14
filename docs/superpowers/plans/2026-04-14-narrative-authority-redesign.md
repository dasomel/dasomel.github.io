# Narrative Authority 사이트 재설계 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** dasomel.github.io를 평면적 블로그에서 "내러티브 + 권위" 결합 전문가 포트폴리오로 전환

**Architecture:** 기존 Next.js 15 App Router + Tailwind CSS 기반 유지. 공통 컴포넌트 3개(ImpactStats, TagFilter, FeaturedCard) 추출 → 페이지별 재구성. About 데이터는 `lib/data/about.ts`로 분리. 프론트매터에 `featured`, `problem`, `solution` 필드 추가.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, next-intl, next-mdx-remote, reading-time, lucide-react

**Spec:** `docs/superpowers/specs/2026-04-14-narrative-authority-redesign.md`

**테스트 전략:** 테스트 프레임워크 없음. 각 태스크 후 `npm run build`로 SSG 빌드 검증 + `npm run dev`로 시각 확인.

---

## Task 1: 타입 확장 + About 데이터 파일

**Files:**
- Modify: `lib/types.ts`
- Create: `lib/data/about.ts`

- [ ] **Step 1: Post, Project, Seminar 타입에 featured 필드 추가**

`lib/types.ts`:
```typescript
// Post에 추가
featured?: boolean;

// Project에 추가
featured?: boolean;
problem?: string;
solution?: string;

// Seminar에 추가
featured?: boolean;
```

- [ ] **Step 2: lib/data/about.ts 생성**

```typescript
export interface ExpertActivity {
  category: 'advisory' | 'review' | 'mentoring';
  title: string;
  org: string;
  year: number;
}

export interface Award {
  title: string;
  org: string;
  year: number;
  highlight?: boolean;
}

export interface ResearchReport {
  title: string;
  client: string;
  year: number;
  url?: string;
}

export interface NarrativeIntro {
  ko: string;
  en: string;
}

export const narrativeIntro: NarrativeIntro = {
  ko: '2013년 eGovFrame 커뮤니티에서 시작해, 클라우드 네이티브 인프라를 만들고 운영해왔습니다. K-PaaS의 핵심 컨트리뷰터로 참여하며, OPA와 OPDC 커뮤니티를 이끌고, 현재는 한국공학대학교에서 후배 엔지니어를 가르치고 있습니다.',
  en: 'Starting from the eGovFrame community in 2013, I have been building and operating cloud-native infrastructure. As a core contributor to K-PaaS, I lead the OPA and OPDC communities, and currently teach the next generation of engineers at Tech University of Korea.',
};

// TODO: 사용자가 실제 데이터로 교체해야 함
export const expertActivities: ExpertActivity[] = [
  { category: 'advisory', title: '클라우드 기술 자문위원', org: 'NIPA', year: 2023 },
  // ... 사용자가 나머지 ~10건 입력
];

export const awards: Award[] = [
  { title: '장관상', org: '과학기술정보통신부', year: 2024, highlight: true },
  // ... 사용자가 나머지 ~10건 입력
];

export const researchReports: ResearchReport[] = [
  { title: 'K-PaaS 기술 동향 보고서', client: 'NIA', year: 2024 },
  // ... 사용자가 나머지 3~4편 입력
];
```

- [ ] **Step 3: lib/content.ts에서 featured 필드 파싱 추가**

`lib/content.ts`의 각 get 함수에서 `gray-matter` 파싱 시 `featured` 필드 포함되도록 확인. 기존 코드가 `data` 객체를 스프레드하므로 추가 코드 불필요할 수 있음 — 빌드로 확인.

Project의 경우 `problem`, `solution` 필드도 동일하게 확인.

- [ ] **Step 4: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 5: 커밋**

```bash
git add lib/types.ts lib/data/about.ts lib/content.ts
git commit -m "feat: 타입 확장(featured/problem/solution) + About 데이터 파일 생성"
```

---

## Task 2: 공통 컴포넌트 3개 생성

**Files:**
- Create: `components/ui/impact-stats.tsx`
- Create: `components/ui/tag-filter.tsx`
- Create: `components/ui/featured-card.tsx`

- [ ] **Step 1: ImpactStats 컴포넌트 생성**

`components/ui/impact-stats.tsx`:
```tsx
interface StatItem {
  value: string;
  label: string;
}

interface ImpactStatsProps {
  stats: StatItem[];
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  return (
    <div
      className="grid gap-0"
      style={{
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="text-center py-5 px-3"
          style={{
            borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            {stat.value}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: TagFilter 컴포넌트 생성**

`components/ui/tag-filter.tsx`:
```tsx
'use client';

interface TagFilterProps {
  tags: string[];
  selected: string;
  onChange: (tag: string) => void;
  allLabel?: string;
}

export function TagFilter({ tags, selected, onChange, allLabel = 'All' }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChange('all')}
        className="px-3 py-1 rounded-full text-xs font-medium transition-all"
        style={{
          backgroundColor: selected === 'all' ? 'var(--accent)' : 'transparent',
          color: selected === 'all' ? '#fff' : 'var(--text-muted)',
          border: selected === 'all' ? 'none' : '1px solid var(--border)',
        }}
      >
        {allLabel}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className="px-3 py-1 rounded-full text-xs font-medium transition-all"
          style={{
            backgroundColor: selected === tag ? 'var(--accent)' : 'transparent',
            color: selected === tag ? '#fff' : 'var(--text-muted)',
            border: selected === tag ? 'none' : '1px solid var(--border)',
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: FeaturedCard 컴포넌트 생성**

`components/ui/featured-card.tsx`:
```tsx
import { ReactNode } from 'react';

interface FeaturedCardProps {
  badge?: string;
  children: ReactNode;
}

export function FeaturedCard({ badge, children }: FeaturedCardProps) {
  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{
        border: '1px solid var(--accent)',
        background: 'linear-gradient(135deg, var(--bg-subtle), var(--bg))',
      }}
    >
      {badge && (
        <span
          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          {badge}
        </span>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 4: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 5: 커밋**

```bash
git add components/ui/impact-stats.tsx components/ui/tag-filter.tsx components/ui/featured-card.tsx
git commit -m "feat: 공통 컴포넌트 생성 — ImpactStats, TagFilter, FeaturedCard"
```

---

## Task 3: i18n 메시지 + 네비게이션 변경

**Files:**
- Modify: `messages/ko.json`
- Modify: `messages/en.json`
- Modify: `components/layout/Header.tsx`

- [ ] **Step 1: messages/ko.json에 키 추가 및 변경**

네비게이션 키 변경:
```json
"nav": {
  "work": "Work",
  "speaking": "Speaking",
  "docs": "Docs",
  "blog": "Blog",
  "about": "About",
  "lang": "EN"
}
```

새 키 추가:
```json
"home": {
  "hero": {
    "tagline": "Cloud & DevOps Engineer · Adjunct Professor",
    "headline_1": "11년간",
    "headline_accent": "클라우드 인프라",
    "headline_2": "를\n만들고, 가르치고, 나눕니다",
    "description": "K-PaaS 핵심 컨트리뷰터 · OPA/OPDC 커뮤니티 리더 · 한국공학대학교 겸임교수",
    "cta_work": "프로젝트 보기",
    "cta_speaking": "발표 이력"
  },
  "sections": {
    "featured_work": "Featured Work",
    "speaking": "Speaking Highlights",
    "latest_posts": "Latest Posts",
    "view_all": "전체 보기"
  },
  "stats": {
    "talks": "컨퍼런스 발표",
    "experience": "클라우드 경력",
    "projects": "OSS 프로젝트"
  }
},
"work": {
  "title": "Work",
  "subtitle": "오픈소스 프로젝트와 인프라 도구",
  "problem": "문제",
  "solution": "해결"
},
"speaking": {
  "title": "Speaking",
  "subtitle_prefix": "년간",
  "subtitle_suffix": "컨퍼런스 발표 기록",
  "highlights": "Highlights",
  "timeline": "Timeline",
  "total": "총 발표",
  "conferences": "컨퍼런스",
  "years_active": "활동 기간"
},
"blog": {
  "title": "Blog",
  "subtitle": "클라우드 네이티브 인프라에 대한 글",
  "featured": "추천",
  "all_posts": "All Posts",
  "min_read": "min"
}
```

- [ ] **Step 2: messages/en.json에 동일한 키 추가 (영어 값)**

네비게이션:
```json
"nav": {
  "work": "Work",
  "speaking": "Speaking",
  "docs": "Docs",
  "blog": "Blog",
  "about": "About",
  "lang": "KO"
}
```

새 키:
```json
"home": {
  "hero": {
    "tagline": "Cloud & DevOps Engineer · Adjunct Professor",
    "headline_1": "Building",
    "headline_accent": "Cloud Infrastructure",
    "headline_2": "\nfor 11 years and counting",
    "description": "K-PaaS core contributor · OPA/OPDC community leader · Adjunct Professor at TUK",
    "cta_work": "View projects",
    "cta_speaking": "Speaking history"
  },
  "sections": {
    "featured_work": "Featured Work",
    "speaking": "Speaking Highlights",
    "latest_posts": "Latest Posts",
    "view_all": "View all"
  },
  "stats": {
    "talks": "Conference Talks",
    "experience": "Cloud Experience",
    "projects": "OSS Projects"
  }
},
"work": {
  "title": "Work",
  "subtitle": "Open source projects and infrastructure tools",
  "problem": "Problem",
  "solution": "Solution"
},
"speaking": {
  "title": "Speaking",
  "subtitle_prefix": " years,",
  "subtitle_suffix": " conference talks",
  "highlights": "Highlights",
  "timeline": "Timeline",
  "total": "Total Talks",
  "conferences": "Conferences",
  "years_active": "Years Active"
},
"blog": {
  "title": "Blog",
  "subtitle": "Writing about cloud-native infrastructure",
  "featured": "Featured",
  "all_posts": "All Posts",
  "min_read": "min"
}
```

- [ ] **Step 3: Header.tsx 네비게이션 항목 변경**

`components/layout/Header.tsx`의 `navItems` 배열 수정:
```tsx
const navItems = [
  { href: `${base}/projects`, label: t('work') },
  { href: `${base}/seminars`, label: t('speaking') },
  { href: `${base}/docs/about`, label: t('docs') },
  { href: `${base}/posts`, label: t('blog') },
  { href: `${base}/about`, label: t('about') },
];
```

주의: URL 경로는 기존 유지 (`/projects`, `/seminars`, `/posts`). 라벨만 변경.

- [ ] **Step 4: 기존 사용하지 않는 i18n 키 정리**

`nav.projects`, `nav.seminars`, `nav.posts` 키를 제거하고 `nav.work`, `nav.speaking`, `nav.blog`로 교체. 홈페이지에서 사용하던 `home.hero.cta_projects`, `home.sections.projects`, `home.sections.recent` 키도 새 키로 교체.

- [ ] **Step 5: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 6: 커밋**

```bash
git add messages/ko.json messages/en.json components/layout/Header.tsx
git commit -m "feat: i18n 메시지 추가 + 네비게이션 라벨 변경 (Work/Speaking/Blog)"
```

---

## Task 4: 콘텐츠 프론트매터 업데이트

**Files:**
- Modify: `src/content/projects/*.md` (featured, problem, solution 추가)
- Modify: `src/content/seminars/*.md` (featured 추가)
- Modify: `src/content/posts/*.md` (featured 추가)

- [ ] **Step 1: 주요 프로젝트에 featured + problem/solution 추가**

`src/content/projects/harbor.md` 프론트매터:
```yaml
featured: true
problem: "Harbor가 ARM 아키텍처를 공식 지원하지 않아 ARM 기반 Kubernetes 클러스터에서 사용 불가"
solution: "멀티 아키텍처 빌드 파이프라인을 구성하여 ARM 호환 이미지 생성"
```

`src/content/projects/kube-ready-box.md` 프론트매터:
```yaml
featured: true
problem: "Kubernetes 개발/테스트 환경 구축에 반복적인 수작업 필요"
solution: "원커맨드로 로컬 K8s 클러스터 + 필수 도구 자동 세팅"
```

영어 버전 (`-en.md`)에도 동일한 필드를 영어로 추가.

- [ ] **Step 2: 주요 세미나에 featured 추가**

가장 최근의 대표 발표 2개에 `featured: true` 추가. 세미나 파일을 확인하여 OpenInfra Days Korea, Korea Community Day 등 주요 컨퍼런스 발표를 선택.

- [ ] **Step 3: 추천 포스트에 featured 추가**

대표 포스트 1개에 `featured: true` 추가.

- [ ] **Step 4: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 5: 커밋**

```bash
git add src/content/
git commit -m "feat: 콘텐츠 프론트매터 업데이트 — featured, problem, solution 필드 추가"
```

---

## Task 5: 홈페이지 재설계

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: 홈페이지 전면 재작성**

`app/[locale]/page.tsx`를 재작성. 섹션 순서:

1. **Hero** — 개인화된 헤드라인 + 역할 2개 병기 + 새 CTA
2. **Impact Bar** — `ImpactStats` 컴포넌트 사용. 값은 `getSeminars().length`, `getProjects().length`, 경력 연수(`new Date().getFullYear() - 2013`)에서 동적 계산
3. **Featured Work** — `getProjects(lang).filter(p => p.featured)` 로 2개 추출. 각 카드에 `problem → solution` 표시
4. **Speaking Highlights** — `getSeminars(lang).filter(s => s.featured)` 로 2개 추출. 컨퍼런스 `event` 필드 + 연도 표시
5. **Latest Posts** — `featured` 포스트 1개 상단 핀 + 나머지 3개. `reading-time` 패키지로 읽기 시간 표시

임포트:
```tsx
import { ImpactStats } from '@/components/ui/impact-stats';
import { FeaturedCard } from '@/components/ui/featured-card';
import { getPosts, getProjects, getSeminars } from '@/lib/content';
import readingTime from 'reading-time';
```

주의: `reading-time`은 이미 `package.json`에 있음. MDX content를 가져와서 `readingTime(content).text`로 계산.

포스트 읽기 시간 계산은 `getPostBySlug`으로 각 포스트의 `content`를 가져와야 하므로, 성능을 위해 목록에서는 `readingTime`의 `words` 추정값 사용 또는 빌드 타임에 계산.

간소화 접근: 홈에서는 최근 포스트 4개만이므로 `getPostBySlug`을 4번 호출해도 빌드 타임이므로 OK.

- [ ] **Step 2: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 3: dev 서버로 시각 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/ko/` 확인:
- Hero 텍스트가 개인화되었는지
- Impact Bar 숫자가 표시되는지
- Featured Work 카드에 문제/해결이 보이는지
- Speaking Highlights가 표시되는지
- Latest Posts에 읽기 시간이 보이는지

- [ ] **Step 4: 커밋**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: 홈페이지 재설계 — Hero 개인화, Impact Bar, Featured Work, Speaking Highlights"
```

---

## Task 6: About 페이지 재설계

**Files:**
- Modify: `app/[locale]/about/page.tsx`

- [ ] **Step 1: About 페이지 전면 재작성**

`app/[locale]/about/page.tsx`를 재작성. 섹션 순서:

1. **프로필 헤더** — 역할 3개 표시 (Cloud Engineer · Professor · Community Leader)
2. **내러티브 인트로** — `narrativeIntro`에서 텍스트 로드. 왼쪽 에메랄드 보더 `border-l-2 border-emerald-500 pl-4`
3. **역할 카드 3개** — 엔지니어(2013~), 교수(2024~), 커뮤니티 리더(2018~). 각각 `border-l-3 border-emerald-500`
4. **전문가 활동** — `expertActivities` 배열에서 렌더. 카테고리 필터 탭 (클라이언트 컴포넌트 필요 → 별도 `components/about/ExpertActivities.tsx` 분리)
5. **수상 이력** — `awards` 배열. `highlight` 항목은 에메랄드 텍스트 + 볼드
6. **연구보고서** — `researchReports` 배열. URL이 있으면 링크
7. **컨퍼런스 월** — `getSeminars(lang)`에서 `event` 필드 중복 제거 후 배지 나열
8. **오픈소스 기여** — 기존 데이터 유지, "문제→해결" 형식으로 변경

About 페이지가 300줄 초과 예상이므로, 클라이언트 인터랙션이 필요한 전문가 활동 섹션은 별도 컴포넌트로 분리.

- [ ] **Step 2: components/about/ExpertActivities.tsx 생성**

카테고리 필터 탭이 있는 클라이언트 컴포넌트:

```tsx
'use client';

import { useState } from 'react';
import type { ExpertActivity } from '@/lib/data/about';

interface Props {
  activities: ExpertActivity[];
  labels: { advisory: string; review: string; mentoring: string };
}

export function ExpertActivities({ activities, labels }: Props) {
  const [category, setCategory] = useState<string>('all');
  const filtered = category === 'all'
    ? activities
    : activities.filter(a => a.category === category);

  // 카테고리 탭 + 연도 역순 리스트 렌더
  // ...
}
```

- [ ] **Step 3: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 4: dev 서버로 시각 확인**

`http://localhost:3000/ko/about` 확인:
- 내러티브 인트로가 보이는지
- 역할 카드 3개가 에메랄드 보더로 표시되는지
- 전문가 활동 카테고리 필터가 동작하는지
- 수상, 연구보고서, 컨퍼런스 월, OSS가 모두 렌더되는지

- [ ] **Step 5: 커밋**

```bash
git add app/[locale]/about/page.tsx components/about/ExpertActivities.tsx
git commit -m "feat: About 재설계 — 내러티브 인트로, 역할 카드, 전문가 활동, 수상, 연구보고서"
```

---

## Task 7: Speaking 페이지 재설계

**Files:**
- Modify: `app/[locale]/seminars/page.tsx`

- [ ] **Step 1: Speaking 페이지 전면 재작성**

`app/[locale]/seminars/page.tsx`를 재작성. 섹션 순서:

1. **페이지 헤더** — "Speaking" + 서브텍스트 (동적: `{years}년간 {count}+ 컨퍼런스 발표 기록`)
2. **Summary Stats** — `ImpactStats` 컴포넌트 사용. 3컬럼: 총 발표 / 컨퍼런스 수 / 활동 기간
3. **Highlights** — `featured` 세미나를 `FeaturedCard`로 렌더. 컨퍼런스 `event` 약어 배지 + 이름 + 제목 + 연도 + 한 줄 설명(콘텐츠 첫 줄 또는 description)
4. **Timeline** — 연도별 그룹핑 유지하되 UI 변경:
   - 왼쪽: 연도 라벨 + 세로 연결선 (`w-0.5 bg-gray-200`)
   - 오른쪽: 컨퍼런스 `event` 약어 배지(20x20 `bg-gray-100 rounded text-[8px]`) + 발표 제목 + `event · Mon` 날짜

컨퍼런스 수 계산: `new Set(seminars.map(s => s.event)).size`

활동 기간 계산: `new Date().getFullYear() - 2013`

- [ ] **Step 2: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 3: dev 서버로 시각 확인**

`http://localhost:3000/ko/seminars` 확인:
- Summary Stats가 정확한 숫자를 표시하는지
- Highlights 섹션이 featured 세미나를 보여주는지
- 타임라인 UI가 세로선 + 배지로 렌더되는지

- [ ] **Step 4: 커밋**

```bash
git add app/[locale]/seminars/page.tsx
git commit -m "feat: Speaking 재설계 — Summary Stats, Highlights, 타임라인 UI"
```

---

## Task 8: Work 페이지 재설계

**Files:**
- Modify: `app/[locale]/projects/page.tsx`

- [ ] **Step 1: Work 페이지 전면 재작성**

`app/[locale]/projects/page.tsx`를 재작성. 섹션 순서:

1. **페이지 헤더** — "Work" + 서브텍스트
2. **TagFilter** — `tags` 프론트매터에서 전체 태그 추출 + `Fork` 카테고리. `TagFilter` 컴포넌트 사용
3. **케이스 스터디 카드** — `featured` 프로젝트. "문제 | 해결" 2컬럼 레이아웃 + 타입 뱃지(Fork/Project) + 태그 + GitHub 링크
4. **컴팩트 카드** — 나머지 프로젝트. 1줄: 프로젝트명 + 설명 + 외부 링크

Projects/Forks 섹션 분리 제거. `type` 필드는 뱃지로만 표시.

필터링은 클라이언트 사이드이므로 페이지를 래퍼 클라이언트 컴포넌트로 감싸거나, 프로젝트 리스트 부분만 클라이언트 컴포넌트로 분리.

접근법: `app/[locale]/projects/page.tsx`는 서버 컴포넌트로 데이터 로드 → `components/projects/ProjectList.tsx` 클라이언트 컴포넌트로 필터링+렌더 위임.

- [ ] **Step 2: components/projects/ProjectList.tsx 생성**

```tsx
'use client';

import { useState } from 'react';
import { TagFilter } from '@/components/ui/tag-filter';
import type { Project } from '@/lib/types';

interface Props {
  projects: Project[];
  translations: { problem: string; solution: string; /* ... */ };
  base: string;
}

export function ProjectList({ projects, translations, base }: Props) {
  const [selected, setSelected] = useState('all');

  const allTags = [...new Set(projects.flatMap(p => p.tags))];
  const filtered = selected === 'all'
    ? projects
    : selected === 'fork'
      ? projects.filter(p => p.type === 'fork')
      : projects.filter(p => p.tags.includes(selected));

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <>
      <TagFilter
        tags={[...allTags, 'Fork']}
        selected={selected}
        onChange={setSelected}
      />
      {/* Featured: 케이스 스터디 카드 */}
      {/* Rest: 컴팩트 카드 */}
    </>
  );
}
```

- [ ] **Step 3: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 4: dev 서버로 시각 확인**

`http://localhost:3000/ko/projects` 확인:
- 태그 필터 클릭 시 프로젝트가 필터링되는지
- featured 프로젝트에 문제/해결이 보이는지
- 타입 뱃지(Fork/Project)가 표시되는지

- [ ] **Step 5: 커밋**

```bash
git add app/[locale]/projects/page.tsx components/projects/ProjectList.tsx
git commit -m "feat: Work 재설계 — 태그 필터, 케이스 스터디 카드, 컴팩트 카드"
```

---

## Task 9: Blog 페이지 재설계

**Files:**
- Modify: `app/[locale]/posts/page.tsx`

- [ ] **Step 1: Blog 페이지 전면 재작성**

`app/[locale]/posts/page.tsx`를 재작성. 섹션 순서:

1. **페이지 헤더** — "Blog" + 서브텍스트
2. **TagFilter** — 포스트 태그에서 추출
3. **추천글 상단 고정** — `featured` 포스트를 `FeaturedCard`로 렌더. 추천 뱃지 + 읽기 시간 + 제목 + description + 태그
4. **포스트 리스트** — 연도 그룹 제거. 각 포스트: 제목 + description 미리보기 + 태그 + 읽기 시간 + "Jan 2025" 형식 날짜

읽기 시간 계산: 서버 컴포넌트에서 `getPostBySlug`으로 content를 가져와 `readingTime(content).minutes`를 계산 후 클라이언트 컴포넌트에 전달. 또는 간소화: `readingTime(content).text` (예: "3 min read").

포스트 수가 적으므로 (현재 2개) 모든 포스트의 content를 로드해도 빌드 타임 성능 문제 없음.

필터링 클라이언트 컴포넌트: `components/posts/PostList.tsx` 분리.

- [ ] **Step 2: components/posts/PostList.tsx 생성**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TagFilter } from '@/components/ui/tag-filter';
import { FeaturedCard } from '@/components/ui/featured-card';

interface PostItem {
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  pubDate: string;
  featured?: boolean;
  readingTime: string;
}

interface Props {
  posts: PostItem[];
  base: string;
  translations: { featured: string; all_posts: string; min_read: string };
}

export function PostList({ posts, base, translations }: Props) {
  const [selected, setSelected] = useState('all');

  const allTags = [...new Set(posts.flatMap(p => p.tags))];
  const filtered = selected === 'all'
    ? posts
    : posts.filter(p => p.tags.includes(selected));

  const featuredPost = filtered.find(p => p.featured);
  const regularPosts = filtered.filter(p => !p.featured);

  // 날짜 형식: "Jan 2025"
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      <TagFilter tags={allTags} selected={selected} onChange={setSelected} />
      {/* Featured post */}
      {/* Regular posts list */}
    </>
  );
}
```

- [ ] **Step 3: 빌드 검증**

```bash
npm run build
```

- [ ] **Step 4: dev 서버로 시각 확인**

`http://localhost:3000/ko/posts` 확인:
- 추천글이 에메랄드 카드로 상단에 표시되는지
- 태그 필터가 동작하는지
- 읽기 시간이 "3 min" 형태로 보이는지
- 날짜가 "Jan 2025" 형태인지

- [ ] **Step 5: 커밋**

```bash
git add app/[locale]/posts/page.tsx components/posts/PostList.tsx
git commit -m "feat: Blog 재설계 — 태그 필터, 추천글 핀, 읽기 시간, description 미리보기"
```

---

## Task 10: 최종 빌드 검증 + 정리

**Files:**
- 전체 프로젝트

- [ ] **Step 1: 전체 빌드**

```bash
npm run build
```

모든 페이지가 성공적으로 SSG 빌드되는지 확인.

- [ ] **Step 2: 린트**

```bash
npm run lint
```

- [ ] **Step 3: dev 서버 전체 페이지 순회**

```bash
npm run dev
```

확인 체크리스트:
- [ ] `/ko/` — Hero, Impact Bar, Featured Work, Speaking, Latest Posts
- [ ] `/en/` — 영어 번역 확인
- [ ] `/ko/about` — 내러티브, 역할 카드, 전문가 활동, 수상, 연구보고서, 컨퍼런스 월, OSS
- [ ] `/ko/seminars` — Stats, Highlights, Timeline
- [ ] `/ko/projects` — 태그 필터, 케이스 스터디, 컴팩트 카드
- [ ] `/ko/posts` — 태그 필터, 추천글, 읽기 시간
- [ ] `/ko/docs/about` — 변경 없음, 기존 동작 확인
- [ ] 모바일 반응형 (브라우저 DevTools)
- [ ] 언어 전환 (ko ↔ en)

- [ ] **Step 4: 사용하지 않는 i18n 키 정리**

기존 `home.hero.cta_projects` 등 더 이상 사용하지 않는 키를 `messages/ko.json`, `messages/en.json`에서 제거.

- [ ] **Step 5: 커밋**

```bash
git add .
git commit -m "chore: 최종 빌드 검증 + 미사용 i18n 키 정리"
```

---

## 태스크 의존성

```
Task 1 (타입+데이터) ──┐
                       ├── Task 5 (홈)
Task 2 (공통 컴포넌트) ──┤
                       ├── Task 6 (About)
Task 3 (i18n+네비) ────┤
                       ├── Task 7 (Speaking)
Task 4 (프론트매터) ────┤
                       ├── Task 8 (Work)
                       │
                       └── Task 9 (Blog)
                              │
                              └── Task 10 (최종 검증)
```

Task 1~4는 순서대로 실행. Task 5~9는 병렬 실행 가능 (서로 독립적). Task 10은 마지막.

---

## 사용자 액션 필요 항목

구현 후 사용자가 직접 입력해야 하는 데이터:

1. `lib/data/about.ts` — 전문가 활동 ~10건, 수상 ~10건, 연구보고서 3~4편의 실제 데이터
2. `lib/data/about.ts` — 내러티브 인트로 텍스트 검토/수정
3. `src/content/projects/*.md` — `problem`, `solution` 필드의 실제 내용 검토
4. `src/content/seminars/*.md` — `featured: true` 대상 세미나 최종 선택
5. `src/content/posts/*.md` — `featured: true` 대상 포스트 최종 선택
