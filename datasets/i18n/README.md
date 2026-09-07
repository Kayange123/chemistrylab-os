# datasets/i18n

Flat dictionaries mapping i18n keys (as validated by `@chemistrylab/chemspec`'s
`i18nKeySchema`) to translated strings. `en.json` is the source locale and
must stay complete — every key referenced anywhere under `datasets/` must
resolve there, and `pnpm validate:data` checks this.

Other locales (currently `sw.json`) may be partial. A missing key falls
back to English at render time; this is a scaffold for
[`packages/i18n`](../../packages/) (planned — see ROADMAP.md), not the
final translation runtime.

## Adding a language

1. Copy the key set from `en.json`.
2. Translate what you can with confidence; leave the rest out rather than
   guessing — a missing key is safer than a wrong one on a science
   education platform.
3. Flag scientific terminology you're unsure of for review in your PR
   description — see `education-review` in `CONTRIBUTING.md`.

## Why keys, not nested objects

`"reaction.hydrogen-combustion.title"` as a flat key (rather than nested
`{ reaction: { "hydrogen-combustion": { title: ... } } }`) makes it trivial
to diff, to detect missing keys with a simple set difference, and to keep
in sync with the dotted `i18nKeySchema` format used throughout ChemSpec.
