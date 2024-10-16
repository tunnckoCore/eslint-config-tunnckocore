# eslint-config-tunnckocore

_late October 2024_

**It is not ESLint v9 compatible yet, we waiting on Airbnb and some other plugins!**

It has Prettier, Unicorn, Airbnb, React, Astro, Tailwind, Node, and Import plugins configured, it
also has support for Hela Workspaces monorepos.

## Usage

Include in `.eslintrc.cjs`

```js
module.exports = require('eslint-config-tunnckocore/eslint.cjs');
```

And in `.prettierrc.cjs`

```js
module.exports = require('eslint-config-tunnckocore/prettier.cjs');
```

and optionally TypeScript

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": ["eslint-config-tunnckocore/tsconfig.json"],
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```
