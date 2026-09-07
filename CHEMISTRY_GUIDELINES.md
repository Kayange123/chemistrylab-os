# Chemistry guidelines

Rules for anyone (human or AI agent) adding or changing scientific content
in this repository: `datasets/reactions/`, `datasets/elements/`, or
chemistry logic in `packages/core`.

## The core rule

**Nothing gets marked `verified` without a real citation, by a reviewer
who isn't the author.** This is enforced at the schema level —
`@chemistrylab/chemspec`'s `provenanceSchema` refuses a document with
`review.scientificStatus: verified` and an empty `sources` array — but
the schema check is a floor, not the actual review. Passing CI (or
satisfying the schema) is never proof that chemistry is correct; a human
with chemistry knowledge has to actually look at it.

## Scientific status lifecycle

Every reaction and element carries `provenance.review.scientificStatus`:

| Status       | Meaning                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `unverified` | Default for every new entry. Nobody with chemistry expertise has reviewed it yet. This is not a bug — it's the honest starting state. |
| `in-review`  | A chemistry reviewer has picked it up.                                                                                                |
| `verified`   | A chemistry reviewer confirmed it against real sources, which are recorded in `provenance.sources`.                                   |
| `disputed`   | Something about it is contested — see the entry or its issue thread for why.                                                          |

Don't hand-flip an entry to `verified` to make a PR look more complete.
An honest `unverified` is more useful to a reader than a false
`verified`.

## When chemistry review is mandatory

- Any change to `datasets/reactions/*.yaml` or `datasets/elements/*.yaml`
- Any change to balancing, conservation, or formula-parsing logic in
  `packages/core` that could change what the engine reports as correct
- Any change to `packages/chemspec`'s schema for scientific fields
  (`reaction.family`, `thermalEffect`, `conditions`, etc.)

Tag the PR `chemistry-review` (see `.github/PULL_REQUEST_TEMPLATE.md`).

## What counts as a source

Prefer, in roughly this order:

1. IUPAC recommendations and nomenclature
2. NIST (e.g. the NIST Chemistry WebBook)
3. PubChem
4. Peer-reviewed literature
5. A recognized, widely-used textbook (cite edition)

Do not cite an arbitrary blog, a Q&A site, or an AI system's own output
as a source — see `DATA_SOURCES.md` for the full policy and how to
record a citation.

## Precision and fabrication

Only include a numeric value (temperature, enthalpy, concentration, etc.)
if you can cite where it came from. An omitted field is always safer than
an invented number. This is why, for example, `datasets/elements/`
currently ships only symbol and atomic number — those are immutable
facts, not measurements, so there's no fabrication risk — and atomic
mass/electronegativity are deferred to Phase 1 rather than shipped with
invented precision. See `ARCHITECTURE.md` and `ROADMAP.md`.

## Educational simplification, stated honestly

This platform aims for **educationally accurate**, not
**research-grade**, simulation (see `README.md` and `ARCHITECTURE.md`).
That's a legitimate design choice, not a shortcut — but every
simplification has to be identifiable as one:

- A reaction's `visualization` hints (`particles`, `bonds`,
  `energyProfile`) describe what to render, not a claim that a mechanism
  or transition state was actually simulated. Where it wasn't, the UI
  must present it as conceptual (see `apps/web`'s "Visualize
  (conceptual)" section for the current example).
- Don't state a simplified model as if it were the complete physical
  picture. "This is a simplified model of X; in reality Y also matters"
  beats a confident half-truth.

## AI-generated chemistry content

Content drafted by an AI agent (including the initial 14-reaction
dataset in this bootstrap) starts `unverified` like anything else — being
AI-generated doesn't change the review requirement, and it doesn't grant
an exemption either. See `AGENTS.md` for the rule agents themselves
follow: don't self-mark your own contribution `verified`.

## Disagreements

If two reviewers disagree about a chemistry claim, mark the entry
`disputed` and open an issue explaining the disagreement (use the
"Chemistry correction" issue template) rather than merging on a
tiebreak. Getting it right is more important than getting it merged.
