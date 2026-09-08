# Contributing to ChemistryLab OS

Thanks for considering it. This project is built for more than
programmers — see "Contribution paths" below for what a chemist, teacher,
student, designer, or translator can do without touching TypeScript.

Coding agents: read [`AGENTS.md`](AGENTS.md) instead/first — same rules,
written as imperatives for a tool rather than narrative for a person.

## Code of conduct

Participation in this project means agreeing to
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). This project is used by
learners of many ages — hold yourself to the higher standard that implies.

## Setup

```bash
git clone https://github.com/Kayange123/chemistrylab-os.git
cd chemistrylab-os
pnpm install     # also runs codegen: element table + JSON Schema
pnpm dev         # playground at http://localhost:5173
```

Requires Node ≥22.13 and pnpm (`packageManager` in `package.json` pins the
exact version this repo was built against).

```bash
pnpm lint            # eslint, every package
pnpm typecheck       # tsc --noEmit, every package
pnpm test            # vitest, every package
pnpm test:e2e        # playwright smoke test (apps/web)
pnpm build           # tsc + vite build
pnpm validate:data   # validate every file under datasets/
pnpm format          # prettier --write
```

Run `pnpm lint && pnpm typecheck && pnpm test && pnpm validate:data && pnpm build`
before opening a PR — this is what CI runs.

## Contribution paths

| You are a... | Start here                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Developer    | `ARCHITECTURE.md`, then pick a `good first issue` label                                                                                                 |
| Chemist      | `CHEMISTRY_GUIDELINES.md`, `DATA_SOURCES.md` — review existing `unverified` reactions, or propose a new one via the "New reaction" issue template       |
| Teacher      | `EDUCATION_GUIDELINES.md` — propose a lesson via the "Propose a lesson" issue template, or give feedback on whether current content is classroom-usable |
| Student      | Try the playground, file a "Bug report" or usability issue, or pick a `good first issue`                                                                |
| Designer     | `ACCESSIBILITY.md` — interaction and visualization proposals                                                                                            |
| Translator   | `datasets/i18n/README.md` — add or fix a translation via the "Translation" issue template                                                               |

## Workflow

1. Fork/branch, make your change.
2. Keep PRs focused — one concern per PR. A bug fix doesn't need
   surrounding refactoring; a new reaction doesn't need a schema change
   bundled in.
3. Write commit messages that explain _why_, not just _what_ — this repo
   doesn't mandate Conventional Commits, but a clear prefix (`fix:`,
   `feat:`, `docs:`, `chore:`) is welcome and keeps history scannable.
4. Fill in the PR template, including which review dimensions apply (see
   below).
5. PRs are squash-merged. CI must pass — see `.github/workflows/ci.yml`.

## Review dimensions

Not every PR needs every kind of review — check what applies in the PR
template:

- **`engineering-review`** — code quality, tests, API design. Applies to
  almost everything.
- **`chemistry-review`** — **mandatory** for `datasets/reactions/`,
  `datasets/elements/`, or chemistry logic in `packages/core`. See
  `CHEMISTRY_GUIDELINES.md`.
- **`education-review`** — recommended for learning-concept tagging,
  accessibility descriptions' pedagogical clarity, or anything
  classroom-facing. See `EDUCATION_GUIDELINES.md`.
- **`accessibility-review`** — **mandatory** for `apps/web` UI changes
  or a schema's `accessibility.*` field. See `ACCESSIBILITY.md`.
- **`data-review`** — **mandatory** for provenance/source changes. See
  `DATA_SOURCES.md`.

CI passing is never treated as proof of scientific correctness (see
`CHEMISTRY_GUIDELINES.md`) — these review dimensions exist because
different kinds of correctness need different kinds of reviewers.

## Labels

- `good first issue` / `help wanted` — start here if you're new
- `chemistry` / `education` / `accessibility` / `localization` /
  `simulation` / `documentation` — subject-area labels

## Adding scientific content

See [`AGENTS.md`](AGENTS.md) § "Adding a reaction" for the mechanical
steps (they're the same whether you're a human or an agent), and
[`CHEMISTRY_GUIDELINES.md`](CHEMISTRY_GUIDELINES.md) for what makes an
addition acceptable. Short version: every new entry starts
`scientificStatus: unverified`; don't flip that yourself.

## Architecture and schema changes

Read [`ARCHITECTURE.md`](ARCHITECTURE.md) first — in particular, check
whether the package you want to add is already in its "planned, not yet
built" table (if so, it's deferred on purpose; raise it rather than
building it unprompted). Anything that could break an existing ChemSpec
document, or changes a public package API, needs an RFC — see
[`rfcs/README.md`](rfcs/README.md).

## Code style

- No comments explaining _what_ code does — name things well instead.
  Comments are for _why_ (a non-obvious constraint, a cited limitation,
  a workaround).
- No `eval`/`new Function` to interpret data — see `SECURITY.md`.
- Don't add abstractions, config flags, or speculative "for later"
  scaffolding beyond what the current change needs.
- Prettier + ESLint config in the repo is the source of truth; run
  `pnpm format` rather than hand-formatting.
- Import order (external packages, then relative imports, each block
  alphabetized) is enforced by ESLint, not Prettier — an editor's ESLint
  auto-fix (or `npx eslint --fix <path>`) sorts them; `pnpm format` alone
  won't.

## Where to find work

[`GOOD_FIRST_ISSUES.md`](GOOD_FIRST_ISSUES.md) lists concrete starting
points that don't require understanding the whole architecture.
