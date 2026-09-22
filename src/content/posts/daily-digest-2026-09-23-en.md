---
title: "📰 Daily Tech Digest - 2026-09-23"
description: "42 curated updates from the Cloud, Kubernetes, AI & DevOps world for 2026-09-23."
pubDate: 2026-09-23
tags: ["Daily Digest", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 Top Story

### Secure AI agents with HashiCorp Boundary

AI agents are evolving from passive assistants into active participants in enterprise IT operations -analyzing logs, investigating incidents, assessing system health, and recommending next steps.

🔗 [Read more](https://www.hashicorp.com/blog/secure-ai-agents-with-hashicorp-boundary) · _HashiCorp_

---

## Kubernetes & Cloud Native

### [The operations gap between deploying an application and running it forever](https://aws.amazon.com/blogs/containers/the-operations-gap-between-deploying-an-application-and-running-it-forever/)

_AWS Containers_

This post features the new Cluster Mode deployment model in AWS Elastic Beanstalk that extends the operational promise of the service to containerized application portfolios.

### [Spotlight on SIG Apps](https://kubernetes.io/blog/2026/09/22/sig-apps-spotlight/)

_Kubernetes_

As Kubernetes adoption has grown, the conversation has shifted beyond running containers to managing increasingly complex application lifecycles. Modern platforms support stateless web services, stateful databases, batch processing, AI workloads, and platform services.

### [Implement per-pod image pull permissions with ECR repository policies on Amazon EKS](https://aws.amazon.com/blogs/containers/implement-per-pod-image-pull-permissions-with-ecr-repository-policies-on-amazon-eks/)

_AWS Containers_

Learn how to scope Amazon ECR image pull permissions to individual Kubernetes pods on a multi-tenant Amazon EKS cluster using KEP 4412 credential providers and ECR repository deny policies, so teams sharing the same nodes can pull only their own container images.

### [Meet the Ecosystem: Partners and Customers at WeAreDevelopers with Docker](https://www.docker.com/blog/wearedevelopers-partner-customer-sessions-2026/)

_Docker_

Meet the partners and customers bringing practical AI, security, and development sessions to the Docker Pavilion at WeAreDevelopers. The post explains why a strong ecosystem matters to developers, announces the sessions and speakers, and invites attendees to connect with the teams building and using these technologies.

### [From attendee badge to speaker badge: My first KubeCon at KubeCon + CloudNativeCon India 2026](https://www.cncf.io/blog/2026/09/22/from-attendee-badge-to-speaker-badge-my-first-kubecon-at-kubecon-cloudnativecon-india-2026/)

_CNCF_

There is something surreal about your first KubeCon being one where you walk onto the stage as a speaker. Most people ease into this community by attending a few conferences, lurking in hallway tracks, and working.

### [Risky identities continue to plague cloud infrastructures](https://webflow.sysdig.com/blog/risky-identities-continue-to-plague-cloud-infrastructures)

_Sysdig_

Our research finds cloud-native IAM remains one of the most persistently misconfigured and poorly governed areas of security. Here’s what you can do.

### [How Ramp runs GPU AI workloads at scale with ECS Managed Instances](https://aws.amazon.com/blogs/containers/how-ramp-runs-gpu-ai-workloads-at-scale-with-ecs-managed-instances/)

_AWS Containers_

Ramp runs GPU-powered AI inference continuously on Amazon ECS. This post walks through how Ramp's infrastructure team moved those GPU workloads onto Amazon ECS Managed Instances: the architecture pattern, Terraform implementation, and the lessons learned migrating 50 to 60 EC2 instances.

### [Kubernetes v1.37: Tracking When a PersistentVolumeClaim Was Last Used (Beta)](https://kubernetes.io/blog/2026/09/21/kubernetes-v1-37-pvc-last-used-time/)

_Kubernetes_

Kubernetes v1.37 promotes the PersistentVolumeClaimUnusedSinceTime feature gate to Beta (enabled by default).

---

## AI & ML

### [Better prompt caching for GPT-6](https://openai.com/index/better-prompt-caching-for-gpt-6)

_OpenAI_

Learn how GPT-6 improves prompt caching with higher cache hit rates, new diagnostics, explicit breakpoints, and controls that reduce latency and costs.

### [Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna)

_OpenAI_

Meet GPT-6 Sol and Luna, two models that bring frontier intelligence to everyday work with different balances of capability and cost.

### [Parallel cut research time and cost in half with GPT‑6 Astra](https://openai.com/index/parallel-cuts-time-and-cost-with-astra)

_OpenAI_

GPT‑6 Astra allowed Parallel’s agents to research and synthesize labor-market data in half the time and at half the cost vs. prior models.

---

## Cloud Updates

### [We just shipped support for the ugliest part of HTTP: Vary](https://blog.cloudflare.com/vary-support/)

_Cloudflare_

Vary support is now available in Cache Rules on every plan. You can normalize known negotiation headers, pass exact values through to the origin when those small differences matter, or bypass cache when the variation is too unpredictable.

### [Introducing Worker Previews: Isolated preview environments for every change your agent makes](https://blog.cloudflare.com/worker-previews/)

_Cloudflare_

Worker Previews gives every branch its own URL, configuration, state, and observability, so you and your agents can test changes in parallel without affecting production.

### [Evolving your automation (Pt. 2): Architectural decisions for upgrading to Red Hat Ansible Automation Platform 2.7](https://www.redhat.com/en/blog/evolving-your-automation-pt-2-architectural-decisions-upgrading-red-hat-ansible-automation-platform-27)

_Red Hat_

Red Hat Ansible Automation Platform 2.7 introduces many new enhancements designed to scale enterprise automation, improve platform engineering productivity, and bridge the gap with AI-driven operations.

### [AutoRAG pipeline optimization in Red Hat OpenShift AI](https://www.redhat.com/en/blog/autorag-pipeline-optimization-red-hat-openshift-ai)

_Red Hat_

If you're an AI or machine learning engineer, you've seen the classic demo: ingest a clean PDF into a prototype, build a vector database index using standard tutorial code, and submit a simple question. The model returns a pristine answer, everyone nods, and the project gets greenlit.

### [Global AI routing with <1% overhead on multi-cluster GKE Inference Gateway](https://cloud.google.com/blog/products/containers-kubernetes/gpu-and-tpu-utilization-with-multi-cluster-gke-inference-gateway/)

_Google Cloud_

Demand for AI infrastructure is at an all-time high. Global accelerator shortages mean engineering teams can rarely get all the compute they need from just one data center — capacity comes a cluster here, a cluster there, often an ocean apart.

### [Maximizing Apache Spark availability: Mitigating compute stockouts with flexible VMs and other best practices](https://cloud.google.com/blog/products/data-analytics/maximize-apache-spark-availability-with-flexible-vms/)

_Google Cloud_

The surge in AI development has created unprecedented demand for compute capacity around the globe. This can have negative implications for data processing and pipelines with Apache Spark.

### [Scale your AI workloads faster and more efficiently with GKE Pod snapshots](https://cloud.google.com/blog/products/containers-kubernetes/gke-pod-snapshots/)

_Google Cloud_

When running modern AI workloads, there’s often a conflict between performance and cost. Workloads like large language models (LLMs) load massive files, and may serve thousands of AI agents that need to execute code instantly.

### [Python Workers are now generally available](https://blog.cloudflare.com/python-workers-ga/)

_Cloudflare_

Python Workers allow developers to run Python web frameworks and AI orchestration libraries natively in the Cloudflare Workers runtime. You can seamlessly integrate with Cloudflare's ecosystem including D1, R2, and Workers AI without writing any JavaScript glue code.

### [Turning security complexity into useful intelligence: What’s new in Red Hat Lightspeed](https://www.redhat.com/en/blog/turning-security-complexity-useful-intelligence-whats-new-red-hat-lightspeed)

_Red Hat_

In a post-Mythos world, IT teams face a mounting crisis. Many are doing more with the same staff, and security work hasn’t gotten simpler.

---

## DevOps & Infrastructure

### [Claude Opus 5.5 wants to finish your coding tasks, not just start them](https://thenewstack.io/claude-opus-5-5-lifecycle/)

_The New Stack_

Anthropic wants developers to use Claude and its family of tools to handle complete coding tasks. The company introduced Claude

### [GPT-6 Sol closes most of the alignment gap with Astra. It’s one-fifth the price.](https://thenewstack.io/gpt-sol-alignment-gaps/)

_The New Stack_

On Tuesday, OpenAI released GPT-6 Sol and Luna, an expansion of the GPT-6 line-up that aims to make GPT-6 Astra’s

### [“One of the most significant steps in our 26-year history”: JetBrains goes big on agentic development — and bets the IDE still matters](https://thenewstack.io/jetbrains-air-agents-ide/)

_The New Stack_

There’s little question that AI coding agents have changed where software development work happens. Developers can increasingly delegate work from

### [방해하지 않고, 눈에 띌 수 있을까](https://toss.tech/article/asset_management)

_토스_

CVR을 3배 높이면서도 사용자 경험을 놓치지 않기 위해 고민한 과정을 들려드려요.

### [So I asked my agent instead…](https://snyk.io/blog/so-i-asked-my-agent-instead/)

_Snyk_

Ask your Evo tenant about models, MCP servers, and skills across your AI estate, from the client you already work in.

### [쉼 없이 도는 테스트, 사람이 어디까지 돌봐야 할까요? - 토스닥터(Toss Doctor)](https://toss.tech/article/toss-doctor)

_토스_

스스로 만들고 고치는 자동화, 토스닥터 V2를 다시 만든 이야기

### [Cut AI agent cost and improve accuracy with Code Execution in the Datadog MCP Server](https://www.datadoghq.com/blog/datadog-code-execution/)

_Datadog_

Use the Code Execution toolset in the Datadog MCP Server to help AI agents run multisignal investigations with fewer tool calls and less model context.

### [When users don’t click thumbs up: Inferring agent feedback from Datadog telemetry](https://www.datadoghq.com/blog/agent-feedback-classification-skill/)

_Datadog_

Learn how we used weak labeling to infer user satisfaction from Datadog telemetry when agent users don’t click thumbs up.

### [How to design GitLab for enterprise scale](https://about.gitlab.com/blog/how-to-design-gitlab-for-enterprise-scale/)

_GitLab_

At enterprise scale, even small architecture choices can have outsized consequences. A deployment that works for a handful of teams can become a constraint once thousands of developers, repositories, and pipelines depend on it.

### [How GitLab reduced code-per-agentic-flow ratio by 45%](https://about.gitlab.com/blog/how-gitlab-reduced-code-per-agentic-flow-ratio/)

_GitLab_

GitLab Duo Agent Platform orchestrates and automates complex tasks through agentic flows. A key part of the platform is the Flow Registry, a declarative configuration framework, built from reusable components, that compiles YAML into fully functional LangGraph flows.

### [New trends in global card fraud: How 3D Secure and regional mandates are affecting risk](https://stripe.com/blog/new-trends-in-global-card-fraud-how-3d-secure-and-regional-mandates-are-affecting-risk)

_Stripe_

We analyzed billions of transactions on Stripe from January 2022 to March 2026 to understand how card fraud patterns differ by region and country, what's driving those differences, and how businesses can respond.

### [Grafana Alerting: Scale alert routing without scaling complexity using multiple notification policies](https://grafana.com/blog/grafana-alerting-scale-alert-routing-without-scaling-complexity-using-multiple-notification-policies/)

_Grafana_

Alert routing often starts simple. A team creates a few contact points, adds some label matchers, and builds a notification policy tree that sends each alert to the right destination.

### [Open-Sourcing Rebalancer: A Generic, High-Performance Library for Solving Assignment Problems](https://engineering.fb.com/2026/09/21/open-source/rebalancer-generic-high-performance-library-assignment-problems/)

_Meta Engineering_

We’re open-sourcing Rebalancer, the assignment-problem solver that has been used to solve resource allocation problems throughout Meta for over nine years. Rebalancer separates several related concerns: how to specify an assignment problem, how to store it efficiently in memory, how to solve it, and how to debug it.

### [Introducing Our New Dropbox API Documentation](https://dropbox.tech/developers/new-dropbox-api-documentation)

_Dropbox_

Learn about the newly launched version of the Dropbox API documentation and its modern design and features.

### [How Adaptive Tail Sampling Works in the OpenTelemetry Collector](https://www.honeycomb.io/blog/how-adaptive-tail-sampling-works)

_Honeycomb_

A technical deep dive into Honeycomb's adaptive tail sampling processor for the OpenTelemetry Collector: how decisions get made, the samplers available, how thresholds compose with the rest of a sampling pipeline, performance benchmarks, deployment limitations, and how it compares to Refinery.

### [Inside Petal: Building the World’s First Petabit-Class Transoceanic Subsea Cable](https://engineering.fb.com/2026/09/21/connectivity/petal-petabit-transoceanic-subsea-cable/)

_Meta Engineering_

Petal, the next step in Meta’s subsea innovation, will be the first subsea cable to deliver petabit capacity at transoceanic distances, connecting France and the United States over approximately 7,000 km (4,300 mi).

### [도메인 지식 없는 디자이너가 팀의 기준을 바꾼 방법](https://toss.tech/article/remittance_transfer)

_토스_

은행 지식이 없던 디자이너가 규제가 가득한 도메인에서 어떻게 팀의 기준을 바꿨는지 이야기해 보려고 해요.

### [Understand the top paths users take to convert or drop off with Journey Paths](https://www.datadoghq.com/blog/product-analytics-journey-paths/)

_Datadog_

Use Journey Paths in Datadog Product Analytics to quantify how users convert, investigate drop-offs, and find friction between funnel steps.

---

## ⚡ Quick News

- [How UK AISI and EvalEval Are Making Benchmark Results Reproducible](https://huggingface.co/blog/evaleval-aisi) — _Hugging Face_
- [Transformers now runs llama.cpp quants](https://huggingface.co/blog/transformers-llama-cpp-quants) — _Hugging Face_
- [Jun Kim, oMLX creator and maintainer, joins Hugging Face to support the MLX community](https://huggingface.co/blog/omlx) — _Hugging Face_

---

_This digest was automatically collected from RSS feeds. Excerpts are taken verbatim from each source — see the original links for full details._
