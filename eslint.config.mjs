import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tailwindcss from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ["**/dist/**", "**/.next/**", "**/coverage/**", "**/node_modules/**"]
  },
  ...compat.extends("next/core-web-vitals"),
  prettierConfig,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      tailwindcss,
      "unused-imports": unusedImports
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always"
        }
      ],
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off"
    }
  }
];
