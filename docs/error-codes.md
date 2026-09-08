# Chemistry error codes

Every validation failure in the chemistry engine and dataset validator has a
stable, machine-readable code, so tooling (CI, editor integrations, future
AI agents) can react to a specific failure rather than parsing prose.

Codes `CHEM001`–`CHEM005`, `CHEM008`, and `CHEM010` are thrown as
`ChemistryError` by `@chemistrylab/core` (see `packages/core/src/errors.ts`)
and can occur at runtime, e.g. in the web playground. Codes `CHEM006`,
`CHEM007`, and `CHEM009` are reported only by `pnpm validate:data`
(`scripts/validate-data.ts`) — they're dataset-authoring problems, not
things a running application encounters.

| Code    | Meaning                                                                                                                                                                                                                                                                                                                                 | Raised by                                      |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| CHEM001 | Atom conservation failed — the two sides of an equation don't have matching per-element atom counts.                                                                                                                                                                                                                                    | `validateConservation` (core), `validate:data` |
| CHEM002 | Unknown element symbol — not present in `datasets/elements/elements.yaml`.                                                                                                                                                                                                                                                              | `parseFormula` (core)                          |
| CHEM003 | Invalid formula syntax — unmatched parentheses, unexpected characters, or an empty formula.                                                                                                                                                                                                                                             | `parseFormula` (core)                          |
| CHEM004 | Invalid equation syntax — missing reaction arrow (`->`, `→`, `=`), an empty side, or an unparsable term.                                                                                                                                                                                                                                | `parseEquation` (core)                         |
| CHEM005 | Charge not conserved. _Reserved_ — v0.1 datasets are net-neutral molecular equations only; this activates once ionic/spectator-ion equations are supported (see ROADMAP.md).                                                                                                                                                            | not yet raised                                 |
| CHEM006 | ChemSpec schema validation failed — the YAML document doesn't match `reactionSchema` / `elementSchema` (wrong type, missing required field, bad enum value, duplicate id, etc), including a cross-field `.refine()` failure such as `verified` with no source, or a measured property (e.g. `atomicMass`) with no `provenance.sources`. | `validate:data`                                |
| CHEM007 | Missing required metadata — an i18n key (`titleKey`, `accessibility.descriptionKey`, or a `learning.conceptKeys` entry) has no entry in `datasets/i18n/en.json`.                                                                                                                                                                        | `validate:data`                                |
| CHEM008 | Equation balancing failed — the atom-count linear system has no solution, or more than one degree of freedom (ambiguous / underdetermined; needs a manual or auxiliary-constraint balance).                                                                                                                                             | `balanceEquation` (core)                       |
| CHEM009 | (Warning, not an error) A reaction's file name doesn't match its `id`. Cosmetic — kept so the dataset directory stays browsable by id.                                                                                                                                                                                                  | `validate:data`                                |
| CHEM010 | Atomic number out of range — not an integer from 1 to 118.                                                                                                                                                                                                                                                                              | `getPeriod`, `getGroup` (core)                 |

## Example: CHEM001

```text
$ pnpm validate:data
...
✗ bad-test-unbalanced
  CHEM001: Atom conservation failed. Element O: reactants 2, products 1
```

## Adding a new code

1. Pick the next unused `CHEMNNN` number — never reuse or renumber an
   existing one, even a retired one (leave a note here instead).
2. Add it to `ChemistryErrorCode` in `packages/core/src/errors.ts` if it's
   raised by the engine, or just document it here if it's validator-only.
3. Add a row to the table above.
4. Add a test that triggers it (see `packages/core/tests/*.test.ts` for the
   pattern).
