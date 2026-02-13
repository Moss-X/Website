import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import css from '@eslint/css'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '.husky/**']
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReact.configs.flat['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  { files: ['**/*.json'], plugins: { json }, language: 'json/json' },
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/commonmark' },
  { files: ['**/*.css'], plugins: { css }, language: 'css/css' },
  eslintConfigPrettier
])
