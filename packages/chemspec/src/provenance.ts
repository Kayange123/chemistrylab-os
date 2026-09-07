import { z } from 'zod';

/**
 * A citation for a scientific claim. Prefer authoritative bodies (IUPAC,
 * NIST, PubChem, peer-reviewed literature, recognized textbooks) over
 * arbitrary web pages. See DATA_SOURCES.md for sourcing policy.
 */
export const sourceSchema = z.object({
  organization: z.string().min(1),
  reference: z.string().min(1).describe('Title, DOI, URL, or textbook citation.'),
  accessedAt: z.string().date().optional(),
});

export type Source = z.infer<typeof sourceSchema>;

/**
 * Scientific review status. `unverified` is the default and safe starting
 * point for every new dataset entry — it is what a contributor (human or
 * AI agent) produces before a chemist has reviewed it. Only a scientific
 * reviewer should move an entry to `verified`; see CHEMISTRY_GUIDELINES.md.
 */
export const scientificStatusSchema = z.enum(['unverified', 'in-review', 'verified', 'disputed']);

export type ScientificStatus = z.infer<typeof scientificStatusSchema>;

export const reviewSchema = z.object({
  scientificStatus: scientificStatusSchema.default('unverified'),
  reviewedBy: z.string().optional().describe('GitHub handle of the reviewing chemist.'),
  lastVerifiedAt: z.string().date().optional(),
});

export type Review = z.infer<typeof reviewSchema>;

export const provenanceSchema = z
  .object({
    sources: z.array(sourceSchema).default([]),
    review: reviewSchema.default({ scientificStatus: 'unverified' }),
  })
  .refine((p) => p.review.scientificStatus !== 'verified' || p.sources.length > 0, {
    message: 'An entry cannot be marked "verified" without at least one source citation.',
    path: ['review', 'scientificStatus'],
  });

export type Provenance = z.infer<typeof provenanceSchema>;
