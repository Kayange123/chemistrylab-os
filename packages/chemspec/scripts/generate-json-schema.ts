/**
 * Generates the language-neutral JSON Schema artifacts committed under
 * schemas/<version>/. Zod is our TypeScript-side validation tool, but the
 * canonical, framework-independent ChemSpec artifact is JSON Schema — any
 * tool in any language can validate against it without touching Node.
 *
 * Uses Zod's own built-in `z.toJSONSchema` (no separate conversion
 * library — see the migration note in packages/chemspec/README.md).
 * `io: 'input'` matches what a document author actually has to supply:
 * fields with `.default()` are correctly left out of `required`, since
 * omitting them is exactly what a `.default()` is for.
 *
 * Run via `pnpm generate:schemas`. CI re-runs this and fails the build if
 * the committed output would change, so the two never drift.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { z } from 'zod';
import { CHEMSPEC_VERSION } from '../src/version.js';
import { elementSchema } from '../src/element.js';
import { reactionSchema } from '../src/reaction.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'schemas', CHEMSPEC_VERSION);
mkdirSync(outDir, { recursive: true });

const targets: Array<[name: string, schema: z.ZodType]> = [
  ['element', elementSchema],
  ['reaction', reactionSchema],
];

for (const [name, schema] of targets) {
  const jsonSchema = z.toJSONSchema(schema, { io: 'input' });
  const outFile = path.join(outDir, `${name}.schema.json`);
  writeFileSync(outFile, `${JSON.stringify(jsonSchema, null, 2)}\n`, 'utf-8');
  console.log(`wrote ${path.relative(process.cwd(), outFile)}`);
}
