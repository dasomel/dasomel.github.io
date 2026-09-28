---
title: "📰 Daily Tech Digest - 2026-09-28"
description: "20 curated updates from the Cloud, Kubernetes, AI & DevOps world for 2026-09-28."
pubDate: 2026-09-28
tags: ["Daily Digest", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 Top Story

### Cloudflare’s 2026 Annual Founders’ Letter

Cloudflare published its 2026 annual founders' letter on September 27, marking the company's 16th anniversary since its 2010 launch. The letter moved up its forecast for automated traffic overtaking human traffic from the second half of 2027 to May 2026. Cloudflare projects automated traffic could reach 1,000 times human traffic within five years if the trend continues. It notes that new website creation, which had plateaued from 2012 through 2025, exploded again starting in mid-2025. More than half of the content fetched by bots had not changed since a previous visit, according to the letter. Cloudflare says over 7 million developers now build on its developer platform. The letter commits to an open ecosystem for the agentic web, including tools that let crawlers fetch only new content and mechanisms for creators to earn when agents use their work.

> 💡 **Why it matters**: With bot traffic now projected to overtake human traffic sooner than expected, infra and edge teams should design crawler-throttling and content-monetization policies now rather than treat agentic traffic as an afterthought.

🔗 [Read more](https://blog.cloudflare.com/cloudflares-2026-annual-founders-letter/) · _Cloudflare_

---

## Kubernetes & Cloud Native

### [AWS named a Leader in the 2026 Gartner Magic Quadrant for Container Management](https://aws.amazon.com/blogs/containers/aws-named-a-leader-in-the-2026-gartner-magic-quadrant-for-container-management/)

_AWS Containers_

AWS announced it has been named a Leader in the 2026 Gartner Magic Quadrant for Container Management for the fourth consecutive year. The Gartner report was authored by Dennis Smith, Tony Iams, Wataru Katsurashima, Lucas Albuquerque, Carolin Zhou, and Bhuvie Chhabra. AWS says it runs billions of Amazon ECS tasks weekly and operates millions of Amazon EKS clusters. It highlights that the EKS Provisioned Control Plane offers a 99.99% availability SLA. Recent features cited include ECS Express Mode, EKS Auto Mode, ECS Managed Instances, EKS Hybrid Nodes, ECS Anywhere, and the AWS DevOps Agent. The post also mentions support for AWS Trainium and NVIDIA GPUs for container workloads. Aarti Patil, Analyst Relations Lead for Containers and Serverless, and Aditya Ramakrishnan, Product Marketing Manager for Kubernetes on AWS, wrote up what the recognition means for customers.

> 💡 The billions-of-tasks-per-week ECS and millions-of-clusters EKS scale, backed by a 99.99% control-plane SLA, signals that any org already running containers at scale should weight AWS's operational maturity heavily in vendor evaluations.

### [One Amazon EKS, many edges: How to choose your edge container strategy on AWS](https://aws.amazon.com/blogs/containers/one-amazon-eks-many-edges-how-to-choose-your-edge-container-strategy-on-aws/)

_AWS Containers_

AWS lays out a decision framework for edge container strategy built around four EKS deployment models: EKS Anywhere, EKS Hybrid Nodes, EKS on AWS Outposts, and fully managed EKS in an AWS Region or Local Zone. The first gate is connectivity: sites with disconnected, disrupted, intermittent, or limited (DDIL) connectivity to an AWS Region are restricted to EKS Anywhere, the only fully self-managed option. For sites with a persistent Region connection, the choice then depends on existing infrastructure — no existing infrastructure points to EKS on Outposts, while existing on-premises infrastructure makes EKS Hybrid Nodes the recommended default, letting teams attach existing machines incrementally without hardware replacement. On pricing, EKS Anywhere is free, with an optional Enterprise Subscription at $24,000 per cluster for a one-year term (or $18,000 per cluster per year on a three-year term); Hybrid Nodes and EKS on Outposts cost $0.10 per cluster-hour ($0.60 with extended support), plus a tiered per-vCPU-hour node charge starting at $0.020 for Hybrid Nodes or Outposts capacity fees for the rack hardware. All three on-premises-capable models share the same underlying Amazon EKS Distro, so Kubernetes manifests and Helm charts can move between them without re-architecture. A key limitation is that EKS Anywhere and EKS Hybrid Nodes are Linux-only, so Windows workloads must run on Outposts extended clusters or be re-platformed to Linux containers. The post frames the whole decision structure around the principle that "the standard should be constant, the deployment model should flex."

> 💡 Reducing the edge deployment choice to two variables, connectivity and existing infrastructure, should cut down on one-off fleet configurations while keeping teams on a single standard Kubernetes toolchain across sites.

### [Security Slam 2026 – Fall edition](https://www.cncf.io/blog/2026/09/25/security-slam-2026-fall-edition/)

_CNCF_

The CNCF and the Open Source Security Foundation (OpenSSF) are jointly running Security Slam 2026 – Fall Edition, a 30-day virtual event from October 5 through November 6, 2026, coordinated by OpenSSF and CNCF's TAG Security. Participating projects work through security hygiene milestones tailored to their own maturity level, using OpenSSF tools and resources along the way. The biggest change this year is eligibility: the Slam was previously limited to CNCF projects but is now open to any open source project. A new metric added for 2026 focuses on preparedness for the EU's Cyber Resilience Act (CRA). Registration opens at securityslam.com/slam26/register, and participants get support throughout October via a dedicated CNCF Slack channel and a set of guidance materials called the "Slam Library." Projects that complete milestones receive iron-on badges, framed plaques, and digital Credly badges, and can collect physical awards at the OpenSSF's Booth #313 in the KubeCon Solutions Showcase on November 10–12. Now in its sixth iteration and led by Eddie Knight and Stacey Potter, the event builds on momentum from prior editions dating back to the original 30-day format in 2023.

> 💡 Opening eligibility beyond CNCF projects and adding a CRA-readiness metric signals a push to spread open-source supply-chain security practices industry-wide ahead of tightening EU regulation.

### [AI adoption is a security survival metric](https://webflow.sysdig.com/blog/ai-adoption-is-a-security-survival-metric)

_Sysdig_

Sysdig's 2026 Cloud-Native Security and Usage Report, authored by Crystal Morin, finds that organizations are moving AI from experimentation into core infrastructure. Across the environments analyzed, AI/ML packages grew by more than one million year-over-year, ML packages in cloud environments increased sixfold, OpenAI-related packages grew 14-fold, and Anthropic-related packages grew 40-fold. Public exposure of AI/ML packages held steady at 1.5%, the same as the prior year, and only 0.05% of overall resources were found to be publicly exposed. The report describes organizations progressing from "takers" that consume external AI services, to "shapers" that customize models, to "makers" that train their own proprietary models. B2C sectors such as media, retail, and transportation lead adoption because AI directly drives revenue and customer experience, while B2B organizations adopt it mainly for operational efficiency and internal productivity. EMEA significantly outpaces other regions in AI/ML adoption, which the report attributes to regulatory frameworks and data-sovereignty requirements that push companies toward internal infrastructure. Morin argues that consolidating scattered AI tools and APIs into owned infrastructure actually shrinks the attack surface, and recommends treating AI as a standard software workload requiring the same security practices as everything else.

> 💡 The 14x and 40x jumps in OpenAI- and Anthropic-linked packages show how fast vendor-tied AI usage is becoming standard workload inside organizations, underscoring an urgent visibility gap for security teams.

---

## AI & ML

### [Proaction boosts sales 60% and saves 75+ hours with Codex](https://openai.com/index/proaction)

_OpenAI_

OpenAI published a customer story about Proaction, a startup building fleet management software for vehicles and construction equipment. After adopting Codex, GPT-Live-1, and GPT-6 Astra, the company reports saving 40 to 60 engineering hours and 33 founder hours per month while growing sales 60%. Co-founder and COO Colin Knudsen says he used to need an engineer to build a demo, but now builds four to six custom demos a month himself in Codex, each taking 30 to 45 minutes. He feeds Codex Granola call recordings, prospect emails, and spreadsheets to generate an HTML demo mirroring the customer's own fleet, which he says has lifted the share of deals moving from initial contact into solution development by 50% to 60%. Using Codex plugins for Granola, Gmail, Slack, Linear, GitHub, and HubSpot, Knudsen handles 15 to 20 tasks a day and estimates this saves him 25 to 33 hours a month. ChatGPT-5.6 Sol identifies vehicle damage from customer-submitted photos, while GPT-Live-1 powers voice agents, including one called Marty that calls repair shops to arrange vehicle service. Head of Product Danny O'Halloran adds that GPT-6 Astra's computer-use runs are more succinct than the longer runs he saw with GPT-5.6 Sol for the same tasks.

> 💡 A non-engineer building customer demos and a maintenance-dispatch voice agent directly in Codex shows how far AI coding tools can now substitute for engineering headcount at a small operations-heavy startup.

---

## Cloud Updates

### [What’s new with Google Cloud](https://cloud.google.com/blog/topics/inside-google-cloud/whats-new-google-cloud/)

_Google Cloud_

Google Cloud's what's new blog page is a continuously updated roundup of product announcements, and this snapshot reflects the items listed as of September 26, 2026. At this point, the list includes Claude Opus 5.5 becoming available on Google Cloud and GKE Agentic Migration entering Public Preview, an AI-assisted, guardrailed path for moving workloads from EKS to GKE. Apigee adds MCP tool authorization with fine-grained access controls, plus Gemini Enterprise Agent Runtime now supporting a private architecture over Private Service Connect. Dataflow Job Builder can now import Delta Lake tables from Cloud Storage through a no-code interface, and Storage Intelligence Advisor reached general availability with anomaly detection. Managed Service for Apache Kafka now supports public clusters that external clients such as IoT, retail, and telecom systems can reach directly. Bigtable Subscriptions entered preview for streaming Pub/Sub messages directly into Bigtable with zero ETL, while the AlloyDB Omni Red Hat RPM Orchestrator reached general availability. The page frames this batch of updates around agentic AI, MCP governance, and lakehouse modernization for AI workloads.

> 💡 The cluster of updates around MCP authorization, agent runtimes, and guardrailed EKS-to-GKE migration suggests Google Cloud is weighting its near-term roadmap toward governing agentic workloads rather than raw compute features.

### [Unlock 3x QPS and microsecond latency with Memorystore for Valkey 9.1](https://cloud.google.com/blog/products/databases/memorystore-for-valkey-9-1-3x-qps-caching/)

_Google Cloud_

Google Cloud announced general availability of Memorystore for Valkey 9.1 on September 26. Based on open-source benchmarks, it claims up to 3x the QPS and microsecond latency compared to Memorystore for Redis Cluster, while cautioning that real-world gains vary by workload. The company also says more than 95% of its top 100 Google Cloud customers already rely on Memorystore. MLB's SVP of Software Engineering Rob Engel and Target's Senior Engineering Managers Scott Weide and Sumanth Huddar are quoted describing their reliance on Valkey in production. The release adds a range of new node sizes, from the 1.25 GB Custom-Pico up to the Highmem-XXLarge with 110 GB of RAM and 16 vCPUs. It highlights a new lock-free, multi-queue messaging architecture with dynamic scaling triggered around 30% main-thread CPU usage. It also ships new commands including CLUSTERSCAN, HGETDEL, MSETEX, and HSETEX, plus a four-step migration path from self-managed Redis or Valkey.

> 💡 The 3x QPS and microsecond-latency figures are benchmark-derived and explicitly caveated as workload-dependent, so ops teams eyeing node consolidation should validate against their own traffic pattern before resizing production cache clusters.

### [Storage Intelligence advisor: Know what changed in your storage estate and act on it](https://cloud.google.com/blog/products/storage-data-transfer/storage-intelligence-advisor-and-batch-operations-updates/)

_Google Cloud_

Google Cloud made Storage Intelligence advisor generally available on September 26, 2026, giving teams automatic anomaly detection across their Cloud Storage estate without building custom pipelines or dashboards. Using daily metadata and activity snapshots compared against project-specific baselines, it surfaces four types of findings within 24 hours: spikes in Class A/B operations against Coldline or Archive storage, spikes in 429 rate-limit errors, unusual cross-region egress, and consumption growth that breaks from long-term trends. Each finding points to the responsible bucket, prefix, and service account, and recommends concrete fixes such as bulk-transitioning objects to Standard storage, enabling Autoclass, or tightening access with Managed Folders. The accompanying Storage batch operations update lets a single job process up to 1,000 buckets per project, adds dry-run validation to preview impact before execution, and supports advanced CEL-based filtering by storage class, object size, or custom attributes. Google reports over 6,000 findings generated in the last 30 days across hundreds of customers, and says the number of customers analyzing datasets over 1 billion objects has more than doubled this year. Target subsidiary Shipt said it now spots usage spikes instantly through native dashboards instead of building custom pipelines, while Palo Alto Networks said batch operations turned object retention-lock management across billions of objects from a non-starter into an on-demand task. New users get a 30-day free trial of Storage Intelligence.

> 💡 Catching storage anomalies within 24 hours instead of on a monthly invoice should meaningfully cut cost-governance overhead and make large-scale cleanup operations far less labor-intensive for cloud teams.

### [Agents can now set up your website’s security with Turnstile Spin](https://blog.cloudflare.com/turnstile-spin/)

_Cloudflare_

Cloudflare has launched Turnstile Spin, a setup-automation tool for its Turnstile bot-protection widget aimed at fixing a common misconfiguration: sites that embed the frontend widget but never wire up backend Siteverify validation. Cloudflare monitors Siteverify calls per widget and shows a "Fix with Spin" banner on any widget that has no server-side validation. Spin runs through the user's preferred AI coding agent — Claude Code, Cursor, or Codex are named — and can be started from the Cloudflare dashboard, the Wrangler CLI, or by pasting a public skill URL into the agent. The agent analyzes the codebase, proposes an implementation plan, waits for approval, and then makes the changes inside the developer's own environment; Cloudflare states it does not receive the application code or modify it remotely. Spin covers three scenarios: a fresh Turnstile install, recovering a widget that's missing backend validation, and migrating from a legacy CAPTCHA to Turnstile. Turnstile itself processes about three billion verifications on a typical weekday, and in one recent week more than 23,000 accounts created new widgets, while Spin has driven more than 65,000 successful widget creations and over 30,000 generated prompt copies since its July release. Turnstile remains free for everyone.

> 💡 Having an AI coding agent complete the security wiring itself, rather than just the frontend widget, should close a configuration gap that has historically left many sites with bot protection in name only.

### [Red Hat Enterprise Linux 10 STIG automation now matches DISA STIG V1R2](https://www.redhat.com/en/blog/red-hat-enterprise-linux-10-stig-automation-now-matches-disa-stig-v1r2)

_Red Hat_

Red Hat says RHEL 10 now fully matches the DISA STIG V1R2 baseline, published in March 2026, through the release of `scap-security-guide` version 0.1.82. STIG (Security Technical Implementation Guide) compliance is mandatory for information systems that connect to U.S. Department of Defense networks. Automation is available through multiple paths: the OpenSCAP (oscap) command-line tool, Red Hat Satellite, Red Hat Lightspeed (formerly Red Hat Insights), and an official RHEL 10 STIG Ansible Galaxy role. It also integrates with Kickstart installations, RHEL image builder, and RHEL image mode, so STIG alignment can be applied at deployment time rather than only after installation. Administrators select either the `stig` or `stig_gui` profile in these tools to scan and remediate systems. Red Hat is explicit that automation only covers the technical configuration requirements — administrators and security officers still need to review findings in their own operational context to achieve full compliance certification. The announcement was published on September 25, 2026.

> 💡 Automating STIG alignment at install time via Kickstart and image builder should shorten compliance timelines for defense and federal customers, but teams should not mistake it for full automated certification, since human contextual review is still required.

### [How to manage aircraft leases with AI agents](https://www.redhat.com/en/blog/how-manage-aircraft-leases-ai-agents)

_Red Hat_

Red Hat's featured AI quickstart, "NeIO LeasingOps," was built by Codvo.ai to automate aircraft lease contract analysis that previously took specialists several days. Aircraft leases run hundreds of pages and contain variable payment schedules, maintenance reserve calculations tied to flight hours and cycles, and obligations spread across lessors, lessees, and MRO (maintenance, repair, and overhaul) providers, making manual review slow. The system runs on Red Hat OpenShift AI as a 10-agent pipeline: contract intake, term extraction, obligation mapping, utilization reconciliation, reserve calculation, variance detection, return-readiness analysis, evidence-pack assembly, decision support, and a human-in-the-loop escalation stage. Model serving runs on vLLM using IBM Granite 3.3 2B, an Apache 2.0-licensed model that requires no Hugging Face token, with LlamaStack and LangGraph handling agent orchestration. Document parsing is handled by Docling with a PyMuPDF fallback, while a FastAPI backend, a Next.js 15 frontend, PostgreSQL, and Redis manage storage and job queues, all deployed via Helm charts. Red Hat says the pipeline cuts analysis tasks that used to take days down to minutes on a GPU, while still producing audit-ready documentation traceable back to the source contract clauses. A deployment guide is available under Red Hat's AI quickstarts on docs.redhat.com, along with a GitHub repository.

> 💡 Compressing multi-day contract review into minutes while still preserving clause-level audit trails suggests that in regulated industries, the real adoption argument for AI agents is verifiability, not just speed.

### [Friday Five — September 25, 2026 | Red Hat](https://www.redhat.com/en/blog/friday-five-september-25-2026-red-hat)

_Red Hat_

Red Hat's "Friday Five" for September 25, 2026 rounds up five posts under the theme of layered security defense running from the OS foundation up through autonomous AI agents. The first item introduces an enterprise security blueprint that builds defense in layers, from the operating-system foundation to autonomous AI agents. The second covers Lightwell, an initiative Red Hat and IBM launched together to help enterprises scale AI-assisted vulnerability patching across open source software, acting as a clearinghouse that also addresses older, unpatched vulnerabilities. The third explains how AI inference actually works, focusing on key-value cache concepts and optimization strategies for efficient deployment. The fourth cites a projection that AI infrastructure spending will reach $1.5 trillion in 2026 and argues telecom operators are well positioned to host and route AI workloads, a "telco tokenomics" opportunity. The fifth covers a Kubernetes Edge AI Appliance built with Supermicro, Red Hat, and Portworx by Everpure, aimed at closing the edge AI capability gap by enabling remote inference without on-site IT staff. All five items are tied together under the theme of enterprise resilience in the age of AI.

> 💡 Bundling vulnerability patching, inference optimization, edge deployment, and telecom infrastructure into one roundup shows Red Hat framing AI security and infrastructure as a single agenda spanning the entire stack.

---

## DevOps & Infrastructure

### [Performance engineering from kernel analysis to AI: Adrian Cockcroft’s take](https://thenewstack.io/cockcroft-performance-engineering-ai/)

_The New Stack_

In a ScyllaDB-sponsored interview on The New Stack, RedMonk analyst Rachel Stephens spoke with Adrian Cockcroft about how AI has changed performance engineering. Cockcroft spent decades doing performance work at Sun Microsystems, Netflix, eBay, and Amazon, from kernel-level analysis to large-scale system optimization. At Sun, he read the kernel source code to understand what tools like vmstat actually meant, work that later became his books Sun Performance and Tuning and Resource Management. He now uses LLMs such as ChatGPT to vibe code custom analysis tools in minutes, saying the code would otherwise never have existed given the time it used to take. He built an open-source R tool that tracks multiple peaks in a response-time distribution instead of collapsing everything into a single percentile like P99, showing that a shifting cache hit rate alone can make averages and P99 swing wildly. The piece notes that the free, virtual P99 CONF 2026 runs October 21 to 22. His advice for teams running high-performance systems is to start with a macro view and then dig progressively deeper, like adjusting a microscope from 10x to 100x to 1000x.

> 💡 With LLMs now making custom analysis tooling nearly free to build, observability teams should shift from single-number SLIs like P99 toward inspecting full response-time distributions to avoid being misled by shifting cache hit rates or multimodal latency.

### [The rise of agentic AI on Kubernetes: unleashing the new infrastructure layer](https://thenewstack.io/agentic-ai-kubernetes-management/)

_The New Stack_

This SUSE-sponsored piece on The New Stack argues that growing AI workloads are reshaping how teams manage Kubernetes across multiple clusters. Citing a Forrester report, it says today's AI computing stack now stretches from the models themselves down into the infrastructure layer beneath them. Unlike traditional automation that reruns the same script regardless of conditions, agentic AI observes cluster state and operational data, proposes a diagnosis or next step, and then acts within an approved scope, usually after a human signs off. As the number of clusters grows, the piece warns of configuration drift, where settings and policies fall out of sync across teams, and eroding visibility when signals are scattered across data centers, clouds, and edge sites. It notes that Kubernetes expertise is unevenly distributed inside organizations and that logs, metrics, policies, and runbooks often live in separate tools, so even a well-trained AI model cannot know a cluster's specific state without that context. The piece concludes that the real value of agentic AI on Kubernetes depends on drawing clear lines around what an agent can observe, recommend, and change.

> 💡 As cluster counts grow, platform teams need to define agent observe, recommend, and act boundaries up front, or the automation gains from agentic Kubernetes management risk being outweighed by drift and misconfiguration risk.

### [Avoiding vendor lock-in through an open-source approach: a developer’s perspective](https://thenewstack.io/avoiding-vendor-lock-in/)

_The New Stack_

In this SUSE-sponsored column on The New Stack, Andreas Prins argues that vendor lock-in usually starts quietly as a reasonable choice made under time or budget pressure. The real risk isn't depending on vendors at all, he writes, but the buildup of dependencies across APIs, contracts, roadmaps, data models, managed services, IAM, and observability pipelines that become too costly or impractical to unwind. He stresses that the dependencies nobody examined closely are the ones that quietly block a business from changing course later. His proposed fix is to evaluate a platform's reversibility before committing to it, essentially asking how hard it would be to change your mind later. As an example, he points to the Linux kernel, where no copyright assignment is required, so ownership of merged code stays with thousands of individual contributors, making unilateral relicensing effectively impractical. Kubernetes has a different legal structure but similar practical protection, he adds, since it is licensed under Apache 2.0 and governed by the Cloud Native Computing Foundation. He cautions that open source is no guarantee against lock-in, since teams can still build tightly coupled systems on top of open foundations.

> 💡 Assessing a platform's reversibility before adoption, rather than after a compliance shift or business change forces the issue, is what actually keeps future migration costs and downtime risk manageable.

### [GitHub Copilot app for Beginners: How to build custom workflows with canvases](https://github.blog/ai-and-ml/github-copilot/github-copilot-app-for-beginners-how-to-build-custom-workflows-with-canvases/)

_GitHub_

GitHub published a post by Kayla Cinnamon, Senior AI Developer Tools Advocate, on September 25 introducing the canvas feature in the Copilot app. Using the /create-canvas command, users describe a workflow in plain English and the agent builds a live interactive surface such as a kanban board, an issue triage board, a release checklist, a dashboard, a form, or a spreadsheet. The key point is that the resulting canvas is bidirectional: both the user and the agent can update shared state through buttons, cards, and filters at the same time. The post includes a sample prompt asking for a release notes canvas to track newly completed feature work. It lists release notes tracking, issue triage, pull request review management, daily checklists, and team release planning as concrete workflow examples. It also points to the Awesome Copilot community extensions repository where custom canvases can be shared and discovered. The article sums up the feature's value as enabling instant collaboration, not command and wait.

> 💡 Copilot canvases turn an agent's output into a shared, live surface the whole team can manipulate in real time rather than a one-off commit, cutting the cost of hand-building internal tooling UI for recurring ops workflows like issue triage or release checklists.

### [Trading a Cloud Identity for Your Own: Workload Attestation on Managed Compute](https://netflixtechblog.com/trading-a-cloud-identity-for-your-own-workload-attestation-on-managed-compute-516d5a29b252?source=rss----2615bd06b42e---4)

_Netflix_

Netflix Technology Blog published a post by Dhruv Pratap describing how it grants an internal identity to Apache Spark workloads running on Amazon EMR. Managed compute only hands a process an AWS execution role, so the workload must separately prove itself through attestation to obtain a short-lived X.509 certificate and mutual TLS access under Metatron, Netflix's private internal PKI. Each Data Project, the company's unit of data ownership, maps one-to-one to a dedicated IAM role, and because tens of thousands of Data Projects are expected, those roles are deterministically sharded across a small pool of dedicated AWS accounts since a single account cannot hold that many. Five components take part: the control plane, the Data Project service, the Identity service, a Spark 3.0+ plugin, and AWS STS acting as a notary. The control plane signs a workload metadata claim and passes it through job configuration, while the driver-side plugin uses the execution role's credentials to sign a request, producing a short-lived pre-signed URL as proof of possession. The Identity service corroborates both signals, fetching the pre-signed URL from AWS STS and checking that role against the control plane's signed claim, and only issues a certificate when the two statements agree. Pratap notes the same pattern underlies AWS IAM authentication in HashiCorp Vault and AWS's own function attestation flows, and generalizes to any environment that hands a process cloud credentials and nothing else.

> 💡 The core lesson for teams on managed compute is that a cloud-issued role alone cannot be trusted as an internal identity, and cross-corroborating a signed control-plane claim against the cloud provider's own STS response is a portable pattern for any managed batch service, not just Spark on EMR.

### [Improving site performance by shipping more CSS](https://github.blog/engineering/architecture-optimization/improving-site-performance-by-shipping-more-css/)

_GitHub_

GitHub says it has fully migrated github.com away from CSS-in-JS, replacing styled-components with CSS Modules. CSS-in-JS required styles to be initialized on the client, which hurt server-side rendering performance, while CSS Modules compile styles into static stylesheets shipped as part of the page HTML, removing that runtime cost. The Primer design system completed its move to CSS Modules in December 2024, cutting server-side rendering time by 55% and component initialization time by 25%. A GitHub-wide migration of the `sx` prop ran from April 2025 to May 2026, removing a peak of roughly 7,760 `sx` props and with a rotation of eight engineers migrating 6,419 props over six months and seeing SSR gains of 1% up to 22% on some pages. In an accelerated cleanup phase from April to June 2026, two engineers used GitHub Copilot coding agents to eliminate the remaining 895 `sx` props in three weeks. Because GitHub supports seven themes, each with a high-contrast variant, the team relied on feature flags, visual regression testing, and a transitional library called `@primer/styled-react` to roll the change out gradually without breaking production. As of June 2026, GitHub runs entirely on CSS Modules and has removed its styled-components dependency altogether.

> 💡 Beyond the SSR cost savings, this migration is a concrete data point that AI coding agents can now absorb thousands of mechanical refactoring changes that would otherwise consume weeks of engineering time.

### [Extend Datadog RUM and Product Analytics to Shopify and Salesforce](https://www.datadoghq.com/blog/rum-product-analytics-shopify-salesforce/)

_Datadog_

Datadog has extended Real User Monitoring (RUM) and Product Analytics to Shopify and Salesforce Experience Cloud, two platforms where engineering teams typically have limited frontend control. On Shopify, teams add the Datadog Browser SDK via a Liquid snippet in their theme for storefront coverage, and use a Datadog custom pixel under Settings > Customer events to cover the checkout flow after the deprecation of checkout.liquid. That pixel shares the same cookie as the storefront pages, so a shopper's session continues seamlessly into checkout, enabling full funnel tracking from `checkout_started` to `checkout_completed` and capturing pageviews, clicks, and UI extension errors as RUM views, actions, and errors. It also supports segmenting users by checkout completion or abandonment, breaking down funnels by device, geography, or referrer, and correlating feature-flag exposure with checkout completion — though Core Web Vitals and Session Replay remain available only on the storefront, where the full SDK runs. On Salesforce, a Salesforce-specific bundle works around Lightning Web Security (LWS) sandbox restrictions by being uploaded as a static resource and loaded via `loadScript` from Lightning Web Components. This captures distinct view names from Salesforce navigation even when raw URLs are identical, console and custom errors within Lightning's isolation boundaries, and clicks or custom actions including frustration signals — though LWS reduces runtime-error detail and unhandled promise rejections aren't captured. Both integrations are documented as production features with no preview status mentioned.

> 💡 Extending RUM visibility onto third-party platforms like checkout, where teams can't embed their own full code, closes an observability blind spot for tracking exactly where conversion funnels break down.

---

_This digest was collected from RSS feeds and summarized by AI (Claude). See the original links for full details._
