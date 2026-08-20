# dasomel.github.io

**Cloud Native / Platform Engineering / Open Source Workbench**

[**cne.io.kr**](https://cne.io.kr)은 Kubernetes, Cloud Native, Platform Engineering, AI-assisted development, 그리고 오픈소스 프로젝트를 실제로 만들고 운영하면서 얻은 engineering knowledge를 기록하는 bilingual technical workbench입니다.

> **Build in public. Verify with evidence. Learn from failures.**

## What this repository is

This repository is more than a personal blog. It is the source of the public **OSS Engineering Workbench** behind `cne.io.kr`.

- **Projects** — OSS projects, experiments, forks, and platform components
- **Notes** — original engineering writing and development notes
- **Tech Digest** — automated bilingual technology digest, kept separate from original Notes
- **Talks** — seminars, presentations, and technical sessions
- **Docs / Events** — project documentation and selected engineering events
- **Knowledge Graph** — explicit relationships between Projects, Notes, and Tech Digest entries
- **Source Snapshot** — static GitHub project metadata refreshed by automation

The site is available in **Korean and English**. Localized content follows a shared slug model so `/ko/...` and `/en/...` remain aligned.

## Featured OSS

### [Narwhal](https://github.com/dasomel/narwhal)

Open-source Kubernetes **Internal Developer Platform (IDP)** integrating GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway, and a management portal.

- Kubernetes v1.35 based
- 35 GitOps-managed applications
- 51-check CI regression suite
- 263 recorded integration / incident lessons with regression-test linkage
- Vagrant ARM64, Kakao Cloud AMD64, and air-gapped scenarios

### [Narwhal Portal](https://github.com/dasomel/narwhal-portal)

Next.js-based Day-2 management portal for Narwhal clusters, covering Dashboard, Onboarding, Catalog, Nodes, Cost, Security, Governance, Architecture, Templates, and related platform operations.

### [Beluga](https://github.com/dasomel/beluga)

A reproducible local data-platform environment connecting CDC, Kafka, Flink, Iceberg, Trino, Superset, Airflow, object storage, catalog, SSO, and policy components through Kubernetes and GitOps.

### [KubeMetal](https://github.com/dasomel/kubemetal)

Apple Silicon-focused local MLOps platform that separates Kubernetes control-plane responsibilities from macOS host GPU/compute workloads.

### [kube-ready-box](https://github.com/dasomel/kube-ready-box)

Ubuntu-based Vagrant Box for reproducible Kubernetes development, labs, and platform bootstrap environments.

### [ldapium](https://github.com/dasomel/ldapium)

Containerized OpenLDAP distribution with build, UI, Helm, release, and supply-chain practices designed for reproducible deployment.

### [nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)

Kubernetes agent for connecting NFS filesystem project quotas with PersistentVolume lifecycle and storage limits.

## Other projects in the workbench

The Projects catalog includes both owned projects and selected forks / integrations, with bilingual project pages where applicable.

- [OpenForge](https://github.com/dasomel/openforge)
- [Beluga Manager](https://github.com/dasomel/beluga-manager)
- [eGovFrame Launcher](https://github.com/dasomel/egovframe-launcher)
- [TerraBoard](https://github.com/dasomel/terraboard)
- [Oh My Cursor](https://github.com/dasomel/oh-my-cursor)
- [K-PaaS](https://github.com/dasomel/k-paas)
- K-PaaS related forks / integrations
- [Harbor](https://github.com/goharbor/harbor) and related ecosystem work

The full catalog and project metadata are maintained in [`src/content/projects/`](src/content/projects/).

## Notes and Tech Digest

### Notes

Original engineering writing covers architecture decisions, OSS development, platform engineering, AI-assisted coding, operational lessons, and project retrospectives.

Recent examples include:

- [How I Build Open Source with AI — Lessons from Developing Narwhal](https://cne.io.kr/en/posts/ai-assisted-open-source-development)
- [AI-Era Open Source: Build the Bathhouse, Not the County Office](https://cne.io.kr/en/posts/ai-era-oss-bathhouse)
- [How to Safely Develop a Repository with ChatGPT — Luna Chat Coder](https://cne.io.kr/en/posts/luna-chat-coder-adoption)
- [Operating Six OSS Projects as One Engineering Portfolio](https://cne.io.kr/en/posts/oss-engineering-portfolio-standard)

Each published Notes entry is intended to have a matching English counterpart so the bilingual content model stays consistent.

### Tech Digest

Daily Tech Digest is generated separately from original Notes.

```text
RSS collection
    ↓
Korean + English digest generation
    ↓
AI enrichment / validation
    ↓
Draft PR
    ↓
Fallback publication when needed
    ↓
GitHub Pages deployment
```

The pipeline includes duplicate-publication guards, fallback handling, enrichment validation, and explicit separation between automated digest content and original Notes.

## AI-assisted development

The repository is developed with multiple AI tools, including:

- ChatGPT
- Claude
- Gemini
- GitHub Copilot

The goal is not to delegate engineering judgment to one model. The repository remains the source of truth, while AI is used for exploration, implementation, review, debugging, and documentation.

This workflow is documented in [Luna Chat Coder](https://github.com/Osteoporosis/luna-chat-coder) and applied to this repository through:

```text
AGENTS.md
    ↓
.agents/skills/luna-chat-coder/
    ↓
repository-local policy
    ↓
sandbox-first implementation
    ↓
exact Git state
    ↓
validation / evidence
```

Related Notes:

- [ChatGPT로 안전하게 리포지토리를 개발하는 방법 — Luna Chat Coder 적용기](https://cne.io.kr/ko/posts/luna-chat-coder-adoption)
- [AI와 함께 오픈소스를 만드는 방법 — Narwhal을 개발하며](https://cne.io.kr/ko/posts/ai-assisted-open-source-development)

## Engineering principles

The workbench follows a few recurring principles:

1. **Repository as source of truth** — Git state, tests, manifests, and generated evidence outrank conversational assumptions.
2. **Integration is a product feature** — the hard part of a platform is often the seam between components.
3. **Evidence-based completion** — a change is complete only when the intended validation actually passes.
4. **Failure becomes knowledge** — incidents and lessons should become durable repository knowledge and regression tests where practical.
5. **Static where possible** — GitHub Pages should remain a static site; runtime metadata and GitHub API dependencies are avoided in the build path.
6. **Bilingual parity** — Korean and English content should remain structurally aligned.

## Tech stack

### Website

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [next-intl](https://next-intl.dev/) — Korean / English routing
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- Static export (`output: export`)
- [GitHub Pages](https://pages.github.com/)

### Content and rendering

- Markdown / MDX source content
- `next-mdx-remote-client`
- GFM, Shiki, Mermaid, `rehype-pretty-code`
- RSS generation for Notes and Tech Digest

### Automation

- GitHub Actions
- project source metadata refresh
- daily digest collection / enrichment / health checks
- static build and deployment

## Repository structure

```text
.
├── app/
│   └── [locale]/
│       ├── posts/
│       ├── notes/
│       ├── tech-digest/
│       ├── projects/
│       ├── docs/
│       ├── seminars/
│       └── events/
├── src/
│   └── content/
│       ├── posts/
│       ├── projects/
│       ├── docs/
│       ├── seminars/
│       └── events/
├── scripts/
│   ├── generate-daily-digest.mjs
│   ├── publish-enrichment.mjs
│   ├── check-enrichment.mjs
│   ├── enrich-apply.mjs
│   └── refresh-project-metadata.mjs
├── .github/
│   └── workflows/
├── .agents/
│   └── skills/
│       └── luna-chat-coder/
├── AGENTS.md
└── CLAUDE.md
```

`lib/content.ts` provides the shared content model and locale-aware lookup. Notes explicitly exclude `daily-digest-*` entries from the original Notes lane, while the Tech Digest route handles them separately.

## Development

```bash
# install dependencies
npm install

# development server
npm run dev

# lint
npm run lint

# production build
npm run build
```

Useful automation commands:

```bash
# refresh static OSS source metadata
npm run projects:refresh

# collect digest feeds
npm run digest:collect

# generate bilingual daily digest
npm run digest

# validate enrichment coverage
npm run digest:check
```

## Deployment

```text
main
  ↓
GitHub Actions
  ↓
npm run lint
  ↓
npm run build
  ↓
Next.js static export
  ↓
GitHub Pages
  ↓
https://cne.io.kr
```

The build is designed to remain static and reproducible. GitHub API metadata is refreshed by automation and stored as static repository data rather than queried at page-build time.

## Site

- Website: [https://cne.io.kr](https://cne.io.kr)
- GitHub: [https://github.com/dasomel](https://github.com/dasomel)

## License

MIT License
