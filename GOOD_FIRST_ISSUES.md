# Good first issues

These are also filed as real issues on
[the GitHub repo](https://github.com/Kayange123/chemistrylab-os/issues),
labeled `good first issue` — this file is a curated starting point, not a
substitute for browsing there. If you'd rather work from something not
listed here, anything tagged
[`good first issue`](https://github.com/Kayange123/chemistrylab-os/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
on GitHub is fair game.

Each of these is scoped to be doable without understanding the whole
architecture — they name the exact file(s) to start from.

1. **Add a 15th curated reaction.** Pick one not already covered in
   `datasets/reactions/` (see the family list in `README.md`) — e.g. a
   second acid-base or redox example. Copy an existing file as a
   template, add its i18n keys to `datasets/i18n/en.json`, and confirm
   `pnpm validate:data` passes. Template: "New reaction."

2. **Expand the Kiswahili translation scaffold.** `datasets/i18n/sw.json`
   currently has 6 entries. Add more element names or reaction titles —
   see `datasets/i18n/README.md` for the process and honesty expectation
   (leave out what you're not confident in). Template: "Translation."

3. **Write a worked "Adding a Reaction" walkthrough** in `docs/` — a
   step-by-step doc based on `AGENTS.md`'s § "Adding a reaction," but
   written for a first-time human contributor (more narrative, a
   screenshot of `pnpm validate:data` output).

4. **Add accessibility descriptions review** — read every entry in
   `datasets/i18n/en.json` whose key ends in `.accessibility` against the
   standard in `ACCESSIBILITY.md` § "Standard for a new accessibility
   description." File corrections for any that don't stand alone without
   the visualization.

5. **Add a CHEM008 documentation example** to `docs/error-codes.md` — the
   table currently explains CHEM008 but has no worked example the way
   CHEM001 does. `packages/core/tests/balance.test.ts` already has a
   triggering case (the underdetermined-system test) you can adapt.

6. **Create a schema example for an acid-base reaction with more than
   two reactants/products** — extend
   `datasets/reactions/hydrochloric-acid-neutralization.yaml`'s pattern
   with a different acid-base pair, as a second worked example for
   contributors learning the schema.

7. **Add a lesson-idea seed** using the "Propose a lesson" issue
   template, for one of the existing reactions (e.g. what would a
   30-minute classroom activity around `iron-rusting` look like?). This
   doesn't produce working software yet (`@chemistrylab/curriculum`
   doesn't exist — see `ROADMAP.md` Phase 5) but seeds real design input
   for when it does.

8. **Audit `datasets/elements/elements.yaml` against IUPAC's official
   element list** for the 44 elements currently included — confirm every
   symbol/atomic-number pair is correct, and file corrections with a
   citation if you find an error. Good first task for a chemist who isn't
   a programmer (Template: "Chemistry correction").

9. **Add a unit test for a formula the parser doesn't currently cover**
   — e.g. a doubly-nested formula more complex than
   `packages/core/tests/formula.test.ts`'s existing `Al2(SO4)3` case, or
   a formula with an unusual but valid charge notation. If it reveals a
   bug, that's a great follow-up issue.

10. **Improve `apps/web`'s empty/loading states** — e.g. what does the
    "Visualize (conceptual)" section show while the equation input is
    empty? Small, contained UI polish in `apps/web/src/App.tsx`.

11. **Document `pnpm validate:data`'s output format** with a couple more
    worked examples (a schema failure, an i18n-key miss) in
    `docs/error-codes.md`, using the pattern already there for CHEM001.

## Already done

- ~~Improve a formula parser error message~~ — done in
  [#12](https://github.com/Kayange123/chemistrylab-os/issues/12) /
  [#13](https://github.com/Kayange123/chemistrylab-os/pull/13), a good
  reference for what a small, well-scoped PR against one of these looks
  like: one commit for the fix, one for the test, tied to the issue.
