/** @typedef  {import("prettier").Config} PrettierConfig */

const sortImportsPlugin = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "<BUILTIN_MODULES>",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^~/(.*)$",
    "^@/(.*)$",
    "^~(.*)$",
    "^[./]",
  ],
};

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  endOfLine: "lf",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  proseWrap: "always",
  arrowParens: "always",
  singleQuote: true,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  plugins: ["prettier-plugin-tailwindcss"],
  // Last version that doesn't squash type and value imports

  overrides: [
    {
      files: ["**/.all-contributorsrc"],
      options: {
        parser: "json",
      },
    },
    {
      files: ["**/*.json"],
      options: {
        parser: "json-stringify",
      },
    },
    {
      files: ["**/*.{mjs,js,jsx}"],
      options: {
        ...sortImportsPlugin,
      },
    },
    {
      files: ["**/*.{ts,tsx}"],
      options: {
        ...sortImportsPlugin,
        parser: "typescript",
      },
    },
    {
      files: ["**/tsconfig*.json"],
      options: {
        parser: "jsonc",
      },
    },
    {
      files: ["**/package.json"],
      options: {
        parser: "json-stringify",
        plugins: ["prettier-plugin-pkgjson"],
      },
    },
    {
      files: ["**/*.md"],
      options: {
        parser: "markdown",
        proseWrap: "always",
      },
    },
    {
      files: ["**/*.mdx"],
      options: {
        parser: "mdx",
        proseWrap: "always",
      },
    },
    {
      files: ["**/*.astro"],
      options: {
        parser: "astro",
        plugins: ["prettier-plugin-astro"],
      },
    },
  ],
};

const withSolidity = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: "**/*.sol",
      options: {
        parser: "solidity-parse",
        printWidth: 100,
        tabWidth: 4,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: false,
      },
    },
  ],
};

module.exports = withSolidity;
