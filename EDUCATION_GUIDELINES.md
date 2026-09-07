# Education guidelines

Guidance for anyone adding or shaping learner-facing content: concept
tags, accessibility descriptions, future lessons/challenges (Phase 5 —
see `ROADMAP.md`).

## A reaction is not a lesson

Simulations and curriculum are architecturally separate, on purpose (see
`ARCHITECTURE.md`). `datasets/reactions/*.yaml` describes chemistry, not
pedagogy — it has `learning.conceptKeys` (which concepts a reaction
_touches_), but no learning objectives, assessment, or sequencing. Those
belong to the future `@chemistrylab/curriculum` package's lesson schema,
which will _reference_ a reaction by id rather than embedding it. Don't
try to smuggle lesson-shaped fields (objectives, mastery thresholds,
question banks) into the reaction schema to work around this — open an
RFC for the curriculum schema instead.

## Writing `learning.conceptKeys`

- Tag a reaction with the concepts a learner would actually practice by
  engaging with it — not every concept that's technically true of it.
  Hydrogen combustion is tagged `concept.activation-energy` because
  ignition is central to understanding it; it isn't tagged with every
  concept that happens to apply to combustion in general.
- Reuse an existing concept key (see `datasets/i18n/en.json` for the
  current list) before inventing a new one — a smaller, consistent
  concept vocabulary is more useful for future features (e.g. "show me
  every reaction that teaches redox") than a sprawling one.
- A concept key is an i18n key like any other — add its translation to
  `datasets/i18n/en.json` alongside the reaction that first uses it (see
  `docs/error-codes.md`'s CHEM007).

## Writing accessibility descriptions

`accessibility.descriptionKey` is required on every reaction — not
optional metadata. Write it so it stands alone as a correct, complete
description without seeing any visualization: state the species,
stoichiometry in words, and the observable macroscopic effect (heat,
gas, colour change, precipitate) where relevant. See
`ACCESSIBILITY.md` for the full standard and worked examples (every
current reaction's description in `datasets/i18n/en.json` follows it).

## Age and reading-level range

This platform spans pupils through university students and teachers.
v0.1 doesn't yet have per-level content variants — write descriptions and
concept framing at a secondary-school reading level by default (concrete
language, short sentences), since that's the widest audience a single
description currently has to serve. Level-specific content is future
work; don't build an ad hoc leveling mechanism into today's schema for
it — raise it as an RFC if it becomes a real need.

## Terminology consistency

Use standard IUPAC-style naming and don't invent shorthand that a
chemistry teacher wouldn't recognize (e.g. write "hydrochloric acid," not
an informal nickname). When in doubt, match the terminology in
`CHEMISTRY_GUIDELINES.md`'s cited sources.

## Review

Tag education-facing changes `education-review` in the PR (see
`.github/PULL_REQUEST_TEMPLATE.md`) — a teacher's read on whether
something is actually usable in a classroom is different from, and
complementary to, a chemist's read on whether it's scientifically
correct (`chemistry-review`). Neither substitutes for the other.
