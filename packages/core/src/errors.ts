/**
 * Machine-readable error codes for chemistry validation. Documented in
 * docs/error-codes.md — keep the two in sync when adding a code.
 */
export type ChemistryErrorCode =
  | 'CHEM001' // Atom conservation failed
  | 'CHEM002' // Unknown element symbol
  | 'CHEM003' // Invalid formula syntax
  | 'CHEM004' // Invalid equation syntax
  | 'CHEM005' // Charge not conserved
  | 'CHEM008' // Balancing system unsolvable or ambiguous
  | 'CHEM010'; // Atomic number out of range (not 1-118)

export class ChemistryError extends Error {
  readonly code: ChemistryErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(code: ChemistryErrorCode, message: string, details?: Record<string, unknown>) {
    super(`${code}: ${message}`);
    this.name = 'ChemistryError';
    this.code = code;
    this.details = details;
  }
}
