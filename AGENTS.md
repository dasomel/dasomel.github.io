# Repository instructions: dasomel.github.io

When working on this repository from ChatGPT or another repository-aware chat surface, read `.agents/skills/luna-chat-coder/SKILL.md` before development work.

Luna is a continuity/fallback layer. It does not replace the project's existing engineering rules or the existing `CLAUDE.md` workflow. Keep those rules intact unless the task explicitly changes them.

## Project invariants

- Next.js 15 + next-intl static site.
- `output: export` and GitHub Pages deployment for `cne.io.kr`.
- Build: `npm run build`.
- Lint: `npm run lint` (`eslint .`); the expected baseline is 0 errors and 3 known warnings. Do not suppress the known warnings or silently accept new warnings.
- CI deployment is gated by build; do not add a lint gate without an explicit project decision.
- Content routes are under `app/[locale]/{posts,projects,docs,seminars,events}/[slug]`.
- Preserve frontmatter and MD/MDX conventions used by existing posts.
- Do not regenerate `package-lock.json` or change dependencies merely to make a task easier; follow the repository's existing lockfile and runtime requirements.
- Do not change GitHub Actions publication behavior casually. In particular, preserve the explicit deployment dispatch behavior required for bot-created commits and the double-publication guards documented in `CLAUDE.md`.
- Before claiming publication success, verify the repository's actual build/deploy evidence rather than inferring success from a green intermediate step.

## Content work

For article creation, translation, or enrichment, inspect representative existing posts first and preserve the site's current tone, metadata, links, and structure. When an English daily digest exists without an equivalent Korean post, treat the Korean post as a missing publication artifact and repair it without changing the English source unless necessary.

## Luna behavior

Prefer the sandbox work container for inspection, editing, build, lint, and validation. Use GitHub Actions only for a real capability/transport/execution gap. Resolve repository state to an exact commit before substantial edits, preserve unrelated work, and report only checks that actually ran.
