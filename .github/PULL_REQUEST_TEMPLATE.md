## What does this change do?

<!-- One or two sentences. Link an issue if there is one. -->

## Review dimensions

<!-- Check every box that applies. Leave the rest unchecked — not every
     PR needs every review. See CONTRIBUTING.md § "Review dimensions". -->

- [ ] `engineering-review` — code quality, tests, API design (default; almost every PR needs this)
- [ ] `chemistry-review` — required if this changes anything under `datasets/reactions/`, `datasets/elements/`, or chemistry logic in `packages/core`
- [ ] `education-review` — recommended if this changes learning concepts, lesson-facing text, or how a reaction is explained
- [ ] `accessibility-review` — required if this changes `apps/web` UI, or a schema's `accessibility.*` field
- [ ] `data-review` — required if this adds/changes a dataset entry's provenance or scientific status

## Checklist

- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm validate:data && pnpm build` pass locally
- [ ] If I changed `datasets/elements/elements.yaml` or any Zod schema in `packages/chemspec/src`, I ran `pnpm generate:elements`/`pnpm generate:schemas` and committed the result
- [ ] If I added a reaction, every `titleKey`/`accessibility.descriptionKey`/`learning.conceptKeys` entry is in `datasets/i18n/en.json`
- [ ] I did not mark anything `scientificStatus: verified` without a real source in `provenance.sources`

## Anything reviewers should focus on?

<!-- Optional: known trade-offs, things you're unsure about, follow-ups you're deliberately not doing here. -->
