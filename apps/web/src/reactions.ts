import { reactionSchema, type ReactionSpec } from '@chemistrylab/chemspec';
import { parse } from 'yaml';

/**
 * Loads every curated reaction directly from datasets/reactions/*.yaml —
 * the same files `pnpm validate:data` checks — and validates each one
 * against the real ChemSpec schema at runtime. Nothing about the reaction
 * list is hardcoded here: add a YAML file to the dataset and it appears
 * in the picker with no code change.
 */
const rawFiles = import.meta.glob('/../../datasets/reactions/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function loadReactions(): ReactionSpec[] {
  const reactions = Object.values(rawFiles).map((raw) => reactionSchema.parse(parse(raw)));
  reactions.sort((a, b) => a.id.localeCompare(b.id));
  return reactions;
}

export const REACTIONS: readonly ReactionSpec[] = loadReactions();
