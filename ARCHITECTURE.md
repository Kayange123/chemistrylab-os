# Architecture

This document describes what exists today. Where it mentions something
that doesn't exist yet, it says so explicitly — this file drifting ahead
of the code is exactly the failure mode we want to avoid (see `AGENTS.md`
and the project's contribution guidelines).

## Guiding principle

> Simulations, reactions, and (eventually) molecules, lessons, and
> experiments are described as structured data — **ChemSpec** — that
> reusable engines interpret. We do not hardcode
> `if (reaction === "hydrogen-combustion") { ... }`.

Concretely, this means:

- A reaction is a YAML document validated against a schema
  (`datasets/reactions/*.yaml` + `@chemistrylab/chemspec`).
- The logic that balances, validates, and renders that reaction is generic
  — it works for any reaction shaped like the schema, not just the ones
  that exist today.
- Adding the 15th reaction should never require touching
  `@chemistrylab/core` or `@chemistrylab/chemspec`.

## Dependency direction (current, v0.1)

```text
apps/web
   │  (imports the public API only — no deep imports)
   ▼
@chemistrylab/core   ←── generated from ──   datasets/elements/*.yaml
   │
   ▼
@chemistrylab/chemspec   ──→   schemas/0.1/*.schema.json (generated, committed)
```

- **`@chemistrylab/chemspec`** — the data _shape_. Zod schemas for
  elements and reactions, compiled to language-neutral JSON Schema on
  every build. Depends on nothing but `zod`. Doesn't know what a balanced
  equation looks like — only what a well-formed document looks like.
- **`@chemistrylab/core`** — the _logic_. Formula parsing, equation
  parsing, balancing, atom-conservation checking. Depends on nothing —
  not even `chemspec` — because a chemistry engine shouldn't need a
  schema library to add two numbers together. Its element-symbol table is
  codegen'd from `datasets/elements/elements.yaml` (via `chemspec`, at
  codegen time only) so the runtime package stays dependency-free.
- **`apps/web`** — the only application in v0.1. Consumes `core`'s public
  API (`import { balanceEquation } from '@chemistrylab/core'`) the same
  way any future application (mobile, embeddable widget, a different
  framework entirely) would. It does not contain chemistry logic of its
  own.

Nothing here depends on React, a bundler, or Node-only APIs, except
`apps/web` itself.

## Why only two packages so far

The brief's suggested structure lists many more (`reaction-engine`,
`molecule-engine`, `simulation-engine`, `visualization`, `curriculum`,
`accessibility`, `i18n`, `ui`...). We deliberately did not create them yet.
Every one of those is a real future package, but creating an empty
package with no consumer and no implementation is worse than not creating
it: it's a promise the repository can't keep, and it's one more thing a
new contributor has to understand before touching anything.

`@chemistrylab/core` currently contains what would eventually split into
`chemistry-core` + `reaction-engine`: formula parsing and equation
balancing are general chemistry, while "run a reaction as a
time-stepped simulation" is a different, not-yet-built concern. We'll
split them when there's a second consumer of one but not the other — see
[`rfcs/0002-domain-model.md`](rfcs/0002-domain-model.md).

## Repository layout (current)

```text
chemistrylab-os/
├── apps/
│   └── web/                  Vite + React playground — the only app in v0.1
├── packages/
│   ├── chemspec/             Schemas (Zod source, JSON Schema artifact)
│   └── core/                 Formula/equation parsing, balancing, conservation
├── datasets/
│   ├── elements/             elements.yaml — canonical element table
│   ├── reactions/            14 curated sample reactions
│   └── i18n/                 en.json (complete) + sw.json (scaffold)
├── scripts/                  validate-data.ts, generate-elements.ts
├── docs/                     error-codes.md, and this file's companions
├── rfcs/                     RFC process + ChemSpec/domain-model RFCs
└── .github/                  CI, issue templates, CODEOWNERS
```

### Planned, not yet built

