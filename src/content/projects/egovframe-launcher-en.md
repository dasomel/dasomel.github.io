---
title: "eGovFrame Launcher"
description: "A local GUI launcher that takes eGovFrame sample projects from clone → build → run → open"
github: "https://github.com/dasomel/egovframe-launcher"
tags: ["eGovFrame", "Go", "Developer Tools", "Spring Boot", "Tomcat", "Docker"]
order: 9
type: "own"
---

## Overview

eGovFrame Launcher is a **local development GUI launcher that takes eGovFrame (Korean e-Government Standard Framework) sample projects from clone → build → run → open in a few clicks**. It ships as a single Go binary; running it opens a dashboard in the browser with nothing else to install.

Getting a standard framework sample running normally means picking a clone location per repo, matching JDK versions, deploying WARs to Tomcat, bringing up database and messaging containers before MSA samples, and checking that ports do not collide. The launcher handles that setup.

## Features

| Feature | Description |
|---------|-------------|
| **One-click run** | Clone · Build · Run · Stop · Open · Logs buttons per card. Spring Boot targets go all the way to running with a single Run |
| **Automatic WAR deployment** | After `mvn package`, deploys to a target-specific isolated Tomcat instance, auto-assigning HTTP and shutdown ports so targets never collide |
| **Automatic infrastructure** | Targets needing Docker get MySQL 8.0, Redis 7 and RabbitMQ 3 provisioned idempotently, with schema scripts loaded in order |
| **JDK auto-detection** | Scans installed JDKs and offers them as a list, defaulting to JDK 17 and falling back to the latest major |
| **Live logs** | Streams build and startup logs to the dashboard over SSE, with per-service filtering, fullscreen and copy |
| **Port collision avoidance** | Each target has a default port, editable directly on the card |
| **VSCode integration** | Opens a cloned target with `code`, including a built-in button to install the Community Server Connectors extension for Tomcat |

## Supported Targets

Ten targets are offered as cards, from a simple board to MSA templates, each with its own startup method and default port.

| Category | Target | Startup | Default port |
|---|---|---|---:|
| Simple board | Boot-based simple board (Spring Boot) | Runs immediately | 8090 |
| Simple board | Simple board (XML-based, WAR) | Auto-deployed to isolated Tomcat | 8091 |
| Simple homepage set | Template backend (Spring Boot) | Run (requires DB) | 8092 |
| Simple homepage set | Template frontend (React · Vite) | Run (paired with backend) | 5173 |
| General templates | Portal site template (WAR) | Auto-deployed to isolated Tomcat | 8093 |
| General templates | Internal business system template (WAR) | Auto-deployed to isolated Tomcat | 8094 |
| General templates | Simple homepage template (WAR) | Auto-deployed to isolated Tomcat | 8095 |
| Common components & MSA | Common components (WAR) | Auto-deployed to isolated Tomcat | 8096 |
| Common components & MSA | MSA common components | Sequential startup: Config→Eureka→Main→Login→Board→Gateway | 19000 |
| Common components & MSA | MSA template (educational) | Six backend services then frontend, in order (Docker) | 3000 |

Targets requiring login expose test accounts through the card's account button.

## Usage

Download a release binary and run it; `http://127.0.0.1:7070` opens automatically.

```bash
# macOS (Apple Silicon)
tar -xzf egov-launcher-darwin-arm64.tar.gz
./egov-launcher-darwin-arm64
```

You can also run from source, or headless without the GUI.

```bash
cd launcher && go run .            # 127.0.0.1:7070

bash scripts/00-check-prereqs.sh   # check git/mvn/npm/docker/java
bash scripts/01-clone.sh           # clone the sample repos
bash scripts/10-run-boot-sample.sh # start the boot sample
```

Windows `.ps1` scripts are provided under the same names.

## Prerequisites

Requirements differ per target, and the dashboard header shows whether each tool is installed.

- **Required**: `git`, JDK 17 (recommended), `mvn`
- **React targets**: `npm`
- **MSA and AI targets**: `docker`
- **WAR targets**: Tomcat 10.1+ (path set in the settings panel)

Settings are stored in `~/.egov-launcher.json` and can be edited directly from the dashboard settings panel.

## Tech Stack

Go 1.26 · JavaScript · SSE · Docker · Maven · Tomcat 10.1+

It cross-builds for macOS (arm64/amd64) and Windows (arm64/amd64), and is released under Apache 2.0.
