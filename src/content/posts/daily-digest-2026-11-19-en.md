---
title: "📰 Daily Tech Digest - 2026-11-19"
description: "56 curated updates from the Cloud, Kubernetes, AI & DevOps world for 2026-11-19."
pubDate: 2026-11-19
tags: ["Daily Digest", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 Top Story

### Google’s Gemini 4 Neon tripled its coding score without changing the model

Google’s new Gemini 4 Neon resolved 12.8% of the SWE-sweep coding benchmark using the mini-SWE harness, but that score jumped

🔗 [Read more](https://thenewstack.io/gemini-neon-antigravity-harness/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [Running GitHub Actions runners with Amazon EKS Auto Mode](https://aws.amazon.com/blogs/containers/running-github-actions-runners-with-amazon-eks-auto-mode/)

_AWS Containers_

Learn how to run self-hosted GitHub Actions runners on Amazon EKS Auto Mode. Actions Runner Controller with EKS Auto Mode, EC2 Spot Instances, and AWS Graviton scales runners to match CI/CD demand and scales to zero when idle, cutting idle compute costs and manual node operations.

### [The Trust Layer: Securing Agentic AI with Docker AI Governance](https://www.docker.com/blog/agentic-ai-security-docker-governance/)

_Docker_

Learn how Docker AI Governance secures agentic AI with sandbox policies, MCP tool governance, and audit visibility to support controlled AI agent workflows.

### [Optimizing Kubernetes admission control: Where Kyverno’s CEL admission cost actually goes](https://www.cncf.io/blog/2026/11/18/optimizing-kubernetes-admission-control-where-kyvernos-cel-admission-cost-actually-goes/)

_CNCF_

Kyverno’s CEL (Common Expression Language)-based engines exist to evaluate policy expressions. So when we profiled the admission path, we expected to find the bulk of the cost in CEL evaluation.

### [Announcing the Sysdig MCP Server for Monitoring](https://webflow.sysdig.com/blog/announcing-the-sysdig-mcp-server-for-monitoring)

_Sysdig_

The new Sysdig Monitor MCP server connects the AI assistant your team already uses to live container, Kubernetes, and cloud monitoring data.

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

### [The Gemini app is now available on lower-memory Android devices.](https://blog.google/innovation-and-ai/products/gemini-app/gemini-lower-memory-devices/)

_Google AI_

The Google Gemini app now supports lower-memory Android devices. Access Gemini Live and custom image creation on your phone.

### [The Silent Consensus](https://openai.com/index/the-silent-consensus)

_OpenAI_

Dean Ball, Head of Strategic Futures at OpenAI, examines how more capable AI could reshape society and how people can retain control of their institutions.

### [Research acceleration: The jagged frontier](https://openai.com/index/research-acceleration-jagged-frontier)

_OpenAI_

OpenAI measures how coding agents are accelerating AI research, where their performance remains uneven, and what this signals about recursive self-improvement.

### [How Sumitomo Life’s leaders helped teams adopt ChatGPT Enterprise](https://openai.com/business/customer-stories/sumitomo-life)

_OpenAI_

Sumitomo Life uses ChatGPT Enterprise to research insurers, prepare proposals, and draft code for investment analysis. Early use by executives helped drive adoption.

### [Put Gemini to work for you](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)

_Google AI_

Tasks in Gemini is now free of charge in six countries, with new features starting in the U.S.

### [New Ask Maps features to help with holiday travel and prep](https://blog.google/products-and-platforms/products/maps/ask-maps-holiday-travel-features-2026/)

_Google AI_

Plan holiday road trips, get route tips, find local appointments, and search your saved lists with new Ask Maps features.

---

## Cloud Updates

### [Aderant modernizes analytics data pipeline with Apache Iceberg and AWS Lambda](https://aws.amazon.com/blogs/architecture/aderant-modernizes-analytics-data-pipeline-with-apache-iceberg-and-aws-lambda/)

_AWS Architecture_

Learn how Aderant modernized the data pipeline behind its Stridyn legal analytics platform with Apache Iceberg, AWS Lambda, and AWS Glue, moving from 15-minute batch cycles to an event-driven medallion architecture that processes change data capture events in single-digit seconds for 700 tenants, with 10-26x faster que…

### [An updated Clairic and Clairic-flash are now open-weight, from the new Workers AI Superintelligence team](https://blog.cloudflare.com/open-clairic/)

_Cloudflare_

Add your teaser here. It should complement the headline, not repeat it.

### [A bridge to modernization: What IDC’s Market Note says about Cameyo by Google](https://cloud.google.com/blog/products/chrome-enterprise/a-bridge-to-modernization-what-idcs-market-note-says-about-cameyo-by-google/)

_Google Cloud_

Organizations are increasingly adopting generative and agentic AI as they look for ways to unlock more business value.

### [How United Airlines streams database changes to Apache Iceberg with Amazon Data Firehose](https://aws.amazon.com/blogs/architecture/how-united-airlines-streams-database-changes-to-apache-iceberg-with-amazon-data-firehose/)

_AWS Architecture_

United Airlines built a near-real-time change data capture pipeline that replicates reference data from Amazon Aurora MySQL to open Apache Iceberg tables using AWS DMS, Amazon Kinesis Data Streams, and Amazon Data Firehose.

### [Resilience testing your agents on Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/architecture/resilience-testing-your-agents-on-amazon-bedrock-agentcore/)

_AWS Architecture_

When an AI agent's tools fail or return corrupted data, does it fail safe or confidently fabricate an answer?

### [EMEA startups building the next-generation of agents on Google Cloud](https://cloud.google.com/blog/topics/startups/google-cloud-highlights-emea-startup-momentum-at-slush-2026/)

_Google Cloud_

As thousands of founders, investors, and technology leaders gather in Helsinki for Slush 2026, the European startup ecosystem is undergoing a profound transformation. The conversation has moved from AI experiments to operating agents.

### [What’s new in OKF v0.3: enterprise-ready knowledge, use cases, and skills](https://cloud.google.com/blog/products/data-analytics/introducing-okf-v0-3/)

_Google Cloud_

In June we introduced the Open Knowledge Format (OKF), an open specification that provides plain markdown and YAML to give agents the context they need. In July, v0.

### [How Cloudflare WAF helps protect against Java4Shell (CVE-2026-114938)](https://blog.cloudflare.com/java4shell-waf-protection/)

_Cloudflare_

Java4Shell is a critical memory-corruption flaw in OpenJDK's Base64 decoder that can lead to remote code execution. Cloudflare has released six WAF managed rules for paid plans that logs matching requests by default.

### [Red Hat OpenShift 5 is now available on Azure Red Hat OpenShift](https://www.redhat.com/en/blog/red-hat-openshift-5-now-available-azure-red-hat-openshift)

_Red Hat_

Red Hat OpenShift 5 is here and it's generally available on Microsoft Azure Red Hat OpenShift with hosted control planes.

### [Quad9’s withdrawal from France: A canary in the coal mine](https://blog.cloudflare.com/quad9-withdrawal-from-france/)

_Cloudflare_

Quad9's forced withdrawal from France highlights the dangers of mandating DNS-level blocking. We explore why forcing public resolvers to act as content filters is technically flawed and threatens the open Internet.

### [How to write a standout Red Hat Summit proposal](https://www.redhat.com/en/blog/how-write-standout-red-hat-summit-proposal)

_Red Hat_

Every year, the Red Hat Summit review committee evaluates roughly 1,500 proposals to build a catalog of around 350 sessions.You may be wondering: What distinguishes a successful abstract from one that falls flat?

### [Azure Red Hat OpenShift with hosted control planes is now generally available](https://www.redhat.com/en/blog/azure-red-hat-openshift-hosted-control-planes-now-generally-available)

_Red Hat_

Microsoft Azure Red Hat OpenShift with hosted control planes is now generally available to help teams reduce infrastructure costs, simplify Day 2 operations, and provision clusters with more flexibility.

---

## DevOps & Infrastructure

### [Get more from your Kiro investment with credit pooling: A guide for admins](https://aws.amazon.com/blogs/devops/get-more-from-your-kiro-investment-with-credit-pooling-a-guide-for-admins/)

_AWS DevOps_

Kiro credit pooling gives admins new decisions: how many seats to keep, how many credits to buy, and what per-user limits to set. This hands-on guide shows how to size your pool and set limits from your own Kiro user activity reports using Amazon Athena, plus best practices for governing shared usage.

### [Microsoft says Bing serves 1B people. Its next search engine isn’t for them.](https://thenewstack.io/microsoft-web-iq-agents/)

_The New Stack_

Microsoft says its Bing search engine now has one billion monthly users. The company says those are humans — not

### [“The best escape room players that you’ve ever met”: What Red Hat’s AI architect really thinks about agents.](https://thenewstack.io/openshell-ai-agent-security/)

_The New Stack_

Last week at KubeCon + CloudNativeCon North America, a major gathering of the open-source and cloud-native communities, many speakers —

### [ObservabilityCON on the Road: New sessions coming to you in 2027](https://grafana.com/blog/observabilitycon-on-the-road-new-sessions-coming-to-you-in-2027/)

_Grafana_

If you couldn't make it to San Francisco for ObservabilityCON 2026, don’t worry. We’re bringing the highlights of ObservabilityCON to five more international destinations in 2027.

### [How Meta Uses AI Agents to Scale ML Innovations Across Ads Ranking Models](https://engineering.fb.com/2026/11/18/ml-applications/ai-agents-to-scale-ml-innovations-across-ads-ranking-models/)

_Meta Engineering_

Our previous post in this series introduced the Ranking Engineer Agent (REA), an autonomous system that generates hypotheses, designs experiments, and proves new machine learning (ML) techniques on ads ranking models.

### [Design Once, Deploy at Scale: Building a Template-Driven ML Ecosystem](https://engineering.fb.com/2026/11/18/ml-applications/design-once-deploy-at-scale-template-driven-ml-ecosystem/)

_Meta Engineering_

As ML ecosystems grow to a large number of production models, the bottleneck is no longer inventing new techniques to improve these models, but rather shipping them reliably and efficiently across a fragmented model space, creating a rising tide that lifts all the boats.

### [Bring Datadog BYOC to your on-premises data with MinIO AIStor](https://www.datadoghq.com/blog/datadog-byoc-minio-aistor/)

_Datadog_

Learn how Datadog BYOC and MinIO AIStor work together to help you search, monitor, and investigate logs while keeping your telemetry on-premises.

### [How we built Datadog’s agentic vulnerability hunting system](https://www.datadoghq.com/blog/datadogs-agentic-vulnerability-hunting-system/)

_Datadog_

We developed threat packs that give our agents the context they need to run efficient, repeatable hunts. Learn how we did it.

### [How we fine-tuned a faster model for Patterns on Baseten](https://www.datadoghq.com/blog/fine-tuning-patterns-baseten/)

_Datadog_

Datadog fine-tuned a summarization model using production traces, cutting average generation time from about 45 seconds to under one second.

### [GitLab Transcend Hackathon: Meet the 'Life After Code' winners](https://about.gitlab.com/blog/gitlab-transcend-hackathon-life-after-code/)

_GitLab_

Code generation is the easy part now. The hard part is everything that comes after it: getting software from a working change to running in production.

### [Reducing database incident MTTR by 73% with a custom AWS DevOps Agent Skill](https://aws.amazon.com/blogs/devops/reducing-database-incident-mttr-by-73-with-a-custom-aws-devops-agent-skill/)

_AWS DevOps_

Database incidents routinely take 45 to 60 minutes to triage.

### [Enforcing zero-trust dependency policies in AWS CodeBuild with JFrog Curation](https://aws.amazon.com/blogs/devops/enforcing-zero-trust-dependency-policies-in-aws-codebuild-with-jfrog-curation/)

_AWS DevOps_

Integrate JFrog Curation into an AWS CodeBuild pipeline to block vulnerable and malicious open source packages at download time. A package that violates policy returns an HTTP 403 (Access Denied) error that fails the build, so a risky dependency never becomes a container image or reaches Amazon ECR.

### [Maintainers don’t need more AI bug reports. They need fixes.](https://github.blog/open-source/maintainers/maintainers-dont-need-more-ai-bug-reports-they-need-fixes/)

_GitHub_

In the Codename MDASH pilot, GitHub and Microsoft turned thousands of raw AI findings into 99 checked, private reports with suggested fixes for six widely used open source projects. Maintainers have already fixed more than half.

### [Building the Agent Host Protocol for sessions that continue across devices](https://github.blog/engineering/engineering-principles/building-the-agent-host-protocol-for-sessions-that-continue-across-devices/)

_GitHub_

Discover how we built the open Agent Host Protocol to keep your agent sessions accessible across editors, apps, phones, and the cloud.

### [Find the log line that matters faster with full-text search in Grafana Cloud Logs](https://grafana.com/blog/find-the-log-line-that-matters-faster-with-full-text-search-in-grafana-cloud-logs/)

_Grafana_

A support ticket comes in with one clue: a transaction ID. The answer is somewhere in your logs, but you don't know which service logged it, which pod handled it, or which day it happened.

### [같은 GPU로 더 많은 AI 요청을 처리할 수 있을까? ― KV 캐시 오프로딩 × EPP 라우팅: 계산 결과를 오래 남기고, 다음 요청이 그 결과를 찾아가게 하기](https://tech.kakao.com/posts/848)

_카카오_

“같은 GPU 32장, 같은 요청 3,456건. 처리 시간이 121.

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

## ⚡ Quick News

- [DaisyRose-27B: Pushing the Frontier of Post-Training Efficiency](https://huggingface.co/blog/RadixArk/daisyrose-27b-pushing-the-frontier-of-post-trainin) — _Hugging Face_
- [Why your fine-tuning job takes longer than the FLOPs say](https://huggingface.co/blog/Dharma-AI/predicting-fine-tuning-time) — _Hugging Face_
- [Time-Series Models in the Streamhouse: A New Frontier and Use Cases](https://huggingface.co/blog/ibm-research/time-series-powered-streamhouse) — _Hugging Face_
- [Engineering AI Discover](https://netflixtechblog.com/engineering-ai-discover-e244944cdc38?source=rss----2615bd06b42e---4) — _Netflix_

---

_This digest was automatically collected from RSS feeds. Excerpts are taken verbatim from each source — see the original links for full details._
