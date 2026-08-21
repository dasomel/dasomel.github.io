# Documentation Readability Research

## Basis

CNE documentation containers are evaluated against WCAG 2.2 contrast guidance and established documentation-theme patterns. WCAG uses 4.5:1 for normal text, 3:1 for large text, and 3:1 for relevant non-text component boundaries.

Docusaurus also separates light/dark palettes and uses dedicated theme-aware treatments for code and admonition content rather than relying on the surrounding page palette.

## CNE decision

The documentation renderer uses explicit CNE tokens for:

- page canvas
- normal surfaces
- code/lifecycle surfaces
- explanatory panels
- table headers
- component boundaries
- foreground text

This avoids inheriting a generic prose palette that can silently reduce contrast. Plain lifecycle blocks without syntax highlighting are rendered as solid high-contrast text.