| Package                         | Responsibility (planned)                                                                                                     | Phase     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------- |
| `@chemistrylab/reaction-engine` | Time-stepped/interactive reaction simulation (temperature, rate, particle counts) — split out of `core` once it exists       | 4         |
| `@chemistrylab/molecule-engine` | Molecular structure, geometry, bonds beyond a flat formula                                                                   | 2         |
| `@chemistrylab/visualization`   | Framework-agnostic rendering primitives shared across representations                                                        | 2-4       |
| `@chemistrylab/curriculum`      | Lesson/challenge definitions that _reference_ simulations without owning them (§14 of the brief)                             | 5         |
| `@chemistrylab/accessibility`   | Shared a11y primitives (reduced motion, text-equivalent generation) once more than one app needs them                        | as needed |
| `@chemistrylab/i18n`            | Runtime for the `datasets/i18n/*.json` key/value scaffold used today                                                         | as needed |
| `@chemistrylab/ui`              | Shared design-system components, once there's a second app                                                                   | as needed |
| `apps/docs`                     | VitePress (or similar) documentation site — `docs/` is plain markdown today because a half-wired doc site is worse than none | as needed |

See `ROADMAP.md` for phase definitions.

## Educational vs. research-grade simulation

ChemistryLab OS is not Gaussian, ORCA, GROMACS, or a quantum-chemistry
package. It aims for **educationally accurate interactive simulation**,
not physically exact molecular dynamics. Concretely:

- `visualization` hints on a reaction (`particles`, `bonds`,
  `energyProfile`) are rendering hints, not a claim that a transition
  state has been simulated. Where a mechanism isn't modelled, the UI must
  present the animation as conceptual, not literal.
- Every reaction's `provenance.review.scientificStatus` defaults to
  `"unverified"` and the schema refuses `"verified"` without a citation —
  see `CHEMISTRY_GUIDELINES.md` and `DATA_SOURCES.md`. Nothing in this
  repository should be read as "AI-verified chemistry."

## i18n and accessibility are schema-level, not bolted on

`ChemSpec` documents never contain human-facing strings — only
dot-separated i18n keys (`titleKey`, `learning.conceptKeys`,
`accessibility.descriptionKey`), validated against
`datasets/i18n/en.json` by `pnpm validate:data`. Every reaction also
_must_ carry an `accessibility.descriptionKey` — the schema makes this
required, not optional, because retrofitting accessibility descriptions
across a growing dataset is far more expensive than requiring them at
data-entry time. See `ACCESSIBILITY.md`.

## Testing strategy (current)

- **Unit** (`packages/*/tests`) — the formula parser, equation parser,
  balancer, and conservation checker each have direct tests, including
  documented edge cases (unbalanced systems, unknown elements, malformed
  syntax, underdetermined balancing).
- **Schema** — `packages/chemspec/tests` checks the Zod schemas
  themselves (defaults, the verified-needs-a-source refinement, id/key
  format enforcement).
- **Data validation** — `pnpm validate:data` is effectively an
  integration test across every committed dataset file; CI runs it on
  every PR that touches `datasets/`.
- **E2E** — see `apps/web/README.md` for what's covered today and what's
  planned.

## Toolchain choices and why

| Choice                                          | Why                                                                                                                                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm + Turborepo                                | Familiar to most JS contributors, minimal config compared to Nx, good workspace + task-caching story for a small number of packages.                                                                                                              |
| TypeScript everywhere                           | Strong tooling, and it's the shared language between domain code and the web app — but domain packages compile to plain ESM + `.d.ts` so nothing about them is React- or bundler-specific.                                                        |
| Zod (source) + JSON Schema (generated artifact) | Zod gives ergonomic TS-side validation and type inference; JSON Schema is the actual language-neutral contract, committed to the repo and CI-checked against drift, so "ChemSpec is implementation-independent" is verifiable, not just asserted. |
| YAML for datasets                               | Human-editable by a chemist or teacher who isn't a programmer, per the multi-persona contribution goal.                                                                                                                                           |
| Vitest                                          | Fast, native ESM/TS support, no separate config for a monorepo this size.                                                                                                                                                                         |
| Vite + React for `apps/web`                     | Widely known, fast dev server — appropriate for a v0.1 playground with one interactive experience.                                                                                                                                                |

We avoided: a docs-site framework not yet wired to real content, a second
web app, GraphQL/REST API layers (there's no backend yet — see
`SECURITY.md` and `ROADMAP.md`), and any package without a concrete
consumer today.
