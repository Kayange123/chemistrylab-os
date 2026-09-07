import en from '../../../datasets/i18n/en.json';

/**
 * Minimal i18n lookup for v0.1 — a real runtime (locale switching, plurals,
 * interpolation) is planned as @chemistrylab/i18n (see ARCHITECTURE.md).
 * For now this just resolves a ChemSpec i18n key against the English
 * dictionary, which keeps every string a UI component shows traceable back
 * to a single source file instead of being embedded ad hoc.
 */
const dictionary = en as unknown as Record<string, string>;

export function t(key: string): string {
  return dictionary[key] ?? key;
}
