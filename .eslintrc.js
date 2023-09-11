module.exports = {
  extends: "next/core-web-vitals",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "eslint-plugin-prettier"],
  // extends: ["plugin:@typescript-eslint/recommended"],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "no-console": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
  overrides: [
    {
      files: [
        "jest.setup.ts",
        "bin/**/*",
        "test/**/*",
        "prisma/**/*",
        "scripts/**/*",
        "src/logger/**/*",
      ],
      rules: {
        "no-console": "off",
      },
    },
  ],
};
