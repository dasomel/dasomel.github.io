# dasomel.github.io

Cloud & DevOps Engineer 개인 블로그

## Tech Stack

- [Astro](https://astro.build/) - Static Site Generator
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## Project Structure

```
src/
├── components/     # Astro 컴포넌트
├── content/        # 콘텐츠 (Markdown)
│   ├── docs/       # K-PaaS 문서 (한국어)
│   ├── docs-en/    # K-PaaS 문서 (영어)
│   ├── posts/      # 블로그 포스트 (한국어)
│   ├── posts-en/   # 블로그 포스트 (영어)
│   ├── projects/   # 프로젝트 (한국어)
│   ├── projects-en/# 프로젝트 (영어)
│   ├── seminars/   # 세미나 (한국어)
│   └── seminars-en/# 세미나 (영어)
├── layouts/        # 레이아웃
├── pages/          # 페이지 라우팅
└── styles/         # 글로벌 스타일
```

## Features

- 다국어 지원 (한국어/영어)
- 반응형 디자인
- SEO 최적화
- RSS 피드
- 사이트맵 자동 생성

## Deployment

GitHub Pages를 통해 자동 배포됩니다.

```
main 브랜치 push → GitHub Actions → GitHub Pages
```

## License

MIT License
