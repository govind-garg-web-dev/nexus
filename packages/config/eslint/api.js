import baseConfig from "./base.js";

export default [
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
    },
  },
];
