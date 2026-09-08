import { ChemistryError } from './errors.js';

const PERIOD_ENDS = [2, 10, 18, 36, 54, 86, 118] as const;

/**
 * Per-period sequence of IUPAC group numbers (1-18), in atomic-number
 * order, one entry per element in that period. `null` marks the f-block
 * (lanthanides 57-71, actinides 89-103): whether La/Ac or Lu/Lr belong in
 * "group 3" is a live, unsettled IUPAC question, and the mainstream
 * periodic-table layout doesn't assign f-block elements a 1-18 group
 * number at all — `null` reflects that convention rather than taking a
 * position on the dispute.
 */
const GROUP_SEQUENCES: readonly (readonly (number | null)[])[] = [
  [1, 18], // period 1: H, He
  [1, 2, 13, 14, 15, 16, 17, 18], // period 2: Li-Ne (no d-block)
  [1, 2, 13, 14, 15, 16, 17, 18], // period 3: Na-Ar (no d-block)
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // period 4: K-Kr
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // period 5: Rb-Xe
  [1, 2, ...Array(15).fill(null), 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // period 6: Cs-Rn (La-Lu f-block)
  [1, 2, ...Array(15).fill(null), 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // period 7: Fr-Og (Ac-Lr f-block)
];

function assertValidAtomicNumber(atomicNumber: number): void {
  if (!Number.isInteger(atomicNumber) || atomicNumber < 1 || atomicNumber > 118) {
    throw new ChemistryError(
      'CHEM010',
      `Atomic number ${atomicNumber} is out of range: must be an integer from 1 to 118.`,
      { atomicNumber },
    );
  }
}

/** The periodic table period (row), 1-7, for a given atomic number. */
export function getPeriod(atomicNumber: number): number {
  assertValidAtomicNumber(atomicNumber);
  return PERIOD_ENDS.findIndex((end) => atomicNumber <= end) + 1;
}

/**
 * The IUPAC group (column), 1-18, for a given atomic number, or `null`
 * for an f-block element (see {@link GROUP_SEQUENCES}).
 */
export function getGroup(atomicNumber: number): number | null {
  assertValidAtomicNumber(atomicNumber);
  const period = getPeriod(atomicNumber);
  const periodStart = period === 1 ? 1 : PERIOD_ENDS[period - 2]! + 1;
  const row = GROUP_SEQUENCES[period - 1]!;
  return row[atomicNumber - periodStart] as number | null;
}
