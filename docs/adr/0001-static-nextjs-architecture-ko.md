# ADR-0001: Next.js 정적 빌드 및 GitHub Pages 배포

- 상태: 채택됨 (Accepted)
- 날짜: 2026-08-28

## 배경 (Context)
커뮤니티 블로그 및 문서 사이트는 서버 유지보수 부담이 없고 높은 Lighthouse 성능과 SEO 최적화가 필요합니다.

## 결정 (Decision)
Next.js `output: 'export'` 정적 산출물 빌드를 채택하고 GitHub Actions를 통해 GitHub Pages에 배포합니다.

## 결과 (Consequences)
- 서버 공격 표면 없이 빠른 CDN 정적 제공 가능
- 모든 동적 라우트는 빌드 타임에 사전 렌더링(prerender)됨
