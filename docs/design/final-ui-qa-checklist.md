# Final UI QA Checklist

This checklist closes the current visual redesign cycle after the Projects, Project Detail, and Content Collection passes.

## Information hierarchy

- Page heroes establish identity before utility controls.
- Section labels, headings, titles, metadata, and body copy have distinct visual roles.
- Related content is separated from primary case-study or editorial content.
- Project cards and post cards expose one clear primary destination.

## Surface system

- `bg` is reserved for the page canvas.
- `surface` is used for primary cards and panels.
- `surface-hi` is reserved for selected or secondary states.
- `border` and `border-soft` communicate normal versus low-emphasis boundaries.
- Teal remains the brand accent; amber remains semantic signal only.

## Accessibility

- Interactive links and controls expose visible `:focus-visible` treatment.
- Mobile navigation exposes `aria-expanded` and `aria-controls`.
- Hover-only motion is not required to understand or operate a component.
- `prefers-reduced-motion: reduce` removes non-essential movement from redesigned surfaces.
- Mobile text remains readable without forced single-line truncation where it harms comprehension.

## Responsive behavior

- Desktop and mobile preserve the same information hierarchy.
- Featured grids collapse without losing primary/secondary distinction.
- Long titles wrap naturally rather than causing horizontal overflow.
- Metadata may wrap while keeping title and primary action prominent.

## Theme behavior

- Light and Dark modes use the shared CNE tokens.
- No new page-specific hard-coded dark or white surfaces are introduced by the redesign.
- Borders remain visible without depending on hover or shadow.

## Scope boundary

Future work should be feature-driven rather than continuing visual micro-tuning. New visual changes should update the design-system guidance only when they establish a reusable rule.
