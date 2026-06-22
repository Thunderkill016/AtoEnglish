import nextConfig from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-dev/**",
      "out/**",
      "coverage/**",
      "node_modules/**",
      "playwright-report/**",
    ],
  },
  ...nextConfig,
];

export default eslintConfig;