// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/node_modules/**',
      'packages/chemspec/schemas/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Groups: external packages, then relative imports, each block
      // alphabetized. Auto-fixable via `eslint --fix` (an editor's ESLint
      // integration, or `npx eslint --fix <path>`) — pnpm's `lint` script
      // runs through turbo, which doesn't forward a bare --fix flag.
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    // CLI/reporting scripts talk to a terminal — console output is the point.
    files: ['scripts/**/*.ts', '**/scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
);
