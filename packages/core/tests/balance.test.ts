import { describe, expect, it } from 'vitest';
import { balanceEquation } from '../src/balance.js';
import { validateConservation } from '../src/conservation.js';
import { parseEquation } from '../src/equation.js';
import { ChemistryError } from '../src/errors.js';

describe('balanceEquation', () => {
  it('balances hydrogen combustion', () => {
    const result = balanceEquation('H2 + O2 -> H2O');
    expect(result.coefficients).toEqual([2, 1, 2]);
    expect(result.equation).toBe('2H2 + O2 -> 2H2O');
  });

  it('balances methane combustion', () => {
    const result = balanceEquation('CH4 + O2 -> CO2 + H2O');
    expect(result.coefficients).toEqual([1, 2, 1, 2]);
    expect(result.equation).toBe('CH4 + 2O2 -> CO2 + 2H2O');
  });

  it('balances an already-1:1:1 acid-base neutralization', () => {
    const result = balanceEquation('HCl + NaOH -> NaCl + H2O');
    expect(result.coefficients).toEqual([1, 1, 1, 1]);
  });

  it('balances iron rusting (2Fe2O3 stoichiometry)', () => {
    const result = balanceEquation('Fe + O2 -> Fe2O3');
    expect(result.coefficients).toEqual([4, 3, 2]);
  });

  it('ignores any coefficients already present in the input', () => {
    const result = balanceEquation('5H2 + 9O2 -> 3H2O');
    expect(result.coefficients).toEqual([2, 1, 2]);
  });

  it('produces coefficients that satisfy validateConservation', () => {
    const result = balanceEquation('Al + O2 -> Al2O3');
    const reparsed = parseEquation(result.equation);
    const check = validateConservation(reparsed);
    expect(check.balanced).toBe(true);
  });

  it('throws CHEM008 for an underdetermined system (two independent reactions bundled together)', () => {
    // 5 species, 3 elements, rank 3 -> a 2-dimensional null space. Atom
    // conservation alone can't pick a unique answer here — see the
    // documented v0.1 limitation in balance.ts and docs/error-codes.md.
    try {
      balanceEquation('Fe + Cl2 + Cu -> FeCl2 + CuCl2');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ChemistryError);
      expect((err as ChemistryError).code).toBe('CHEM008');
    }
  });
});
