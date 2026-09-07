/**
 * The current ChemSpec schema version.
 *
 * ChemSpec follows its own version line, independent of package versions.
 * A breaking change to any schema in this package requires a new schema
 * version and a migration note in the package README — see rfcs/0001-chemspec.md.
 */
export const CHEMSPEC_VERSION = '0.1' as const;

export type ChemSpecVersion = typeof CHEMSPEC_VERSION;
