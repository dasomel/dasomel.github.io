# Actions missions

Use an Actions mission only when the sandbox or connected GitHub path cannot safely or efficiently provide a required capability, exact transport, or bounded execution step.

Before dispatch, define:
- exact repository and expected commit SHA
- purpose and capability gap
- exact inputs and operations
- expected durable outputs
- verification and minimum permissions

Treat Actions as an ephemeral, bounded remote job, not an interactive shell. Inspect logs/results before retrying. Prefer returning to the sandbox after a supply mission. Keep task-owned temporary branches, workflows, and artifacts bounded and recovery-aware.
