---
title: "📰 Daily Tech Digest - 2026-08-01"
description: "22 curated updates from the Cloud, Kubernetes, AI & DevOps world for 2026-08-01."
pubDate: 2026-08-01
tags: ["Daily Digest", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 Top Story

### Forget humans “in” the loop. Harness engineering puts humans “on” the loop.

The New Stack covers harness engineering and the case for putting humans "on" the loop rather than "in" it. Thoughtworks distinguished engineer Kief Morris argues we need to pay more attention to the human on the loop to keep defining what good code and good systems are. Speaking to The New Stack at PlatformCon in London last month, he said that if you are using AI to build software you need to make sure you are building production-ready software, and that the default approaches people take right now do not include those engineering best practices. Even without giving agents free rein, he argues, you have to build that into your process and think about how to use agents safely — and that cannot wait, it is something to do now. At the speed of AI, organizations have to focus far less on speed to deploy and far more on the guardrails that ensure what they deploy is safe, secure and of high quality. The solution goes back to software delivery best practices accepted for more than a decade, but only if the CI/CD pipeline is production-ready. Morris worries that we have delegated so much code building to AI agents that we have become distant from the details of what they are building, losing track of whether the AI is building things well. That means, he says, getting better at defining good — something he does not think the industry has been good at.

> 💡 **Why it matters**: Building guardrails on the premise that "good" differs per team is the practical advice — before adopting agents, check whether your acceptance criteria are written down explicitly.

🔗 [Read more](https://thenewstack.io/ai-agents-harness-engineering/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [Docker OIDC connections for GitHub Actions available for Docker Orgs](https://www.docker.com/blog/docker-oidc-connections-for-github-actions-available-for-docker-orgs/)

_Docker_

Docker made OIDC connections for GitHub Actions available to Docker organizations, eliminating stored credentials in CI/CD pipelines by replacing long-lived PATs and OATs with short-lived, per-run tokens that expire in minutes and cannot be reused. Configuration takes three steps: create a connection with rulesets in Docker Home, update the workflow YAML with a `DOCKERHUB_OIDC_CONNECTIONID` environment variable and `id-token: write` permission, then verify and remove old credentials. Rulesets pin access by repository and branch using OIDC subject claims such as `repo:my-org/my-repo:ref:refs/heads/main`, with up to five rulesets per connection. It is available to Docker Team, Docker Business and Docker Hardened Images subscriptions, plus Docker Sponsored Open Source Program organizations. Workflows fill in the connection ID and org name using docker/login-action@v4.5.0 or later, and existing PATs and OATs keep working during migration. Scope is GitHub Actions only — local development and non-GitHub CI still use PATs and OATs.

> 💡 Registry credentials are among the CI secrets with the widest blast radius when leaked — for teams on GitHub Actions this is a high-priority migration.

### [Kubernetes v1.37 Sneak Peek](https://kubernetes.io/blog/2026/07/31/kubernetes-v1-37-sneak-peek/)

_Kubernetes_

Kubernetes published a v1.37 sneak peek on July 31, 2026, framed around features being deprecated, removed or replaced as the project matures ahead of the release. Deprecations include the `--filename`/`-f` flag on `kubectl run` (kubernetes/kubernetes#138671) and the ipvs mode in kube-proxy (KEP-5495), which will be disabled by default in v1.40 and removed in v1.43. On removals, static pods can no longer reference Secrets or ConfigMaps, and the `PreventStaticPodAPIReferences` feature gate is removed (kubernetes/kubernetes#140226). An ongoing change is the phase-out of cgroup v1 support: since v1.35 the kubelet fails on cgroup v1 unless the `failCgroupV1: false` override is applied. Referenced KEPs are KEP-3866 for the ipvs mode rationale and KEP-5495 for deprecating ipvs mode in kube-proxy.

> 💡 With kube-proxy ipvs mode scheduled for removal in v1.43, clusters still on ipvs should start planning the move to iptables or an eBPF-based alternative now.

### [Scaling Kubernetes pods with KEDA based on Amazon SQS queue depth](https://www.cncf.io/blog/2026/07/31/scaling-kubernetes-pods-with-keda-based-on-amazon-sqs-queue-depth/)

_CNCF_

A CNCF blog post shows how to scale Kubernetes pods with KEDA based on Amazon SQS queue depth, opening from the point that in event-driven Kubernetes architectures CPU and memory utilization often fail to reflect real system pressure. The setup is an Amazon EKS cluster with KEDA installed via Helm into a dedicated namespace, requiring AWS authentication through IRSA or Pod Identity plus an existing SQS queue and worker deployment. The KEDA components are a TriggerAuthentication for AWS pod identity, a ScaledObject linking the deployment to queue metrics, and the KEDA operator managing HPA updates. The SQS metric is the sum of `ApproximateNumberOfMessages` and `ApproximateNumberOfMessagesNotVisible`, determining outstanding work. Configuration values are queueLength 10 (messages per pod), activationQueueLength 1 as the scale-to-zero threshold, pollingInterval 10 seconds, cooldownPeriod 120 seconds, minReplicaCount 0 and maxReplicaCount 30. Desired replicas are the ceiling of outstanding messages divided by queueLength — 25 messages at queueLength 10 yields 3 pods.

> 💡 Summing in not-visible messages is the key detail — counting only visible ones omits in-flight work and triggers scale-down too early.

### [Introducing the Runtime Remediation Skill for headless cloud security](https://webflow.sysdig.com/blog/introducing-the-runtime-remediation-skill-for-headless-cloud-security)

_Sysdig_

Sysdig introduced the Runtime Remediation Skill for headless cloud security. It turns a runtime alert into a safe, auditable response by mapping real blast radius, proposing ordered containment actions and watching for threat respawn, all within the analyst terminal. Safety controls require explicit analyst confirmation for every destructive action, showing exactly what the action does, what it breaks and whether it can be undone, with no approval-all option. The action set covers forensic collection such as binary and syscall capture, network isolation, process termination and IAM session revocation for credential theft, sequenced correctly. Integration runs through the Sysdig MCP server registered via OAuth, giving AI agents structured access to runtime detections and workload context. For audit, it automatically generates incident ticket logging with UTC timestamps, decisions and watcher confirmation states of cleared, still_active or inconclusive. It is available in public beta through Claude Code and Agent Skills-compatible environments, complementing the prior Runtime Investigation Skill.

> 💡 Refusing an approval-all option and showing reversibility per action is the load-bearing design — a reasonable minimum bar to demand when adopting automated response tooling.

---

## AI & ML

### [Advancing responsible AI across Europe](https://openai.com/index/advancing-responsible-ai-across-europe)

_OpenAI_

OpenAI shared how it is advancing responsible AI across Europe. It opens from the premise that millions of people across Europe use OpenAI's tools every day to learn, create, work and manage everyday tasks, and that those tools also support businesses of all sizes and governments across the region. The company believes responsible AI can help drive Europe's competitiveness and prosperity, and as the EU AI Act enters its next phase it is sharing how it has strengthened its approach to safety, security, transparency and provenance in line with the EU framework, and how it will keep evolving those practices as AI advances. Its mission of ensuring artificial general intelligence benefits all of humanity carries an ongoing responsibility to maximize benefits, broaden access and manage risks, which is why it has for years developed governance approaches and supported workable rules. Holding that regulation should be pragmatic, proportionate and risk-based so as to advance governance while supporting innovation, OpenAI contributed to and endorsed two Codes of Practice: the EU's General-Purpose AI (GPAI) Code of Practice and the Code of Practice on Transparency of AI-Generated Content, both developed through extensive multi-stakeholder processes. The GPAI Code creates a shared framework for transparency, safety and security for general-purpose AI models, and OpenAI says it supports that framework through extensive pre-release model testing and published system cards with major releases.

> 💡 Transparency of AI-generated content being covered by its own Code of Practice matters practically — services targeting the EU should treat content labelling and provenance records as a regulatory requirement.

### [Building abundant intelligence](https://openai.com/index/building-abundant-intelligence)

_OpenAI_

OpenAI described its full-stack approach to building abundant intelligence. The starting point is that AI infrastructure is valuable not because it is large but because of what it makes possible: more capable intelligence, available to more people, at lower cost. That abundance is embedded both in the mission of ensuring AGI benefits all of humanity and in the economic engine driving the business. When the cost of useful intelligence falls, more work becomes worth doing; when models become more capable, that work creates more value; and as adoption grows, the company gains the revenue, real-world feedback and visibility into demand to keep investing in the next generation of research and infrastructure. A recent pricing announcement shows how quickly that cycle reaches customers: the day before, OpenAI reduced the price of GPT-5.6 Luna by 80 percent and GPT-5.6 Terra by 20 percent, putting Luna at $0.20 per million input tokens and $1.20 per million output tokens, and Terra at $2 and $12 respectively. For GPT-5.6 Sol, Fast mode delivers up to 2.5 times the speed of standard processing at twice the price with no change in intelligence. OpenAI frames these as more than price list changes — they expand the range of work that becomes practical and give customers flexibility to balance intelligence, speed, reliability and cost. The right question, it argues, is not which model belongs to which task but how much intelligence the outcome demands, how quickly it is needed and what it should cost, a balance that may change several times within the same workflow.

> 💡 The view that required intelligence shifts several times within one workflow is the basis for routing design — assign models per step rather than per workflow.

### [Univé builds an AI-ready workforce](https://openai.com/index/unive)

_OpenAI_

OpenAI published a customer story on Univé, one of the Netherlands' largest cooperative insurers, serving millions of members across insurance, mortgages, financial services and risk prevention. Its mission has always been to help people prevent problems before they happen, and as AI began reshaping knowledge work the organization saw an opportunity to rethink how employees could better deliver on it. Rather than approaching AI as another technology deployment, Univé viewed it as a major organizational transformation: the objective was not simply to introduce new tools but to build AI capability across the workforce so every employee could use AI safely, responsibly and effectively. ChatGPT Enterprise became a key part of that strategy, providing a secure platform employees could adopt quickly within Univé's governance framework. The transformation began with leadership — instead of treating AI as an IT initiative, the company brought its entire management community together for dedicated AI leadership sessions that challenged leaders to rethink how work itself would change and what role they would play in enabling it, moving managers beyond approving AI initiatives. Reported results include 97% of ChatGPT Enterprise licenses activated, 85% weekly active users, and roughly 1,500 custom GPTs created by employees, with pet insurance claims prepared for decision in minutes instead of hours.

> 💡 97% license activation alongside 85% weekly active users is an unusual pairing — evidence that starting adoption with manager enablement rather than as an IT project actually worked.

---

## Cloud Updates

### [What’s new in AI infrastructure and orchestration this month](https://cloud.google.com/blog/topics/ai-infrastructure/whats-new-in-ai-infrastructure-this-month/)

_Google Cloud_

Google Cloud rounds up this month's AI infrastructure and orchestration news, opening from the framing that AI at Google is a soup-to-nuts endeavor including leading models such as Gemini and Nano Banana. Google Cloud Managed Lustre reached general availability with four performance tiers from 125 to 1000 MB/s per TiB, scaling to 8 PB and powered by DDN's EXAScaler. C4N VMs reached general availability with 400 Gbps bandwidth, 95 million packets per second and 25 GiB/s block storage throughput via Titanium hardware. GKE Dataplane V2 reached general availability supporting clusters up to 15,000 nodes with active Network Policy enforcement. Co-operative time-slicing in llm-d interleaves independent RL jobs on shared hardware, raising accelerator duty cycles from around 40% to 70%. k8s-aibom was open-sourced as a Kubernetes controller for automated AI supply chain security, detecting AI runtimes and generating ML Bills of Materials. A day-zero deployment guide covers Moonshot AI's 2.8-trillion-parameter Kimi K3 via Model Garden, custom orchestration, or GKE with llm-d recipes.

> 💡 An open-sourced controller that auto-generates ML Bills of Materials is the practically useful item — supply chain visibility for AI workloads without maintaining a manual inventory.

### [What’s new with Google Cloud](https://cloud.google.com/blog/topics/inside-google-cloud/whats-new-google-cloud/)

_Google Cloud_

The "What's new with Google Cloud" page appeared in the digest. It is a continuously updated hub gathering the latest Google Cloud news, announcements, resources, events and learning opportunities in one place. Because it updates continuously, the items present at collection time differ from its later contents.

> 💡 The pattern of evergreen hub pages recurring across daily digests is now clear enough to warrant a collection rule for how such URLs should be handled.

### [Cloud CISO Perspectives: Why AI Threat Defense is the new boardroom baseline](https://cloud.google.com/blog/products/identity-security/cloud-ciso-perspectives-why-ai-threat-defense-is-the-new-boardroom-baseline/)

_Google Cloud_

The second Cloud CISO Perspectives of July 2026, written by Google Cloud CISO Chris Betz and Office of the CISO Senior Director Alicja Cade. The main argument is that AI Threat Defense should become a boardroom baseline for security governance, enabling business agility by automating threat detection and response at machine speed rather than through manual, reactive approaches. Named products are AI Threat Defense (AITD), CodeMender, Agent Platform, Cloud KMS, AlloyDB and Google Cloud Run. On numbers, Morgan Stanley is cited as collapsing mean time to detect threats by 99.9%, from a 45-minute window to 90 seconds or less, using a unified AI Threat Defense framework. Five strategic focus areas are business enablement, remediation cycle optimization, system consolidation, contextual prioritization using deep business context, and AI safety and policy governance. It was published August 1, 2026.

> 💡 The 45-minutes-to-90-seconds figure appears in an earlier Cloud CISO post too, marking it as the vendor's showcase case — whether it reproduces in your environment needs separate verification.

### [An API for MoQ: provision your own isolated relays](https://blog.cloudflare.com/moq-relays/)

_Cloudflare_

Cloudflare introduced a provisioning API for Media over QUIC (MoQ), letting developers create their own isolated relays. MoQ is a publish/subscribe system where publishers send out named streams of data and subscribers request those streams by name, relayed through CDN servers. The protocol runs over QUIC transport under HTTP/3, enabling low-latency delivery of video, messaging and other data without specialized infrastructure. Cloudflare made every one of its servers a MoQ relay last year; the new provisioning API is a control plane that lets developers create isolated relays and issue separate credentials controlling whether clients can publish, subscribe or both. Provisioned relays create isolated scopes across the existing global network rather than launching dedicated servers, and are available within seconds. Tokens are scoped to specific operations, assignable per client, and support expiration and revocation independently without disrupting other users. It currently supports the IETF draft-14 and draft-16 MoQ Transport specifications and is free at any scale during the beta period.

> 💡 Separating publish and subscribe rights at the token level matters for real-time streaming design — it pushes access control for multi-party scenarios out of the application.

### [Red Hat Ansible All-Stars: Driving the future of network and infrastructure automation](https://www.redhat.com/en/blog/red-hat-ansible-all-stars-driving-future-network-and-infrastructure-automation)

_Red Hat_

Red Hat introduces the Ansible All-Stars program driving the future of network and infrastructure automation, framed around operations teams facing an unsustainable calculation as enterprise infrastructures scale across hybrid cloud and distributed networks. The program annually recognizes outstanding IT professionals leading structural and cultural modernization in enterprise infrastructure automation. The 2026 recipients are Drew McKee of Blue Cross Blue Shield of Kansas and Jade Wu of TD Bank Group. McKee implemented Red Hat Ansible Automation Platform for patching workflows, certificate management and ticket management across more than 400 servers. Wu used the platform to compress a 1,300-branch IP migration from years to four months, eliminating manual site preparation work. Ansible Automation Platform serves as the core technology, offering agentless cross-vendor network device support without requiring software deployments. Both recipients are exploring AI-driven capabilities including self-healing infrastructure and AIOps.

> 💡 As in compressing a 1,300-branch IP migration from years to four months, automation pays off most where repetition is high and manual preparation is in the loop.

### [Announcing Red Hat OpenShift Platform Plus for Red Hat OpenShift Service on AWS on AWS Marketplace](https://www.redhat.com/en/blog/red-hat-openshift-platform-plus-rosa-aws-marketplace)

_Red Hat_

Red Hat announced Red Hat OpenShift Platform Plus for ROSA on AWS Marketplace, prompted by organizations using Red Hat OpenShift Service on AWS increasingly seeking ways to extend their platform with enterprise-grade capabilities. The bundle includes Advanced Cluster Management, Advanced Cluster Security, the Quay registry and OpenShift Data Foundation. Pricing is a pay-as-you-go consumption model with a 33% discount available on annual commitment, integrating with AWS Cost Explorer. Billing arrives as a single AWS Marketplace bill and supports AWS committed spend allocation. Prerequisites are an active ROSA subscription and an ACM hub purchased through AWS Marketplace. Premium tier Red Hat Support is included, with standard business hours access plus 24/7 coverage for critical issues.

> 💡 Counting toward AWS committed spend is the procurement-side advantage — for organizations that must burn down an AWS commitment, the purchase channel itself becomes a cost decision.

### [Same goals, different clocks: What Red Hat’s 2025 Risk Report reveals about global compliance gaps](https://www.redhat.com/en/blog/red-hat-2025-risk-report)

_Red Hat_

Red Hat summarizes its Product Security team's annual Risk Report, published in April 2026 covering 2025. It issued 3,781 security advisories in 2025, an almost linear upward trend year over year. Supply chain attacks increased 54% compared with 2024. 88% of incidents had unknown attribution, with the vast majority of supply chain attacks leaving no definitive fingerprints. Five of six Linux kernel vulnerabilities in CISA's Known Exploited Vulnerabilities catalog were originally disclosed in prior years, and CVE-2021-22555 waited four years before confirmation. Average fix time was 12 days for Critical vulnerabilities and 24 days for Important ones. On compliance gaps, the EU CRA's 24-hour reporting trigger conflicts with traditional 72-hour frameworks and differs across NIS2 and DORA standards globally. On open source impact, 66% of companies remain unfamiliar with the CRA and only 41% expect full compliance by December 2027. On cost burden, organizations spend an average of $258,000 per release cycle maintaining private software versions instead of contributing upstream.

> 💡 Five of six exploited kernel vulnerabilities originating in prior years means clearing unapplied patches reduces real risk more than chasing the newest CVEs.

---

## DevOps & Infrastructure

### [Nscale just bought Anyscale. Here’s why it matters for multi-cloud neutrality.](https://thenewstack.io/nscale-anyscale-acquisition-neocloud-lockin/)

_The New Stack_

Cloud platform company Nscale announced this week a definitive agreement to acquire AI workload scaling specialist Anyscale, in a move that tests whether cloud-neutral AI software can stay neutral once paired with a GPU neocloud. The purchase combines Nscale's infrastructure capabilities — spanning control systems overseeing GPUs, data centers and power consumption through to the application layer where AI services execute — with Anyscale's software layer for scaling AI workloads across data processing, training, inference and reinforcement learning. Nscale describes it as two highly complementary companies coming together, but the article argues it could be a fundamental change in the resulting business model. Nscale is a GPU neocloud, a specialized provider running bare-metal GPUs and infrastructure optimized for AI and machine learning, operating its own GPU-rich data centers and software stack. Anyscale, meanwhile, is an independent cloud-neutral multi-cloud orchestration control plane that works with any hyperscaler — now owned by a single neocloud. Nscale chief product officer Dan Bathurst says the Anyscale platform continues as its own brand and product, including bring-your-own-cloud deployments on AWS, GCP, Azure and others. He says the company wants to win on performance, not on vendor lock-in or forcing anyone to choose Nscale as their infrastructure provider, and that what changes is customers also gaining a first-party option to run Anyscale on the Nscale fleet as a fully optimized full-stack solution.

> 💡 When a neutral orchestration layer comes under an infrastructure provider, roadmap priorities can shift — if you depend on that stack, watch whether the BYOC path stays a first-class citizen.

### [Modeling Device Capabilities for Analytics](https://netflixtechblog.com/modeling-device-capabilities-for-analytics-e7607acebde8?source=rss----2615bd06b42e---4)

_Netflix_

The Netflix technology blog covers modeling device capabilities for analytics.

> 💡 For organizations serving heterogeneous devices, how capability models are normalized determines analytics quality — making device attribute schema an early data-team decision.

### [Don’t stop early: Case-folding source code at memory speed](https://github.blog/engineering/architecture-optimization/dont-stop-early-case-folding-source-code-at-memory-speed/)

_GitHub_

GitHub published an optimization for case-folding source code at memory speed. The context is that GitHub's Blackbird code search indexes over 480 TB of source code, and every byte requires case folding before ngram extraction. The technique is a branch-free ASCII loop with byte-space arithmetic for Unicode folding, processing entire buffers without early exits to enable vectorization. Throughput exceeds 45 GiB/s on a single core along the ASCII path. The rationale for going branch-free is that a data-dependent loop exit is enough on its own to keep the loop scalar; removing early-exit breaks lets LLVM vectorize with NEON instructions. The core optimization replaces conditional stores with unconditional writes via branchless masks, trading per-byte cost for a single 16-byte vector operation. Unicode is handled through a 1,776-byte paged bitmap plus a run-length table that avoids UTF-8 decode and encode cycles entirely using little-endian byte addition. For comparison, simd_normalizer runs around 1.2 GiB/s on ASCII. The implementation is open-sourced as the Rust crate "casefold."

> 💡 The observation that a single data-dependent early exit blocks vectorization of the whole loop generalizes well — it is the first thing to check when optimizing a text-processing hot path.

### [Gemini Robotics 2 brings us one step closer to physical AGI](https://thenewstack.io/gemini-robotics-2/)

_The New Stack_

Google DeepMind revealed Gemini Robotics 2 on Thursday, an intelligence layer comprising three new models to power more adaptable physical AI. Google says the models give robots more dexterous, full-body control to work together and complete a wide range of multi-step tasks. The vision-language-action model, Gemini Robotics 2, converts vision and language inputs into motor control so robots can flex from feet to fingertips, with enough dexterity in hands and grippers for delicate tasks like closing a Ziploc bag. The lightweight Gemini Robotics On-Device 2 runs locally so robotic applications keep working without internet connectivity. The embodied reasoning model, Gemini Robotics ER 2, lets robots understand their surroundings and communicate with humans to devise plans for multi-step tasks such as emptying a dishwasher and putting items away. Chris Matthieu, VP of the developer ecosystem at RealSense, tells The New Stack this is what it will take for robots to graduate from simple, isolated actions to real-world physical assistance: the hard part is not making the first decision but recovering from the hundredth once the world has changed — doors close, objects get moved, people walk into the scene, batteries drain and sensors become partially occluded. Where the previous Gemini Robotics 1.5 could only control a robot's upper body for tabletop tasks, Gemini Robotics 2 brings intelligence to the entire humanoid body, enabling it to walk, crouch, stretch and handle various objects.

> 💡 The point that the hard part is the hundredth decision after the world has changed generalizes past robotics — long-running agents should be evaluated on recovery, not initial accuracy.

### [Reflections on AI Week, and the future of solving problems with observability and AI](https://grafana.com/blog/ai-week-recap/)

_Grafana_

Grafana wrapped up AI Week with reflections on the future of solving problems with observability and AI. Generally available features include Workspace as an agent-native home for the Assistant, gcx and the Cloud MCP server providing structured Grafana access for AI agents, Assistant Investigations for automated alert and incident investigation, Automations for scheduled work automation, Agent Observability for monitoring and evaluating agent behavior, and an open source AI SDK for building custom AI agents on Grafana. Preview features include Assistant Watchers, Assistant Search, Assistant on mobile and desktop, Assistant in Microsoft Teams, Assistant with OpenAI models, and Agentic Testing for website testing automation.

> 💡 An observability vendor shipping Agent Observability — treating agents as a monitored subject — signals that the instrumentation gap in agent operations is being recognized as a real problem.

### [Grafana에서 자연어로 장애 원인을 분석하기: LLM 에이전트 기반 SRELens 개발기](https://techblog.lycorp.co.jp/ko/analyzing-incident-root-causes-in-grafana-using-natural-language-with-llm-agent)

_LINE_

LY Corporation's Home SRE team describes SRELens, an LLM agent-based tool for analyzing incident root causes in Grafana using natural language, opening from the point that observability data has grown but analysis remains hard. SRELens is a natural language observability data analysis tool operating as a Grafana application plugin, analyzing incident causes by querying metrics, logs, traces and profiles through LLM agent orchestration. The architecture pairs a TypeScript/React frontend providing a chat UI with a Go backend handling LLM agent orchestration, prompt synthesis and rate limiting, an MCP gateway accessing observability backends (Mimir, Loki, Tempo, Pyroscope), and Redis storing conversation history and usage quotas. The agent design uses GPT models with tool-calling, applies a three-layer system prompt of base policy, datasource fragments with environment metadata and user context, and enforces a maximum of 10 tool-calling rounds with duplicate-call blocking and result-size limits. Centralized backend control prevents prompt injection, while datasource fragments encode SRE operational knowledge such as label mappings and query conventions. Across three scenarios it narrowed an error spike to specific API request patterns, identified poison-pill retry storms by correctly selecting datasource-specific log fields, and honestly reported missing log data rather than speculating.

> 💡 The operational lesson that control mechanisms matter more than prompt sophistication is the core — and designing the agent to say "unknown" when data is missing is what makes an observability agent trustworthy.

### [How to govern agentic AI, MCPs, and AI code assistants](https://about.gitlab.com/blog/govern-agentic-ai-mcps-code-assistants/)

_GitLab_

GitLab lays out how to govern agentic AI, MCPs and AI code assistants, starting from the observation that AI code completion built human review into the process by design: a developer types, a suggestion appears and a human decides whether to accept it. With agentic AI that checkpoint disappears, requiring post-action audit trails instead. The governance controls named are a central AI Catalog publishing approved agents and flows rather than decentralized team configs; composite identity linking every agent action to the requesting human user so activity is never attributable to the agent alone; tool approval guardrails setting individual tools to run autonomously, pause for review or stay blocked; and prompt guardrails detecting attempts to hijack agent behavior mid-workflow. GitLab features cited include merge request approval policies, scanner enforcement, audit event streaming and self-hosted deployment options. The key argument is that governance for agentic AI is not an add-on but a different approach built around identity, permissions and auditability. Metrics for adoption, acceptance and quality, risk, remediation and ROI are tracked together to catch issues early.

> 💡 The key point is that human review was structurally enforced in code completion and simply disappears with agents — worth checking whether swapping tools also removed your review checkpoint.

---

_This digest was collected from RSS feeds and summarized by AI (Claude). See the original links for full details._
