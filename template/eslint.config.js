import nodePlugin from 'eslint-plugin-n'
import pluginSecurity from 'eslint-plugin-security'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'

export default neostandard(
  {
    ignores: resolveIgnoresFromGitignore(),
  },
  [
    nodePlugin.configs['flat/recommended-script'],
    pluginSecurity.configs.recommended,
    {
      rules: {
        'no-process-exit': 'warn',
        'node/no-unsupported-features': 'off',
        'node/no-unpublished-require': 'off',
        'security/detect-non-literal-fs-filename': 'error',
        'security/detect-unsafe-regex': 'error',
        'security/detect-buffer-noassert': 'error',
        'security/detect-child-process': 'error',
        'security/detect-disable-mustache-escape': 'error',
        'security/detect-eval-with-expression': 'error',
        'security/detect-no-csrf-before-method-override': 'error',
        'security/detect-non-literal-regexp': 'error',
        'security/detect-object-injection': 'warn',
        'security/detect-possible-timing-attacks': 'error',
        'security/detect-pseudoRandomBytes': 'error',
        'space-before-function-paren': 'off',
        'object-curly-spacing': 'off',
      },
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },
    },
  ])
