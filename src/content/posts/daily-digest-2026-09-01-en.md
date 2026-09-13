---
title: "📰 Daily Tech Digest - 2026-09-01"
description: "21 curated updates from the Cloud, Kubernetes, AI & DevOps world for 2026-09-01."
pubDate: 2026-09-01
tags: ["Daily Digest", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 Top Story

### BigQuery Graph is now GA: the knowledge foundation for the agentic era

Google Cloud announced general availability of BigQuery Graph. Its centerpiece, Borderless Graph Lakehouse, joins BigQuery tables with Iceberg tables from external catalogs such as Databricks Unity Catalog, AWS Glue, and Snowflake into a virtual knowledge graph spanning multiple clouds without moving any data. The GQL query language now runs twice as fast as in preview, with undirected traversal 100 times faster, and adds CALL statement support plus expanded subquery support. The agentic side includes conversational analytics that auto-generates GQL and SQL from natural language with a Gemini Enterprise MCP server connection, Data Agent Kit extensions usable from Antigravity, VS Code, Claude Code, and Codex, and a context graph in BigQuery Agent Analytics that stores every agent action as an auditable graph. Thales Cybersecurity's Pete Rubio said the platform enables sub-second multi-hop threat detection, Yahoo's Mikul Bhatt said it gives connected context across ad campaigns, audiences, impressions, and outcomes, and Workerbee's Heiko Roth said it underlies thousands of workforce decisions.

> 💡 **Why it matters**: Being able to fold Iceberg tables from external catalogs into the graph without moving data means multi-hop queries like fraud detection or supply-chain dependency mapping in a multicloud environment no longer require a separate ETL pipeline just to get the data in one place.

🔗 [Read more](https://cloud.google.com/blog/products/data-analytics/bigquery-graph-connecting-data-and-ai-at-scale/) · _Google Cloud_

---

## Kubernetes & Cloud Native

### [Kubernetes v1.37: Storage Version Migration Enabled by Default](https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/)

_Kubernetes_

Storage Version Migration, or SVM, reached General Availability in Kubernetes 1.37, stabilizing the storagemigration.k8s.io/v1 API and enabling the control plane controller by default in every 1.37 cluster. SVM rewrites resources stored under an older API version to the current storage version before that old version can be safely dropped from .status.storedVersions, and it performs the same rewrite when encryption-at-rest configuration changes or keys rotate, so existing resources get re-encrypted under the new key. Previously this required hand-written kubectl get and replace scripts or the out-of-tree kube-storage-version-migrator tool, but now the rewrite is triggered automatically through the Kubernetes API server. This is described as a significant operational improvement spanning both CRD lifecycle management and cluster security operations. The SVM controller inspects resources one by one and leaves any already on the current storage version untouched.

> 💡 Because SVM now automatically rewrites existing resources on key rotation or API version deprecation, cluster operators can design key-rotation policy around SVM handling it automatically, eliminating the maintenance burden of hand-rolled migration scripts.

### [Secure by default is your only way forward](https://www.docker.com/blog/secure-by-default-is-your-only-way-forward/)

_Docker_

Docker bundled several products around the message that security must be the default, not an option, in the age of AI agents. It cited public base images that pack in hundreds of unused packages and scanners generating about 400 false-positive alerts a week, and said Docker Hardened Images, or DHI, compatible with Alpine and Debian and adoptable by changing just the FROM line in a Dockerfile, cut attack surface by up to 95%, ship CVE fixes within 7 days of an upstream fix, and come with a signed SBOM, build provenance, and up to 5 years of extended lifecycle support. Docker Sandboxes run agents disposably in microVMs with OS-level host isolation and proxied credentials, described as YOLO mode with guardrails, while the MCP Catalog and Toolkit offer hardened MCP servers and the MCP Enterprise Gateway authenticates, authorizes, and logs every tool call. The announcement arrives ahead of Docker CISO Mark Lechner's One boundary for the agentic era talk at the WeAreDevelopers World Congress in San Jose, September 23 to 25. Docker frames these products as one continuous security boundary running from the foundation layer through isolation to control.

> 💡 Because an AI agent treats whatever it discovers as trustworthy by default, existing image-scanning and permission models alone fall short, so pairing hardened base images with agent execution sandboxing on the same platform is what actually narrows the incident blast radius.

### [OpenTelemetry has graduated… now what?](https://www.cncf.io/blog/2026/08/31/opentelemetry-has-graduated-now-what-2/)

_CNCF_

A CNCF blog post covered where OpenTelemetry stands and what comes next after graduating in May 2026 alongside Kubernetes and Prometheus. The project now counts more than 12,000 contributions, more than 2,800 companies, and hundreds of maintainers, runs the second-fastest development velocity in CNCF behind Kubernetes, and has been adopted in production by a range of organizations including GitHub and Farfetch. Its graduation criteria included a documented governance model, an active community with a fast review process, a completed independent security audit, a stable and backward-compatible API, and comprehensive documentation. Looking ahead, the post names generative AI semantic conventions for observing agent workflows and expanded browser and mobile observability as emerging areas, and introduces extensibility tools such as Weaver for defining and governing telemetry schemas, OpenTelemetry Packaging for installable modules, and the OpenTelemetry Injector for zero-code instrumentation. Graduated status vouches for the project's current stability, but what comes next hinges on how it absorbs the new observability demands of the agent era.

> 💡 Graduated status itself is a stability guarantee, but since the project's next focus is semantic conventions for agent workflows, teams running agent pipelines should start folding OpenTelemetry's emerging generative AI instrumentation conventions into their observability design now to avoid re-instrumenting later.

### [Defending the battlefield: Stateful detections for an agentic threat landscape](https://webflow.sysdig.com/blog/defending-the-battlefield-stateful-detections-for-an-agentic-threat-landscape)

_Sysdig_

Sysdig introduced stateful detection as an extension to Falco. Traditional detection engines evaluate individual events in a vacuum, so a single event like a terminal shell opening inside a container lacks the context to tell a developer's routine debugging from a malicious action, while stateful detection instead correlates a sequence, a shell opening followed by a binary download followed by execution, to make that call. Falco gained an Observations component to define these stateful evaluations, obs_link_fields to define relationships between events such as sharing the same process ID, and obs.occurs and obs.link for rules to use those observations. The approach cuts false positives by distinguishing a legitimate single action from a malicious multi-step attack and speeds investigation by delivering alerts that already include correlation context, and Sysdig says 70% of the organizations it surveyed already use stateful detection. Sysdig stresses that this kind of correlated detection becomes more valuable the faster agents themselves are able to act.

> 💡 Evaluating a single event in isolation tends to either flag routine debugging as a false positive or miss that several steps belong to one multi-stage attack, so moving runtime security rules to a stateful model that links events by a shared key like process ID improves both investigation speed and false-positive rate at once.

---

## AI & ML

### [TimesFM-3: A zero-shot foundation model for multivariate forecasting](https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/)

_Google Research_

Google Research published the technical details behind TimesFM-3, a zero-shot foundation model for multivariate forecasting. It is a 330-million-parameter decoder-only transformer that chops each series into patches of 32 time steps and alternates causal temporal attention, which looks backward across time within one series, with full variate attention, which looks across series at a given moment to learn cross-series correlations. Pre-trained on a corpus of more than a trillion real-world and synthetic time points, it uses a non-autoregressive decode built on Contiguous Patch Masking to fill the entire forecasting horizon in a single forward pass. It natively supports forecasting multiple targets at once, along with historical covariates and future-known dynamic covariates, and produces nine quantile predictions per target to quantify uncertainty. On the GIFT-Eval, FEV-Bench, and TIME leaderboard benchmarks, it outperformed competing models including Chronos-2 and Toto 2.0 on both point and probabilistic forecasting metrics, and Google said it matched or beat competitors even when run in univariate-only mode.

> 💡 Being able to forecast multiple targets and covariates in one model at once means teams that have been running a separate forecasting pipeline per time series now have room to consolidate onto a single model-serving endpoint.

### [Polimill builds Japan's next-generation public AI infrastructure](https://openai.com/index/polimill)

_OpenAI_

OpenAI profiled Polimill, the company behind QommonsAI, a public-sector AI platform used across Japan. Polimill began with Surfvote, a citizen civic-participation platform, then identified that government workflows themselves needed to become more efficient first, and released QommonsAI in October 2024; it is now used by about 1,050 municipalities and roughly 550,000 public employees across Japan for assembly responses, public services, social welfare, and legal search. QommonsAI standardizes assembly minutes and administrative documents that differ by municipality, adding metadata with AI to build a high-precision search foundation spanning regions and time periods, and CAIO Masahiro Wakabayashi said GPT models' broad capability and the familiarity of the ChatGPT name lower the adoption barrier for public employees. Adopting Codex across the entire development workflow, from requirements definition through consistency checks against existing GitHub code to implementation and testing, raised development speed to 3 to 5 times the prior rate, and while less experienced employees using AI alongside accumulated administrative knowledge can now draft policy proposals approaching veteran quality, veteran officials' proposals still receive the highest ratings, a gap Polimill attributes to undocumented tacit knowledge. Wakabayashi sees a risk that this knowledge disappears again each time a staff member changes unless it gets documented.

> 💡 Standardizing document formats and naming conventions that differ by municipality into one searchable foundation was the actual precondition for adoption spreading, which means for public-sector AI the bigger bottleneck to solve first is fragmented data, not model capability.

### [A milestone in expanding access to AI](https://openai.com/index/expanding-access-to-ai-with-chatgpt-ads)

_OpenAI_

OpenAI said ChatGPT Ads reached a 1 billion dollar annualized revenue run rate in less than 200 days after launch, with tens of thousands of advertisers already using it, and that starting today self-service purchasing through Ads Manager is launching across India, Europe, the Middle East, and North Africa. ChatGPT now has more than 1 billion weekly active users, and its ad system uses the context of the current conversation, plus broader ChatGPT usage context where the country and user settings allow it. OpenAI stressed that ads remain clearly labeled and separate from ChatGPT's answers, never influence the answers themselves, and that advertisers never get access to users' private conversations. Since Ads Manager launched in May, small and medium businesses have grown into a material share of advertisers, the ecosystem now includes more than 50 technology and measurement partners, CPC and outcome-optimized bidding make up the majority of campaigns, and OpenAI cited an ecommerce advertiser achieving a 3x return on ad spend over 28 days and a technology partner reporting more than 80% of ad-driven traffic coming from new customers. OpenAI said the measures it tracks for trust, relevance, and overall experience have remained strong throughout the global rollout.

> 💡 Designing ads to draw on both the current conversation and broader usage context raises conversion at the cost of resting user trust entirely on the single principle that ads never influence answers, so any breach of that boundary risks undermining the whole advertising revenue model's credibility.

---

## Cloud Updates

### [Cloud CISO Perspectives: Tips on securing the water sector in the AI era](https://cloud.google.com/blog/products/identity-security/cloud-ciso-perspectives-tips-on-securing-water-sector-ai-era/)

_Google Cloud_

In Google Cloud's Cloud CISO Perspectives, Mandiant's Chris Sistrunk and Google Cloud's Stephanie Kiel covered threat actors targeting internet-connected PLCs at US water facilities amid geopolitical conflict. Their six recommendations are asset inventory and exposure assessment for internet-facing control systems, basic security hygiene such as replacing default credentials with strong passwords, a 3-2-1 backup rule with three copies, two storage types, and one offsite copy, network segmentation with multi-factor authentication, emergency planning integrated with existing FEMA NIMS and ICS4ICS frameworks, and monitoring remote access by system integrators and maintenance contractors. Mandiant's OT Theory of 99 finds that 99% of compromised systems, 99% of malware, 99% of forensic work, 99% of detection opportunities, and 99% of intrusion dwell time all occur on ordinary computer workstations and servers rather than OT-specific equipment, and the piece stresses that while manual overrides and water-quality testing act as a safety net, basic security hygiene remains essential. It also cites a figure that 79% of tech leaders name security, governance, and operations as the biggest challenge in scaling AI infrastructure, and notes that the Office of the National Cyber Director and the state of Texas have launched a pilot program. The post adds that as AI adoption grows, defenders need to lean on AI-assisted detection as well to keep pace.

> 💡 Even in an OT environment like water infrastructure that has physical safety nets such as manual overrides and water-quality testing, 99% of actual compromise happens on ordinary IT workstations and servers rather than OT-specific equipment, so basic IT hygiene reduces more risk than pouring the defense budget into OT-specific security alone.

### [From weeks to minutes: The new agentic era of data pipelines](https://cloud.google.com/blog/products/data-analytics/build-data-pipelines-in-less-time-with-data-agent-kit/)

_Google Cloud_

Google Cloud introduced Data Agent Kit, an open-source data engineering toolkit that plugs directly into an IDE or CLI, saying it turns the work of writing complex Python Airflow boilerplate into generating YAML from a natural-language prompt, cutting pipeline construction from weeks to minutes. Its three core features are a Data Engineering Tab for comprehensive pipeline management, an Agentic Skill that writes, deploys, and troubleshoots Apache Airflow DAGs from natural language, and an Orchestration Pipelines Framework that defines high-level logic through a YAML DSL. It supports running BigQuery queries, the serverless Managed Service for Apache Spark, dbt models, and Gemini Enterprise Agent Platform model management, plus conditional pipeline triggers and drift-detection-based automatic retraining, with real-time monitoring and AI-assisted troubleshooting available right inside IDEs such as VS Code and Claude Code. In a sample MLOps scenario, the kit assembled training, inference, and evaluation pipelines in under two minutes, and the tool itself is fully free and open source. Google Cloud said the toolkit was designed so every data role, from analysts to ML engineers, shares the same tool.

> 💡 Turning pipeline authoring into a natural-language prompt mainly cuts boilerplate-writing time, not the need to understand the orchestration logic the resulting Airflow DAG or YAML DSL actually expresses, so data engineers should treat the tool as shifting their role toward review and validation rather than replacing code authoring outright.

### [Introducing Adaptive Intelligence: Undermining the economics of every bot attack](https://blog.cloudflare.com/introducing-adaptive-intelligence/)

_Cloudflare_

Cloudflare introduced Adaptive Intelligence, a new bot-detection engine built on the premise of making automated attacks economically unsustainable. Legacy static, deterministic detection rules only updated on a months-long cycle, letting attackers learn the patterns and refine bypasses against clear yes-or-no feedback, while this engine uses a machine-learning model that continuously retrains on live traffic and makes non-deterministic judgments that resist that kind of learning. It runs a four-step loop: observe signals such as JA4 TLS fingerprints, request structure, session behavior, and network reputation; train continuously on live traffic; deploy new model weights automatically; and validate changes in shadow mode before they affect real users. Cloudflare said it analyzes more than a trillion requests a day to keep the model current, and that it can recognize a new evasion tool the same week it emerges, backed by disposable rules that expire automatically after their predicted useful lifespan. The design aims to ensure that even when an attacker finds a bypass, its effectiveness does not last long.

> 💡 Static rule-based detection hands attackers a clear pass-fail signal that helps them learn the pattern, while a continuously retrained, non-deterministic model removes that signal entirely, so any organization handling large-scale traffic needs bot detection delivered as a constantly retraining service rather than a static ruleset to keep pace with evasion.

---

## DevOps & Infrastructure

### [SpaceX is in an “enviable position”: why Anthropic is sticking with Cursor as OpenAI cuts access](https://thenewstack.io/anthropic-spacex-cursor-compute-openai/)

_The New Stack_

Right after OpenAI announced it would cut off model access to Cursor in November, Anthropic co-founder and self-described chief compute officer Tom Brown posted on X on August 29 that Cursor has been a trusted partner since Sonnet 3.5 and that Anthropic will keep increasing compute to support Claude in Cursor. The article contrasts this with Anthropic's own history: when reports surfaced in May 2025 that OpenAI was in talks to buy Windsurf for 3 billion dollars, Anthropic cut Windsurf's access to Claude 3.5 and 3.7 Sonnet before the deal even closed, the deal then fell through and Google instead paid 2.4 billion dollars to hire Windsurf's founders into DeepMind, and xAI similarly lost Claude access through Cursor back in January this year. The key difference this time is that Anthropic buys enormous amounts of compute from SpaceX, having announced on May 6 that it secured the entire output of SpaceX's Colossus 1 data center near Memphis, more than 300 megawatts and over 220,000 Nvidia GPUs, with SpaceX's IPO filing showing Anthropic agreed to pay 1.25 billion dollars a month for roughly 325,000 GPUs combined across Colossus and Colossus II through May 2029. Replit founder Amjad Masad and Pragmatic Engineer author Gergely Orosz both called out the apparent double standard, noting Anthropic cut Windsurf on rumor alone but is staying with Cursor even after an actual rival's acquisition. The article notes that Anthropic had not publicly addressed the apparent double standard as of this reporting.

> 💡 Whether an AI lab cuts off a rival-linked customer's model access may hinge less on a stated principle than on how much compute that customer supplies the lab, so assessing platform lock-in risk means watching a vendor's compute-sourcing relationships alongside its stated competitive policy.

### [MCP was supposed to solve the agent tooling problem. It missed a step.](https://thenewstack.io/ard-agent-discovery-specification/)

_The New Stack_

This article covers ARD, or Agentic Resource Discovery, an open specification AWS described as "DNS, but for agents" in its August 31 Weekly Roundup. The Model Context Protocol has become a common way for AI applications to connect to external tools and data, but it assumes the client already knows which server it wants to use, which becomes a problem once an organization's resources are spread across clouds, SaaS platforms, and internal systems. ARD uses the term agentic resource to cover anything an AI client can connect to, from an MCP server to other external capabilities, and lets an agent search across registries instead of having every connection configured in advance. The specification was authored by Junjie Bu of Google, R.V. Guha of Microsoft, and Shaun Smith of Hugging Face, released under the Apache 2.0 license, with engineers from Cisco, Databricks, GitHub, GoDaddy, Nvidia, Salesforce, ServiceNow, and Snowflake contributing, while AWS's own role has been limited to feedback. The current v0.91 proposal, dated August 26, uses JSON-LD and a REST interface with a required POST /search endpoint for task-based search, and while AWS engineers Jeffrey Damick and Bhargav Talluri, who both work on Route 53, drove the DNS comparison, the article notes it falls short because a domain name points to one location while an ARD search can return several equally capable options.

> 💡 Because ARD is a vendor-neutral federation of registries addressing the discovery step MCP left out, organizations running hundreds of internal MCP servers should weigh adopting this emerging standard rather than building their own ad hoc discovery layer to solve the same problem.

### [Google’s new forecasting model beats everyone. You can’t use it at work (yet).](https://thenewstack.io/google-timesfm-3-multivariate-forecasting/)

_The New Stack_

Google launched TimesFM-3, a 330-million-parameter time-series forecasting model, on Monday. Pre-trained on more than a trillion real-world and synthetic data points and released on Hugging Face under a non-commercial license, it was built, according to Google researchers Ayush Jain and Rajat Sen, because most real-world forecasting problems are inherently multivariate, with multiple time series and external features jointly shaping the outcome. Architecturally it is a decoder-only transformer that chops each series into patches of 32 data points and alternates between attention that looks backward across time within one series and attention that looks sideways across all series at a given moment, and it replaces the prior one-patch-at-a-time generation with masked placeholder tokens across the entire forecast horizon filled in a single forward pass. On Salesforce's Gift-Eval, Amazon and AutoGluon's FEV-Bench, and the Time leaderboard, it outperformed Chronos-2, Moirai 2.0, and Datadog's Toto 2.0, while TimesFM-2.5, state of the art when it launched in September 2025, now sits at the bottom of the same benchmarks. TimesFM-2.5, Toto 2.0, and Chronos-2 remain under Apache 2.0, but TimesFM-3's pretrained weights ship under a separate license restricted to non-commercial, non-production use even though its source code stays Apache-licensed, and Google plans to soon replace TimesFM-2.5 with this model behind its data warehouse's AI.FORECAST command.

> 💡 As more labs open-source a new model's code while gating the pretrained weights behind a non-commercial license, cloud engineers will increasingly find the benchmark-leading model unusable in production without routing through the vendor's own managed service instead.

### [Testing cookie behavior across hundreds of web surfaces with our in-house auditor](https://dropbox.tech/security/how-our-inhouse-auditor-tests-cookie-behavior-across-hundreds-of-web-surfaces)

_Dropbox_

Dropbox described an in-house auditor it built to verify that its cookie banners keep working as intended. Using Playwright browser automation to open a fresh isolated session, the tool replays three scenarios, a US visitor, an EU visitor, and a visitor sending a Global Privacy Control signal, recording which cookies load, then rejecting non-essential cookies and refreshing the page to confirm the choice persists. The audit covers more than 200 web surfaces Dropbox operates, in 22 languages, producing weekly reports, and the team also built a companion tool called the URL detector that analyzes billions of traffic records to automatically keep the list of audited pages current. Without this automation, manually checking hundreds of pages across languages would have made the audit cycle far slower. Audit results are compiled into the weekly report so the owning team can track regressions quickly.

> 💡 A code deploy can silently break cookie-banner behavior without anyone noticing, so an organization running hundreds of web surfaces needs a recurring browser-automation regression test across visitor scenarios, not manual spot checks, as its real compliance safety net.

### [Fin's CTO on Building Great Engineering Organizations in the AI Era](https://www.honeycomb.io/blog/fin-cto-building-great-engineering-organizations-ai-era)

_Honeycomb_

Honeycomb's blog carried an interview with Darragh Curran, CTO of Fin, formerly Intercom. Curran said he had publicly committed to doubling R&D productivity but ended up achieving nearly three times the prior level instead. The core change is AI-driven PR review, where agents trace execution paths rather than just reading a diff to understand a change's real impact, with a large share of changes shipping without a human reviewer while a safeguard still lets a human request review at any time. He framed the organization's core function as a simple loop, do work, learn, do the next thing, and described observability, continuously tracking speed, cost, and errors, as the trust mechanism underpinning that loop on the premise that quality dropping below a bar costs user trust. Curran said leaders need to take an even more hands-on role precisely during this kind of transition.

> 💡 Trusting AI review enough to ship without a human in the loop requires the reviewer to trace execution paths, not just read a diff, so an organization running diff-only AI review needs to widen what its review agent observes before targeting a productivity multiplier like 3x.

### [Optimize EKS operations with agents: Reduce MTTR with AWS DevOps Agent and a Kubernetes Operator](https://aws.amazon.com/blogs/devops/optimize-eks-operations-with-agents-reduce-mttr-with-aws-devops-agent-and-a-kubernetes-operator/)

_AWS DevOps_

AWS introduced the AWS DevOps Agent and a Kubernetes Operator that automate incident investigation for failures like OOMKilled or IP exhaustion on EKS to cut MTTR. Existing tools fell short: K8sGPT only analyzes current resource state, and Amazon Bedrock Agents requires manually wiring up tool integrations, so neither delivered end-to-end automated investigation. The Operator detects a failure at millisecond granularity from a kubelet state change and preserves evidence to S3 and CloudWatch before the pod gets rescheduled, collects node-level data beyond kubectl's reach, such as dmesg and IPAMD output, via SSM, and codifies operational knowledge by failure type, checking dmesg and memory for OOMKilled or previous logs for CrashLoopBackOff. In a worked example, it traced an OOMKilled failure to a memory leak in a processed_records list with no eviction logic, growing about 20 megabytes per minute and exceeding a 200-megabyte limit in roughly 10 minutes, and deployment requires EC2 managed node groups, Fargate is not supported, across six regions, N. Virginia, Oregon, Frankfurt, Ireland, Sydney, and Tokyo, plus the AmazonSSMManagedInstanceCore IAM policy and the EKS Pod Identity Agent add-on.

> 💡 Because root-causing an incident depends on preserving node-level evidence like dmesg and IPAMD output, which kubectl cannot see, at millisecond granularity before a pod reschedules it away, EKS operators need to design their evidence-capture pipeline around the moment a pod state change is detected, not the moment the incident is declared.

### [How Bits Database Optimization proves a query rewrite is faster](https://www.datadoghq.com/blog/how-bits-database-optimization-proves-a-query-rewrite-is-faster/)

_Datadog_

Datadog described how its Database Monitoring feature, Bits Database Optimization, proves that a proposed query rewrite is actually faster. To avoid the risk of testing against production data, it builds a disposable database instance inside Datadog's own infrastructure that recreates the production schema from table definitions and index information the Datadog Agent has collected, then populates it with synthetic data matched to production's cardinality and per-column distributions. In that environment it runs both the original and rewritten query 50 times each, measuring server-reported execution time, logical reads, the number of blocks accessed from cache or storage, and dirtied blocks, the number of modified blocks that require persisting, and only recommends a rewrite if it shows more than a 20% improvement in at least three of four summary statistics, average, median, p95, and maximum, across all three measurements. Accuracy validation found the query planner's cost estimates tracked reality within 1.00 to 1.05 times at the median and 1.00 to 1.24 times at p95, while read fidelity against actual block access varied from 1.04 to 2.34 times at the median depending on query type, and the feature currently supports only PostgreSQL, with MySQL, SQL Server, and Oracle support planned. Datadog emphasizes that this approach quantifies confidence in a rewrite recommendation without ever requiring production credentials.

> 💡 Validating a proposed query rewrite first against a disposable instance reproduced with cardinality- and distribution-matched synthetic data, before touching production, lets a monitoring tool establish benchmark credibility without ever needing privileged production credentials.

### [Respond to security threats faster with Tines and Observability Pipelines](https://www.datadoghq.com/blog/tines-observability-pipelines-security-automation/)

_Datadog_

Datadog detailed how its Observability Pipelines product integrates with the security automation platform Tines. Security teams face noisy logs arriving in many formats, and manual steps that slow down response. Observability Pipelines standardizes and routes logs while Tines calls the pipeline API to change how logs are tagged or filtered in real time. In one example, an offboarding workflow in Tines deactivates an employee's Okta account while simultaneously tagging that user's logs with security:high and offboarded:true. In another, Tines checks a known scanner IP against the ServiceNow CMDB and updates a Reference Table so Observability Pipelines filters matching logs, and an analyst can type a suspicious user ID into a Tines page to apply a security:high tag to that user's logs in real time.

> 💡 Treating the log pipeline as something a security workflow can drive in real time over an API, rather than a static routing layer, removes manual tagging and filtering steps from repetitive tasks like offboarding and threat triage, cutting response time.

### [Troubleshoot and secure your code faster with Datadog’s Bitbucket Cloud Source Code integration](https://www.datadoghq.com/blog/bitbucket-cloud-source-code-integration/)

_Datadog_

Datadog launched a source code integration for Bitbucket Cloud. Connecting a repository lets Datadog analyze it with Static Code Analysis, Software Composition Analysis, Secret Scanning, and Infrastructure as Code Security, so developers see the same findings in both Datadog and Bitbucket and can jump straight to a fix. Code-aware APM ties application telemetry to a specific repository and commit, letting tools like Error Tracking and Continuous Profiler link stack frames directly to the underlying source. In pull requests, Code Coverage and Test Optimization surface test reach and failing or flaky tests, while Code Security flags new vulnerabilities and misconfigurations on the changed lines. Engineers can jump from a trace straight to the affected source file, and reviewers see test and security feedback without leaving Bitbucket.

> 💡 Anchoring both runtime traces and pull-request review to the same commit means root-causing an incident and reviewing security or test findings happen in one flow instead of switching tools, cutting both MTTR and review latency.

### [같은 장애를 두 번 겪지 않기 위해, 배포 전에 리뷰합니다 — KRIS 개발기](https://tech.kakao.com/posts/831)

_카카오_

Kakao introduced KRIS, short for Kakao Risk Inspection Service, an agent that screens deployments before they ship. The project started from a gap in its AI code review tool CodeBuddy, which kept improving response quality but never asked whether a change resembled a pattern that caused a past incident. Internal incident data showed human fault behind most outages, with roughly 40% traced to source code errors and about 20% to configuration value errors, suggesting recurring patterns could be turned into a searchable check run before deployment. KRIS pulls a diff through a Compare Provider against GitHub pull requests or the internal deployment system, retrieves relevant policy rules with Policy RAG and checks them with rule-specific judgment logic, then has an LLM reassess severity across three axes: environment, configuration, and infrastructure. Rule-violation checks run on deterministic code that always returns the same verdict for the same input, while only severity is left to the LLM's contextual judgment, preventing the grade from drifting day to day, and cases where analysis fails or access is insufficient are marked UNKNOWN rather than folded into LOW.

> 💡 Turning post-incident learnings into rules checked against the diff right before deployment, rather than leaving them in a retrospective document, catches organization-specific recurring mistakes that generic code review or security scanners are structurally unable to see.

---

_This digest was collected from RSS feeds and summarized by AI (Claude). See the original links for full details._
