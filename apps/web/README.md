# @chemistrylab/web

The ChemistryLab OS playground — the one application in v0.1, and the
"minimum executable proof" required by the founding brief: it consumes
`@chemistrylab/core`'s public API directly (`balanceEquation`,
`parseEquation`, `validateConservation`, `parseFormula`) — there is no
demo-only balancing shortcut.

## Run it

```bash
pnpm install   # from the repo root
pnpm dev       # starts this app's Vite dev server
```

## What it does (v0.1)

- **Balance** — type or edit an equation (`H2 + O2 -> H2O`), see live
  per-element atom conservation, or click "Balance automatically" to run
  `balanceEquation` and fill in the correct coefficients.
- **Choose a reaction** — a `<select>` populated directly from
  `datasets/reactions/*.yaml` at build time (`src/reactions.ts` uses
  `import.meta.glob` + the real `reactionSchema` from `@chemistrylab/chemspec`
  to validate every file it loads — adding a 15th reaction to the dataset
  needs no code change here).
- **Visualize (conceptual)** — atom-composition cards for each species,
  explicitly labelled conceptual rather than a simulated mechanism (see
  `ARCHITECTURE.md` § "Educational vs. research-grade simulation").

Reaction metadata (family, thermal effect, learning concepts, the
accessibility description) is shown as read from the dataset — not
editable yet. Temperature/concentration controls (Experience C) and a
causal explanation view (Experience D) are intentionally not implemented:
there is no simulation engine yet to back them honestly (see
`ROADMAP.md` Phase 4), and a control that doesn't do anything is worse
than no control.

## Accessibility

- Every control is a native, keyboard-operable HTML element (`<input>`,
  `<select>`, `<button>`) — no custom widgets to re-implement keyboard
  semantics for.
- The balance status is an `aria-live="polite"` region with a text
  equivalent (`"✓ Balanced"` / `"✗ Not balanced"`), not colour alone; the
  per-element table repeats the same information in text form.
- `prefers-reduced-motion: reduce` is honoured globally (`src/styles.css`).
- Parse errors surface as `role="alert"` text, not a silent blank screen.

## Testing

- **Unit** (`pnpm test`, Vitest + Testing Library) — `src/App.test.tsx`
  covers the default unbalanced state, automatic balancing, loading a
  curated reaction, and a malformed-input error path.
- **E2E** (`pnpm test:e2e`, Playwright, Chromium only) —
  `e2e/balance.spec.ts` drives the actual built app in a real browser
  through the golden path: load hydrogen combustion, see it unbalanced,
  balance it, see it confirmed balanced.
