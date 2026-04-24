// import js from '@eslint/js';

// export default [
//   js.configs.recommended,
//   {
//     languageOptions: {
//       ecmaVersion: 2022,
//       sourceType: 'module',
//       globals: {
//         console: 'readonly',
//         process: 'readonly',
//         Buffer: 'readonly',
//         __dirname: 'readonly',
//         __filename: 'readonly',
//         URL: 'readonly',
//         setTimeout: 'readonly',
//         clearTimeout: 'readonly',
//         setInterval: 'readonly',
//         clearInterval: 'readonly',
//       },
//     },
//     rules: {
//       indent: ['error', 2, { SwitchCase: 1 }],
//       'linebreak-style': ['error', 'unix'],
//       quotes: ['error', 'single'],
//       semi: ['error', 'always'],
//       'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
//       'no-console': 'off',
//       'prefer-const': 'error',
//       'no-var': 'error',
//       'object-shorthand': 'error',
//       'prefer-arrow-callback': 'error',
//     },
//   },
//   {
//     files: ['tests/**/*.js'],
//     languageOptions: {
//       globals: {
//         describe: 'readonly',
//         it: 'readonly',
//         expect: 'readonly',
//         beforeEach: 'readonly',
//         afterEach: 'readonly',
//         beforeAll: 'readonly',
//         afterAll: 'readonly',
//         jest: 'readonly',
//       },
//     },
//   },
//   {
//     ignores: ['node_modules/**', 'coverage/**', 'logs/**', 'drizzle/**'],
//   },
// ];
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // STEP 1: Tell ESLint to ignore the "noise"
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'drizzle/**'],
  },
  // STEP 2: Load recommended rules for JS and TS
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // STEP 3: Apply these rules to BOTH .js and .ts
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['tests/**/*.{js,ts}', '**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
  }
);
