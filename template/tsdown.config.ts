import { defineConfig } from 'tsdown'

const sharedBuildOptions = {
  sourcemap: false,
  treeshake: false,
  target: 'es2022',
  platform: 'node',
  tsconfig: './tsconfig.json',
  cjsDefault: true,
  fixedExtension: true,
  minify: false,
}

export default defineConfig([
  {
    ...sharedBuildOptions,
    entry: 'src/main.ts',
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/',
    clean: true,
  },
  {
    ...sharedBuildOptions,
    entry: 'src/bin/cli.ts',
    format: ['esm'],
    dts: false,
    outDir: 'dist/bin/',
    clean: false,
  },
])
