# @chemistrylab/chemspec

**ChemSpec** is the versioned, declarative specification for chemistry
content in ChemistryLab OS: elements, reactions, and (planned) molecules,
lessons, and experiments. See [`rfcs/0001-chemspec.md`](../../rfcs/0001-chemspec.md)
for the full rationale.

## What this package is

- The **canonical schemas**, written once in [Zod](https://zod.dev) and
  compiled to language-neutral JSON Schema on every build
  (`schemas/0.1/*.schema.json`, committed to the repo). Any tool in any
  language can validate a ChemSpec document against the JSON Schema without
  depending on this package, TypeScript, or Node.
- Pure data-shape validation. ChemSpec does not know how to parse a
  formula, balance an equation, or render anything — that's
  `@chemistrylab/core` and the (planned) engine packages. ChemSpec only
  answers "is this document well-formed?"

## What this package is not

- Not a chemistry engine. It doesn't know that `H2 + O2 -> H2O` is
  unbalanced — see `@chemistrylab/core`'s `validateConservation`.
- Not tied to React, a bundler, or a runtime. It has one dependency (`zod`)
  and compiles to plain ESM + `.d.ts`.

## Usage

```ts
import { reactionSchema } from '@chemistrylab/chemspec';

const reaction = reactionSchema.parse(yourParsedYaml);
```

## Scientific status defaults to `unverified`

Every entry's `provenance.review.scientificStatus` defaults to
`"unverified"`. The schema _refuses_ to accept an entry marked `"verified"`
unless it carries at least one source citation — see
[`CHEMISTRY_GUIDELINES.md`](../../CHEMISTRY_GUIDELINES.md) and
[`DATA_SOURCES.md`](../../DATA_SOURCES.md). This is enforced at the schema
level, not by convention, because "trust the dataset" is not a safe default
for a science education platform.

## Measured properties need their own citation

A field like `element.atomicMass` is optional, but if it's set, that
element's `provenance.sources` must be non-empty — regardless of
`scientificStatus`. This is stricter than the verified-needs-sources rule
above: an unreviewed _category_ claim (e.g. a reaction family) is honest
as a bare `unverified` guess, but an unreviewed _number_ with no source at
all isn't reviewable by anyone. See `DATA_SOURCES.md`.

## i18n keys, not strings

ChemSpec documents never contain human-facing text — only dot-separated
i18n keys (e.g. `reaction.hydrogen-combustion.title`), validated by
`i18nKeySchema`. Translated strings live in `datasets/i18n/*.json`. See
§16 of the project brief and `packages/i18n` (planned).

## Regenerating JSON Schema

```bash
pnpm --filter @chemistrylab/chemspec generate:schemas
```

CI runs this and fails if `schemas/` would change but wasn't regenerated —
the TypeScript source and the committed JSON Schema must never drift.

Generation uses Zod's own built-in `z.toJSONSchema` (no separate
conversion library) with `io: 'input'`, so a field with `.default()` is
correctly left out of `required` — that's what a document author actually
has to supply. Every object schema in this package uses
`z.strictObject()`, not `z.object()`, specifically so `additionalProperties:
false` in the generated schema is true to what Zod itself enforces: a
typo'd field name is rejected, not silently dropped.

## Versioning

`CHEMSPEC_VERSION` (currently `"0.1"`) is a schema version, separate from
this package's npm version. A breaking schema change bumps
`CHEMSPEC_VERSION`, adds a new `schemas/<version>/` directory, and ships a
migration note — old documents are never silently reinterpreted under a new
schema. See [`rfcs/0001-chemspec.md`](../../rfcs/0001-chemspec.md).
