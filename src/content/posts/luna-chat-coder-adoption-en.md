---
title: "💬 Safe Repository Development with ChatGPT — Adopting Luna Chat Coder"
description: "How I applied Luna Chat Coder to a real technical blog repository to make repository work safer, reproducible, and easier to continue across ChatGPT sessions."
pubDate: 2026-08-19
tags: ["Luna Chat Coder", "ChatGPT", "AI Agent", "GitHub", "Developer Experience", "Cloud Native"]
featured: false
draft: false
---

## Introduction

As AI coding tools become better, an interesting problem becomes more important: **how do we safely let an AI work on a real repository?**

A request such as:

> “Look at this repository, modify it, test it, and publish the result to GitHub.”

sounds simple, but a reliable implementation needs more than a conversation. We need an exact source state, a known execution environment, project-specific rules, and a durable record of what happened.

That is why I created [Luna Chat Coder](https://github.com/Osteoporosis/luna-chat-coder) and applied it to this blog repository, [dasomel.github.io](https://github.com/dasomel/dasomel.github.io).

This note is not a product manual. It records why I built the workflow and how I applied it to a real repository.

---

## 1. What is Luna Chat Coder?

Luna Chat Coder is a **repository-local agent skill** for repository development from a normal ChatGPT conversation.

The core workflow is:

```text
Chat
  ↓
Sandbox-first development
  ↓
Verify exact GitHub state
  ↓
Use GitHub Actions only when needed
  ↓
Publish verified results through the simplest path
```

The goal is not to build another huge development platform. It is to turn recurring failure patterns in conversational coding into explicit repository policy.

The principles are:

- **Discover early, activate late** — discover the skill first; use Actions only when necessary.
- **Exact state first** — identify the exact commit, PR, and branch before editing.
- **Sandbox first** — perform normal edits, tests, and builds in a disposable environment.
- **Capability inventory** — inspect the current environment before adding tools or dependencies.
- **GitHub as the durable source of truth** — prefer actual Git state over conversation memory.
- **Exact publication** — use the simplest reliable publishing path for the change.
- **Evidence-based completion** — report only validations that actually ran.

Luna does not replace a project's build system or engineering conventions. It acts more like a continuity and fallback layer around them.

---

## 2. Why apply it to an existing repository?

This blog is not just a Markdown directory.

It is a Next.js site deployed to GitHub Pages at `cne.io.kr`, with localized routes, Markdown content, project pages, documentation, seminars, events, and several GitHub Actions workflows.

The main thing I wanted to avoid was allowing a new AI workflow to overwrite the repository's existing conventions.

The resulting separation is:

```text
CLAUDE.md
  └─ Project-specific operating knowledge

AGENTS.md
  └─ Short entry point for agents

.agents/skills/luna-chat-coder/SKILL.md
  └─ Shared conversational-development policy

Existing project tooling / workflows
  └─ Actual build, test, and deployment rules
```

Luna adds a way to work with the repository; it does not replace the rules that already make the repository build and deploy correctly.

---

## 3. The structure is deliberately small

The repository-local structure is:

```text
AGENTS.md

.agents/
└── skills/
    └── luna-chat-coder/
        ├── SKILL.md
        └── references/
            ├── actions-missions.md
            ├── recovery.md
            └── design-rationale.md
```

The top-level entry point remains small so that an agent can discover the workflow without loading every policy document into context immediately.

The detailed policy lives in `SKILL.md`.

That separation makes the repository easier to maintain and reduces the chance that project-specific build instructions get mixed with general agent behavior.

---

## 4. The most important rule: Sandbox First

This is the principle I care about most.

The fact that an AI agent *can* manipulate GitHub Actions does not mean every task should run remotely.

Most development tasks fit a simpler path:

```text
Checkout repository
       ↓
Inspect in sandbox
       ↓
Edit
       ↓
Build / Test / Lint
       ↓
Inspect exact diff
       ↓
Publish to GitHub
```

GitHub Actions should be a **fallback execution boundary**, not the default development environment.

This keeps normal work faster and simpler and avoids turning every small edit into a remote CI orchestration problem.

---

## 5. When should Actions be used?

I think about Actions in three broad cases.

### Supply

The sandbox can modify the repository but cannot access a required external input, dependency, native library, or generated resource.

### Exact transport

A large or mode-sensitive change is safer to publish through a Git-aware transport path rather than many independent file writes.

### Degraded remote execution

The normal sandbox path is unavailable or cannot provide the resources required to finish and validate the work.

The important point is not “never use Actions.” It is:

> **Be able to explain why Actions are necessary for this task.**

---

## 6. Exact GitHub state comes first

One of the most dangerous situations in conversational development is using conversation history as a substitute for the current source tree.

For example:

```text
Conversation describes a file
        ↓
Sandbox is reset
        ↓
GitHub already contains another commit
        ↓
AI reconstructs the file from memory
        ↓
Unintended changes
```

Luna therefore treats the recovery order roughly as:

```text
commit / PR head
    > immutable Git or Actions artifact
    > live sandbox working tree
    > conversation reconstruction
```

If the exact source bytes exist in Git, that source is authoritative.

---

## 7. Applying the workflow to this repository

When I introduced Luna here, the repository already had project-specific operating rules and several publication workflows.

The goal was to add continuity without changing that foundation.

The repository keeps the build, lint, content, and deployment constraints where they belong, while Luna describes **how an agent should safely discover and follow those constraints**.

This distinction is important because an AI assistant may be good at producing code while still being wrong about repository state or the publication path.

---

## 8. A useful mental model

The result is a simple model:

```text
Repository rules
       ↓
Agent workflow
       ↓
Sandbox execution
       ↓
Evidence
       ↓
GitHub state
       ↓
CI / deployment
```

The AI accelerates exploration and implementation, but the repository, tests, CI, and deployment state provide the durable evidence.

That is the part I want Luna Chat Coder to preserve.

---

## Conclusion

The goal of a repository-local AI workflow is not to make the AI more powerful than the repository.

It is to make the AI **more faithful to the repository**.

As AI coding becomes faster, continuity, exact source state, validation, and recovery become more important.

Luna Chat Coder is my attempt to make those rules explicit so that a new ChatGPT session can continue real engineering work without treating the previous conversation as the source of truth.
