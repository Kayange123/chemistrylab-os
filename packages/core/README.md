# @chemistrylab/core

Framework-independent chemistry domain primitives. No React, no DOM, no
Node-specific APIs beyond what any JS runtime provides — this package is
meant to run in a browser tab, a Node script, or a future mobile runtime
without modification.

## Public API

```ts
import {
  parseFormula,
  parseEquation,
  countAtoms,
  validateConservation,
  balanceEquation,
} from '@chemistrylab/core';

parseFormula('Ca(OH)2');
// { formula: 'Ca(OH)2', atoms: { Ca: 1, O: 2, H: 2 }, charge: 0 }

balanceEquation('H2 + O2 -> H2O');
// { balanced: true, equation: '2H2 + O2 -> 2H2O', coefficients: [2, 1, 2] }

validateConservation(parseEquation('H2 + O2 -> H2O'));
// { balanced: false, differences: [{ element: 'O', reactants: 2, products: 1 }], ... }
```

All functions are pure and deterministic: same input, same output, no
hidden state. See `tests/` for the full contract — the tests _are_ the
specification for edge-case behaviour.

## What's implemented (v0.1)

- **Formula parsing** — nested parentheses, multipliers, optional net
  charge (`SO4^2-`). Validates element symbols against
  `datasets/elements/elements.yaml` (codegen'd into `src/generated/`).
- **Equation parsing** — `+`-separated terms, optional leading
  coefficients, `->`/`→`/`=` arrows.
- **Conservation checking** — per-element atom-count comparison between
  the two sides of a coefficient-annotated equation.
- **Balancing** — solves the atom-count linear system exactly (rational
  arithmetic, no floating point) for equations with a one-dimensional
  solution space. See the doc comment on `balanceEquation` in
  `src/balance.ts` for the documented limitation on underdetermined
  systems (e.g. some redox half-reactions), which raise `CHEM008` rather
  than guessing.

## What's intentionally not here yet

Limiting reagent, yield, equilibrium, reaction rate, and ionic (spectator
ion) equations are named in `ROADMAP.md` as later-phase work. Adding them
should not require changing the functions above — see
`ARCHITECTURE.md`.

## Error codes

Every thrown error is a `ChemistryError` with a stable `.code` — see
`docs/error-codes.md` for the full table and what each one means.
