import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import js from '@eslint/js';

export default [
  {
    ignores: ['frontend/**', 'node_modules/**', 'dist/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
  eslintConfigPrettier,
];
