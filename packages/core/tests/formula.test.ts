import { describe, expect, it } from 'vitest';
import { parseFormula } from '../src/formula.js';
import { ChemistryError } from '../src/errors.js';

describe('parseFormula', () => {
  it('parses a simple molecule', () => {
    expect(parseFormula('H2O').atoms).toEqual({ H: 2, O: 1 });
  });

  it('parses an implicit count of 1', () => {
    expect(parseFormula('NaCl').atoms).toEqual({ Na: 1, Cl: 1 });
  });

  it('parses nested parentheses with a multiplier', () => {
    expect(parseFormula('Ca(OH)2').atoms).toEqual({ Ca: 1, O: 2, H: 2 });
  });

  it('parses doubly-nested groups', () => {
    expect(parseFormula('Al2(SO4)3').atoms).toEqual({ Al: 2, S: 3, O: 12 });
  });

  it('parses a net ionic charge', () => {
    const result = parseFormula('SO4^2-');
    expect(result.atoms).toEqual({ S: 1, O: 4 });
    expect(result.charge).toBe(-2);
  });

  it('parses a single-magnitude charge', () => {
    expect(parseFormula('Na^+').charge).toBe(1);
    expect(parseFormula('Cl^-').charge).toBe(-1);
  });

  it('throws CHEM002 for an unknown element symbol', () => {
    try {
      parseFormula('Xx2O');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ChemistryError);
      expect((err as ChemistryError).code).toBe('CHEM002');
    }
  });

  it('throws CHEM003 for an unmatched parenthesis', () => {
    try {
      parseFormula('Ca(OH2');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ChemistryError);
      expect((err as ChemistryError).code).toBe('CHEM003');
    }
  });

  it('throws CHEM003 for an empty formula', () => {
    expect(() => parseFormula('  ')).toThrow(ChemistryError);
  });

  it('throws CHEM003 for a lowercase-only leading token', () => {
    try {
      parseFormula('h2o');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ChemistryError);
      expect((err as ChemistryError).code).toBe('CHEM003');
    }
  });
});
