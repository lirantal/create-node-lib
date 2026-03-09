# AGENTS.md

## Project Overview

**create-node-lib** is a scaffolding CLI tool that generates batteries-included Node.js library projects. Users run `npx create-node-lib my-lib-name`, answer interactive prompts, and get a fully configured project with TypeScript, testing, linting, CI/CD, changesets, and git hooks.

## Architecture

The project has two distinct layers:

### 1. Generator (root level)

The scaffolding engine that prompts users and generates projects:

- **`bin/cli.js`** — CLI entry point. Resolves the generator root and output directory, then delegates to Sao.
- **`saofile.js`** — Generator definition. Contains prompts, template data helpers, file actions, and post-generation hooks (git init, npm install, husky setup).
- **`__tests__/generator.test.js`** — Jest tests that use `sao.mock()` to verify generated file lists and content.

### 2. Template (`template/` directory)

The EJS template files that become the generated project. These use placeholders like `<%= projectName %>`, `<%= author %>`, `<%= email %>`, `<%= username %>`, `<%= projectRepository %>`, and helpers like `<%= npmClientInstall(npmClient) %>` and `<%- changesetRepo({ projectRepository }) %>`.

The generated project includes:
- TypeScript source in `src/` with dual ESM/CJS output via tsup
- Node.js built-in test runner with c8 coverage
- ESLint (neostandard) + eslint-plugin-security + Prettier
- Changesets for versioning and releases
- Husky git hooks with conventional commits
- GitHub Actions workflows for CI, releases, link checking, and more

## Tech Stack

| Layer     | Technology                                                    |
|-----------|---------------------------------------------------------------|
| Scaffolding | Sao v1.7.1                                                 |
| Validation  | validate-npm-package-name                                  |
| Testing     | Jest 29 (generator), Node.js test runner + c8 (template)   |
| Linting     | ESLint (standard config for generator, neostandard for template) |
| Formatting  | Prettier                                                    |
| Releases    | semantic-release (generator), Changesets (template)         |
| Git hooks   | Husky + lint-staged + commitlint/validate-conventional-commit |
| Language    | JavaScript (generator), TypeScript (template)               |

## Commands

### Generator (root)

| Command | Purpose |
|---------|---------|
| `npm test` | Run Jest tests |
| `npm run test:watch` | Jest in watch mode |
| `npm run lint` | ESLint + lockfile-lint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier on all JS files |

### Template (generated project)

| Command | Purpose |
|---------|---------|
| `npm run build` | `tsc && tsup` — compile TypeScript to ESM + CJS |
| `npm test` | `c8 node --import tsx --test` — run tests with coverage |
| `npm run lint` | ESLint + lockfile-lint + markdownlint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm start` | Run CLI via tsx |

## Code Style

- **Prettier**: 100 char print width, 2-space indent, single quotes, no semicolons, no trailing commas
- **ESLint**: Standard-style rules (generator uses eslint-config-standard; template uses neostandard)
- **Security**: eslint-plugin-security is enabled in both layers
- **Commits**: Conventional commit format enforced via git hooks
- **CommonJS**: The generator itself (`bin/cli.js`, `saofile.js`, tests) uses CommonJS (`require`/`module.exports`)
- **ESM + TypeScript**: The template generates ESM-first TypeScript projects

## File Conventions

- Generator source files are plain JavaScript at the root level — no transpilation step
- Template files in `template/` are EJS templates — be careful not to break `<%= ... %>` and `<%- ... %>` placeholders when editing
- Test files live in `__tests__/` directories (both generator and template)
- The template's `package.json` uses EJS interpolation for project metadata fields

## Testing

Generator tests use `sao.mock()` to run the generator with mocked prompt answers and assert on:
- The generated file list (`stream.fileList`)
- The content of generated files (`stream.readFile()`)
- Correct template variable substitution

Run tests before committing: `npm test`

## CI/CD

The generator's CI (`.github/workflows/main.yml`) runs on push and PR:
- Tests on Node.js 24, Ubuntu
- On push to `main`, runs `semantic-release` to publish to npm

## Key Considerations for Agents

1. **Two-layer architecture**: Changes to the generator logic go in `saofile.js` or `bin/cli.js`. Changes to what gets generated go in `template/`.
2. **EJS templates**: Files in `template/` are EJS — angle-bracket placeholders (`<%= %>`, `<%- %>`) are intentional and must be preserved.
3. **Template helpers**: `templateData` in `saofile.js` defines helper functions (`npmClientInstall`, `changesetRepo`) available in templates.
4. **Sao framework**: The generator uses Sao v1 — refer to Sao v1 docs for the `prompts`, `actions`, `completed` lifecycle.
5. **No TypeScript at root**: The generator itself is plain JavaScript with CommonJS modules. Only the template output is TypeScript.
6. **Test with mocks**: Generator tests don't actually create files on disk — they use `sao.mock()` to simulate generation.
7. **Lockfile-lint**: Both the generator and template validate lockfiles — if you change the package manager config, update the lint:lockfile script accordingly.
