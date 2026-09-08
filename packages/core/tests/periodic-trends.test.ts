import { describe, expect, it } from 'vitest';
import { getGroup, getPeriod } from '../src/periodic-trends.js';
import { ChemistryError } from '../src/errors.js';

describe('getPeriod', () => {
  it('places hydrogen and helium in period 1', () => {
    expect(getPeriod(1)).toBe(1);
    expect(getPeriod(2)).toBe(1);
  });

  it('places elements at period boundaries correctly', () => {
    expect(getPeriod(10)).toBe(2); // Ne, end of period 2
    expect(getPeriod(11)).toBe(3); // Na, start of period 3
    expect(getPeriod(36)).toBe(4); // Kr, end of period 4
    expect(getPeriod(37)).toBe(5); // Rb, start of period 5
  });

  it('places lanthanides and actinides in periods 6 and 7', () => {
    expect(getPeriod(71)).toBe(6); // Lu
    expect(getPeriod(103)).toBe(7); // Lr
  });

  it('places oganesson in period 7', () => {
    expect(getPeriod(118)).toBe(7);
  });

  it('throws CHEM010 for an atomic number outside 1-118', () => {
    expect(() => getPeriod(0)).toThrow(ChemistryError);
    expect(() => getPeriod(119)).toThrow(ChemistryError);
    expect(() => getPeriod(1.5)).toThrow(ChemistryError);
  });
});

describe('getGroup', () => {
  it('places helium in group 18, not group 2, despite its s2 configuration', () => {
    expect(getGroup(2)).toBe(18);
  });

  it('assigns main-group elements correctly', () => {
    expect(getGroup(5)).toBe(13); // B
    expect(getGroup(56)).toBe(2); // Ba
  });

  it('assigns d-block elements correctly in periods without an f-block gap', () => {
    expect(getGroup(30)).toBe(12); // Zn
  });

  it('returns null for lanthanides and actinides, not a disputed group 3', () => {
    expect(getGroup(57)).toBeNull(); // La
    expect(getGroup(71)).toBeNull(); // Lu
    expect(getGroup(89)).toBeNull(); // Ac
    expect(getGroup(103)).toBeNull(); // Lr
  });

  it('resumes at group 4 immediately after the lanthanide f-block gap', () => {
    expect(getGroup(72)).toBe(4); // Hf
  });

  it('resumes at group 4 immediately after the actinide f-block gap', () => {
    expect(getGroup(104)).toBe(4); // Rf
  });

  it('throws CHEM010 for an atomic number outside 1-118', () => {
    expect(() => getGroup(0)).toThrow(ChemistryError);
    expect(() => getGroup(119)).toThrow(ChemistryError);
  });
});
