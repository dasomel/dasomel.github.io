---
title: "AI-Era Open Source: Build the Bathhouse, Not the County Office"
description: "A review of my OSS projects through a user-friction lens inspired by the bathhouse metaphor: Narwhal, Beluga, KubeMetal, eGovFrame Launcher, nfs-quota-agent, and ldapium."
pubDate: 2026-08-20
tags: ["AI", "Open Source", "Platform Engineering", "Kubernetes", "Cloud Native", "Developer Experience"]
featured: false
draft: false
---

## Introduction

I recently read a GeekNews post titled **“In the AI era, developers should build the bathhouse, not the county office.”**

The metaphor stayed with me.

In the story, residents are asked what they need for a new public building. The supplier assumes a county office is the right answer, but the residents actually need a bathhouse because their everyday problem is having no practical place to wash.

The lesson is simple: a plausible solution from the provider's perspective may not be the real solution from the user's perspective.

After reading it, I looked again at the open-source projects I am building.

I have spent a lot of time on Kubernetes, GitOps, data platforms, MLOps, integration, version alignment, incident reproduction, and testing. Those things matter. But changing one question made the projects look different:

> **Instead of asking what technology this OSS provides, what friction does it remove for someone?**

AI can now help build the county office much faster. That makes the question of *what should be built* more important, not less.

---

## 1. Narwhal — reducing the friction of operating Kubernetes

[Narwhal](https://github.com/dasomel/narwhal) is an open-source Kubernetes Internal Developer Platform.

It integrates GitOps, IAM/SSO, API Gateway, Service Mesh, Observability, Registry, Storage, Backup, Policy, and Portal capabilities.

On paper, it looks like a platform project.

But the problem I am actually trying to solve is not installing Kubernetes.

Kubernetes itself is relatively easy to install. The harder part is making many independent projects work together:

```text
Kubernetes
   ↕
Keycloak
   ↕
APISIX
   ↕
Istio
   ↕
ArgoCD
   ↕
Grafana / Gitea / Harbor / Headlamp
```

Claims can be incompatible, TLS chains can diverge, a Helm chart upgrade can break a configuration, and an air-gapped environment can reveal an overlooked external dependency.

That is why I treat the **seams between components as part of the product**.

The operations log records not only how a problem was fixed, but how similar incidents can be distinguished and prevented through regression testing.

From the bathhouse perspective, Narwhal can be described as:

> **A platform that removes the repeated integration friction operators experience between Kubernetes and dozens of Cloud Native components.**

---

## 2. Beluga — making the data journey reproducible

[Beluga](https://github.com/dasomel/beluga) reconstructs an end-to-end data platform on local VMs.

It connects Kafka, CDC, Flink, Iceberg, Trino, Superset, Airflow, Kubernetes, and GitOps.

The technology list is large:

```text
PostgreSQL
   ↓ CDC
Kafka
   ↓
Flink
   ↓
Iceberg
   ↓
Trino
   ↓
Superset
```

But the user does not really want Kafka installed.

The user wants to experience something like:

> Put data into PostgreSQL, watch CDC events flow through Kafka, process them with Flink, persist them to Iceberg, query them through Trino, and see the result in a dashboard.

The product is therefore the **data journey**, not the component list.

A successful Helm template is not enough. The meaningful question is whether the end-to-end flow actually works in a running cluster.

```text
Configuration is correct
        ≠
The platform is working
```

That gap is the friction Beluga is trying to remove.

---

## 3. KubeMetal — hiding the constraints of Apple Silicon

[KubeMetal](https://github.com/dasomel/kubemetal) creates a local MLOps environment on Apple Silicon.

The interesting technical constraint is the relationship between macOS host compute and the Linux VM running Kubernetes.

```text
             KubeMetal
                 │
       ┌─────────┴─────────┐
       │                   │
   Kubernetes           macOS Host
   Control Plane          Compute
       │                   │
 MLflow / Storage        MLX / GPU
```

The user does not necessarily care about the architecture.

The user wants something simpler:

> **I want to use my Mac GPU for model training and serving.**

KubeMetal's job is to hide the friction created by the gap between Apple Silicon, Linux VMs, Kubernetes, and host GPU compute.

The implementation is interesting, but the user experience is what makes the project useful.

---

## 4. eGovFrame Launcher — the most direct bathhouse example

[eGovFrame Launcher](https://github.com/dasomel/egovframe-launcher) is a GUI launcher for running eGovFrame examples locally.

Running an example can require a surprisingly long preparation sequence:

```text
Git clone
   ↓
JDK check
   ↓
Maven check
   ↓
Project requirements
   ↓
Tomcat / DB / Redis / RabbitMQ
   ↓
Port checks
   ↓
Build
   ↓
Deploy
   ↓
Run
   ↓
Logs
```

But what does the user actually want?

> **“I just want to run the example.”**

So the Launcher combines cloning, build, run, stop, open, and logs into one workflow. It can detect JDK requirements, use isolated Tomcat instances for WAR projects, prepare required Docker infrastructure, and handle port conflicts.

From the provider perspective this is an environment automation tool.

From the user's perspective it is simply:

> **A way to remove the annoying preparation work.**

---

## 5. nfs-quota-agent — a small project solving a precise problem

[nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent) is much smaller than Narwhal or Beluga.

That makes it a useful example.

With Kubernetes and NFS storage, a PVC's declared capacity is not always enough to enforce a real filesystem quota on the NFS server.

The operator eventually asks:

> “The PVC says 10Gi. Why is the actual storage still growing?”

The project focuses on that concrete operational gap by connecting Kubernetes PersistentVolumes with filesystem project quotas on the NFS server.

The value is not the size of the codebase. It is the precision of the problem being solved.

---

## 6. ldapium — reducing the distance between upstream OpenLDAP and a usable platform

[ldapium](https://github.com/dasomel/ldapium) builds OpenLDAP from upstream sources and packages the resulting image, UI, and Helm chart together.

For an operator, the important problem is not learning every build detail of OpenLDAP.

It is getting a reproducible, deployable, manageable LDAP service without repeatedly rebuilding the same integration work.

That makes ldapium another example where the useful abstraction is not “here is an LDAP container,” but:

> **Here is a reproducible operational path from upstream source to a usable Kubernetes service.**

---

## 7. What AI changes

AI makes implementation dramatically cheaper.

That changes the economics of building the county office. We can make more code, more interfaces, and more integrations faster.

The danger is that speed makes it easier to optimize for visible output instead of actual user value.

The better use of the saved time is to investigate the user's actual workflow:

```text
What is the user trying to do?
        ↓
Where do they stop?
        ↓
What do they repeatedly configure?
        ↓
What fails at the seams?
        ↓
What can the OSS remove?
```

AI gives me more implementation capacity. It does not automatically give me better product judgment.

---

## Conclusion

The bathhouse metaphor changed the way I want to evaluate my OSS projects.

When I review Narwhal, Beluga, KubeMetal, eGovFrame Launcher, nfs-quota-agent, and ldapium, I want to ask fewer questions like:

> “How many technologies have I integrated?”

and more questions like:

> “Which repetitive, frustrating, error-prone part of someone's work disappears because this project exists?”

AI makes building faster.

That makes **choosing the right problem and verifying the result** more important than ever.

The goal is not to build a more impressive county office.

The goal is to build the thing people actually needed.
