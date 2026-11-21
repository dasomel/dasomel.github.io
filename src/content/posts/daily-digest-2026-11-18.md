---
title: "📰 데일리 테크 다이제스트 - 2026-11-18"
description: "2026-11-18 Cloud, Kubernetes, AI, DevOps 소식 41건 — 자동 큐레이션 다이제스트."
pubDate: 2026-11-18
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### How to Build Durable Agentic Systems with Google Antigravity: From Instructions to Loops

I watched the discussion on agentic loops grow louder over the past few months. But for me, the reality is simpler: prompt engineering has shifted from individual tasks to systems design, and the harness around the model (not the model itself) is now my primary constraint in software engineering.

🔗 [원문 보기](https://cloud.google.com/blog/topics/developers-practitioners/how-to-build-durable-agentic-systems-with-google-antigravity-from-instructions-to-loops/) · _Google Cloud_

---

## Kubernetes & Cloud Native

### [Java4Shell (CVE-2026-114938): Pre-auth RCE in OpenJDK, and the challenge of image and feature bloat](https://webflow.sysdig.com/blog/java4shell-cve-2026-114938-pre-auth-rce-in-openjdk)

_Sysdig_

On 11/17/26, Oracle and OpenJDK shipped fixes for Java4Shell (CVE-2026-114938), a heap memory corruption bug in the AVX-512 accelerated Base64 decoder.

### [Is your OpenTelemetry pipeline becoming a performance bottleneck?](https://www.cncf.io/blog/2026/11/17/is-your-opentelemetry-pipeline-becoming-a-performance-bottleneck/)

_CNCF_

At Cloud Native Days Austria 2026, I presented a talk called How to Defeat OTel’s Silent Killer: The Performance Overhead, exploring a problem that is easy to overlook when building observability pipelines: the cost of collecting.

### [High-quality cost-effective AI image generation on Amazon ECS](https://aws.amazon.com/blogs/containers/high-quality-cost-effective-ai-image-generation-on-amazon-ecs/)

_AWS Containers_

Learn how to run Z-Image-Turbo, a 6-billion-parameter diffusion transformer, on AWS Inferentia2 and Amazon ECS to generate high-quality images at a fraction of a cent each, with auto-scaling, arbitrary resolution support, and a complete CI/CD pipeline.

### [How Salesforce efficiently right-sizes Kubernetes workloads at scale on Amazon EKS](https://aws.amazon.com/blogs/containers/how-salesforce-efficiently-right-sizes-kubernetes-workloads-at-scale-on-amazon-eks/)

_AWS Containers_

Salesforce operates one of the largest multi-tenant Kubernetes platforms on Amazon EKS, spanning 1,400+ clusters.

### [Scheduling the removal of the kube-proxy IPVS backend](https://kubernetes.io/blog/2026/11/16/ipvs-removal/)

_Kubernetes_

The ipvs backend for kube-proxy was an experiment in providing a service proxy implementation with better performance than the iptables backend.

### [Give sandboxed agents live web access with the Firecrawl kit for Docker Sandboxes](https://www.docker.com/blog/docker-sandboxes-firecrawl-web-access/)

_Docker_

Give AI coding agents live web access with the Firecrawl kit for Docker Sandboxes. Learn to search, scrape, and crawl websites with network controls.

---

## AI & ML

### [Introducing GPT-6.2 Astra and Sol](https://openai.com/index/introducing-gpt-6-2-astra-sol)

_OpenAI_

Introducing GPT‑6.2 Astra and Sol, with better professional outputs, coding, computer use, and efficiency at lower cost across ChatGPT Work, Codex, and the API.

### [Put Gemini to work for you](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)

_Google AI_

Tasks in Gemini is now free of charge in six countries, with new features starting in the U.S.

### [Introducing ChatGPT for Sales](https://openai.com/index/introducing-chatgpt-for-sales)

_OpenAI_

Explore the new Sales plugin and 30+ new and expanded partner plugins in ChatGPT to research prospects, prepare pitches, update your CRM, and move deals forward.

### [Strengthening NATO and allied cyber defenses with AI](https://openai.com/index/strengthening-nato-allied-cyber-defences-ai)

_OpenAI_

How OpenAI is working with NATO and allied cyber agencies to help trusted defenders find vulnerabilities, test fixes and protect essential systems.

### [New Ask Maps features to help with holiday travel and prep](https://blog.google/products-and-platforms/products/maps/ask-maps-holiday-travel-features-2026/)

_Google AI_

Plan holiday road trips, get route tips, find local appointments, and search your saved lists with new Ask Maps features.

---

## 클라우드 업데이트

### [Quad9’s withdrawal from France: A canary in the coal mine](https://blog.cloudflare.com/quad9-withdrawal-from-france/)

_Cloudflare_

Quad9's forced withdrawal from France highlights the dangers of mandating DNS-level blocking. We explore why forcing public resolvers to act as content filters is technically flawed and threatens the open Internet.

### [Simplifying multicloud networking to Azure with partner Cross-Cloud Interconnect](https://cloud.google.com/blog/products/networking/cross-cloud-interconnect-for-microsoft-azure/)

_Google Cloud_

As AI changes how businesses build and run applications, more enterprises are spreading their models, data and applications across multiple clouds. To make that work, they need fast, private connections between those environments.

### [Google Cloud is a Leader in the 2026 Gartner Magic Quadrant for AI Application Development Platforms](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-is-a-leader-in-the-2026-gartner-magic-quadrant/)

_Google Cloud_

For the third time in a row, Google Cloud is recognized as a Leader in the 2026 Gartner Magic Quadrant for AI Application Development Platforms, positioned highest overall on the Ability to Execute axis.

### [How Rakbank built centralized observability at scale with Amazon OpenSearch Service](https://aws.amazon.com/blogs/architecture/how-rakbank-built-centralized-observability-at-scale-with-amazon-opensearch-service/)

_AWS Architecture_

Rakbank re-platformed logging for its retail digital banking workloads on a cross-account, Multi-AZ Amazon OpenSearch Service design that ingests ~150 GB/day through Fluent Bit, using hot/UltraWarm/cold tiering and Amazon S3 archival for 7-year compliance retention and ~55% cost savings over an all-hot cluster.

### [How to write a standout Red Hat Summit proposal](https://www.redhat.com/en/blog/how-write-standout-red-hat-summit-proposal)

_Red Hat_

Every year, the Red Hat Summit review committee evaluates roughly 1,500 proposals to build a catalog of around 350 sessions.You may be wondering: What distinguishes a successful abstract from one that falls flat?

### [Azure Red Hat OpenShift with hosted control planes is now generally available](https://www.redhat.com/en/blog/azure-red-hat-openshift-hosted-control-planes-now-generally-available)

_Red Hat_

Microsoft Azure Red Hat OpenShift with hosted control planes is now generally available to help teams reduce infrastructure costs, simplify Day 2 operations, and provision clusters with more flexibility.

### [Announcing updates to the AWS Well-Architected Framework](https://aws.amazon.com/blogs/architecture/announcing-updates-to-the-aws-well-architected-framework-3/)

_AWS Architecture_

Updates to the AWS Well-Architected Framework reorganize it into Well-Architected Cloud Foundations and Well-Architected Cloud Workloads, add new best practices, and bring the general availability of the AWS Well-Architected Agent for analyzing workloads and guiding remediation.

### [Unlocking mission-critical innovation: Microsoft Azure Red Hat OpenShift IL5 is Now Available on JWCC](https://www.redhat.com/en/blog/unlocking-mission-critical-innovation-microsoft-azure-red-hat-openshift-il5-now-available-jwcc)

_Red Hat_

As previously announced, Microsoft Azure Red Hat OpenShift on Microsoft Azure Government (MAG) has officially achieved Impact Level 5 (IL5) certification.

---

## DevOps & 인프라

### [Reducing database incident MTTR by 73% with a custom AWS DevOps Agent Skill](https://aws.amazon.com/blogs/devops/reducing-database-incident-mttr-by-73-with-a-custom-aws-devops-agent-skill/)

_AWS DevOps_

Database incidents routinely take 45 to 60 minutes to triage.

### [Your AI coding agent could cost 5x more depending on the harness, benchmark finds](https://thenewstack.io/coding-agent-harness-costs/)

_The New Stack_

The same AI model can cost up to five times more to run depending on the coding agent harness it’s

### [Enforcing zero-trust dependency policies in AWS CodeBuild with JFrog Curation](https://aws.amazon.com/blogs/devops/enforcing-zero-trust-dependency-policies-in-aws-codebuild-with-jfrog-curation/)

_AWS DevOps_

Integrate JFrog Curation into an AWS CodeBuild pipeline to block vulnerable and malicious open source packages at download time. A package that violates policy returns an HTTP 403 (Access Denied) error that fails the build, so a risky dependency never becomes a container image or reaches Amazon ECR.

### [OpenAI’s own tests show GPT-6.2 Astra is twice as likely to hide coding failures](https://thenewstack.io/astra-hides-coding-failures/)

_The New Stack_

OpenAI’s new GPT-6.2 Astra is nearly twice as likely as its predecessor to leave users unaware of problems that prevented

### [Microsoft’s new coding model promises near-Opus performance at 5% of the cost](https://thenewstack.io/microsoft-mai-code-2/)

_The New Stack_

At its Ignite conference in San Francisco on Tuesday, Microsoft announced a number of new AI models, including two new

### [Maintainers don’t need more AI bug reports. They need fixes.](https://github.blog/open-source/maintainers/maintainers-dont-need-more-ai-bug-reports-they-need-fixes/)

_GitHub_

In the Codename MDASH pilot, GitHub and Microsoft turned thousands of raw AI findings into 99 checked, private reports with suggested fixes for six widely used open source projects. Maintainers have already fixed more than half.

### [Secure MCP integrations for AWS DevOps Agent with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/devops/secure-mcp-integrations-for-aws-devops-agent-with-amazon-bedrock-agentcore/)

_AWS DevOps_

As you connect more Model Context Protocol (MCP) tools to AWS DevOps Agent, each one adds its own authentication, credential rotation, and audit overhead.

### [Building the Agent Host Protocol for sessions that continue across devices](https://github.blog/engineering/engineering-principles/building-the-agent-host-protocol-for-sessions-that-continue-across-devices/)

_GitHub_

Discover how we built the open Agent Host Protocol to keep your agent sessions accessible across editors, apps, phones, and the cloud.

### [Find the log line that matters faster with full-text search in Grafana Cloud Logs](https://grafana.com/blog/find-the-log-line-that-matters-faster-with-full-text-search-in-grafana-cloud-logs/)

_Grafana_

A support ticket comes in with one clue: a transaction ID. The answer is somewhere in your logs, but you don't know which service logged it, which pod handled it, or which day it happened.

### [지표 뒤에 숨은 맥락을 한눈에: New20 Timeline Hub 만들기](https://toss.tech/article/new20-timeline-hub)

_토스_

흩어진 정책, 배포, 실험 기록을 하나의 시간축으로 연결해 분석가의 질문에 답하는 허브를 만든 경험을 공유합니다.

### [From exposed secrets to managed credentials: Reducing credential risk across the application lifecycle](https://www.hashicorp.com/blog/from-exposed-secrets-to-managed-credentials)

_HashiCorp_

A recent software supply chain attack affecting tens of thousands of GitHub repositories highlights a security problem that is easy to underestimate: a credential does not stop being exposed simply because it has been deleted from the latest version of the code.

### [판단에만 집중하세요: 토스 타겟팅 모델 개발 자동화](https://toss.tech/article/targeting-model-automation)

_토스_

피쳐 개수 자동 결정부터 모델 비교, 평가 보고서 자동 생성, 메트릭 확인까지

### [같은 모델, 다른 예측](https://toss.tech/article/training-serving-skew)

_토스_

Training–Serving Skew를 줄인 과정을 소개합니다.

### [How we scaled metrics aggregation by moving durable state into storage](https://www.datadoghq.com/blog/engineering/how-we-scaled-metrics-aggregation/)

_Datadog_

Learn how Datadog evolved metrics aggregation from fixed partition ownership to transferable state and, ultimately, storage-side reconciliation.

### [Send query-ready logs to Azure Data Explorer with Datadog Observability Pipelines](https://www.datadoghq.com/blog/adx-observability-pipelines/)

_Datadog_

Use Datadog Observability Pipelines to process, filter, and route logs to Azure Data Explorer, control ingestion costs, and simplify log migrations.

### [Datadog named a Leader in the 2026 Gartner® Magic Quadrant™ for Observability Pipelines](https://www.datadoghq.com/blog/datadog-observability-pipelines-gartner-magic-quadrant-2026/)

_Datadog_

Datadog has been recognized as a Leader in the 2026 Gartner® Magic Quadrant™ for Observability Pipelines.

### [What CISA’s new cyber strategy means for how you ship software](https://about.gitlab.com/blog/cisa-2030-cyber-strategy/)

_GitLab_

On October 26, 2026, the Cybersecurity and Infrastructure Security Agency released CISA 2030: Defend, Harden, Prevail, three pillars of a four-year strategy for securing the nation’s critical infrastructure.

### [HCP introduces IBMid support and new enterprise governance capabilities](https://www.hashicorp.com/blog/hcp-introduces-ibmid-support-and-new-enterprise-governance-capabilities)

_HashiCorp_

Over the past quarter, the HashiCorp Cloud Platform (HCP) team has continued investing in the foundations that help organizations securely adopt and operate HashiCorp products at scale.

### [if(kakao)26 현장 스케치](https://tech.kakao.com/posts/849)

_카카오_

지난 10월 13일과 14일, 카카오 AI 캠퍼스에서 if(kakao)26이 열렸습니다. ‘모든 연결에 지능을’이라는 주제 아래, 카카오가 만들어가는 AI 기술과 서비스를 소개하고 개발과 운영 과정에서 쌓은 경험을 나눴습니다.

---

## ⚡ 빠른 소식

- [Engineering AI Discover](https://netflixtechblog.com/engineering-ai-discover-e244944cdc38?source=rss----2615bd06b42e---4) — _Netflix_
- [Hugging Face and OpenRouter join forces to make open-weight models easy to run](https://huggingface.co/blog/openrouter) — _Hugging Face_

---

_이 다이제스트는 RSS 피드에서 자동 수집되었습니다. 발췌문은 각 피드 원문에서 그대로 가져온 것으로, 자세한 내용은 원문 링크를 확인하세요._
