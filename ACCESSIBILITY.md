# Accessibility

Accessibility is architecture in this project, not a post-launch pass.
Chemistry content leans heavily on colour, motion, spatial layout, and
visual structure by default — this document exists because that default
excludes people, and we're not willing to ship that quietly.

## What's already true of the schema and the code

- **Every reaction requires `accessibility.descriptionKey`.**
  `@chemistrylab/chemspec`'s `reactionSchema` makes this a required field,
  not optional metadata — `pnpm validate:data` fails a reaction that's
  missing one. See `EDUCATION_GUIDELINES.md` for how to write one well.
- **The playground uses native, keyboard-operable HTML controls.** The
  equation field is a plain `<input type="text">`, the reaction picker a
  native `<select>`, "Balance automatically" a real `<button>` — no
  custom widget re-implements keyboard semantics.
- **Status has a text equivalent, not just colour.** The balance result
  reads `"✓ Balanced"` / `"✗ Not balanced"` in text, scoped inside its own
  `aria-live="polite"` element so a screen reader announces just that
  headline on change — not the whole per-element table, which sits
  alongside it as static text repeating the same reactants-vs-products
  information. A parse error is a separate `role="alert"` element (an
  implicit assertive live region on its own; it isn't nested inside the
  polite one). CSS colour is supplementary, never the only signal.
- **`prefers-reduced-motion: reduce` is honoured globally**
  (`apps/web/src/styles.css`) — anything that later adds real animation
  (Phase 4's reaction-engine) inherits this, and any new transition must
  respect it, not add an exception.
- **Errors are announced, not silent.** A malformed equation surfaces as
  `role="alert"` text instead of a blank or broken UI.

## Standard for a new accessibility description

Write `accessibility.descriptionKey` so it stands alone as a correct,
complete description — someone using a screen reader with visualization
turned off should understand the reaction as well as someone looking at
it. A good description:

1. Names the species and their stoichiometry in words ("two hydrogen
   molecules react with one oxygen molecule").
2. States the observable macroscopic effect where there is one (heat,
   gas, colour change, precipitate, flame).
3. Avoids relying on the reader having seen any visualization.

Example (from `datasets/i18n/en.json`):

> "Two hydrogen molecules react with one oxygen molecule to form two
> water molecules. The reaction releases heat and requires an ignition
> source to start."

## Contributor expectations for UI work

If you're changing `apps/web` (or any future application):

- **Keyboard first.** Every interactive element must be reachable and
  operable via keyboard alone, with a visible focus indicator (see the
  `:focus-visible` rule in `styles.css` — don't remove or weaken it).
- **Colour is never the only channel.** If you add a status, a category,
  or a state, it needs a text or icon equivalent alongside the colour.
- **Motion must be pausable or absent by default under reduced motion.**
  Anything with a duration >0 needs a `prefers-reduced-motion` fallback.
  A future simulation view will additionally need real pause/step
  controls (see `ROADMAP.md` Phase 4) — don't ship continuous,
  un-pausable animation.
- **Label everything.** Every form control needs an associated
  `<label>` (not just a placeholder) — placeholders disappear on input
  and aren't reliably read by all assistive tech.
- **Test with a screen reader**, not just automated tooling, before
  calling accessibility work done — an automated check catches missing
  labels; it doesn't catch a description that's technically present but
  useless.

Tag UI changes `accessibility-review` in the PR (see
`.github/PULL_REQUEST_TEMPLATE.md`).

## What's not solved yet

There's no dedicated `@chemistrylab/accessibility` package yet — a11y
primitives (reduced-motion detection, text-equivalent generation) live
directly in `apps/web` because there's only one app to share them with.
See `ARCHITECTURE.md`'s "planned, not yet built" table for when that
changes.
