// to check the config use: npx eslint --inspect-config

import eslint from '@eslint/js'
import ts from 'typescript-eslint'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'

export default [
  eslint.configs.recommended,
  stylistic.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      '@stylistic/max-statements-per-line': ['error', { max: 3 }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/no-multi-spaces': 'off',
      '@stylistic/key-spacing': 'off',
    },
  },
  { ignores: ['dist/'] },
]

// useful settings for vscode
//
// "css.validate": false,
// "editor.formatOnSave": false,
// "editor.guides.bracketPairs": true,
// "editor.codeActionsOnSave": {
//   "source.fixAll.eslint": "explicit"
// },
// "eslint.useFlatConfig": true,
// "eslint.validate": ["svelte"],
// "svelte.enable-ts-plugin": true,
