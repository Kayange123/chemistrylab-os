# RFC 0002: Domain model and package boundaries

- **Status:** Accepted (v0.1)
- **Authors:** Founding bootstrap (AI-assisted; see `AGENTS.md`)
- **Date:** 2026-09-07

## Summary

v0.1 ships exactly two domain packages — `@chemistrylab/chemspec` (data
shape) and `@chemistrylab/core` (chemistry logic) — instead of the larger
package set suggested by the founding brief
(`reaction-engine`, `molecule-engine`, `simulation-engine`,
`visualization`, `curriculum`, `accessibility`, `i18n`, `ui`). This RFC
records why, and what has to be true before each of those splits off.

## Motivation

Creating an empty package with no implementation and no consumer is
worse than not creating it: it's a promise the repository can't keep,
and one more thing a new contributor has to understand before touching
anything (see `ARCHITECTURE.md` § "Why only two packages so far"). But
"avoid premature fragmentation" isn't itself a design — this RFC records
the actual boundary reasoning so a future split is a decision made with
context, not guesswork against a two-year-old bootstrap.

## Goals

- Domain logic (`core`) has zero dependency on a UI framework, bundler,
  or Node-only API — verified by it building to plain ESM + `.d.ts` with
  no runtime dependencies at all.
- Schema (`chemspec`) has zero dependency on domain logic — it validates
  shape, not chemistry.
- A clear, written trigger for _when_ each planned package should
  actually be created, so "not yet" doesn't silently become "never."

## Non-goals

- Deciding the internal design of any not-yet-built package (Phase 2+
  work) — this RFC only fixes the boundary and the trigger for creating
  it.

## Detailed design

### Current dependency graph

```text
apps/web  ──uses──>  @chemistrylab/core  ──(codegen-time only)──>  @chemistrylab/chemspec
```

`core` has no runtime dependency on `chemspec` — its element-symbol table
is codegen'd from `datasets/elements/elements.yaml` via `chemspec`'s
schema at build time (`scripts/generate-elements.ts`), then committed as
a plain TypeScript array (`packages/core/src/generated/elements.ts`).
This means a hypothetical future consumer of `core` (a CLI tool, a
different frontend) never needs `zod` or any schema library — see
`ARCHITECTURE.md`.

### What's currently inside `@chemistrylab/core` that will eventually split out

- **Formula/equation parsing, balancing, conservation checking** — this
  is general, stateless chemistry and stays in `core` permanently.
- **Time-stepped/interactive simulation** (temperature effects, reaction
  rate, particle counts) — conceptually `reaction-engine`, but doesn't
  exist yet at all (Phase 4). It is _not_ currently jammed into `core` in
  a half-built form; it simply isn't built. When it is, split it into its
  own package at that point rather than growing it inside `core` first.

### Trigger conditions for each planned package

| Package           | Split out when...                                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reaction-engine` | Time-stepped simulation exists and needs its own release cadence separate from pure parsing/balancing (Phase 4)                                                                          |
| `molecule-engine` | Molecular structure (bonds, geometry) is implemented — this is new functionality, not an extraction (Phase 2)                                                                            |
| `visualization`   | A second application needs to share rendering primitives with `apps/web`                                                                                                                 |
| `curriculum`      | Lesson/challenge schemas are designed (Phase 5) — needs its own RFC first, since it's also a ChemSpec-adjacent schema decision                                                           |
| `accessibility`   | A second application needs to share a11y primitives currently living directly in `apps/web`                                                                                              |
| `i18n`            | The `datasets/i18n/*.json` + `apps/web/src/i18n.ts` lookup approach needs real runtime features (locale switching, plurals, interpolation)                                               |
| `ui`              | A second application exists that should share design-system components                                                                                                                   |
| `apps/docs`       | There's enough real documentation content to justify a generated site, and someone commits to keeping it wired into `pnpm build`/CI rather than letting it drift (see `ARCHITECTURE.md`) |

## Scientific considerations

None beyond what's already covered in `rfcs/0001-chemspec.md` — this RFC
is about package boundaries, not chemistry content.

## Educational considerations

Curriculum/lessons are kept structurally separate from reactions (a
reaction is not a lesson) specifically so a lesson can reference multiple
simulations and a simulation can be used by multiple lessons — see
`EDUCATION_GUIDELINES.md`. This constrains the future `curriculum`
package's design even though it isn't built yet.

## Accessibility

None beyond `ACCESSIBILITY.md`'s existing requirements — no new surface
introduced by this RFC.

## Security

None. No new trust boundary.

## Backward compatibility

N/A — this RFC describes the initial state.

## Alternatives considered

- **Build the full suggested package list up front, empty or stubbed** —
  rejected; matches exactly the anti-pattern this project's founding
  brief calls out ("do not create empty folders purely to look
  enterprise").
- **Put everything in one package (`core` absorbs `chemspec` too)** —
  rejected: schema validation and chemistry logic have genuinely
  different consumers and change reasons (a schema change is a
  data-compatibility question; a balancing-algorithm change is a
  correctness question), and language-neutral JSON Schema generation is
  cleaner from a package with no chemistry-logic baggage.

## Migration

N/A.

## Open questions

- When `reaction-engine` splits out of `core`, does `parseFormula`/
  `parseEquation`/`balanceEquation`/`validateConservation` stay in a
  renamed-but-stable `core`, or move too? Current lean: they stay — they
  have no dependency on simulation state and are useful standalone (e.g.
  a future CLI that only balances equations shouldn't need simulation
  code). Revisit when `reaction-engine`'s actual shape is known.
