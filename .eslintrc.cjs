module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': ['warn'], // Downgraded from error to warning
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': ['warn'], // Downgrade from error to warning
    '@typescript-eslint/no-unsafe-assignment': ['warn'], // Downgrade from error to warning
    '@typescript-eslint/no-unsafe-member-access': ['warn'], // Downgrade from error to warning
    '@typescript-eslint/no-unsafe-call': ['warn'], // Downgrade from error to warning
    '@typescript-eslint/no-unsafe-return': ['warn'], // Downgrade from error to warning
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
} 