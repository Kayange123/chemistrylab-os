# RFC 0001: ChemSpec — the chemistry data specification

- **Status:** Accepted (v0.1) — describes what shipped with the founding
  bootstrap; treat this as a starting point to extend via further RFCs,
  not a finished spec.
- **Authors:** Founding bootstrap (AI-assisted; see `AGENTS.md`)
- **Date:** 2026-09-07

## Summary

ChemSpec is the versioned, declarative, language-neutral specification
for chemistry content in ChemistryLab OS. v0.1 covers two document types
— **element** and **reaction** — implemented as Zod schemas in
`@chemistrylab/chemspec`, compiled to committed JSON Schema artifacts
(`packages/chemspec/schemas/0.1/*.schema.json`).

## Motivation

The project's core architectural principle (see `ARCHITECTURE.md`) is
that chemistry content is data interpreted by generic engines, not
per-reaction application code. That only works if the data has an actual
specification — versioned, validated, and not silently reinterpreted
across changes. Without ChemSpec, "declarative content" degrades into
"YAML files whose shape is whatever the last person who wrote one felt
like."

## Goals

- A schema that's implementation-independent — usable by a tool in any
  language, not just from this TypeScript monorepo.
- Required fields that make honesty checkable: every reaction needs an
  accessibility description and defaults to unverified scientific status.
- i18n keys instead of embedded strings, so translation never requires
  touching a dataset file.
- A real versioning story, so a breaking change is a decision, not an
  accident.

## Non-goals (v0.1)

- Molecule structure/geometry beyond a flat formula (Phase 2)
- Lesson/curriculum documents (Phase 5)
- Ionic equations / spectator ions / net charge balancing (CHEM005 is
  reserved but unused — see `docs/error-codes.md`)
- A runtime i18n system — `datasets/i18n/*.json` is a scaffold consumed
  directly by `apps/web` today, not a package

## Detailed design

### Why Zod as the source, JSON Schema as the artifact

Zod gives ergonomic TypeScript validation and type inference for the one
implementation that exists today (`@chemistrylab/core`, `apps/web`). But
"ChemSpec is language-neutral" has to be more than an assertion — so
every build compiles the Zod schemas to JSON Schema
(`pnpm generate:schemas`) and commits the result. CI regenerates and
diffs against the commit; a mismatch fails the build. Any tool, in any
language, can validate a ChemSpec document against
`packages/chemspec/schemas/0.1/*.schema.json` without touching Node.

### Document shapes (v0.1)

**Element** (`packages/chemspec/src/element.ts`): `schemaVersion`,
`symbol`, `atomicNumber`, `nameKey`. Deliberately minimal — see
"Scientific considerations."

**Reaction** (`packages/chemspec/src/reaction.ts`): `schemaVersion`,
`id`, `titleKey`, `equation` (reactants/products, each a
`{molecule, coefficient}` list), `reaction` (`family`, `reversible`,
`thermalEffect`), `conditions`, `learning.conceptKeys`,
`accessibility.descriptionKey` (required), `visualization` (hints, not a
simulation guarantee), `provenance` (`sources`, `review`).

### i18n keys

`i18nKeySchema` enforces dot-separated, kebab-case segments (e.g.
`reaction.hydrogen-combustion.title`). No ChemSpec document may contain a
human-facing string directly. See `datasets/i18n/README.md`.

### Provenance and the `unverified` default

`provenanceSchema` defaults `review.scientificStatus` to `"unverified"`
and refuses `"verified"` without a non-empty `sources` array — a Zod
`.refine()`, so this is enforced by the schema itself, not by convention.
See `CHEMISTRY_GUIDELINES.md`.

## Scientific considerations

The element schema ships only `symbol` and `atomicNumber` — immutable
IUPAC facts, not measurements — specifically to avoid fabricating
precision for atomic mass, electronegativity, etc. before those values
have real citations. This was a deliberate scope cut, not an oversight
(see `DATA_SOURCES.md`). Extending the element schema with measured
quantities is Phase 1 work and should come with its own provenance
fields, likely mirroring `reactionSchema`'s `provenance` shape.

## Educational considerations

`learning.conceptKeys` exists so a reaction can be discovered/filtered by
what it teaches, without embedding lesson structure in the reaction
itself (see `rfcs/0002-domain-model.md` and `EDUCATION_GUIDELINES.md` for
why that separation matters).

## Accessibility

`accessibility.descriptionKey` is required, not optional — see
`ACCESSIBILITY.md`. This was a specific, deliberate schema decision: an
optional field predictably gets skipped under deadline pressure; a
required one doesn't.

## Security

ChemSpec documents are pure data (YAML validated by Zod/JSON Schema).
Nothing in the schema or its consumers evaluates document content as
code — see `SECURITY.md`.

## Backward compatibility

This is the first version (`schemaVersion: "0.1"`); nothing to be
compatible with yet.

## Alternatives considered

- **JSON Schema as the source of truth, no Zod** — rejected: worse
  authoring/type-inference ergonomics for the one implementation that
  exists, for a "purity" benefit the generated-artifact approach already
  delivers.
- **YAML with no schema/validation** — rejected outright; this is exactly
  the failure mode ChemSpec exists to prevent (see Motivation).
- **Nested i18n objects instead of flat dotted keys** — rejected for
  v0.1; flat keys are simpler to diff and to check for completeness (see
  `datasets/i18n/README.md`).

## Migration

N/A for v0.1. Future breaking changes: bump `CHEMSPEC_VERSION`, add a new
`schemas/<version>/` directory, and ship a migration note — see
`packages/chemspec/README.md` § Versioning. Old documents must never be
silently reinterpreted under a new schema version.

## Open questions

- Should `provenance.sources` support a structured DOI/URL type instead
  of a free-text `reference` string? Deferred until enough real citations
  exist to know what's actually needed.
- Where should molecule (Phase 2) and lesson (Phase 5) schemas live —
  this package, or their own? Likely this package while the schema count
  stays small; revisit if `packages/chemspec` starts feeling like a
  dumping ground.
