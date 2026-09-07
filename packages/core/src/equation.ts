import { ChemistryError } from './errors.js';

export interface EquationTerm {
  readonly coefficient: number;
  readonly formula: string;
}

export interface ParsedEquation {
  readonly reactants: readonly EquationTerm[];
  readonly products: readonly EquationTerm[];
}

const ARROW = /->|→|=/;
const TERM = /^(\d+)?\s*(.+)$/;

/**
 * Parses a chemical equation such as "2H2 + O2 -> 2H2O" (arrows "->", "→",
 * and "=" are all accepted) into reactant and product terms. Each term's
 * formula is *not* validated here — parseEquation only checks syntactic
 * shape. Call {@link countAtoms} or {@link balanceEquation} to validate
 * and interpret the formulas themselves.
 *
 * Throws {@link ChemistryError} with code CHEM004 for missing arrows, empty
 * sides, or unparsable terms.
 */
export function parseEquation(equation: string): ParsedEquation {
  const trimmed = equation.trim();
  const arrowMatch = ARROW.exec(trimmed);
  if (!arrowMatch) {
    throw new ChemistryError(
      'CHEM004',
      `Equation "${equation}" is missing a reaction arrow ("->", "→", or "=").`,
      { equation },
    );
  }

  const left = trimmed.slice(0, arrowMatch.index);
  const right = trimmed.slice(arrowMatch.index + arrowMatch[0].length);

  return {
    reactants: parseSide(left, equation),
    products: parseSide(right, equation),
  };
}

function parseSide(side: string, originalEquation: string): EquationTerm[] {
  const parts = side
    .split('+')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (parts.length === 0) {
    throw new ChemistryError('CHEM004', `Equation "${originalEquation}" has an empty side.`, {
      equation: originalEquation,
    });
  }

  return parts.map((part) => {
    const match = TERM.exec(part);
    if (!match?.[2]) {
      throw new ChemistryError(
        'CHEM004',
        `Could not parse term "${part}" in equation "${originalEquation}".`,
        { equation: originalEquation, term: part },
      );
    }
    const coefficient = match[1] ? Number(match[1]) : 1;
    return { coefficient, formula: match[2].trim() };
  });
}
