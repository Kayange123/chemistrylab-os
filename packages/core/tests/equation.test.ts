import { describe, expect, it } from 'vitest';
import { parseEquation } from '../src/equation.js';
import { ChemistryError } from '../src/errors.js';

describe('parseEquation', () => {
  it('parses coefficients and formulas with an ASCII arrow', () => {
    const result = parseEquation('2H2 + O2 -> 2H2O');
    expect(result.reactants).toEqual([
      { coefficient: 2, formula: 'H2' },
      { coefficient: 1, formula: 'O2' },
    ]);
    expect(result.products).toEqual([{ coefficient: 2, formula: 'H2O' }]);
  });

  it('accepts a unicode arrow', () => {
    const result = parseEquation('H2 + O2 → H2O');
    expect(result.reactants[0]).toEqual({ coefficient: 1, formula: 'H2' });
  });

  it('accepts "=" as an arrow', () => {
    const result = parseEquation('H2 + O2 = H2O');
    expect(result.products[0]).toEqual({ coefficient: 1, formula: 'H2O' });
  });

  it('defaults missing coefficients to 1', () => {
    const result = parseEquation('H2 + O2 -> H2O');
    expect(result.reactants.map((t) => t.coefficient)).toEqual([1, 1]);
  });

  it('throws CHEM004 when no arrow is present', () => {
    try {
      parseEquation('H2 + O2 H2O');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ChemistryError);
      expect((err as ChemistryError).code).toBe('CHEM004');
    }
  });

  it('throws CHEM004 for an empty side', () => {
    expect(() => parseEquation('-> H2O')).toThrow(ChemistryError);
  });
});
