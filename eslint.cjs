// SPDX-License-Identifier: Apache-2.0

// to do: update the eslint-config-tunnckocore to use this file

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const airbnbBase = require('eslint-config-airbnb-base');
const eslintConfigPrettier = require('eslint-config-prettier');
const prettierConfig = require('./prettier.cjs');

// eslint-disable-next-line import/no-dynamic-require
const bestPractices = require(airbnbBase.extends[0]);

function readJson(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function getEsLintConfig(options = {}) {
  const workspaceFile = path.join(
    options.cwd || process.cwd(),
    typeof options['workspace-file'] === 'string'
      ? options['workspace-file']
      : 'hela-workspace.json',
  );

  let workspaceData = false;

  try {
    workspaceData = readJson(workspaceFile);
  } catch {
    workspaceData = false;
  }

  return loadConfigFromWorkspace(workspaceData);
}

// module.exports = { readJSON, getESLintConfig, loadConfigFromWorkspace };

function loadConfigFromWorkspace(ws) {
  const extensions = ['.js', '.mjs', '.cjs', '.jsx', '.md', '.mdx', '.ts', '.tsx', '.astro'];

  const settingsAndImportResolver = {
    node: {
      ...(ws ? { allowModules: ws.packages } : {}),
      tryExtensions: extensions,
    },
    'import/resolver': {
      node: {
        // TODO: do we even need this?
        // paths: ws.workspaces.map((x) => x.slice(0, -2)),
        extensions,
        tryExtensions: extensions,

        // TODO: should we?
        // - what's the difference with `paths`?
        // - shoud it be each package from every workspace?
        // - or if it's like node_modules, then just list the workspaces dirs?
        moduleDirectory: ['node_modules', ...(ws ? ws.workspaces.map((x) => x.slice(0, -2)) : [])],
      },

      // eslint-plugin-import / eslint-import-resolver-alias
      alias: {
        // mapping of [packageName, packageLocation]
        ...(ws ? { map: Object.values(ws.graph).map((item) => [item.name, item.resolved]) } : {}),
        extensions,
      },
    },
  };

  const ignoredProps = [
    ...bestPractices.rules['no-param-reassign'][1].ignorePropertyModificationsFor,
    'err',
    'x',
    '_',
    'opts',
    'flags',
    'options',
    'settings',
    'config',
    'cfg',
  ];

  // Additional rules that are specific and overiding previous
  const additionalChanges = {
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ignoredProps }],

    // https://eslint.org/docs/rules/function-call-argument-newline
    'no-import-assign': 'error',

    // https://eslint.org/docs/rules/function-call-argument-newline
    'function-call-argument-newline': ['error', 'consistent'],

    // Prefer Object.hasOwn() over Object.prototype.hasOwnProperty.call()
    // https://eslint.org/docs/rules/prefer-object-has-own
    'prefer-object-has-own': 'error',

    // Off in Airbnb, until `eslint v7.15 is required`
    // disallow use of optional chaining in contexts where the undefined value is not allowed
    // https://eslint.org/docs/rules/no-unsafe-optional-chaining
    'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],

    // https://eslint.org/docs/rules/default-param-last
    'default-param-last': 'error',

    'prefer-regex-literals': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-extend-native': 'error',
    'no-use-extend-native/no-use-extend-native': 'error',

    // yes, we know that it's just a convention, allow me Airbnb.
    'no-underscore-dangle': 'off',

    // why?
    'no-continue': 'warn',
    'no-console': 'off',

    // we use es modules
    strict: ['off', 'global'],

    // we use tabs
    'no-tabs': 'error',

    // Enforce using named functions when regular function is used,
    // otherwise use arrow functions
    'func-names': ['error', 'always'],
    // Always use parens (for consistency).
    // https://eslint.org/docs/rules/arrow-parens
    'arrow-parens': ['error', 'always', { requireForBlockBody: true }],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true, allowUnboundThis: true }],
    // http://eslint.org/docs/rules/max-params
    'max-params': ['error', { max: 4 }],
    // http://eslint.org/docs/rules/max-statements
    'max-statements': ['error', 40, { ignoreTopLevelFunctions: true }],
    // http://eslint.org/docs/rules/max-statements-per-line
    'max-statements-per-line': ['error', { max: 1 }],
    // http://eslint.org/docs/rules/max-nested-callbacks
    'max-nested-callbacks': ['error', { max: 4 }],
    // http://eslint.org/docs/rules/max-depth
    'max-depth': ['error', { max: 4 }],
    // enforces no braces where they can be omitted
    // https://eslint.org/docs/rules/arrow-body-style
    // Never enable for object literal.
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],
    // Allow functions to be use before define because:
    // 1) they are hoisted,
    // 2) because ensure read flow is from top to bottom
    // 3) logically order of the code.
    // 4) the only addition is 'typedefs' option, see overrides for TS files
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        allowNamedExports: true,
      },
    ],

    // disallow declaration of variables that are not used in the code
    'no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true, // airbnb's default
        vars: 'all', // airbnb's default
        // caughtErrorsIgnorePattern: '^(?:$$|xx|_|__|[iI]gnor(?:e|ing|ed))',
        varsIgnorePattern: '^(?:$$|xx|_|__|[iI]gnor(?:e|ing|ed))',
        args: 'after-used', // airbnb's default
        argsIgnorePattern: '^(?:$$|xx|_|__|[iI]gnor(?:e|ing|ed))',

        // catch blocks are handled by Unicorns
        caughtErrors: 'none',
        // caughtErrorsIgnorePattern: '^(?:$$|xx|_|__|[iI]gnor(?:e|ing|ed))',
      },
    ],

    // Default as Airbnb's except we allow for of & for await of
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      // {
      //   selector: 'ForOfStatement',
      //   message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      // },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
  };

  const pluginImport = {
    rules: {
      'import/namespace': ['error', { allowComputed: true }],
      'import/no-absolute-path': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-self-import': 'error',

      // Enable this sometime in the future when Node.js has ES2015 module support
      'import/no-cycle': 'error',

      // Disabled as it doesn't work with TypeScript
      // 'import/newline-after-import': 'error',

      'import/no-amd': 'error',
      'import/no-duplicates': 'error',

      // Enable this sometime in the future when Node.js has ES2015 module support
      // 'import/unambiguous': 'error',

      // Enable this sometime in the future when Node.js has ES2015 module support
      // 'import/no-commonjs': 'error',

      // Looks useful, but too unstable at the moment
      'import/no-deprecated': 'error',

      'import/no-extraneous-dependencies': 'off',
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default-member': 'error',

      // ! buggy, when you have same identifier as default and as named
      // like `import test from 'foo';` and `import { test } from 'foo';`
      'import/no-named-as-default': 'off',

      // Disabled because it's buggy and it also doesn't work with TypeScript
      // 'import/no-unresolved': [
      //  'error', { commonjs: true }
      // ],

      'import/order': 'error',
      // 'import/no-unassigned-import': [
      //   'error',
      //   {
      //     allow: ['dotenv/config', 'dotenv/import', '@babel/polyfill', '@babel/register', '*.css'],
      //   },
      // ],

      // TODO: mm?
      'import/prefer-default-export': 'off',

      // Ensure more web-compat
      // ! note that it doesn't work in CommonJS
      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
      'import/extensions': ['error', 'ignorePackages'],

      // ? Always use named exports. Enable?
      // 'import/no-default-export': 'error',

      // ? enable?
      'import/exports-last': 'off',

      // TODO: Enable in future.
      // Ensures everything is tested (all exports should be used).
      // For cases when you don't want or can't test, add eslint-ignore comment!
      // see: https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unused-modules.md
      // ! maybe not
      // 'import/no-unused-modules': '',

      'import/no-useless-path-segments': ['error', { noUselessIndex: false }],
    },
  };

  const pluginNode = {
    rules: {
      'node/no-deprecated-api': 'error',
      'node/no-exports-assign': 'error',
      'node/no-unpublished-bin': 'error',

      // Redundant with import/no-extraneous-dependencies
      // 'node/no-extraneous-import': 'error',
      // 'node/no-extraneous-require': 'error',

      // Redundant with import/no-unresolved
      // 'node/no-missing-import': 'error',
      // 'node/no-missing-require': 'error',

      'node/no-unsupported-features/es-builtins': ['error', { version: '>=18.0.0' }],
      'node/no-unsupported-features/node-builtins': ['error', { version: '>=18.0.0' }],

      // buggy with `ecmaVersion: 'latest'`
      'node/no-unsupported-features/es-syntax': 'off',

      'no-process-exit': 'off',
      'node/process-exit-as-throw': 'error',
      'node/shebang': 'error',

      'node/exports-style': 'off',
      'node/file-extension-in-import': ['error', 'always'],
      'node/prefer-global/buffer': 'error',
      'node/prefer-global/console': 'error',
      'node/prefer-global/process': ['error', 'never'],

      // These below will be enabled in XO when it targets Node.js 10
      'node/prefer-global/text-decoder': 'error',
      'node/prefer-global/text-encoder': 'error',
      'node/prefer-global/url-search-params': ['error', 'always'],
      'node/prefer-global/url': ['error', 'always'],
      'node/prefer-promises/dns': 'error',
      'node/prefer-promises/fs': 'error',
      // TODO: in future?
      // 'node/prefer-promises/timers': 'error',
    },
  };

  const pluginPromise = {
    rules: {
      // These below are to ensure not changes
      // inside upstream XO and the plugin:promise/recommended configs
      'promise/catch-or-return': 'off',
      'promise/always-return': 'off',
      'promise/no-native': 'off',
      'promise/no-nesting': 'off',
      'promise/no-promise-in-callback': 'off',
      'promise/no-callback-in-promise': 'off',
      'promise/avoid-new': 'off',
      'promise/prefer-await-to-then': 'error',
      'promise/prefer-await-to-callbacks': 'error',

      // These are the same as in XO CLI, but they are not in the eslint-config-xo
      'promise/no-return-wrap': ['error', { allowReject: true }],
      'promise/param-names': 'error',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'error',
      'promise/valid-params': 'error',
    },
  };

  const pluginUnicorn = {
    rules: {
      // It is too much annoyance for me. It's a good thing, but generally
      // after so many years we already name things properly,
      // so please don't mess with me and don't correct me.
      'unicorn/prevent-abbreviations': 'off',

      // Please don't annoy me.
      'unicorn/no-null': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/no-array-reduce': 'off',

      // These below are intentional & explicit overrides of XO and Unicorn

      // ! needed for `unicorn/no-unreadable-array-destructuring`
      // 'prefer-destructuring': ['warn', { object: true, array: false }],
      'unicorn/no-unreadable-array-destructuring': 'error', // default in recommended

      'unicorn/no-unused-properties': 'error',
      // Disallow unsafe regular expressions.
      // Don't allow potential catastrophic crashes, slow behaving and downtimes.
      // You still can disable that and do whatever you want,
      // but that will be explicit and visible.
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-unsafe-regex.md
      'unicorn/no-unsafe-regex': 'error',

      // Enforce importing index files with `.` instead of `./index`. (fixable)
      // But we should be explicit. We know it is working without that,
      // but at least it is good for newcomers.
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/import-index.md
      'unicorn/import-index': 'off',

      // Enforce proper Error subclassing. (fixable)
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/custom-error-definition.md
      'unicorn/custom-error-definition': 'error',

      // Pretty useful rule, but it depends.
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/filename-case.md
      'unicorn/filename-case': 'off',

      // It is pretty common to name it `err`, and there is almost no reason to be any other.
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/catch-error-name.md
      'unicorn/catch-error-name': ['error', { name: 'err' }],

      // Doesn't work well in node-land. We have `.on/.off` emitters in Nodejs.
      'unicorn/prefer-add-event-listener': 'off',
      'unicorn/no-process-exit': 'error',
    },
  };

  return {
    root: true,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      ecmaFeatures: {
        jsx: true,
      },
    },
    env: {
      node: true,
      es2022: true,
    },
    settings: {
      'import/extensions': extensions,
      'import/core-modules': ['electron', 'atom'],
      ...settingsAndImportResolver,
    },
    extends: [
      'eslint:recommended',
      // 'plugin:@typescript-eslint/recommended',
      'airbnb-base',
      'plugin:unicorn/recommended',
      'plugin:promise/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:astro/recommended',
      // broken in 2024, eventho we installed the same exact pinned versions.. wtf
      // 'plugin:prettier/recommended',
    ],
    plugins: ['no-use-extend-native', 'node', 'promise', 'unicorn', 'prettier', 'astro'],
    reportUnusedDisableDirectives: true,
    rules: {
      ...additionalChanges,
      ...pluginNode.rules,
      ...pluginImport.rules,
      ...pluginPromise.rules,
      ...pluginUnicorn.rules,

      'prettier/prettier': ['error', prettierConfig, { usePrettierrc: false }],
    },
    overrides: [
      {
        // Define the configuration for `.astro` file.
        files: ['**/*.astro'],
        processor: 'astro/client-side-ts',
        // Allows Astro components to be parsed.
        parser: 'astro-eslint-parser',
        // Parse the script in `.astro` as TypeScript by adding the following configuration.
        // It's the setting you need when using TypeScript.
        parserOptions: {
          parser: '@typescript-eslint/parser',
          extraFileExtensions: ['.astro'],
        },
        plugins: ['@typescript-eslint'],
        extends: ['plugin:@typescript-eslint/recommended'],
        rules: {
          '@typescript-eslint/triple-slash-reference': 'off',
          '@typescript-eslint/no-unused-vars': 'off', // fvck off, we have properly configured `no-unused-vars`
          '@typescript-eslint/no-explicit-any': 'off',

          // !NOTE: disabling this on ESLint is still okay,
          // !NOTE: because the Prettier uses its own config and prettier-plugin-astro to format everything correctly
          // !NOTE: formatting typescript also works on script tags and the astro frontmatter
          // If you are using "prettier/prettier" rule,
          // you don't need to format inside <script> as it will be formatted as a `.astro` file.
          'prettier/prettier': 'off',

          // !NOTE: seems like `ignoreTopLevelFunctions` is not working for .astro files
          'max-statements': ['warn', 40, { ignoreTopLevelFunctions: true }],
        },
      },
      {
        // Define the configuration for `<script>` tag.
        // Script in `<script>` is assigned a virtual file name with the `.js` extension.
        files: ['**/*.astro/*.js', '*.astro/*.js'],
        rules: {
          // If you are using "prettier/prettier" rule,
          // you don't need to format inside <script> as it will be formatted as a `.astro` file.
          'prettier/prettier': 'off',
          // !NOTE: seems like `ignoreTopLevelFunctions` is not working for .astro files
          'max-statements': ['warn', 40, { ignoreTopLevelFunctions: true }],
        },
      },
      {
        // Define the configuration for `<script>` tag when using `client-side-ts` processor.
        // Script in `<script>` is assigned a virtual file name with the `.ts` extension.
        files: ['**/*.astro/*.ts', '*.astro/*.ts'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          sourceType: 'module',
          project: null,
        },
        rules: {
          // If you are using "prettier/prettier" rule,
          // you don't need to format inside <script> as it will be formatted as a `.astro` file.
          'prettier/prettier': 'off',
          // !NOTE: seems like `ignoreTopLevelFunctions` is not working for .astro files
          'max-statements': ['warn', 40, { ignoreTopLevelFunctions: true }],
        },
      },
      {
        files: ['.eslintrc.cjs', 'eslint.config.cjs', '.prettierrc.cjs', '**/*.cjs', '*.*.cjs'],
        // !NOTE: should not be needed, cuz typescript should not be enabled on non-ts files
        // rules: { '@typescript-eslint/no-var-requires': 'off' },
      },
      {
        files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        extends: ['plugin:@typescript-eslint/recommended'],
        rules: {
          '@typescript-eslint/triple-slash-reference': 'off',
          '@typescript-eslint/no-unused-vars': 'off', // fvck off, we have properly configured `no-unused-vars`
          '@typescript-eslint/no-explicit-any': 'off',
        },
      },
    ],
  };
}

