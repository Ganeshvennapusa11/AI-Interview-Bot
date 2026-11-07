/**
 * Server lint config.
 *
 * Deliberately dependency-free: it declares rules and globals directly, so it
 * runs with any ESLint binary without adding packages to the server.
 *   npm run lint
 */
export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "uploads/**", "eval/results/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_|^next$", caughtErrors: "none", ignoreRestSiblings: true },
      ],
      "no-dupe-keys": "error",
      "no-unreachable": "error",
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-empty": ["error", { allowEmptyCatch: true }],
      "require-await": "error",
    },
  },
];
