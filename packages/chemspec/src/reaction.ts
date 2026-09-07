import { z } from 'zod';
import { CHEMSPEC_VERSION } from './version.js';
import { i18nKeySchema } from './i18n.js';
import { accessibilityDescriptionSchema } from './accessibility.js';
import { provenanceSchema } from './provenance.js';

/**
 * A single reactant or product term in a chemical equation.
 *
 * `molecule` is a molecular formula string (e.g. "H2O", "Ca(OH)2") parsed by
 * @chemistrylab/core — ChemSpec only validates its shape, not its
 * chemistry. `coefficient` is the stoichiometric coefficient as authored;
 * the reaction engine treats it as a starting point, not a guarantee — see
 * CHEM001 in docs/error-codes.md.
 */
export const equationTermSchema = z.object({
  molecule: z
    .string()
    .min(1)
    .regex(/^[A-Za-z0-9()]+(\^[0-9]*[+-])?$/, 'Expected a molecular formula, e.g. "H2O".'),
  coefficient: z.number().int().min(1).default(1),
});

export type EquationTerm = z.infer<typeof equationTermSchema>;

export const equationSchema = z.object({
  reactants: z.array(equationTermSchema).min(1),
  products: z.array(equationTermSchema).min(1),
});

export type Equation = z.infer<typeof equationSchema>;

export const reactionFamilySchema = z.enum([
  'synthesis',
  'decomposition',
  'combustion',
  'single-displacement',
  'double-displacement',
  'acid-base',
  'precipitation',
  'redox',
  'other',
]);

export type ReactionFamily = z.infer<typeof reactionFamilySchema>;

export const thermalEffectSchema = z.enum([
  'exothermic',
  'endothermic',
  'thermoneutral',
  'unknown',
]);

export type ThermalEffect = z.infer<typeof thermalEffectSchema>;

/**
 * Educational conditions that gate or influence the reaction in the
 * simulation. This list intentionally stays small in v0.1 (§9); pressure,
 * catalyst, surface area, and pH are named in ROADMAP.md as Phase 4 work
 * and can be added without breaking existing entries.
 */
export const conditionsSchema = z.object({
  ignitionRequired: z.boolean().default(false),
  defaultTemperatureCelsius: z.number().optional(),
});

export type Conditions = z.infer<typeof conditionsSchema>;

export const learningSchema = z.object({
  conceptKeys: z.array(i18nKeySchema).min(1).describe('e.g. "concept.stoichiometry".'),
});

export type Learning = z.infer<typeof learningSchema>;

/**
 * Visualization is a set of *hints*, not a guarantee of scientific
 * simulation fidelity. Where a transition state or mechanism is not
 * modelled, the renderer must present the animation as conceptual — see
 * §6 and ARCHITECTURE.md § "Educational vs. research-grade simulation".
 */
export const visualizationHintsSchema = z.object({
  particles: z.boolean().default(true),
  bonds: z.boolean().default(true),
  energyProfile: z.boolean().default(false),
});

export type VisualizationHints = z.infer<typeof visualizationHintsSchema>;

export const reactionSchema = z.object({
  schemaVersion: z.literal(CHEMSPEC_VERSION).default(CHEMSPEC_VERSION),
  id: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id must be kebab-case, e.g. "hydrogen-combustion".'),
  titleKey: i18nKeySchema,
  equation: equationSchema,
  reaction: z.object({
    family: reactionFamilySchema,
    reversible: z.boolean().default(false),
    thermalEffect: thermalEffectSchema,
  }),
  conditions: conditionsSchema.default({ ignitionRequired: false }),
  learning: learningSchema,
  accessibility: accessibilityDescriptionSchema,
  visualization: visualizationHintsSchema.default({
    particles: true,
    bonds: true,
    energyProfile: false,
  }),
  provenance: provenanceSchema.default({
    sources: [],
    review: { scientificStatus: 'unverified' },
  }),
});

export type ReactionSpec = z.infer<typeof reactionSchema>;
