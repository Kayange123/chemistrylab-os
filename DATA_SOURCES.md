# Data sources

How scientific claims in this repository get sourced, cited, and trusted
— or explicitly marked as not yet trusted. See `CHEMISTRY_GUIDELINES.md`
for the review process this data feeds into.

## Preferred sources, in order

1. **IUPAC** recommendations and nomenclature — the closest thing
   chemistry has to a single authority on naming and conventions.
2. **NIST** (e.g. the NIST Chemistry WebBook) — authoritative for
   measured physical/thermodynamic data.
3. **PubChem** — good for compound identity, structure, and cross-checks.
4. **Peer-reviewed literature** — cite the specific paper (DOI
   preferred).
5. **A recognized, widely-used textbook** — cite title, author, and
   edition, since values and framing can change between editions.

## What we don't accept as a primary source

- Arbitrary websites, blogs, or forum answers with no citation of their
  own
- Wikipedia (fine for orientation while researching; cite what Wikipedia
  itself cites, not Wikipedia)
- An AI system's own generated output, including this bootstrap's own
  content — see "AI-generated content" below
- Scraped data with no attached provenance

## How to record a citation

`@chemistrylab/chemspec`'s `provenanceSchema` (see
`packages/chemspec/src/provenance.ts`) shape:

```yaml
provenance:
  sources:
    - organization: IUPAC
      reference: 'Nomenclature of Inorganic Chemistry, 2005 Recommendations'
      accessedAt: '2026-01-15' # optional
  review:
    scientificStatus: verified
    reviewedBy: <github-handle>
    lastVerifiedAt: '2026-01-15'
```

The schema _requires_ at least one entry in `sources` before
`review.scientificStatus` can be `verified` — this is enforced, not
optional. `unverified` entries may have an empty `sources: []`, but
adding a source even before formal review is welcome and helps whoever
reviews it next.

## What v0.1 actually ships, honestly

The 14 reactions bootstrapped with this repository were authored by an
AI agent from general chemistry knowledge, **not** from per-entry
citation research, and every one ships with
`review.scientificStatus: unverified` and an empty `sources: []` — see
`CHEMISTRY_GUIDELINES.md`. This is deliberate honesty, not an oversight:
claiming otherwise would be exactly the kind of unearned trust this
document exists to prevent. Elements started the same way (symbol +
atomic number only, no sources needed since those aren't measurements);
see below for how `atomicMass` changed that.

The element dataset's symbol and atomic number are immutable IUPAC facts
with no measurement uncertainty — there's no fabrication risk in listing
that carbon is element 6. `atomicMass` (Phase 1's first measured
property) is different: every element's value is transcribed from a real
external source (CIAAW's Abridged Standard Atomic Weights, cited per
entry, with the uncertainty CIAAW itself publishes alongside it), not
invented, but it's still an AI transcription that a chemist hasn't
checked — hence `unverified`, not a claim of correctness. Electronegativity,
reaction enthalpies, rate constants, and temperatures remain **not**
included, rather than included with invented precision — see
`ROADMAP.md` Phase 1 and `CHEMISTRY_GUIDELINES.md`
"Precision and fabrication."

## AI-generated content

An AI agent (human or automated contributor) may draft dataset entries,
but:

- It starts `unverified`, like any other new entry — no exception.
- It must not mark its own contribution `verified` — review has to come
  from someone (or something) other than the author, per
  `CHEMISTRY_GUIDELINES.md`.
- It should not invent a citation to satisfy the schema. An honest
  `unverified` entry with no `sources` is correct; a fabricated
  `sources` entry is worse than none.

See `AGENTS.md` for the same rule stated for coding agents specifically.

## Third-party datasets, images, and media

Before importing any external dataset, image, or other asset:

1. Confirm its license is compatible with CC BY 4.0 (or more permissive)
   — see `LICENSE-CONTENT.md`.
2. Record where it came from and under what license, next to the asset
   or in the PR description.
3. Don't scrape a website's content wholesale and call it a dataset —
   scraping without attached provenance is explicitly against this
   policy (see §10-11 of the founding brief this project follows).

If you're unsure whether a source is appropriate, ask in the PR rather
than guessing — `data-review` exists for exactly this.
