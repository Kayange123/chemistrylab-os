import { z } from 'zod';

/**
 * An i18n key is a stable, language-neutral identifier that resolves to a
 * translated string at render time (see packages/i18n, planned, and the
 * scaffolds in datasets/i18n/*.json for now).
 *
 * ChemSpec data files must never embed human-facing text directly — only
 * keys. This keeps scientific identifiers language-neutral (§16 of the
 * project brief) and means adding a language never touches dataset files.
 *
 * Convention: dot-separated, lowercase, kebab-case segments, e.g.
 *   reaction.hydrogen-combustion.title
 *   element.oxygen.name
 *   concept.reaction-rate
 */
export const i18nKeySchema = z
  .string()
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)+$/,
    'i18n keys must be dot-separated, kebab-case segments, e.g. "reaction.hydrogen-combustion.title"',
  )
  .brand<'I18nKey'>();

export type I18nKey = z.infer<typeof i18nKeySchema>;
