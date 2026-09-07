import { describe, expect, it } from 'vitest';
import { parseEquation } from '../src/equation.js';
import { validateConservation, countAtoms } from '../src/conservation.js';

describe('validateConservation', () => {
  it('reports an unbalanced equation with per-element differences', () => {
    const equation = parseEquation('H2 + O2 -> H2O');
    const result = validateConservation(equation);
    expect(result.balanced).toBe(false);
    expect(result.differences).toEqual([{ element: 'O', reactants: 2, products: 1 }]);
  });

  it('reports a balanced equation with no differences', () => {
    const equation = parseEquation('2H2 + O2 -> 2H2O');
    const result = validateConservation(equation);
    expect(result.balanced).toBe(true);
    expect(result.differences).toEqual([]);
    expect(result.reactantAtoms).toEqual({ H: 4, O: 2 });
    expect(result.productAtoms).toEqual({ H: 4, O: 2 });
  });

  it('countAtoms sums coefficients across terms', () => {
    const equation = parseEquation('2H2 + O2 -> 2H2O');
    expect(countAtoms(equation.reactants)).toEqual({ H: 4, O: 2 });
  });
});
