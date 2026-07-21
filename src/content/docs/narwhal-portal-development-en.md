---
title: "Portal Development Workflow"
description: "Guide to the in-cluster portal development environment using Skaffold, Kaniko, and pnpm"
project: "Narwhal Portal"
order: 202
lastModified: 2026-07-17
---

## Development Workflow Design Rationale (ADR-001)

The portal directly depends on 6 to 8 internal cluster infrastructures, including Istio ambient mesh (ztunnel), OpenBao, Keycloak, ArgoCD, and Prometheus. We chose an in-cluster build and deployment workflow over local Docker execution for the following reasons:
- **Reproducing Pod-level Behavior**: Guarantees identical operational parity with the production environment, covering Istio cookie handling, Secret mounts, and inter-service DNS resolution.
- **Coexistence with ArgoCD GitOps**: To prevent ArgoCD's selfHeal from reverting the temporary `dev` image and environment variables deployed by Skaffold, we added an `ignoreDifferences` block to `gitops/apps/idp-portal.yaml` to ignore diffs on the image and env fields.
- **Rapid Feedback (Iteration Speed)**: Leverages file synchronization to overwrite files directly inside the container without triggering a full image rebuild on save. The Next.js HMR is reflected instantly within 2 to 3 seconds.

## Execution and HMR (Hot Module Replacement)

We exclusively use `pnpm` as the package manager. After bootstrapping the `.env.local` secrets, initiate the live in-cluster development environment with the following command:

The in-cluster file sync and HMR flow via Skaffold is as follows.

<Mermaid chart={`flowchart TB
  DEV["Local File Edit<br/>IDE"]
  SYNC["Skaffold File Sync<br/>(sync.manual)"]
  REBUILD["Kaniko Image Rebuild<br/>(Harbor)"]
  POD(["Running Container<br/>in-cluster"])
  BROWSER["Browser<br/>(HMR Applied)"]

  DEV -->|"Save File"| SYNC
  DEV -.->|"On Config Change<br/>Full Build"| REBUILD
  SYNC -->|"Dynamic Overwrite<br/>(No Rebuild)"| POD
  REBUILD -.->|"Pod Restart"| POD
  POD -->|"Port Forwarding<br/>(Applied in 2-3s)"| BROWSER

  style POD fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style DEV fill:#fff,stroke:#9ca3af,color:#111
  style SYNC fill:#f0fdf4,stroke:#059669,color:#111
  style REBUILD fill:#f9fafb,stroke:#d1d5db,color:#111
  style BROWSER fill:#fff,stroke:#9ca3af,color:#111
`} />

```bash
pnpm run dev:skaffold
```

- **Kaniko Build (In-cluster)**: The Kaniko pod inside the cluster performs the build based on `Dockerfile.dev` without needing a local Docker daemon. The base image utilizes the Debian-based `node:22-slim` to support the required file synchronization tools (GNU tar).
- **Skaffold File Sync**: Based on the `sync.manual` rules defined in `skaffold.yaml`, any changes made to `src/**/*.{ts,tsx,js,jsx,css}`, `public/**`, or `next.config.ts` are copied directly into the running container (`/app`), bypassing the Harbor image rebuild.
- **Port Forwarding**: Once running, the container's port 3000 is automatically forwarded to the host's `localhost:3000`.

### ⚠️ Tip: Avoiding Kaniko OOM on the First Build

During the very first Kaniko build right after a clean install, the Harbor layer cache is empty. Attempting to snapshot the entire `node_modules` directory can trigger a global OOM (Out of Memory) due to the node's memory limitation (6GB).
- **Solution**: For the initial cache warmup build only, drain one worker node (e.g., `narwhal-worker-2`) and temporarily add a `nodeSelector` and `tolerations` to the `build.cluster` configuration in `skaffold.yaml`. This forces the Kaniko build pod to exclusively occupy that node's resources. Once the cache is populated, subsequent builds are incremental, meaning HMR and restarts will operate normally even on a 6GB node.

## Debugging Setup (Node Inspector)

To attach a debugger to running Server Components or API routes, launch the application using the dedicated debugging profile.

```bash
pnpm run debug:skaffold
```

This profile uses a `post-deploy` hook to inject the `NODE_OPTIONS=--inspect=0.0.0.0:9229` environment variable immediately after the container deployment and sets up an additional port forward for port `9229` to your local machine.
- **IntelliJ IDEA**: Go to [Run] → [Edit Configurations] → [+] → [Attach to Node.js/Chrome] and set the port to `9229`. (Using the Cloud Code plugin is highly recommended).
- **VS Code**: Add an entry in the `.vscode/launch.json` file specifying `request: "attach"`, `port: 9229`, and `remoteRoot: "/app"`.

## Manual Production Deployment Flow

While standard deployments rely on GitOps and pre-built images, if you aren't using Skaffold, you can use your local machine's Docker environment to build and roll out the image. (This applies the multi-stage production `Dockerfile`).

```bash
# Build using local Docker and push to Harbor (:latest)
make all

# Manually trigger a restart of the deployment
kubectl -n devtools rollout restart deployment/idp-portal
```
