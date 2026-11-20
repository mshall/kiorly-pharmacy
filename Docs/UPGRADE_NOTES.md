# Upgrade notes: dependencies and toolchain (20 Nov 2026)

Everything was moved to the latest stable release one logical group at a time (toolchain, build/test tooling, backend libraries, NestJS, Prisma, frontend), with typecheck + lint + unit/e2e tests after each group and a full run at the end. Nothing was silenced with casts or `ts-ignore`. Nothing was deployed or applied (infra edits are validated with `tofu validate` / `tofu fmt` only).

## Versions, before -> after

| Area | Before | After |
|---|---|---|
| Node.js | `>=22` (CI 22, Lambda `nodejs22.x`) | **26 LTS** (`.nvmrc`, `engines >=26`, CI `node-version-file`, `Dockerfile.seed` on `lambda/nodejs:26`, Lambda `nodejs26.x`) |
| npm | 11.x | `engines npm >=11` (npm 12 also installs the lockfile cleanly) |
| TypeScript | 5.7.3 | 6.0.3 |
| NestJS (common/core/platform-express/testing) | 10.4.22 | 12.5.1 |
| `@nestjs/swagger` / `@nestjs/cli` / `@nestjs/schematics` | 7.4.2 / 10.4.9 / 10.2.3 | 12.1.2 / 12.0.15 / 12.0.16 |
| Prisma (client, CLI) | 6.19.3 | 7.10.1 (+ `@prisma/adapter-pg` 7.10.1, `pg` 8.23) |
| React / React DOM | 18.3.1 | 19.3.1 |
| Vite / `@vitejs/plugin-react` | 6.4.6 / 4.7.0 | 8.3.8 / 6.3.0 |
| Tailwind CSS | 3.4.19 (+ autoprefixer) | 4.3.5 (`@tailwindcss/postcss`, autoprefixer removed) |
| TanStack Query | 5.108 | 5.108.1 (already latest) |
| i18next / react-i18next | 24.2 / 15.7 | 27.2 / 18.0 |
| ESLint | 9.39 | 9.39 (pinned) |
| `eslint-plugin-react-hooks` | 5.2 | 7.1 (React Compiler rules on) |
| typescript-eslint / globals | 8.18 -> 8.73 / 15 -> 17 | |
| class-validator / jose / dotenv / pdfkit / fast-check | 0.14 / 5.10 / 16 / 0.20 / 3.23 | 0.15.1 / 6.2.18 / 18 / 0.21 / 4.10 |
| `@types/node` / `@types/express` | 22 / 4 | 26 / 5 |
| Playwright / axe | 1.65 / 4.14 | unchanged (already latest) |
| GitHub Actions | checkout v4/v6, setup-node v4, github-script v7, trivy 0.28.0, setup-tflint v4, setup-opentofu v1 | checkout v7, setup-node v7, github-script v9, trivy v0.36.0, setup-tflint v6, setup-opentofu v2 |
| OpenTofu / providers | 1.13.9, aws 6.73, random 3.9, archive 2.8 | already latest (constraints unchanged; `tofu validate` + `fmt -check` pass with `nodejs26.x`) |

Tests after the upgrade: 78 unit + 160 e2e, 24 web unit, 8 Playwright; `npm audit` reports 0 vulnerabilities; OpenAPI regeneration shows no semantic drift; `npm ci` from a clean clone works (vendored tarballs intact).

## Pinned / blocked (and what unblocks it)

| Item | Pinned at | Why | Unblocks when |
|---|---|---|---|
| TypeScript | 6.0.3 (latest is 7.0.2, the native compiler) | `typescript-eslint` 8.73 peers `typescript <6.1`, `@nestjs/swagger` 12 peers `^5.5 \|\| ^6`, `@nestjs/cli` 12 ships `~6.0`; the Prisma generator and Nest decorator metadata path are not validated on 7 | typescript-eslint, Nest CLI/swagger declare TS 7 support; then bump and re-run typecheck + build |
| Prisma | 7.10.1 (8.0.0 is only a release candidate) | no stable 8 yet | Prisma 8 GA: bump `prisma`, `@prisma/client`, `@prisma/adapter-pg` together and re-read the migration guide |
| PostgreSQL in CI | `postgres:16-alpine` | binding stack rule (production RDS parity); the suites also pass on the local PostgreSQL 18 cluster | founder/infra decision to move RDS to 18 |
| `@kiorex/contracts` | 1.6.0 tarball in `vendor/` | vendored on purpose; owned by `kiorex-contracts` | republish from `kiorex-contracts`, replace the tarball, `npm install` |
| ESLint / `@eslint/js` | 9.39.x (latest 10.15 / 10.0.1) | `eslint-plugin-jsx-a11y` 6.10.2 (latest) peers `eslint ^3..^9` | jsx-a11y publishes ESLint 10 support, then bump both |

