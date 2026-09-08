import type { EquationTerm } from './equation.js';
import { parseFormula } from './formula.js';

export type AtomCounts = Readonly<Record<string, number>>;

/**
 * Sums atom counts across a list of (coefficient, formula) terms, e.g. the
 * reactant side of an equation. Used by both {@link validateConservation}
 * and directly by callers that just want a total, such as a UI showing
 * "4 H atoms" beneath a reactant list.
 */
export function countAtoms(terms: readonly EquationTerm[]): AtomCounts {
  const totals: Record<string, number> = {};
  for (const term of terms) {
    const { atoms } = parseFormula(term.formula);
    for (const [symbol, count] of Object.entries(atoms)) {
      totals[symbol] = (totals[symbol] ?? 0) + count * term.coefficient;
    }
  }
  return totals;
}

export interface ElementDifference {
  readonly element: string;
  readonly reactants: number;
  readonly products: number;
}

export interface ConservationResult {
  readonly balanced: boolean;
  readonly reactantAtoms: AtomCounts;
  readonly productAtoms: AtomCounts;
  /** Elements whose atom count differs between sides, sorted by symbol. */
  readonly differences: readonly ElementDifference[];
}

/**
 * Checks whether an equation, as coefficient-annotated, conserves atoms —
 * the check behind CHEM001 (see docs/error-codes.md). This does not balance
 * the equation; it reports whether the coefficients given already balance
 * it, which is exactly what Experience A ("Balance") needs as a learner
 * adjusts coefficients interactively.
 */
export function validateConservation(equation: {
  readonly reactants: readonly EquationTerm[];
  readonly products: readonly EquationTerm[];
}): ConservationResult {
  const reactantAtoms = countAtoms(equation.reactants);
  const productAtoms = countAtoms(equation.products);

  const elements = new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]);
  const differences: ElementDifference[] = [];
  for (const element of elements) {
    const reactants = reactantAtoms[element] ?? 0;
    const products = productAtoms[element] ?? 0;
    if (reactants !== products) {
      differences.push({ element, reactants, products });
    }
  }
  differences.sort((a, b) => a.element.localeCompare(b.element));

  return {
    balanced: differences.length === 0,
    reactantAtoms,
    productAtoms,
    differences,
  };
}
