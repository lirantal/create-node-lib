# Migrating a Node.js CLI from tsup to tsdown

A step-by-step guide for migrating a TypeScript Node.js CLI project from
[tsup](https://tsup.egoist.dev/) to [tsdown](https://tsdown.dev/). Based on a
real migration and cross-referenced with the
[official tsdown migration guide](https://tsdown.dev/guide/migrate-from-tsup)
and the
[Turborepo tsup-to-tsdown PR](https://github.com/vercel/turborepo/pull/11649).

## Prerequisites

- Node.js >= 20.19 (required by tsdown)
- pnpm (guide uses pnpm commands; adapt for npm/yarn as needed)
- Existing tsup-based project with a `tsup.config.ts` and dual ESM/CJS output

## Overview of changes

| File | Action |
| --- | --- |
| `package.json` | Swap `tsup` for `tsdown` in devDependencies, update build script |
| `tsup.config.ts` | Delete |
| `tsdown.config.ts` | Create with equivalent config |
| `package.json` exports/types | Update `.d.ts` references to `.d.mts` / `.d.cts` |
| `pnpm-workspace.yaml` | Allow native build scripts for rolldown dependencies |
| ESLint config | Ensure `dist/` is excluded from linting |

---

## Step 1: Swap the dependency and build script

In `package.json`:

1. Remove `tsup` from `devDependencies`.
2. Add `tsdown` to `devDependencies`.
3. Update the `build` script to call `tsdown` instead of `tsup`.

```diff
 "scripts": {
-  "build": "tsc && tsup",
+  "build": "tsc && tsdown",
 },
 "devDependencies": {
-  "tsup": "^8.1.0",
+  "tsdown": "^0.9.0",
 }
```

## Step 2: Replace the config file

Delete `tsup.config.ts` and create `tsdown.config.ts`. The config uses
`defineConfig` imported from `tsdown` instead of `tsup`.

### Option mapping reference

Use this table to translate your tsup config options into tsdown equivalents:

| tsup option | tsdown equivalent | Notes |
| --- | --- | --- |
| `entryPoints` | `entry` | Different key name, same purpose |
| `format: ['cjs', 'esm']` | `format: ['cjs', 'esm']` | Identical syntax. tsdown defaults to `esm` only, so always set this explicitly for dual output |
| `dts: true` | `dts: true` | Auto-detected if `package.json` has a `types` field, but explicit is fine |
| `outDir` | `outDir` | Identical |
| `clean: true` | `clean: true` | Enabled by default in tsdown |
| `sourcemap: false` | `sourcemap: false` | Disabled by default in tsdown. Note: if your `tsconfig.json` has `declarationMap: true`, tsdown will force sourcemaps on for declaration files regardless of this setting |
| `bundle: true` | _(default)_ | tsdown bundles by default; use `unbundle: true` to mirror input structure |
| `splitting: false` | _(N/A)_ | tsdown does not have a `splitting` option; single-entry chunks do not split by default |
| `outExtension` | `outExtensions` | Note the plural "s". Different function signature (see below). Often unnecessary when using `fixedExtension: true` |
| `treeshake: false` | `treeshake: false` | tsdown defaults to `true`, so set explicitly if you want it off |
| `target` | `target` | Identical. tsdown also auto-reads from `engines.node` in `package.json` if not set |
| `platform: 'node'` | `platform: 'node'` | Identical |
| `tsconfig` | `tsconfig` | Identical |
| `cjsInterop: true` | `cjsDefault: true` | tsdown's equivalent for CJS default export interop |
| `keepNames: true` | _(N/A)_ | No direct equivalent in tsdown; drop this option |
| `skipNodeModulesBundle` | _(default)_ | tsdown handles externals via the `deps` config; default behavior is equivalent |
| `minify: false` | `minify: false` | Disabled by default in tsdown |

### The `fixedExtension` option

When `platform` is set to `'node'`, tsdown defaults `fixedExtension` to `true`.
This means output files always use `.cjs` / `.mjs` extensions (and `.d.cts` /
`.d.mts` for declarations) regardless of the package `type` field. This
typically makes a custom `outExtensions` function unnecessary.

If you previously had a tsup `outExtension` function like:

```typescript
outExtension(ctx) {
  return {
    dts: '.d.ts',
    js: ctx.format === 'cjs' ? '.cjs' : '.mjs',
  }
}
```

You can replace it with just `fixedExtension: true` in tsdown (or omit it
entirely for `platform: 'node'` since it's the default).

### Example config

**Before** (`tsup.config.ts`):

```typescript
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entryPoints: ['src/main.ts', 'src/bin/cli.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    minify: false,
    outDir: 'dist/',
    clean: true,
    sourcemap: false,
    bundle: true,
    splitting: false,
    outExtension(ctx) {
      return {
        dts: '.d.ts',
        js: ctx.format === 'cjs' ? '.cjs' : '.mjs',
      }
    },
    treeshake: false,
    target: 'es2022',
    platform: 'node',
    tsconfig: './tsconfig.json',
    cjsInterop: true,
    keepNames: true,
    skipNodeModulesBundle: false,
  },
])
```

**After** (`tsdown.config.ts`):

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main.ts', 'src/bin/cli.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist/',
  clean: true,
  sourcemap: false,
  treeshake: false,
  target: 'es2022',
  platform: 'node',
  tsconfig: './tsconfig.json',
  cjsDefault: true,
  fixedExtension: true,
  minify: false,
})
```

Key differences:

- No array wrapper needed (single config object, not `defineConfig([...])`)
- `entryPoints` becomes `entry`
- `cjsInterop` becomes `cjsDefault`
- `bundle`, `splitting`, `keepNames`, `skipNodeModulesBundle` are dropped
- `outExtension` function replaced by `fixedExtension: true`

### CommonJS packages

If your package has `"type": "commonjs"` in `package.json`, name the config file
`tsdown.config.mts` instead of `tsdown.config.ts` (as noted in the
[Turborepo migration PR](https://github.com/vercel/turborepo/pull/11649)).

## Step 3: Update declaration file references in package.json

tsdown with `fixedExtension: true` produces `.d.mts` for ESM declarations and
`.d.cts` for CJS declarations. tsup typically produced `.d.ts` for ESM. You need
to update any references in `package.json`:

```diff
-"types": "dist/main.d.ts",
+"types": "dist/main.d.mts",
```

```diff
 "exports": {
   ".": {
     "import": {
-      "types": "./dist/main.d.ts",
+      "types": "./dist/main.d.mts",
       "default": "./dist/main.mjs"
     },
     "require": {
       "types": "./dist/main.d.cts",
       "default": "./dist/main.cjs"
     }
   }
 }
```

The `bin` field pointing to `.cjs` files does not need to change -- tsdown
produces `.cjs` files with the shebang (`#!/usr/bin/env node`) intact and
automatically grants execute permission.

## Step 4: Allow native build scripts (pnpm)

tsdown depends on [rolldown](https://rolldown.rs/) (Rust-based bundler) and
other native packages that need to run postinstall scripts. If your
`pnpm-workspace.yaml` uses `onlyBuiltDependencies` or you have strict install
policies, add these packages:

```yaml
onlyBuiltDependencies:
  - esbuild
  - rolldown
  - unrs-resolver
```

Without this, `pnpm install` will skip the native binary downloads and tsdown
will fail at runtime.

## Step 5: Ensure dist/ is excluded from ESLint

tsdown's output code style differs from tsup's (tabs vs spaces, semicolons,
variable naming, etc.). If your ESLint config lints `dist/` files, you will get
false lint failures. Make sure `dist/**` is in your ESLint ignores:

```javascript
// eslint.config.js (flat config)
export default [
  {
    ignores: ['dist/**'],
  },
  // ... rest of config
]
```

Or for legacy `.eslintrc`:

```json
{
  "ignorePatterns": ["dist/**"]
}
```

This is good practice regardless of bundler -- build output should never be
linted.

## Step 6: Install and verify

```bash
# Update the lockfile and install tsdown
pnpm install --no-frozen-lockfile

# Run the build
pnpm run build

# Verify output files exist
ls dist/

# Expected output structure for a dual ESM/CJS CLI:
# dist/main.mjs          (ESM entry)
# dist/main.cjs          (CJS entry)
# dist/main.d.mts        (ESM declarations)
# dist/main.d.cts        (CJS declarations)
# dist/bin/cli.mjs       (ESM CLI)
# dist/bin/cli.cjs       (CJS CLI, with shebang)

# Test the CLI binary
node dist/bin/cli.cjs

# Run lint
pnpm run lint

# Run tests
pnpm run test
```

## Behavioral differences to be aware of

### Declaration file extensions

tsdown uses `.d.mts` / `.d.cts` with `fixedExtension: true`, whereas tsup
typically used `.d.ts` / `.d.cts`. Update all `types` references in
`package.json` accordingly.

### Declaration maps

If your `tsconfig.json` has `declarationMap: true`, tsdown will generate
`.d.mts.map` and `.d.cts.map` files and will force sourcemaps on for the
declaration build, regardless of the `sourcemap` setting in `tsdown.config.ts`.

### Chunk naming

tsdown may produce internal chunks with hashed filenames (e.g.,
`main-DM5FYoS9.cjs`). These are implementation details invisible to package
consumers -- the public entry points (`main.cjs`, `main.mjs`) re-export from
them.

### Target auto-detection

If you omit `target`, tsdown reads from `engines.node` in `package.json`. For
example, `"node": ">=24.0.0"` would auto-set the target to `node24`. Set
`target` explicitly if you want a specific ES version like `es2022`.

### Shebang and execute permissions

tsdown automatically detects CLI entry points, preserves the `#!/usr/bin/env
node` shebang, and grants execute permission to the output file. No special
configuration needed.

### No `keepNames` equivalent

tsdown does not have a `keepNames` option (which preserves `Function.name` and
`Class.name`). If your code relies on `Function.name` at runtime, verify that
the bundled output still works correctly.

## Quick checklist

- [ ] Replace `tsup` with `tsdown` in `devDependencies`
- [ ] Update build script from `tsup` to `tsdown`
- [ ] Delete `tsup.config.ts`
- [ ] Create `tsdown.config.ts` (or `.mts` for CJS packages) with mapped options
- [ ] Update `types` and `exports.*.types` in `package.json` (`.d.ts` to `.d.mts`)
- [ ] Allow native build scripts in pnpm (`onlyBuiltDependencies`)
- [ ] Ensure `dist/` is excluded from ESLint
- [ ] Run `pnpm install --no-frozen-lockfile`
- [ ] Run `pnpm run build` and verify output files
- [ ] Run `pnpm run lint` and confirm no regressions
- [ ] Run `pnpm run test` and confirm all tests pass
- [ ] Test the CLI binary manually (`node dist/bin/cli.cjs`)

## References

- [tsdown documentation](https://tsdown.dev/guide/)
- [tsdown UserConfig API reference](https://tsdown.dev/reference/api/Interface.UserConfig)
- [tsdown migration guide from tsup](https://tsdown.dev/guide/migrate-from-tsup)
- [Turborepo tsup-to-tsdown PR #11649](https://github.com/vercel/turborepo/pull/11649)
