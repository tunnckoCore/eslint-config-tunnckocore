/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  endOfLine: 'lf',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  proseWrap: 'always',
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  // Last version that doesn't squash type and value imports
  importOrderTypeScriptVersion: '5.4.3',
  importOrder: [
    '<BUILTIN_MODULES>',
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^~/(.*)$',
    '^@/(.*)$',
    '^~(.*)$',
    '^[./]',
  ],
  overrides: [
    {
      files: ['**/.all-contributorsrc'],
      options: {
        parser: 'json',
      },
    },
    {
      files: ['**/*.json'],
      options: {
        parser: 'json-stringify',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      options: {
        parser: 'typescript',
      },
    },
    {
      files: ['**/tsconfig*.json'],
      options: {
        parser: 'jsonc',
      },
    },
    {
      files: ['**/package.json'],
      options: {
        parser: 'json-stringify',
        plugins: ['prettier-plugin-pkgjson'],
      },
    },
    {
      files: ['**/*.md'],
      options: {
        parser: 'markdown',
        proseWrap: 'always',
      },
    },
    {
      files: ['**/*.mdx'],
      options: {
        parser: 'mdx',
        proseWrap: 'always',
      },
    },
    {
      files: ['**/*.astro'],
      options: {
        parser: 'astro',
        plugins: ['prettier-plugin-astro'],
      },
    },
  ],
};

const cfg = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: '**/*.sol',
      options: {
        parser: 'solidity-parse',
        printWidth: 100,
        tabWidth: 4,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: false,
      },
    },
  ],
};

module.exports = cfg;
