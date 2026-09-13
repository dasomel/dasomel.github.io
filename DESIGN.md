# DESIGN.md

English | [한국어](DESIGN-ko.md)

## Product archetype

`archetype: Platform Portal`

dasomel.github.io is the community portal and technical blog for the Dasomel open source ecosystem.

## Product personality

- **Density:** Balanced (comfortable reading typography with technical code blocks)
- **Visual weight:** Clean editorial layout with light/dark theme toggle
- **Accent:** Indigo (`#6366f1`) and brand purple highlights

## Token mapping

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
