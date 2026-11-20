---
title: "📰 Daily Tech Digest - 2026-11-20"
description: "60 curated updates from the Cloud, Kubernetes, AI & DevOps world for 2026-11-20."
pubDate: 2026-11-20
tags: ["Daily Digest", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 Top Story

### Does your AI agent need an LLM to decide what to do next?

Say “good morning” to an AI agent, and it might search its long-term memory before saying hello back. Somewhere in

🔗 [Read more](https://thenewstack.io/aws-decider-models-agents/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [Karpenter v1.15: GPU-aware provisioning, smarter node repair, and more](https://aws.amazon.com/blogs/containers/karpenter-v1-15-gpu-aware-provisioning-smarter-node-repair-and-more/)

_AWS Containers_

Karpenter v1.

### [Your guide to containers at AWS re:Invent 2026](https://aws.amazon.com/blogs/containers/your-guide-to-containers-at-aws-reinvent-2026/)

_AWS Containers_

AWS re:Invent 2026 returns to Las Vegas, November 30 to December 4.

### [Use Amazon ECR global authentication token across AWS Regions](https://aws.amazon.com/blogs/containers/use-amazon-ecr-global-authentication-token-across-aws-regions/)

_AWS Containers_

Amazon ECR now supports global authentication tokens: request one token from AWS Sign-In and use it to push and pull images across AWS Regions in the same partition, with a lifetime from 5 minutes to 12 hours. This post shows how to request a global token and use it with Docker in two Regions.

### [Docker patches Java4Shell and the NGINX HTTP/2 with Docker Hardened Images](https://www.docker.com/blog/docker-patches-java4shell-and-the-nginx-http-2-with-docker-hardened-images/)

_Docker_

Docker publishes fixed images for both Java4Shell and the NGINX HTTP/2 in the Docker Hardened Images (DHI) catalog.

### [Meet the New Docker: Built to Run on Trust](https://www.docker.com/blog/meet-the-new-docker-built-to-run-on-trust/)

_Docker_

Docker launches a new brand built on trust. Learn why Docker is evolving for AI agents, what stays the same, and how to run agents securely with Docker.

### [Runtime security for Amazon EKS Auto Mode with Sysdig](https://webflow.sysdig.com/blog/runtime-security-for-amazon-eks-auto-mode)

_Sysdig_

Sysdig integrates with Amazon EKS Auto Mode hands node management to AWS, giving you immutable, Bottlerocket-based nodes with read-only root filesystems and no kernel module loading. But the shared responsibility model still applies: what happens inside your workloads at runtime is on you.

### [The Trust Layer: Securing Agentic AI with Docker AI Governance](https://www.docker.com/blog/agentic-ai-security-docker-governance/)

_Docker_

Learn how Docker AI Governance secures agentic AI with sandbox policies, MCP tool governance, and audit visibility to support controlled AI agent workflows.

### [Optimizing Kubernetes admission control: Where Kyverno’s CEL admission cost actually goes](https://www.cncf.io/blog/2026/11/18/optimizing-kubernetes-admission-control-where-kyvernos-cel-admission-cost-actually-goes/)

_CNCF_

Kyverno’s CEL (Common Expression Language)-based engines exist to evaluate policy expressions. So when we profiled the admission path, we expected to find the bulk of the cost in CEL evaluation.

### [Announcing the Sysdig MCP Server for Monitoring](https://webflow.sysdig.com/blog/announcing-the-sysdig-mcp-server-for-monitoring)

_Sysdig_

The new Sysdig Monitor MCP server connects the AI assistant your team already uses to live container, Kubernetes, and cloud monitoring data.

### [Is your OpenTelemetry pipeline becoming a performance bottleneck?](https://www.cncf.io/blog/2026/11/17/is-your-opentelemetry-pipeline-becoming-a-performance-bottleneck/)

_CNCF_

At Cloud Native Days Austria 2026, I presented a talk called How to Defeat OTel’s Silent Killer: The Performance Overhead, exploring a problem that is easy to overlook when building observability pipelines: the cost of collecting.

---

## AI & ML

### [A game you cannot win unless you have a quantum computer](https://research.google/blog/a-game-you-cannot-win-unless-you-have-a-quantum-computer/)

_Google Research_

Quantum

### [Introducing Tool Retrieval in the Gemini API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-tool-retrieval/)

_Google AI_

Give your agents access to hundreds of tools while using fewer tokens with Tool Retrieval, now in preview in the Gemini API.

### [Walter Isaacson on curiosity and creativity in the AI age.](https://blog.google/innovation-and-ai/technology/ai/dialogues-walter-isaacson/)

_Google AI_

Walter Isaacson joins Google to discuss how history’s greatest innovators inspire creativity and human judgment in the AI age. Watch the episode.

### [How OpenAI’s Performance Factory keeps ChatGPT fast](https://openai.com/index/how-openai-performance-factory-keeps-chatgpt-fast)

_OpenAI_

Learn how OpenAI built the Performance Factory, a system of Codex-powered workflows that finds and fixes performance issues to help keep ChatGPT fast.

### [Deploying Daybreak Red](https://openai.com/business/learn/deploying-daybreak-red)

_OpenAI_

Explore a reference architecture for supervised security investigations with Daybreak Red, including safety controls, setup, and monitoring.

### [See PR scans in action](https://openai.com/business/learn/pr-scans-demo)

_OpenAI_

Watch a walkthrough of PR scans and see how the presenter reviews scan results in a pull request workflow.

### [The Gemini app is now available on lower-memory Android devices.](https://blog.google/innovation-and-ai/products/gemini-app/gemini-lower-memory-devices/)

_Google AI_

The Google Gemini app now supports lower-memory Android devices. Access Gemini Live and custom image creation on your phone.

---

## Cloud Updates

### [AI coding agents on Amazon EC2 Mac: How Cognition scales Devin for macOS](https://aws.amazon.com/blogs/architecture/ai-coding-agents-on-amazon-ec2-mac-how-cognition-scales-devin-for-macos/)

_AWS Architecture_

Cognition gave its AI software engineer, Devin, a cloud Mac. Each Devin session gets a fresh macOS VM on Amazon EC2 Mac bare metal hosts, so Devin can build, run, and test iOS and macOS apps.

### [How Country Road Group built a pattern-driven integration solution on AWS](https://aws.amazon.com/blogs/architecture/how-country-road-group-built-a-pattern-driven-integration-solution-on-aws/)

_AWS Architecture_

Country Road Group replaced Microsoft BizTalk with a pattern-driven, serverless integration platform on AWS. Learn how its Strategic Integration Platform works across four processing lanes, and get the open-source Enterprise Integration Patterns CDK library to apply the same approach to your own middleware.

### [The Blueprint: How Kult built a gaming companion that actually knows your game](https://cloud.google.com/blog/products/gaming/kult-built-a-gaming-companion-with-gemini-that-actually-knows-your-game/)

_Google Cloud_

Welcome to The Blueprint, our ongoing series where we highlight how Google Cloud customers are tackling unique and common challenges across industries using the latest AI and cloud technologies. We hope to inspire others looking to innovate in their work.

### [Introducing object enrichments: Transform unstructured data into agent-ready context](https://cloud.google.com/blog/products/storage-data-transfer/cost-effective-ai-context-extraction-from-unstructured-gcs-data/)

_Google Cloud_

The vast majority of enterprise information is unstructured, locked away in object storage as petabytes of images, PDFs, videos, and audio files. This data holds the institutional knowledge AI agents need to do business-critical work.

### [Helping our partners market smarter, together, with Gemini](https://cloud.google.com/blog/topics/partners/helping-our-partners-market-smarter-together-with-gemini/)

_Google Cloud_

At Google Cloud, our commitment to agentic transformation extends to everyone, including the partners who build and grow alongside us. Today, we are excited to introduce new Gemini-powered co-marketing capabilities directly within everyday go-to-market workflows for our partners.

### [Internet traffic and attacks during the 2026 U.S. midterm elections](https://blog.cloudflare.com/internet-traffic-2026-us-election/)

_Cloudflare_

On November 3, 2026 U.S.

### [Aderant modernizes analytics data pipeline with Apache Iceberg and AWS Lambda](https://aws.amazon.com/blogs/architecture/aderant-modernizes-analytics-data-pipeline-with-apache-iceberg-and-aws-lambda/)

_AWS Architecture_

Learn how Aderant modernized the data pipeline behind its Stridyn legal analytics platform with Apache Iceberg, AWS Lambda, and AWS Glue, moving from 15-minute batch cycles to an event-driven medallion architecture that processes change data capture events in single-digit seconds for 700 tenants, with 10-26x faster que…

### [BGP cloud connector for Microsoft Azure Red Hat OpenShift now available](https://www.redhat.com/en/blog/bgp-cloud-connector-microsoft-azure-red-hat-openshift-now-available)

_Red Hat_

Organizations are reassessing where and how they run their virtual machines (VMs). Evolving cloud strategies, the need for a modern platform, and cost pressures are prompting many to reconsider their virtualization options.

### [An updated Clairic and Clairic-flash are now open-weight, from the new Workers AI Superintelligence team](https://blog.cloudflare.com/open-clairic/)

_Cloudflare_

Clairic graduates from preview, while Clairic-flash joins the repertoire on Workers AI. We’re doing an open-weight release for both extraction models.

### [How Cloudflare WAF helps protect against Java4Shell (CVE-2026-114938)](https://blog.cloudflare.com/java4shell-waf-protection/)

_Cloudflare_

Java4Shell is a critical memory-corruption flaw in OpenJDK's Base64 decoder that can lead to remote code execution. Cloudflare has released six WAF managed rules for paid plans that logs matching requests by default.

### [Red Hat OpenShift 5 is now available on Azure Red Hat OpenShift](https://www.redhat.com/en/blog/red-hat-openshift-5-now-available-azure-red-hat-openshift)

_Red Hat_

Red Hat OpenShift 5 is here and it's generally available on Microsoft Azure Red Hat OpenShift with hosted control planes.

### [Microsoft and Oracle bring agentic AI into flow of enterprise work](https://azure.microsoft.com/en-us/blog/microsoft-and-oracle-bring-agentic-ai-into-flow-of-enterprise-work/)

_Azure_

Our new integrations let AI agents reason across Oracle’s business-critical data.

### [Introducing Azure Catalyst agentic modernization and new AI infrastructure innovations](https://azure.microsoft.com/en-us/blog/introducing-azure-catalyst-agentic-modernization-and-new-ai-infrastructure-innovations/)

_Azure_

At Microsoft Ignite 2026, we’ll showcase what’s possible when models, silicon, and cloud infrastructure converge into a single, co-engineered system.

### [Microsoft Ignite 2026: What’s new in Azure, the platform purpose-built for AI](https://azure.microsoft.com/en-us/blog/microsoft-ignite-2026-whats-new-in-azure-the-platform-purpose-built-for-ai/)

_Azure_

At Microsoft Ignite, we're sharing what's new across every layer of the platform. New capabilities spanning compute, storage, and networking let you run AI at scale with the control of your own infrastructure, without having to build, secure, and operate all of it yourself.

---

## DevOps & Infrastructure

### [Announcing custom execution roles for AWS CloudFormation StackSets](https://aws.amazon.com/blogs/devops/announcing-custom-execution-roles-for-aws-cloudformation-stacksets/)

_AWS DevOps_

AWS CloudFormation StackSets now supports custom execution role templates, so you can define the IAM role StackSets uses in each member account instead of the default AdministratorAccess role. Scope permissions to least privilege, and deploy service-managed stack sets that use nested stacks, macros, and transforms.

### [Track AWS CloudFormation StackSets deployments with progress visibility](https://aws.amazon.com/blogs/devops/track-aws-cloudformation-stacksets-deployments-with-progress-visibility/)

_AWS DevOps_

AWS CloudFormation StackSets now adds deployment progress visibility, a stage-by-stage view of where each stack set operation stands. See how much work is complete and which accounts and stack instances need attention, and follow a deployment while it runs across tens or thousands of accounts.

### [What’s new in AWS Transform – continuous modernization for re:Invent 2026](https://aws.amazon.com/blogs/devops/whats-new-in-aws-transform-continuous-modernization-for-reinvent-2026/)

_AWS DevOps_

Ahead of re:Invent 2026, AWS Transform continuous modernization is faster to start, easier to act on, and easier to extend. A new AWS Health integration takes you from a planned lifecycle event straight to the affected code, and remediations now arrive as one clean pull request per repository.

### [Google just gave Gemini the run of your Mac — three days after Apple tightened the rules](https://thenewstack.io/gemini-mac-computer-use/)

_The New Stack_

Google is adding computer use to its Gemini app for macOS. The assistant can now work across desktop applications and

### [An engineer didn’t message his AI for 22 of 44 days. It built an Android app anyway.](https://thenewstack.io/cognition-devin-bots-management/)

_The New Stack_

Cognition has spent nearly three years developing Devin as an autonomous engineer that takes a ticket and ships a pull

### [Grafana Labs’ First Executive Briefing Center Coming to Ginza](https://grafana.com/blog/grafana-labs-ebc1/)

_Grafana_

Grafana Labs does not have a headquarters office. Since its founding in 2014, it has been fully remote-first.

### [The best things in open source are built together](https://github.blog/open-source/maintainers/the-best-things-in-open-source-are-built-together/)

_GitHub_

Introducing Replica and the Open Source Accessibility Framework, new open source projects for collaboration and inclusion.

### [Bring charts, queries, and context into one shareable document: Introducing Grafana Notebooks](https://grafana.com/blog/bring-charts-queries-and-context-into-one-shareable-document-introducing-grafana-notebooks/)

_Grafana_

A teammate asks why you think a deployment caused checkout failures. You have an error-rate chart in your dashboard, a query that narrows the failures to one payment provider, and an explanation you've been exploring with Grafana Assistant.

### [Why the Harness Matters: Early Lessons From the Evo Code Scanning Agent Preview](https://snyk.io/blog/why-harness-matters-evo-code-scanning-agent/)

_Snyk_

In early tests, Evo Code Scanning Agent’s security harness found more known vulnerabilities than Claude Security and Codex Security at the same compute budget, with lower precision. See what the results reveal about the role of the harness in AI code scanning.

### [How Datadog resolves evolving OpenTelemetry semantics at query time](https://www.datadoghq.com/blog/engineering/semantic-translation-otel/)

_Datadog_

OpenTelemetry conventions evolve, but queries still need to work across old, current, and Datadog-native telemetry. Learn how Datadog uses a knowledge graph and query-time translation to resolve conditional semantic equivalences and validate them against real data.

### [Retain more logs for longer with Flex Logs BYOBucket](https://www.datadoghq.com/blog/flex-logs-bring-your-own-bucket/)

_Datadog_

Store Flex Logs in your cloud bucket with unlimited retention to control storage costs and keep logs searchable in Datadog for investigations and audits.

### [Track Lighthouse scores alongside real-user data in Datadog](https://www.datadoghq.com/blog/lighthouse-audits-rum-synthetic-monitoring/)

_Datadog_

Run scheduled Lighthouse audits with Datadog Synthetic Monitoring, compare lab results with field data in RUM, and track page health across releases.

### [Rotate a leaked GitLab token and let GitLab Duo fix the code](https://about.gitlab.com/blog/secret-detection-token-rotate-and-fix/)

_GitLab_

Secret detection alerts you when an active personal access token (PAT) is exposed in your default branch. Acting on that finding is harder: revoking the token breaks dependent pipelines, and replacing it safely takes several manual steps.

### [Turn Slack conversations into trusted software, faster](https://about.gitlab.com/blog/gitlab-slack-integration-for-software-factory/)

_GitLab_

Most software starts as a conversation: a customer requests a new capability, a product manager weighs it against the roadmap, an engineer checks feasibility, and a security lead asks what it touches. Then someone has to turn it into work.

### [Keep recurring work moving with scheduled automations](https://about.gitlab.com/blog/gitlab-scheduled-automations/)

_GitLab_

Every engineering team has work that needs regular attention, like triaging new issues or investigating incidents. Among DevSecOps professionals using AI tools, 43% say automating repetitive tasks has created the most efficiency, according to GitLab’s Global DevSecOps report.

### [Give your agents controlled access to analyze your data and move funds](https://stripe.com/blog/give-your-agents-controlled-access-to-analyze-your-data-and-move-funds)

_Stripe_

Stripe Treasury now lets agents transfer funds, convert currencies, and pay vendors within limits you set. Give agents the access they need to help run your business, with customizable controls and human approvals.

### [ObservabilityCON on the Road: New sessions coming to you in 2027](https://grafana.com/blog/observabilitycon-on-the-road-new-sessions-coming-to-you-in-2027/)

_Grafana_

If you couldn't make it to San Francisco for ObservabilityCON 2026, don’t worry. We’re bringing the highlights of ObservabilityCON to five more international destinations in 2027.

### [How Meta Uses AI Agents to Scale ML Innovations Across Ads Ranking Models](https://engineering.fb.com/2026/11/18/ml-applications/ai-agents-to-scale-ml-innovations-across-ads-ranking-models/)

_Meta Engineering_

Our previous post in this series introduced the Ranking Engineer Agent (REA), an autonomous system that generates hypotheses, designs experiments, and proves new machine learning (ML) techniques on ads ranking models.

### [Design Once, Deploy at Scale: Building a Template-Driven ML Ecosystem](https://engineering.fb.com/2026/11/18/ml-applications/design-once-deploy-at-scale-template-driven-ml-ecosystem/)

_Meta Engineering_

As ML ecosystems grow to a large number of production models, the bottleneck is no longer inventing new techniques to improve these models, but rather shipping them reliably and efficiently across a fragmented model space, creating a rising tide that lifts all the boats.

### [Maintainers don’t need more AI bug reports. They need fixes.](https://github.blog/open-source/maintainers/maintainers-dont-need-more-ai-bug-reports-they-need-fixes/)

_GitHub_

In the Codename MDASH pilot, GitHub and Microsoft turned thousands of raw AI findings into 99 checked, private reports with suggested fixes for six widely used open source projects. Maintainers have already fixed more than half.

### [Building the Agent Host Protocol for sessions that continue across devices](https://github.blog/engineering/engineering-principles/building-the-agent-host-protocol-for-sessions-that-continue-across-devices/)

_GitHub_

Discover how we built the open Agent Host Protocol to keep your agent sessions accessible across editors, apps, phones, and the cloud.

### [같은 GPU로 더 많은 AI 요청을 처리할 수 있을까? ― KV 캐시 오프로딩 × EPP 라우팅: 계산 결과를 오래 남기고, 다음 요청이 그 결과를 찾아가게 하기](https://tech.kakao.com/posts/848)

_카카오_

“같은 GPU 32장, 같은 요청 3,456건. 처리 시간이 121.

### [지표 뒤에 숨은 맥락을 한눈에: New20 Timeline Hub 만들기](https://toss.tech/article/new20-timeline-hub)

_토스_

흩어진 정책, 배포, 실험 기록을 하나의 시간축으로 연결해 분석가의 질문에 답하는 허브를 만든 경험을 공유합니다.

---

## ⚡ Quick News

- [NGINX2Root: Five RCE bugs in NGINX, a Linux kernel path to root, and how to detect exploitation](https://webflow.sysdig.com/blog/nginx2root) — _Sysdig_
- [DaisyRose-27B: Pushing the Frontier of Post-Training Efficiency](https://huggingface.co/blog/RadixArk/daisyrose-27b-pushing-the-frontier-of-post-trainin) — _Hugging Face_
- [Why your fine-tuning job takes longer than the FLOPs say](https://huggingface.co/blog/Dharma-AI/predicting-fine-tuning-time) — _Hugging Face_
- [Time-Series Models in the Streamhouse: A New Frontier and Use Cases](https://huggingface.co/blog/ibm-research/time-series-powered-streamhouse) — _Hugging Face_
- [Engineering AI Discover](https://netflixtechblog.com/engineering-ai-discover-e244944cdc38?source=rss----2615bd06b42e---4) — _Netflix_

---

_This digest was automatically collected from RSS feeds. Excerpts are taken verbatim from each source — see the original links for full details._
