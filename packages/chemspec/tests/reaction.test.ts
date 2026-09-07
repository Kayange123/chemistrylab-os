import { describe, expect, it } from 'vitest';
import { reactionSchema } from '../src/reaction.js';

const validReaction = {
  id: 'hydrogen-combustion',
  titleKey: 'reaction.hydrogen-combustion.title',
  equation: {
    reactants: [
      { molecule: 'H2', coefficient: 2 },
      { molecule: 'O2', coefficient: 1 },
    ],
    products: [{ molecule: 'H2O', coefficient: 2 }],
  },
  reaction: {
    family: 'combustion',
    reversible: false,
    thermalEffect: 'exothermic',
  },
  learning: {
    conceptKeys: ['concept.stoichiometry', 'concept.conservation-of-mass'],
  },
  accessibility: {
    descriptionKey: 'reaction.hydrogen-combustion.accessibility',
  },
};

describe('reactionSchema', () => {
  it('accepts a well-formed reaction and fills in defaults', () => {
    const result = reactionSchema.parse(validReaction);
    expect(result.schemaVersion).toBe('0.1');
    expect(result.provenance.review.scientificStatus).toBe('unverified');
    expect(result.conditions.ignitionRequired).toBe(false);
  });

  it('rejects a reaction marked verified without any source', () => {
    const invalid = {
      ...validReaction,
      provenance: {
        sources: [],
        review: { scientificStatus: 'verified' },
      },
    };
    expect(() => reactionSchema.parse(invalid)).toThrow();
  });

  it('accepts a verified reaction when a source is present', () => {
    const withSource = {
      ...validReaction,
      provenance: {
        sources: [{ organization: 'IUPAC', reference: 'Nomenclature of Inorganic Chemistry' }],
        review: { scientificStatus: 'verified' },
      },
    };
    expect(() => reactionSchema.parse(withSource)).not.toThrow();
  });

  it('rejects an id that is not kebab-case', () => {
    expect(() => reactionSchema.parse({ ...validReaction, id: 'Hydrogen_Combustion' })).toThrow();
  });

  it('rejects a titleKey that is not a dotted i18n key', () => {
    expect(() =>
      reactionSchema.parse({ ...validReaction, titleKey: 'Hydrogen Combustion' }),
    ).toThrow();
  });
});
