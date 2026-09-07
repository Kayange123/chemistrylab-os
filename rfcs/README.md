# RFCs

An RFC ("request for comments") is how ChemistryLab OS proposes and
records decisions that are expensive to reverse.

## When you need one

- Changing `@chemistrylab/chemspec`'s schema in a way that could
  invalidate an existing document (removing/renaming a required field,
  tightening a validation rule)
- Adding a new top-level package under `packages/` or `apps/`
- Changing a public package API (anything exported from a package's
  `index.ts`) in a breaking way
- Changing simulation semantics or a scientific modeling assumption that
  affects how the engine behaves, not just what data it holds
- Any change explicitly called out elsewhere in this repo as "open an
  RFC" (e.g. a new curriculum/lesson schema)

## When you don't

- Bug fixes
- Adding a dataset entry (a reaction, an element) that fits the existing
  schema
- Additive, backward-compatible schema changes (a new optional field, a
  widened enum) — update the relevant package README instead
- Refactoring that doesn't change a public API or on-disk data format
- Documentation

If you're not sure, open a small RFC anyway, or ask in the PR/issue —
erring toward discussion is cheap; an unreviewed breaking change is not.

## Process

1. Copy [`0000-template.md`](0000-template.md) to
   `NNNN-short-title.md`, using the next unused number.
2. Fill it in — it's fine to leave "Open Questions" genuinely open.
3. Open a PR with just the RFC file. Discussion happens there.
4. Once there's consensus (see `GOVERNANCE.md` for how decisions get
   made), the RFC is merged with `Status: Accepted` and implementation
   can proceed — normally as a separate PR, referencing the RFC.
5. If an accepted RFC turns out to be wrong once implemented, supersede
   it with a new RFC rather than silently deviating from it — link the
   old one from the new one's `Status` line.

## Numbering

Numbers are assigned sequentially and never reused, even for a
withdrawn/rejected RFC — a gap in the sequence is normal and expected.

## Index

| #                            | Title                                      | Status          |
| ---------------------------- | ------------------------------------------ | --------------- |
| [0001](0001-chemspec.md)     | ChemSpec: the chemistry data specification | Accepted (v0.1) |
| [0002](0002-domain-model.md) | Domain model and package boundaries        | Accepted (v0.1) |
