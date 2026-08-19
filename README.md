# dasomel.github.io

**Cloud & DevOps Engineer | Cloud Native / Kubernetes / Platform Engineering**

개인 기술 블로그 [cne.io.kr](https://cne.io.kr) 소스 저장소입니다.

Cloud Native, Kubernetes, Platform Engineering, AI-assisted development, Open Source 프로젝트와 기술 경험을 기록합니다.

## Current Projects

### [Narwhal](https://github.com/dasomel/narwhal)

오픈소스 Kubernetes Internal Developer Platform(IDP)입니다.

GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway, Management Portal을 하나의 재현 가능한 플랫폼으로 통합합니다.

- Kubernetes v1.35 기반
- 35개 GitOps 관리 애플리케이션
- 51-check CI regression suite
- 263건의 통합/장애 incident 기록과 regression test 연결
- Vagrant ARM64, Kakao Cloud AMD64, air-gapped 환경 지원

### [Narwhal IDP Portal](https://github.com/dasomel/narwhal-portal)

Narwhal 클러스터의 Day-2 운영을 위한 Next.js 기반 관리 포털입니다.

Dashboard, Onboarding, Catalog, Nodes, Cost, Security, Governance, Architecture, Templates 등의 기능을 제공합니다.

### [kube-ready-box](https://github.com/dasomel/kube-ready-box)

Kubernetes 개발 및 실습 환경을 재현하기 위한 Ubuntu 기반 Vagrant Box 프로젝트입니다.

### [Luna Chat Coder](https://github.com/Osteoporosis/luna-chat-coder)

ChatGPT와 repository-aware AI development를 위한 repository-local skill입니다.

Sandbox-first execution, exact Git state, capability inventory, bounded GitHub Actions fallback, recovery 및 evidence-based verification을 중심으로 AI-assisted development workflow를 정리합니다.

## AI-assisted Development

현재 개발 과정에서 **ChatGPT, Claude, Gemini, GitHub Copilot**을 함께 사용합니다.

하나의 모델에 개발 workflow를 종속시키기보다, 여러 AI를 활용하면서도 repository의 engineering rules, architecture, tests, operational knowledge를 일관되게 유지하는 것을 목표로 합니다.

이 블로그와 관련 프로젝트는 이러한 AI-assisted open source development 경험을 실제 프로젝트에 적용하며 발전시키고 있습니다.

관련 글:

- [ChatGPT로 안전하게 리포지토리를 개발하는 방법 — Luna Chat Coder 적용기](https://cne.io.kr/ko/posts/luna-chat-coder-adoption)
- [AI와 함께 오픈소스를 만드는 방법 — Narwhal을 개발하며](https://cne.io.kr/ko/posts/ai-assisted-open-source-development)

## Tech Stack

### Website

- [Next.js 15](https://nextjs.org/)
- [next-intl](https://next-intl-docs.vercel.app/) - 다국어 지원
- [TypeScript](https://www.typescriptlang.org/)
- Static export (`output: export`)
- [GitHub Pages](https://pages.github.com/)

### Content / Development

- Markdown / MDX 기반 콘텐츠
- GitHub Actions
- AI-assisted development workflow

## Repository Structure

```text
.
├── app/
│   └── [locale]/
│       ├── posts/
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
├── .agents/
│   └── skills/
│       └── luna-chat-coder/
├── AGENTS.md
└── CLAUDE.md
```

`AGENTS.md`는 repository-level entry point이며, `.agents/skills/luna-chat-coder/`는 AI-assisted repository development를 위한 공통 policy를 제공합니다.

프로젝트 고유의 개발 및 운영 규칙은 기존 `CLAUDE.md`와 repository tooling을 유지합니다.

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# lint
npm run lint

# production build
npm run build
```

## Deployment

GitHub Pages를 통해 자동 배포됩니다.

```text
main 브랜치
    ↓
GitHub Actions
    ↓
Next.js static export
    ↓
GitHub Pages
    ↓
cne.io.kr
```

배포 workflow와 기존 publication behavior는 repository 운영 규칙에 따라 관리합니다.

## Blog Topics

- Cloud Native
- Kubernetes
- Platform Engineering
- AI / AI-assisted Development
- DevOps
- GitOps
- Open Source
- Infrastructure Automation
- Data / AI Platform

## License

MIT License
