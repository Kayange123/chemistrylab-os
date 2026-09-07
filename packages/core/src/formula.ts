import { ChemistryError } from './errors.js';
import { KNOWN_ELEMENT_SYMBOLS } from './generated/elements.js';

export interface ParsedFormula {
  /** The formula as given, trimmed but otherwise unmodified. */
  readonly formula: string;
  /** Element symbol -> atom count, e.g. { C: 1, H: 4 } for "CH4". */
  readonly atoms: Readonly<Record<string, number>>;
  /** Net ionic charge, e.g. -2 for "SO4^2-". Zero for neutral molecules. */
  readonly charge: number;
}

const CHARGE_SUFFIX = /\^(\d*)([+-])$/;

/**
 * Parses a molecular formula such as "H2O", "Ca(OH)2", or "SO4^2-" into its
 * per-element atom counts and net charge.
 *
 * Throws {@link ChemistryError} with code CHEM003 for malformed syntax
 * (unmatched parentheses, unexpected characters) or CHEM002 for a symbol
 * that isn't in the known element table (datasets/elements/elements.yaml).
 */
export function parseFormula(formula: string): ParsedFormula {
  const trimmed = formula.trim();
  if (trimmed.length === 0) {
    throw new ChemistryError('CHEM003', 'Formula must not be empty.', { formula });
  }

  let body = trimmed;
  let charge = 0;
  const chargeMatch = CHARGE_SUFFIX.exec(trimmed);
  if (chargeMatch) {
    const magnitude = chargeMatch[1] ? Number(chargeMatch[1]) : 1;
    const sign = chargeMatch[2] === '+' ? 1 : -1;
    charge = magnitude * sign;
    body = trimmed.slice(0, trimmed.length - chargeMatch[0].length);
  }

  const state: ParserState = { input: body, index: 0 };
  const atoms = parseGroup(state, trimmed);

  if (state.index !== body.length) {
    throw new ChemistryError(
      'CHEM003',
      `Unexpected character "${body[state.index]}" in formula "${trimmed}".`,
      { formula: trimmed, position: state.index },
    );
  }

  return { formula: trimmed, atoms, charge };
}

interface ParserState {
  readonly input: string;
  index: number;
}

function parseGroup(state: ParserState, originalFormula: string): Record<string, number> {
  const counts: Record<string, number> = {};

  while (state.index < state.input.length && state.input[state.index] !== ')') {
    const char = state.input[state.index];

    if (char === '(') {
      state.index++; // consume '('
      const inner = parseGroup(state, originalFormula);
      if (state.input[state.index] !== ')') {
        throw new ChemistryError('CHEM003', `Unmatched "(" in formula "${originalFormula}".`, {
          formula: originalFormula,
        });
      }
      state.index++; // consume ')'
      const multiplier = readInteger(state, 1);
      mergeInto(counts, inner, multiplier);
      continue;
    }

    if (!char || !/[A-Z]/.test(char)) {
      throw new ChemistryError(
        'CHEM003',
        `Expected an element symbol or "(" but found "${char ?? 'end of formula'}" in formula "${originalFormula}".`,
        { formula: originalFormula, position: state.index },
      );
    }

    const symbol = readSymbol(state);
    if (!KNOWN_ELEMENT_SYMBOLS.has(symbol)) {
      throw new ChemistryError(
        'CHEM002',
        `Unknown element symbol "${symbol}" in formula "${originalFormula}".`,
        { formula: originalFormula, symbol },
      );
    }
    const count = readInteger(state, 1);
    counts[symbol] = (counts[symbol] ?? 0) + count;
  }

  return counts;
}

function readSymbol(state: ParserState): string {
  const start = state.index;
  state.index++; // first uppercase letter already validated by the caller
  while (state.index < state.input.length && /[a-z]/.test(state.input[state.index] ?? '')) {
    state.index++;
  }
  return state.input.slice(start, state.index);
}

function readInteger(state: ParserState, fallback: number): number {
  const start = state.index;
  while (state.index < state.input.length && /[0-9]/.test(state.input[state.index] ?? '')) {
    state.index++;
  }
  if (state.index === start) return fallback;
  return Number(state.input.slice(start, state.index));
}

function mergeInto(
  target: Record<string, number>,
  source: Record<string, number>,
  multiplier: number,
): void {
  for (const [symbol, count] of Object.entries(source)) {
    target[symbol] = (target[symbol] ?? 0) + count * multiplier;
  }
}
