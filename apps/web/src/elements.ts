import { type Element, elementDatasetSchema } from '@chemistrylab/chemspec';
import { parse } from 'yaml';

import raw from '../../../datasets/elements/elements.yaml?raw';

/**
 * Loads the canonical element list directly from
 * datasets/elements/elements.yaml — the same file `pnpm validate:data`
 * checks — and validates it against the real ChemSpec schema at runtime.
 * Nothing about the element list is hardcoded here: add or edit an entry
 * in the dataset and it appears here with no code change.
 */
export const ELEMENTS: readonly Element[] = elementDatasetSchema.parse(parse(raw));
