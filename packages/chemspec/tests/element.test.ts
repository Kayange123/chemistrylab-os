import { describe, expect, it } from 'vitest';

import { elementSchema } from '../src/element.js';

const validElement = {
  symbol: 'H',
  atomicNumber: 1,
  nameKey: 'element.hydrogen.name',
};

const aSource = { organization: 'CIAAW', reference: 'Abridged Standard Atomic Weights 2024' };

describe('elementSchema', () => {
  it('accepts an element with only the v0.1 fields', () => {
    const result = elementSchema.parse(validElement);
    expect(result.atomicMass).toBeUndefined();
    expect(result.provenance).toBeUndefined();
  });

  it('rejects an unknown top-level property instead of silently dropping it', () => {
    expect(() => elementSchema.parse({ ...validElement, typoedField: true })).toThrow();
  });

  it('rejects atomicMass with no provenance', () => {
    expect(() => elementSchema.parse({ ...validElement, atomicMass: { value: 1.008 } })).toThrow();
  });

  it('rejects atomicMass with provenance but no sources', () => {
    expect(() =>
      elementSchema.parse({
        ...validElement,
        atomicMass: { value: 1.008 },
        provenance: { sources: [], review: { scientificStatus: 'unverified' } },
      }),
    ).toThrow();
  });

  it('accepts atomicMass when at least one source is cited', () => {
    const withSource = {
      ...validElement,
      atomicMass: { value: 1.008, uncertainty: 0.0002 },
      provenance: { sources: [aSource], review: { scientificStatus: 'unverified' } },
    };
    expect(() => elementSchema.parse(withSource)).not.toThrow();
  });

  it('accepts atomicMass with no uncertainty given', () => {
    const withSource = {
      ...validElement,
      atomicMass: { value: 1.008 },
      provenance: { sources: [aSource] },
    };
    expect(() => elementSchema.parse(withSource)).not.toThrow();
  });

  it('rejects a non-positive atomicMass value', () => {
    expect(() =>
      elementSchema.parse({
        ...validElement,
        atomicMass: { value: -1 },
        provenance: { sources: [aSource] },
      }),
    ).toThrow();
  });

  it('rejects a negative uncertainty', () => {
    expect(() =>
      elementSchema.parse({
        ...validElement,
        atomicMass: { value: 1.008, uncertainty: -0.0002 },
        provenance: { sources: [aSource] },
      }),
    ).toThrow();
  });

  it('rejects an unknown property inside atomicMass', () => {
    expect(() =>
      elementSchema.parse({
        ...validElement,
        atomicMass: { value: 1.008, typoedField: true },
        provenance: { sources: [aSource] },
      }),
    ).toThrow();
  });
});
