import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { react: reactPlugin },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { window: true, document: true, localStorage: true, console: true },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
]
