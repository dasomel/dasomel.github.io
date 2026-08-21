# CNE Design System

## Purpose

CNE is an engineering workbench, not a generic SaaS landing page. The interface should communicate open-source engineering, evidence, architecture, and technical depth with a restrained editorial visual language.

## Brand principles

1. **Engineering first** — visuals support technical content instead of decorating it.
2. **Editorial hierarchy** — use strong typography and whitespace before adding boxes, gradients, or motion.
3. **Quiet surfaces** — cards and navigation use clear surface layers with thin borders; avoid floating white rectangles on dark backgrounds.
4. **One accent** — teal is the primary accent. Supporting colors should remain neutral unless a specific technical state requires otherwise.
5. **Evidence over ornament** — diagrams, code, architecture, repository activity, and project artifacts are preferred hero visuals.
6. **Motion with purpose** — use small transitions, scroll reveals, and one meaningful visual motion element rather than many competing animations.

## Color tokens

### Light

- `--bg`: `#f7f8f6` — page background
- `--bg-subtle`: `#f1f4f2` — navigation / secondary background
- `--surface`: `#ffffff` — cards and primary surfaces
- `--surface-hi`: `#edf1ef` — selected/secondary surface
- `--border`: `#d5ddda` — default borders
- `--border-soft`: low-emphasis border derived from the same family
- `--border-hi`: `#b9c7c2` — emphasized border
- `--text`: `#141917`
- `--text-muted`: `#59645f`
- `--text-faint`: `#7b8781`
- `--accent`: `#0f766e`

### Dark

- `--bg`: `#0b1110`
- `--bg-subtle`: `#101715`
- `--surface`: `#151d1a`
- `--surface-hi`: `#1d2824`
- `--border`: `#2c3934`
- `--border-soft`: low-emphasis border derived from the same family
- `--border-hi`: `#42514b`
- `--text`: `#edf4f0`
- `--text-muted`: `#aab7b1`
- `--text-faint`: `#77867f`
- `--accent`: `#4fd1c5`

## Surface hierarchy

Use these levels consistently:

`bg` → page/canvas

`bg-subtle` → shell/sidebar/navigation

`surface` → cards, panels, primary controls

`surface-hi` → selected item, badge fill, active navigation, secondary controls

Do not use fixed `bg-white`, `bg-gray-*`, or fixed light hex backgrounds inside shared components.

## Typography

- Sans: Pretendard Variable
- Mono: JetBrains Mono
- Hero eyebrow: small uppercase monospace
- Hero headline: large editorial sans, tight tracking
- Body: readable 16–18px with generous line height
- Metadata: muted monospace or compact sans

## Layout

- Desktop content width: approximately 1180–1440px depending on documentation depth.
- Prefer generous horizontal whitespace.
- Documentation uses three-column layout: navigation / content / on-page navigation.
- Sidebar width should stay visually light; avoid heavy vertical chrome.

## Components

### Header

- Persistent theme-aware surface.
- One language switch and one theme switch.
- Navigation uses `surface-hi` for active states.
- Avoid transparent header states that reduce contrast against hero artwork.

### Cards

- Use `surface` + `border`.
- Rounded corners are moderate, not excessive.
- Shadows are subtle and primarily used on hover.
- A card is for grouping meaningful information, not every small UI element.

### Code blocks

- Copy button belongs only to executable/code blocks (`pre > code`).
- Never add copy controls to ordinary cards, badges, tables, or text boxes.
- Use dual-theme syntax highlighting.
- Keep code background visually distinct from surrounding surfaces.

### OSS Documentation

- Hub uses project cards as the primary navigation objects.
- Project pages use a quiet documentation shell.
- `On this page` is a navigation aid, not a decorative card.
- Project identity comes from typography, metadata, diagrams, and architecture visuals rather than heavy branded chrome.

## Hero direction

The home hero may borrow the composition principles of modern editorial hero layouts, but should remain CNE-specific:

- short technical eyebrow
- strong two-line message
- concise supporting copy
- two or fewer CTAs
- one wide engineering visual
- visual fade into the next section

Preferred visuals include architecture diagrams, repository/project relationships, Kubernetes flows, GitOps pipelines, OSS maps, and engineering evidence.

## Motion

Use motion selectively:

- 150–250ms UI transitions
- reduced-motion support is mandatory
- one major animated/interactive visual per page is enough
- avoid constant floating, excessive parallax, and decorative cursor effects

## AI design handoff

When asking an AI design or coding system to modify CNE:

1. Read this document first.
2. Preserve the color, surface, typography, and spacing tokens.
3. Reuse existing components before creating new variants.
4. Do not introduce a new accent color without a documented reason.
5. Do not copy a third-party component implementation; use the design idea and implement it with CNE's own tokens/components.
6. Verify both Light and Dark themes before merging.
7. Keep copy controls restricted to code blocks.