## What changed in the code (and why)

- **TypeScript 6**: removed deprecated `baseUrl`; `tsconfig.build.json` now sets `rootDir: ./src` and keeps `tsBuildInfoFile` inside `dist/` (otherwise `nest build` deletes `dist/` and then emits nothing because the build-info says "up to date").
- **NestJS 12** (core packages are ESM-only; the CommonJS app loads them through `require(esm)`, fine on Node 26): `@types/express` 5; class-validator 0.15 (was held at 0.14 until swagger 12 because swagger 7 blocked hoisting it); the raw request body for HMAC verification now comes from `NestFactory.create(AppModule, { rawBody: true })` / `createNestApplication({ rawBody: true })` instead of a `verify` hook (removed from the body-parser option type).
- **Test runner**: API tests run under `@swc-node/register` (as before in pharmacy; lab moved off `tsx`). `tsx` converts ESM-only Nest packages to a second CJS copy, which broke `instanceof StreamableFile` (PDF downloads returned JSON). Production uses `node dist/main.js` and is unaffected.
- **Prisma 7**: `generator client` is now `prisma-client` (`output = ../src/generated/prisma`, `moduleFormat = "cjs"`; the directory is gitignored and created by `npm run prisma:generate -w api`, which `typecheck`/`build` already run); datasource URL moved to `apps/api/prisma.config.ts`; the runtime uses the `pg` driver adapter through `src/prisma/pg-adapter.ts`, which translates the Prisma-style URL parameters (`schema`, `connection_limit`, `connect_timeout`, `pool_timeout`) and keeps `sslmode=no-verify` working; all imports moved from `@prisma/client` to the generated client; `Prisma.Decimal.Value` -> `DecimalValue` (in `src/common/money.ts`); `Prisma.dmmf` in the schema smoke test replaced with `Prisma.ModelName` and `<Model>ScalarFieldEnum`. `prisma migrate dev` no longer generates, so `db:migrate` runs `prisma generate` after it. All migrations apply to an empty database and `prisma migrate diff` reports no difference. `Dockerfile.seed` installs `prisma@7.10.1` and ships `prisma.config.ts`. The CLI's transitive `effect` (ReDoS advisory, exact-pinned by `@prisma/config`) is overridden to 3.22.5 in the root `package.json`.
- **React 19 / react-hooks 7**: the new purity and set-state-in-effect rules were fixed in code (lazy `useState` initialisers for `Date.now()`, state derived during render instead of effects, `.then` instead of sync `setState` in effect callbacks, a loop instead of a reassigned closure variable in the donut chart). Pages that call `useTranslation().t` as a plain function type now use i18next's `TFunction`.
- **Tailwind 4**: ran the official upgrade tool, kept the brand preset through `@config`, fixed one over-eager codemod (`variant="outline"` had been rewritten to `outline-solid`). Visual/axe checks via Playwright pass.
- **Playwright**: ports and database are now overridable (`PHARMACY_E2E_API_PORT/PHARMACY_E2E_WEB_PORT`) so the suite can run beside a dev stack. The axe suite had real violations that are now fixed (HBars `ul role=img` -> `div`, sidebar group label contrast, `aria-controls` pointing to panels that do not exist).
- **lab OpenAPI script**: `tsc` 6 refuses file arguments next to a `tsconfig.json`; the script passes `--ignoreConfig --types node`.
## Things to know before deploying (not done here)

- `Dockerfile.seed` was edited but the image could not be built in this session (Docker daemon was not running); build it once before the next seed deploy.
- Prisma 7 + `pg` verifies TLS certificates; the seed Lambda URL uses `sslmode=no-verify`, the API in AWS needs either the same or the RDS CA bundle via `NODE_EXTRA_CA_CERTS`.
- The new `nodejs26.x` Lambda runtime passes `tofu validate` with provider 6.73; confirm it is available in `eu-central-1` before the next apply.
- Standalone Prisma Accelerate URLs are not supported by the driver adapter (not used here).
