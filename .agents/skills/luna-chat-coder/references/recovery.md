# Recovery

After chat/sandbox reset or source-identity ambiguity:

1. Inspect surviving workspace before replacing it.
2. Resolve the repository task to the current immutable commit/PR-head SHA.
3. Recover exact source from Git/PR/artifact when available.
4. Compare with surviving local work before replacement or merge.
5. Preserve unfamiliar remote state until ownership is understood.
6. Resume from the recovered durable state.

Trust order:

```text
commit / PR head
    > immutable Git or Actions artifact
    > surviving sandbox working tree
    > conversation reconstruction
```
