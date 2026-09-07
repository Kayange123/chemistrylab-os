import { z } from 'zod';
import { i18nKeySchema } from './i18n.js';

/**
 * Every learner-facing ChemSpec entry (reaction, molecule, element, lesson)
 * must carry a text-equivalent description that does not depend on colour,
 * motion, or spatial layout — see ACCESSIBILITY.md. This is validated, not
 * optional, because retrofitting accessibility is far more expensive than
 * requiring it at data-entry time.
 */
export const accessibilityDescriptionSchema = z.object({
  descriptionKey: i18nKeySchema.describe(
    'i18n key resolving to a plain-language, colour- and motion-independent description.',
  ),
});

export type AccessibilityDescription = z.infer<typeof accessibilityDescriptionSchema>;
