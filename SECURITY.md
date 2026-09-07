# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for a security
vulnerability.

<!-- TODO(founding maintainer): replace with a real, monitored contact
     (an email address, or enable GitHub's private vulnerability
     reporting for this repo under Settings -> Security) before this
     project has external users. -->

Report privately to: `<TODO: security-reporting-contact>`

Please include:

- What you found and where (file/package/URL)
- Steps to reproduce
- What you think the impact is

We'll acknowledge receipt as soon as we can and follow up once we've
assessed it. There is no bug bounty program.

## Supported versions

Pre-1.0, only the latest commit on `main` is supported. There is no
long-term-support branch yet.

## What's in scope

- The `@chemistrylab/*` packages and `apps/web`
- CI/CD configuration (`.github/workflows/`)
- Dependency supply-chain issues (see below)

## What's explicitly out of scope

This is a client-side, no-backend educational tool in v0.1 — there is no
server, no user accounts, and no database to compromise (see
`ARCHITECTURE.md` and `ROADMAP.md`). If that changes in a later phase,
this document will be updated to match.

## Security principles this project holds itself to

- **ChemSpec is data, never code.** Reaction, element, and (eventually)
  lesson definitions are validated data (YAML validated against
  `@chemistrylab/chemspec`'s schemas). Nothing in this repository uses
  `eval`, `new Function`, or any other dynamic-code-execution mechanism
  to interpret them, and nothing should. A PR that introduces one is a
  security regression, not a style issue.
- **No secrets in frontend code.** `apps/web` is a static, client-side
  application. It should never gain an API key, token, or credential of
  any kind — if a future feature needs one, it needs a backend design
  discussion first (see `ARCHITECTURE.md`), not a hardcoded value.
- **Minimal CI permissions.** `.github/workflows/ci.yml` requests
  `contents: read` and nothing else. Widening workflow permissions
  requires a specific justification in the PR that does it.
- **Dependencies are kept current** via Dependabot
  (`.github/dependabot.yml`), grouped to keep the PR volume manageable.
  Security-relevant updates should not be batched behind unrelated
  dependency bumps.
- **User-provided input is parsed, not executed.** The equation/formula
  parsers in `@chemistrylab/core` (`parseFormula`, `parseEquation`) treat
  all input as untrusted data and fail closed with a typed
  `ChemistryError` (see `docs/error-codes.md`) rather than throwing an
  unhandled exception or silently misinterpreting malformed input.

## Disclosure

We'll credit reporters (unless they ask not to be) once a fix is
released, and we'll aim to disclose responsibly — giving a fix time to
ship before any public write-up.
