import { z } from 'zod';
import { CHEMSPEC_VERSION } from './version.js';
import { i18nKeySchema } from './i18n.js';

/**
 * A chemical element.
 *
 * v0.1 deliberately ships only immutable, uncontroversial IUPAC facts
 * (symbol, atomic number). Atomic mass, electronegativity, and other
 * measured quantities are Phase 1 work (see ROADMAP.md) because they carry
 * units, uncertainty, and revision history that this schema does not yet
 * model — shipping them now would mean fabricating precision we haven't
 * sourced.
 */
export const elementSchema = z.strictObject({
  schemaVersion: z.literal(CHEMSPEC_VERSION).default(CHEMSPEC_VERSION),
  symbol: z.string().regex(/^[A-Z][a-z]?$/, 'Element symbols are 1-2 characters, e.g. "H", "Na".'),
  atomicNumber: z.number().int().min(1).max(118),
  nameKey: i18nKeySchema.describe('i18n key, e.g. "element.hydrogen.name".'),
});

export type Element = z.infer<typeof elementSchema>;

export const elementDatasetSchema = z.array(elementSchema);
