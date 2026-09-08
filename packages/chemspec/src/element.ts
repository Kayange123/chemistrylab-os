import { z } from 'zod';
import { CHEMSPEC_VERSION } from './version.js';
import { i18nKeySchema } from './i18n.js';
import { provenanceSchema } from './provenance.js';

/**
 * IUPAC/CIAAW *abridged* standard atomic weight: a single representative
 * value (quoted to 5 significant figures) published for general/
 * educational use, with the uncertainty CIAAW itself publishes alongside
 * it. Some elements' true standard atomic weight is an interval (natural
 * isotopic composition varies, e.g. boron, carbon, lithium) — `value` is
 * that interval's abridged single-value simplification, not the interval
 * itself; see DATA_SOURCES.md.
 */
export const atomicMassSchema = z.strictObject({
  value: z.number().positive(),
  uncertainty: z.number().nonnegative().optional(),
});

/**
 * A chemical element.
 *
 * v0.1 shipped only immutable, uncontroversial IUPAC facts (symbol, atomic
 * number). `atomicMass` (Phase 1, see ROADMAP.md) is the first measured
 * property, added optionally with its own provenance rather than fabricated
 * precision — see the cross-field refine below.
 */
export const elementSchema = z
  .strictObject({
    schemaVersion: z.literal(CHEMSPEC_VERSION).default(CHEMSPEC_VERSION),
    symbol: z
      .string()
      .regex(/^[A-Z][a-z]?$/, 'Element symbols are 1-2 characters, e.g. "H", "Na".'),
    atomicNumber: z.number().int().min(1).max(118),
    nameKey: i18nKeySchema.describe('i18n key, e.g. "element.hydrogen.name".'),
    atomicMass: atomicMassSchema.optional(),
    provenance: provenanceSchema.optional(),
  })
  .refine((e) => !e.atomicMass || (e.provenance?.sources?.length ?? 0) > 0, {
    message: 'An element with atomicMass must cite at least one source in provenance.sources.',
    path: ['provenance', 'sources'],
  });

export type Element = z.infer<typeof elementSchema>;

export const elementDatasetSchema = z.array(elementSchema);
