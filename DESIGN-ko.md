# DESIGN-ko.md

[English](DESIGN.md) | 한국어

## 제품 아키타입 (Product archetype)

`archetype: Platform Portal`

dasomel.github.io는 Dasomel 오픈소스 생태계의 커뮤니티 포털 및 기술 블로그입니다.

## 제품 성격 (Personality)

- **밀도 (Density):** 균형 (Balanced — 편안한 기술 문서 가독성 및 코드 블록)
- **시각적 비중:** 라이트/다크 테마 토글이 가능한 깔끔한 에디토리얼 레이아웃
- **강조 색상:** 인디고 (`#6366f1`) 및 브랜드 퍼플

## 시맨틱 토큰 매핑 (Token mapping)

```yaml
tokens:
  bgCanvas: var(--of-color-bg-canvas, #ffffff)
  bgSurface: var(--of-color-bg-surface, #f8fafc)
  bgSurfaceRaised: var(--of-color-bg-surface-raised, #f1f5f9)
  textPrimary: var(--of-color-text-primary, #0f172a)
  textSecondary: var(--of-color-text-secondary, #475569)
  textMuted: var(--of-color-text-muted, #94a3b8)
  borderDefault: var(--of-color-border-default, #e2e8f0)
  accentPrimary: var(--of-color-accent-primary, #6366f1)
  danger: var(--of-color-status-danger, #ef4444)
  success: var(--of-color-status-success, #22c55e)
```
