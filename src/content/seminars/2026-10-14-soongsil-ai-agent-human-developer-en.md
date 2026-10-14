---
title: "AI Agents and the Role of the Human Developer"
event: "Soongsil University Software Special Topics 2"
date: 2026-10-14
slides: "https://cne.io.kr/slides/ai-agent-human-developer/#1"
tags: ["AI Agent", "Harness Engineering", "Evidence", "University"]
---

## Topic: What to Hand to an Agent and What Humans Keep, Seen Through My Own Incident Logs

The line on the cover, `PASS T03 all ArgoCD apps Synced+Healthy`, was a pass, yet there were actually zero ArgoCD apps. Following cases of this kind of silent failure, the talk looked at where a developer's work moves in the age of AI agents. The slides are in Korean.

## Learning goals

- Explain how an AI agent works (choosing and calling tools, context and harness, multi-agent setups).
- Describe an agent development environment (model, context, harness) at the level of its configuration.
- Recognize how agents fail silently, and verify a "done" report against evidence.
- Explain the division of roles between humans and AI (what to hand off and what to keep, responsibility versus prevention) and apply it to your own project.

## Outline

- **My AI journey**: how my way of using AI changed, from ChatGPT to Claude Code, Antigravity CLI, and Codex CLI
- **What an agent is**: how it differs from a chatbot, models, context and harness, the Ralph loop, hub-and-spoke multi-agent setups
- **How agents fail silently**: cases 1 to 4 and a feedback structure (incident, lesson, discriminating criterion, regression test)
- **Dividing roles between humans and AI**: an open-source contribution case, what to hand off and what to keep, responsibility and prevention

## Key messages

- The person who approves takes the responsibility, and a mechanism prevents the recurrence.
- Put a floor on the count in "all are fine" checks, treat a silent SKIP as a FAIL, and require execution evidence in every completion report.
- The cases were picked from my own records, so they are not generalized into a property of AI.

## Related

- [Soongsil Guest Lecture Recap: What Humans Should Hold in the Age of AI Agents](/en/posts/soongsil-ai-agent-human-developer-2026/)
- [View the slides](https://cne.io.kr/slides/ai-agent-human-developer/#1)
- [A CI Job Can Print FAIL and Still Report Success](/en/posts/echo-branch-false-green-detector/)
