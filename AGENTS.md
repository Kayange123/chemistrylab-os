# AGENTS.md

Instructions for coding agents (Claude Code, Codex, Cursor, Gemini CLI,
GitHub Copilot, Windsurf, or similar) working in this repository. Humans
should read `CONTRIBUTING.md` instead — it says the same things with more
narrative and less imperative mood, but the rules are the same.

## What this repository is

ChemistryLab OS is an open chemistry education platform built on a
principle: chemistry content (elements, reactions, and eventually
molecules/lessons/experiments) is **declarative data (ChemSpec)** that
generic engines interpret — not hardcoded per-reaction application logic.
See `ARCHITECTURE.md` before making any structural change.

## Repository map

```text
packages/chemspec/   Schemas only. Zod source -> generated JSON Schema. No chemistry logic.
packages/core/        Chemistry logic only. parseFormula, parseEquation, balanceEquation,
                       validateConservation. No UI, no I/O beyond reading its own
                       codegen'd element table.
datasets/elements/    Source of truth for known elements. Codegen'd into
                       packages/core/src/generated/elements.ts — never hand-edit that file.
datasets/reactions/   Sample ChemSpec reaction documents (YAML).
datasets/i18n/        Flat i18n key -> string dictionaries. en.json must stay complete.
apps/web/             The one application in v0.1. Consumes @chemistrylab/core's public
                       API only — never deep-imports package internals.
scripts/               validate-data.ts, generate-elements.ts — repo-wide tooling.
rfcs/                  Proposals for schema/architecture/API changes. See rfcs/README.md.
```

## Commands

```bash
pnpm install         # also runs codegen via postinstall (generate-elements, generate-schemas)
pnpm dev             # apps/web dev server
pnpm lint            # eslint across all packages
pnpm typecheck       # tsc --noEmit across all packages
pnpm test            # vitest across all packages
pnpm test:e2e        # playwright, apps/web only (see apps/web/README.md for current status)
pnpm build           # tsc build for packages, vite build for apps/web
pnpm validate:data   # validates every file under datasets/ — see docs/error-codes.md
pnpm generate:elements  # regenerate packages/core/src/generated/elements.ts from datasets/elements/elements.yaml
pnpm generate:schemas   # regenerate packages/chemspec/schemas/0.1/*.schema.json from the Zod source
```

Run `pnpm lint && pnpm typecheck && pnpm test && pnpm validate:data && pnpm build`
before considering any change done — this is what CI runs.

## Coding standards

- No `eval`, `new Function`, or any dynamic code execution to interpret
  ChemSpec or simulation data. ChemSpec is data, never code — this is a
  hard security boundary, not a style preference.
- Pure functions in `packages/core` and `packages/chemspec`: same input,
  same output, no hidden state, no I/O. If you're tempted to add a side
  effect, it probably belongs in `apps/web` instead.
- Public API only. `@chemistrylab/core`'s public surface is exactly what
  `packages/core/src/index.ts` exports. Don't import
  `@chemistrylab/core/dist/internal/...` from `apps/web`, and don't add
  new exports to `index.ts` without a real external consumer.
- No comments explaining _what_ code does — name things well instead.
  Comments are for _why_: a non-obvious constraint, a cited limitation
  (e.g. the documented balancer limitation in `packages/core/src/balance.ts`),
  or a workaround.
- Don't add abstractions, config flags, or "for the future" scaffolding
  beyond what the current task needs. See §40/§41 of the founding brief
  philosophy, carried into `CONTRIBUTING.md`.

## Files to be careful with

- `packages/core/src/generated/elements.ts` and
  `packages/chemspec/schemas/0.1/*.schema.json` are **generated**. Edit
  the source (`datasets/elements/elements.yaml`, the Zod schemas in
  `packages/chemspec/src`) and re-run the generator — CI fails the build
  if committed generated output doesn't match a fresh regeneration.
- `packages/chemspec/src/*.ts` — a change here is a ChemSpec schema
  change. If it's breaking (removes/renames a required field, tightens a
  validation in a way that invalidates existing documents), it needs an
  RFC (`rfcs/`) and a `CHEMSPEC_VERSION` bump, not a silent edit. Additive,
  backward-compatible changes (new optional field, widened enum) don't
  need an RFC but should still update `packages/chemspec/README.md`.
- `datasets/reactions/*.yaml` — every entry's `provenance.review.scientificStatus`
  must stay `"unverified"` unless you are a reviewing chemist adding real
  citations (`provenance.sources`). Don't flip this to `"verified"` on an
  agent's own authority — see `CHEMISTRY_GUIDELINES.md`. The schema
  enforces this (a `"verified"` entry without sources fails validation),
  but don't try to satisfy the enforcement by inventing a citation.

## Adding a reaction

1. Add `datasets/reactions/<id>.yaml` matching `reactionSchema`
   (`packages/chemspec/src/reaction.ts`) — copy an existing file as a
   template.
2. Add its `titleKey`, `accessibility.descriptionKey`, and every
   `learning.conceptKeys` entry to `datasets/i18n/en.json`.
3. Run `pnpm validate:data` — it checks schema shape, atom conservation
   (`CHEM001`), and i18n key completeness (`CHEM007`).
4. Leave `provenance.review.scientificStatus: unverified` unless you can
   cite a real source — see `DATA_SOURCES.md`.

## Adding a lesson

Not yet supported — curriculum/lesson schemas are Phase 5 work (see
`ROADMAP.md`). Don't invent a lesson schema ad hoc; open an RFC.

## Updating a schema

See "Files to be careful with" above. In short: additive and optional =
just do it + update the README; anything that could invalidate an
existing document = RFC + version bump.

## Scope discipline

If a task looks like it needs a new package under `packages/`, check
`ARCHITECTURE.md`'s "planned, not yet built" table first. If the package
is listed there, it's intentionally deferred — raise it rather than
creating it unprompted. Creating an empty or single-file package with no
real consumer is explicitly against this project's philosophy (§39 of the
founding brief: "do not create empty folders purely to look enterprise").