const eslintConfig = getEsLintConfig();

module.exports = {
  ...eslintConfig,
  ...eslintConfigPrettier,

  // parser: '@typescript-eslint/parser',
  globals: {
    ...eslintConfig.globals,

    browser: true,
    Deno: true,
    Bun: true,
    process: true,
    node: true,
    es2020: true,
    es2022: true,
    'astro/astro': true,
  },

  extends: eslintConfig.extends,
  // plugins: [...eslintConfig.plugins, '@typescript-eslint'],
  plugins: [...eslintConfig.plugins],

  rules: {
    ...eslintConfig.rules,
    ...eslintConfigPrettier.rules,

    'unicorn/no-await-expression-member': 'off',
    'unicorn/consistent-destructuring ': 'off',
    'sort-keys': 'off',

    camelcase: 'off',
    'node/prefer-global/process': 'off',
    'node/file-extension-in-import': 'off',
    'unicorn/expiring-todo-comments': 'off',
    'import/no-unassigned-import': 'off',
    'import/prefer-default-export': 'off',
    'import/no-relative-packages': 'off',

    // bruh
    'prefer-destructuring': 'off',
    'no-param-reassign': 'off',

    'import/no-unresolved': ['error', { ignore: ['^astro:*', '^bun:*', '^npm:*', '^jsr:*'] }],
    'unicorn/no-useless-spread': 'off', // useless rule
    'unicorn/prefer-switch': 'off', // fvck off
    // 'no-explicit-any': 'warn',
  },
};
