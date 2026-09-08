# Roadmap

Phases are ordered by capability, not by date — nothing here has a
deadline. A phase is "done" when its capabilities exist and are tested,
not when a box is checked. See `ARCHITECTURE.md` for what already exists.

## Phase 0 — Foundation (this bootstrap)

- [x] Monorepo tooling (pnpm + Turborepo, TypeScript, ESLint, Prettier)
- [x] `@chemistrylab/chemspec`: versioned schemas + generated JSON Schema
- [x] `@chemistrylab/core`: formula parsing, equation parsing, balancing,
      atom conservation
- [x] Canonical element dataset (symbol + atomic number, 44 elements)
- [x] 14 curated sample reactions across 8 reaction families
- [x] `pnpm validate:data` with machine-readable `CHEM0xx` error codes
- [x] i18n key scaffold (`datasets/i18n/en.json`, `sw.json` started)
- [x] Accessibility required at the schema level
      (`accessibility.descriptionKey`)
- [x] Web playground (`apps/web`) exercising the same public API as any
      future application
- [x] CI: lint, typecheck, test, validate:data, build, codegen-drift check
- [x] Governance, contribution, and scientific-review documentation
- [ ] `apps/docs` documentation site — deferred; `docs/` stays plain
      markdown until there's a concrete reason to wire up a site generator

## Phase 1 — Elements

- Element dataset grows beyond symbol + atomic number, each addition with
  its own provenance since these are measurements, not immutable facts:
  - [x] Atomic mass (all 44 elements, sourced from CIAAW)
  - [ ] Electronegativity
  - [ ] Common oxidation states
- Periodic-trend queries built on `@chemistrylab/core`.
- Element detail views; **Elementa** experience.

## Phase 2 — Molecules

- `@chemistrylab/molecule-engine`: structure beyond a flat formula —
  bonds, connectivity, simple molecular geometry.
- 2D (and where it adds real understanding, simple 3D) molecule
  visualization.
- **Molecula** experience.

## Phase 3 — Reactions

- Broaden the reaction dataset well beyond the 14 v0.1 examples, each
  scientifically reviewed (see `CHEMISTRY_GUIDELINES.md`).
- Limiting reagent, excess reagent, yield.
- **Reacta** foundation: the reaction-browsing/running experience.

## Phase 4 — Simulation

- `@chemistrylab/reaction-engine` split out of `core`: time-stepped,
  interactive simulation — temperature effects, concentration effects,
  educational collision/rate model, activation-energy visualization.
- Deterministic simulation mode for reproducible classroom assessment.
- Additional `conditions` fields named in `ARCHITECTURE.md`: pressure,
  catalyst, surface area, pH.

## Phase 5 — Education

- `@chemistrylab/curriculum`: lessons and challenges that _reference_
  simulations without owning them (a reaction is not a lesson — see
  `ARCHITECTURE.md`).
- Quizzes, learning-objective tracking, mastery thresholds.
- **Learn** and **Challenge** experiences.

## Phase 6 — Virtual Laboratory

- Virtual equipment, reagents, measurements, solutions, titration.
- **Lab** experience.

## Phase 7 — Educator Platform

- **Studio**: lesson authoring that outputs structured ChemSpec/curriculum
  definitions, not hardcoded application code.
- Sharing, classroom packages, LMS integration.

## Phase 8 — Ecosystem

- Embeddable simulations (e.g. `<chem-reaction>`), public SDKs.
- Plugin architecture for community-contributed content.
- Additional languages beyond English/Kiswahili.

## Explicitly out of scope

See §39 of the founding brief and `SECURITY.md` / `README.md`: no
Kubernetes, no required backend for core learning, no accounts required
for basic simulations, no LMS, no social networking, no payments, no
advertising, no intrusive analytics, no `eval`-based simulation execution.
