# Governance

ChemistryLab OS is a young project (v0.1). This document describes how
decisions get made _today_, and how that's expected to evolve — it is
deliberately light rather than pre-building process for a community that
doesn't exist yet.

## Today: founding maintainer

The project currently has a single founding maintainer, responsible for
final decisions on architecture, scope, and merges. This is a practical
starting point, not a permanent structure — see "Where this is headed"
below. See [`.github/CODEOWNERS`](.github/CODEOWNERS) for the current
(placeholder) owners.

## Decision-making

Most changes don't need a formal decision: open a PR, address review
feedback, get it merged. Two categories get more process:

- **Architecture, ChemSpec schema, or public API changes** go through an
  RFC (see [`rfcs/README.md`](rfcs/README.md)) before implementation.
  This is about getting the design right with input, not bureaucracy —
  small, clearly-scoped changes don't need one (see `rfcs/README.md` for
  the line).
- **Scientific content** (anything under `datasets/reactions/`,
  `datasets/elements/`, or a claim embedded in the engine) requires
  chemistry review before it can be marked `verified` — see
  [`CHEMISTRY_GUIDELINES.md`](CHEMISTRY_GUIDELINES.md). This is a
  standing rule, not a per-decision judgment call: no single person
  (including the founding maintainer, including an AI agent) marks their
  own scientific contribution `verified`.

## Review dimensions

A pull request may need review along more than one axis — see the PR
template. Not every PR needs every dimension:

- `engineering-review` — default; code quality, tests, API design
- `chemistry-review` — mandatory for anything under `datasets/reactions/`,
  `datasets/elements/`, or `packages/core`'s chemistry logic
- `education-review` — recommended for learning-objective or
  concept-tagging changes, and for anything a teacher would actually use
  in a classroom
- `accessibility-review` — mandatory for `apps/web` UI changes and any
  schema `accessibility.*` field
- `data-review` — mandatory for provenance/source changes

CI passing is never treated as proof of scientific correctness — see
`CHEMISTRY_GUIDELINES.md`.

## Where this is headed

As trusted contributors emerge — a chemist doing regular scientific
review, an active maintainer of a specific package — they get named in
`CODEOWNERS` for the area they own, with commit/merge rights scoped to
that area. The intent is a small maintainer team organized around
review dimensions (engineering, chemistry, education, accessibility)
rather than a single decision-maker, once there's more than one person
to share the responsibility with. This document will be updated when
that happens, rather than describing a team that doesn't exist yet.

There is no legal entity or foundation behind this project today. If
that changes, it will be reflected here, not assumed in advance.

## Conflict resolution

Disagreements are expected to be resolved through discussion on the
relevant issue/PR/RFC. If they can't be, the founding maintainer (and
later, the maintainer team) makes the final call, favoring — in this
order — scientific accuracy, learner safety/accessibility, and
architectural coherence over speed or convenience.
