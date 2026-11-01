---
title: "📰 Daily Tech Digest - 2026-11-01"
description: "3 curated updates from the Cloud, Kubernetes, AI & DevOps world for 2026-11-01."
pubDate: 2026-11-01
tags: ["Daily Digest", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 Top Story

### The context problem: How Docusign built agents that understand the business behind contracts

Docusign detailed the architecture of Iris, its contract AI engine that powers the Intelligent Agreement Management (IAM) platform introduced in April 2024. Docusign CTO Sagnik Nandy explained that general LLMs treat amendments and revised pricing schedules as isolated PDF files, failing to grasp overarching contractual relationships without custom grouping logic. To address this, Iris structures context into four tiers: within-agreement, cross-agreement, organizational playbooks, and user preferences, combining extraction with semantic search. Answering queries such as renewals exceeding $1 million or multi-amendment payment obligations involves orchestrating five to six specialized tools across the contract lifecycle. Organizations maintain governance through Workflow Builder and Agent Studio, automating routine renewals below spending thresholds while routing high-value exceptions to human review. According to Docusign's 2026 Customer Awards, customer Experian reduced contract cycle times from approximately 10 days to hours by integrating Docusign with its CPQ system.

> 💡 **Why it matters**: When deploying enterprise AI agents, teams must integrate domain-specific approval workflows and human-in-the-loop thresholds alongside LLM reasoning to prevent automated compliance failures.

🔗 [Read more](https://thenewstack.io/docusign-contract-ai-agents/) · _The New Stack_

---

## DevOps & Infrastructure

### [Five years after the fork, OpenSearch is slowly stepping out of AWS’s shadow](https://thenewstack.io/opensearch-foundation-aws-elasticsearch/)

_The New Stack_

Five years after AWS forked Elasticsearch in January 2021, OpenSearch is actively working to establish vendor-neutral credibility under the Linux Foundation. Speaking at Open Source Summit Europe in Prague, OpenSearch Software Foundation executive director Bianca Lewis emphasized that donating the project in September 2024 permanently secured its open-source license. According to foundation data, AWS's share of project contribution activities dropped from 91% in year one to 72% in 2025-26, while Amazon-affiliated core maintainers decreased from 95% in April 2022 to 71% today. The 2026 Open Data Infrastructure Report revealed that self-managed cloud deployments jumped from 37% in 2024 to 60%, outpacing Amazon Managed OpenSearch Service growth from 44% to 48%. Nonetheless, 24% of 71 surveyed non-adopters still cite AWS ties as a barrier, and AWS maintains 4 of 15 Technical Steering Committee seats with AWS engineer Andrew Ross reelected as chair in October. On the technical front, the September release of OpenSearch 3.9 expanded vector and hybrid search capabilities to target enterprise AI retrieval-augmented generation workloads.

> 💡 The growing shift toward self-managed OpenSearch deployments underscores how platform teams prioritize avoiding cloud vendor lock-in for AI search infrastructure despite ongoing vendor influence in governance.

### [Developers ask AI which tool to use. Here’s how we track the answer.](https://thenewstack.io/tracking-ai-tool-recommendations/)

_The New Stack_

With Stack Overflow's 2026 developer survey reporting that nearly 70% of respondents use AI agents to find answers, Webflow analyzed how AI search engines recommend developer tools. Between September 25 and October 19, the team executed 100 benchmark queries across ChatGPT, Claude, Gemini, and Perplexity using the prompt "Which CMS platforms support MCP integration?" Webflow appeared in 49 of the 100 responses, revealing substantial platform variance ranging from 22 out of 25 on Perplexity down to 4 out of 25 on Claude. Crucially, a single third-party guide on llmcms.org was cited in 60 of the 100 responses, demonstrating that AI answer engines heavily reference aggregated external summaries. To improve agent discoverability, the authors advise DevOps teams to verify AI crawler user-agents like GPTBot against CDN and firewall rules and expose clean text via `/llms.txt` or `.md` endpoints. The guide also emphasizes engineering intent-based MCP tool descriptions, embedding JSON-LD metadata, and restricting agent operations using scoped OAuth permissions.

> 💡 Platform and documentation teams must optimize beyond traditional SEO by maintaining `/llms.txt` endpoints and semantic schemas so internal tools and public services are accurately discovered by developer AI agents.

---

_This digest was collected from RSS feeds and summarized by AI (Claude). See the original links for full details._
