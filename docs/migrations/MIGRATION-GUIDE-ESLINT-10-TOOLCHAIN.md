# Migrating template linting from ESLint 9 + neostandard to ESLint 10

This guide documents the migration plan and upgrade path applied in this repository, aligned with:

- https://github.com/lirantal/gh-cp/pull/29

## Scope in `create-node-lib`

The migration applies to the generated project template and generator wiring:

- `template/eslint.config.js` moved from `neostandard` to explicit ESLint 10 flat config modules
- `template/package.json` upgraded lint dependencies and removed `lockfile-lint`
- `saofile.js` updated generated scripts to stop adding `lint:lockfile`
- `__tests__/generator.test.js` updated expected generated scripts
- `template/.github/workflows/ci.yml` updated to Node `24.x` only

## Migration plan

1. Upgrade the template lint stack to ESLint 10-compatible packages:
   - `eslint`
   - `@eslint/js`
   - `typescript-eslint`
   - `eslint-plugin-n`
   - `eslint-plugin-security`
2. Replace `neostandard` usage with explicit flat config composition.
3. Remove `lockfile-lint` from template scripts and devDependencies.
4. Update generator logic so newly scaffolded projects no longer include `lint:lockfile`.
5. Update generator tests to assert the new `lint` script behavior.
6. Align template CI Node version matrix with Node 24.
7. Regenerate lockfile and validate with:
   - `npm run lint`
   - `npm test`

## Behavioral changes

- Generated projects now run lint as:
  - `eslint . && <package-manager> run lint:markdown`
- Generated projects no longer include:
  - `lint:lockfile` script
  - `lockfile-lint` dependency

## Notes for maintainers

- The repository root still uses legacy ESLint config for generator code, and now ignores `template/eslint.config.js` in root linting to avoid parser mismatches.
- This migration keeps generator behavior stable while modernizing the template lint toolchain.
