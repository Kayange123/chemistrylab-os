/**
 * Validates every chemistry dataset in the repository: schema shape,
 * atom/element well-formedness, and i18n key completeness. This is what
 * `pnpm validate:data` runs, and what CI runs on every PR that touches
 * `datasets/`.
 *
 * Error codes are documented in docs/error-codes.md — keep the two files
 * in sync when adding a check.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { parse } from 'yaml';

import { elementDatasetSchema } from '../packages/chemspec/src/element.js';
import { reactionSchema, type ReactionSpec } from '../packages/chemspec/src/reaction.js';
import { validateConservation } from '../packages/core/src/conservation.js';
import { ChemistryError } from '../packages/core/src/errors.js';
import { parseFormula } from '../packages/core/src/formula.js';

const repoRoot = path.resolve(import.meta.dirname, '..');

interface Problem {
  readonly code: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

let errorCount = 0;
let warningCount = 0;

function fail(code: string, message: string): Problem {
  errorCount++;
  return { code, message, severity: 'error' };
}

function warn(code: string, message: string): Problem {
  warningCount++;
  return { code, message, severity: 'warning' };
}

// --- English i18n dictionary: the source of truth every key must resolve against ---
const enDictPath = path.join(repoRoot, 'datasets', 'i18n', 'en.json');
const enDict: Record<string, string> = JSON.parse(readFileSync(enDictPath, 'utf-8'));
const knownI18nKeys = new Set(Object.keys(enDict).filter((k) => k !== '_meta'));

function checkI18nKey(key: string, problems: Problem[]): void {
  if (!knownI18nKeys.has(key)) {
    problems.push(fail('CHEM007', `i18n key "${key}" is not defined in datasets/i18n/en.json.`));
  }
}

// --- Elements ---
console.log('Checking elements...\n');
const elementsPath = path.join(repoRoot, 'datasets', 'elements', 'elements.yaml');
const rawElements = parse(readFileSync(elementsPath, 'utf-8'));
const elementsResult = elementDatasetSchema.safeParse(rawElements);
if (!elementsResult.success) {
  console.log(`✗ elements.yaml`);
  for (const issue of elementsResult.error.issues) {
    console.log(`  CHEM006: ${issue.path.join('.')}: ${issue.message}`);
    errorCount++;
  }
} else {
  const elementProblems: Problem[] = [];
  for (const element of elementsResult.data) {
    checkI18nKey(element.nameKey, elementProblems);
  }
  if (elementProblems.length === 0) {
    console.log(`✓ elements.yaml (${elementsResult.data.length} elements)`);
  } else {
    console.log(`✗ elements.yaml`);
    for (const p of elementProblems) console.log(`  ${p.code}: ${p.message}`);
  }
}

// --- Reactions ---
const reactionsDir = path.join(repoRoot, 'datasets', 'reactions');
const reactionFiles = readdirSync(reactionsDir).filter((f) => f.endsWith('.yaml'));

console.log(`\nChecking ${reactionFiles.length} reactions...\n`);

const seenIds = new Set<string>();

for (const file of reactionFiles) {
  const problems: Problem[] = [];
  const filePath = path.join(reactionsDir, file);
  const raw = parse(readFileSync(filePath, 'utf-8'));

  const result = reactionSchema.safeParse(raw);
  if (!result.success) {
    console.log(`✗ ${file}`);
    for (const issue of result.error.issues) {
      console.log(`  CHEM006: ${issue.path.join('.')}: ${issue.message}`);
      errorCount++;
    }
    continue;
  }

  const reaction: ReactionSpec = result.data;

  if (seenIds.has(reaction.id)) {
    problems.push(fail('CHEM006', `Duplicate reaction id "${reaction.id}".`));
  }
  seenIds.add(reaction.id);

  if (reaction.id !== path.basename(file, '.yaml')) {
    problems.push(
      warn(
        'CHEM009',
        `File name "${file}" does not match reaction id "${reaction.id}" (cosmetic, but keeps the dataset browsable).`,
      ),
    );
  }

  // Formula validity (CHEM002/CHEM003 surface as thrown ChemistryErrors).
  const allTerms = [...reaction.equation.reactants, ...reaction.equation.products];
  for (const term of allTerms) {
    try {
      parseFormula(term.molecule);
    } catch (err) {
      if (err instanceof ChemistryError) {
        problems.push(fail(err.code, err.message));
      } else {
        throw err;
      }
    }
  }

  // Atom conservation (CHEM001) — only meaningful if every formula parsed.
  if (problems.every((p) => p.code !== 'CHEM002' && p.code !== 'CHEM003')) {
    const conservation = validateConservation({
      reactants: reaction.equation.reactants.map((t) => ({
        formula: t.molecule,
        coefficient: t.coefficient,
      })),
      products: reaction.equation.products.map((t) => ({
        formula: t.molecule,
        coefficient: t.coefficient,
      })),
    });
    if (!conservation.balanced) {
      const lines = conservation.differences
        .map((d) => `Element ${d.element}: reactants ${d.reactants}, products ${d.products}`)
        .join('; ');
      problems.push(fail('CHEM001', `Atom conservation failed. ${lines}`));
    }
  }

  // i18n key completeness.
  checkI18nKey(reaction.titleKey, problems);
  checkI18nKey(reaction.accessibility.descriptionKey, problems);
  for (const key of reaction.learning.conceptKeys) checkI18nKey(key, problems);

  const hasErrors = problems.some((p) => p.severity === 'error');
  if (problems.length === 0) {
    console.log(`✓ ${reaction.id}`);
  } else {
    console.log(`${hasErrors ? '✗' : '⚠'} ${reaction.id}`);
    for (const p of problems) console.log(`  ${p.code}: ${p.message}`);
  }
}

console.log('');
console.log(`${reactionFiles.length} reaction file(s) checked`);
console.log(`${warningCount} warning(s)`);
console.log(`${errorCount} error(s)`);

if (errorCount > 0) {
  process.exitCode = 1;
}
