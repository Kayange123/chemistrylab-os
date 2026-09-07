import { parseEquation } from './equation.js';
import { parseFormula } from './formula.js';
import { ChemistryError } from './errors.js';
import * as F from './fraction.js';
import type { Fraction } from './fraction.js';

export interface BalanceResult {
  readonly balanced: true;
  /** The balanced equation re-rendered with computed coefficients. */
  readonly equation: string;
  /** Coefficients in species order: all reactants, then all products. */
  readonly coefficients: readonly number[];
}

/**
 * Balances a chemical equation using linear algebra over the rationals: the
 * per-element atom counts form a homogeneous linear system, and a balanced
 * set of coefficients is the system's integer null-space vector.
 *
 * Any coefficients already present in `equationString` are ignored — this
 * always (re)computes coefficients from the species alone, so the
 * playground and any future caller share one balancing algorithm rather
 * than a demo-only shortcut.
 *
 * v0.1 scope: supports reactions whose atom-count matrix has a
 * one-dimensional null space — true for the overwhelming majority of
 * synthesis, decomposition, combustion, and displacement reactions taught
 * at secondary level. Equations needing an auxiliary constraint (e.g. some
 * redox half-reactions balanced by electron transfer) raise CHEM008 rather
 * than guessing; see docs/error-codes.md.
 */
export function balanceEquation(equationString: string): BalanceResult {
  const parsed = parseEquation(equationString);
  const species = [
    ...parsed.reactants.map((t) => t.formula),
    ...parsed.products.map((t) => t.formula),
  ];
  const reactantCount = parsed.reactants.length;

  const perSpeciesAtoms = species.map((formula) => parseFormula(formula).atoms);
  const elements = [...new Set(perSpeciesAtoms.flatMap((atoms) => Object.keys(atoms)))].sort();

  // Rows = elements, columns = species. Reactant columns carry positive atom
  // counts, product columns negative — a solution vector x with Mx = 0
  // means "reactant atoms - product atoms = 0" for every element.
  const matrix: Fraction[][] = elements.map((element) =>
    perSpeciesAtoms.map((atoms, col) => {
      const count = atoms[element] ?? 0;
      const sign = col < reactantCount ? 1 : -1;
      return F.fraction(sign * count);
    }),
  );

  const solution = solveNullSpace(matrix, species.length, equationString);
  const coefficients = toMinimalIntegers(solution, equationString);

  const rendered = renderEquation(parsed.reactants, parsed.products, coefficients);

  return { balanced: true, equation: rendered, coefficients };
}

function solveNullSpace(
  matrix: Fraction[][],
  columnCount: number,
  equationString: string,
): Fraction[] {
  const rows = matrix.length;
  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < columnCount && pivotRow < rows; col++) {
    let selected = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (!F.isZero(matrix[r]![col]!)) {
        selected = r;
        break;
      }
    }
    if (selected === -1) continue;

    [matrix[pivotRow], matrix[selected]] = [matrix[selected]!, matrix[pivotRow]!];
    const pivotVal = matrix[pivotRow]![col]!;
    matrix[pivotRow] = matrix[pivotRow]!.map((v) => F.div(v, pivotVal));

    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue;
      const factor = matrix[r]![col]!;
      if (F.isZero(factor)) continue;
      matrix[r] = matrix[r]!.map((v, c) => F.sub(v, F.mul(factor, matrix[pivotRow]![c]!)));
    }

    pivotCols.push(col);
    pivotRow++;
  }

  const freeCols: number[] = [];
  for (let col = 0; col < columnCount; col++) {
    if (!pivotCols.includes(col)) freeCols.push(col);
  }

  if (freeCols.length === 0) {
    throw new ChemistryError(
      'CHEM008',
      `"${equationString}" has no non-trivial balanced solution — check that every species is actually connected by shared elements.`,
      { equation: equationString },
    );
  }
  if (freeCols.length > 1) {
    throw new ChemistryError(
      'CHEM008',
      `"${equationString}" cannot be balanced automatically: the system is underdetermined (needs ${freeCols.length} auxiliary constraints, e.g. electron balance for a redox half-reaction). Balance it manually or split into half-reactions.`,
      { equation: equationString, freeVariableCount: freeCols.length },
    );
  }

  const freeCol = freeCols[0]!;
  const solution: Fraction[] = new Array(columnCount).fill(F.ZERO);
  solution[freeCol] = F.ONE;
  for (let i = 0; i < pivotCols.length; i++) {
    const col = pivotCols[i]!;
    solution[col] = F.negate(matrix[i]![freeCol]!);
  }

  return solution;
}

function toMinimalIntegers(solution: readonly Fraction[], equationString: string): number[] {
  let lcm = 1n;
  for (const f of solution) {
    lcm = (lcm * f.den) / F.bigintGcd(lcm, f.den);
  }

  const ints = solution.map((f) => (f.num * (lcm / f.den)) as bigint);

  if (ints.some((n) => n === 0n)) {
    throw new ChemistryError(
      'CHEM008',
      `"${equationString}" cannot be balanced: one or more species has a zero coefficient in the only candidate solution, meaning it isn't actually part of a consistent reaction.`,
      { equation: equationString },
    );
  }

  const positive = ints.every((n) => n > 0n);
  const negative = ints.every((n) => n < 0n);
  if (!positive && !negative) {
    throw new ChemistryError(
      'CHEM008',
      `"${equationString}" cannot be balanced with all-positive coefficients given the species provided.`,
      { equation: equationString },
    );
  }

  const normalized = negative ? ints.map((n) => -n) : ints;
  let divisor = normalized[0]!;
  for (const n of normalized) divisor = F.bigintGcd(divisor, n);

  return normalized.map((n) => Number(n / divisor));
}

function renderEquation(
  reactants: readonly { formula: string }[],
  products: readonly { formula: string }[],
  coefficients: readonly number[],
): string {
  const renderSide = (terms: readonly { formula: string }[], offset: number): string =>
    terms
      .map((t, i) => {
        const coefficient = coefficients[offset + i]!;
        return coefficient === 1 ? t.formula : `${coefficient}${t.formula}`;
      })
      .join(' + ');

  return `${renderSide(reactants, 0)} -> ${renderSide(products, reactants.length)}`;
}
