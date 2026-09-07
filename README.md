# ChemistryLab OS

> Explore elements. Build molecules. Run reactions. See chemistry at the
> particle level — and understand why.

ChemistryLab OS is an open platform for interactive chemistry education,
for pupils, secondary and university students, teachers, chemistry
enthusiasts, developers, and institutions. `ChemistryLab OS` is a working
name — nothing in the architecture is tied to it.

**Status: v0.1 foundation.** This is a young project. What's below is
what actually exists today, not a vision document. See
[`ROADMAP.md`](ROADMAP.md) for what's planned.

## Why this exists

Most chemistry software is either a research-grade simulator (not built
for a classroom) or a fixed animation of one specific reaction (not built
to grow). We're building something in between: a platform where
reactions, molecules, and lessons are **declarative data** that generic
engines interpret — not one hardcoded animation per reaction. Add a
reaction to the dataset and it works everywhere the engine is used,
with no application code to touch. See [`ARCHITECTURE.md`](ARCHITECTURE.md).

We are explicitly **not** trying to become Gaussian, ORCA, GROMACS, or any
other research-grade computational chemistry tool. The goal is
educationally accurate interactive simulation — and being honest about
the difference. See ARCHITECTURE.md § "Educational vs. research-grade
simulation."

## What works today

- **Balance any equation.** Type `H2 + O2 -> H2O`, see live per-element
  atom-conservation feedback, or have the engine balance it for you
  (`2H2 + O2 -> 2H2O`) — via the same pure, tested functions any future
  application will use (`@chemistrylab/core`).
- **14 curated reactions** across all 8 major reaction families
  (synthesis, decomposition, combustion, single/double displacement,
  acid-base, precipitation, redox), each a validated
  [ChemSpec](rfcs/0001-chemspec.md) document, not application code.
- **A chemistry-aware data validator** (`pnpm validate:data`) that checks
  schema shape, atom conservation, and i18n-key completeness with
  machine-readable error codes (`CHEM001`, ...) — see
  [`docs/error-codes.md`](docs/error-codes.md).
- **A minimal web playground** (`apps/web`) exercising all of the above,
  keyboard-accessible and screen-reader-friendly from the start.

Try it:

```bash
pnpm install
pnpm dev
```

## Quick start

```bash
git clone <this repository>
cd chemistrylab-os
pnpm install     # also runs codegen (element table, JSON Schema)
pnpm dev         # http://localhost:5173 — the playground
```

Other useful commands (see [`AGENTS.md`](AGENTS.md) for the full list):

```bash
pnpm lint            # eslint, every package
pnpm typecheck       # tsc --noEmit, every package
pnpm test            # vitest, every package
pnpm test:e2e        # playwright smoke test for the playground
pnpm build           # tsc + vite build
pnpm validate:data   # validate every file under datasets/
```

Requires Node ≥20 and pnpm (see `.nvmrc` / `packageManager` in
`package.json`).

## Architecture, in one paragraph

`@chemistrylab/chemspec` defines the data _shape_ (Zod schemas, compiled
to language-neutral, versioned JSON Schema — no dependency on TypeScript
or a browser). `@chemistrylab/core` defines the chemistry _logic_
(formula parsing, equation parsing, balancing, conservation checking) —
pure, dependency-free, framework-agnostic. `apps/web` is the one
application today, consuming `core`'s public API the same way any future
app (mobile, an embeddable widget, a different framework) would. Full
detail, including what's deliberately _not_ built yet and why, is in
[`ARCHITECTURE.md`](ARCHITECTURE.md).

## Scientific integrity

Every reaction and element in this dataset carries a
`provenance.review.scientificStatus`, and it defaults to **`unverified`**
— the schema refuses to accept anything marked `verified` without a real
citation. Nothing in this repository should be read as scientifically
authoritative until a chemist has reviewed it. See
[`CHEMISTRY_GUIDELINES.md`](CHEMISTRY_GUIDELINES.md) and
[`DATA_SOURCES.md`](DATA_SOURCES.md).

## How can I contribute?

This project is built for more than programmers:

| You are a... | You can contribute...                                            |
| ------------ | ---------------------------------------------------------------- |
| Developer    | domain logic, the playground, tooling, tests                     |
| Chemist      | scientific review, new reactions, corrections, provenance        |
| Teacher      | lesson ideas, learning objectives, classroom feedback            |
| Student      | usability feedback, translations, documentation, beginner issues |
| Designer     | interaction design, visualization, accessibility                 |
| Translator   | localization (`datasets/i18n/`)                                  |

Start with [`CONTRIBUTING.md`](CONTRIBUTING.md) and
[`GOOD_FIRST_ISSUES.md`](GOOD_FIRST_ISSUES.md). Coding agents should read
[`AGENTS.md`](AGENTS.md) first.

## Roadmap

v0.1 covers formula/equation parsing, balancing, conservation checking,
and a small curated reaction dataset. Elements (Phase 1), molecular
structure (Phase 2), a broader reaction library (Phase 3), interactive
simulation with temperature/rate effects (Phase 4), lessons and
challenges (Phase 5), a virtual lab (Phase 6), an educator authoring tool
called Studio (Phase 7), and an embeddable ecosystem (Phase 8) are all
planned, not built — see [`ROADMAP.md`](ROADMAP.md) for the full
breakdown and what "done" means for each.

## Licensing

- Code (`packages/`, `apps/`, `scripts/`): [Apache License 2.0](LICENSE)
- Educational content and datasets (`datasets/`, `docs/`, `rfcs/`, this
  repo's own Markdown docs): [CC BY 4.0](LICENSE-CONTENT.md)

## Community

- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — how we treat each other
- [`GOVERNANCE.md`](GOVERNANCE.md) — how decisions get made
- [`SECURITY.md`](SECURITY.md) — how to report a vulnerability
- [`rfcs/`](rfcs/) — how architectural and ChemSpec changes get proposed
