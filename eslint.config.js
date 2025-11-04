import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // 전역 ignore 패턴
  { ignores: ["dist", "build", "node_modules", "*.config.js", "coverage"] },

  // 기본 JavaScript 권장 규칙
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React 기본 규칙
      "react/react-in-jsx-scope": "off", // React 17+ 에서는 불필요
      "react/prop-types": "off", // TypeScript 사용시 불필요
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-no-target-blank": "warn",
      "react/self-closing-comp": "warn",

      // React Hooks 규칙
      ...reactHooks.configs.recommended.rules,

      // React Refresh (Vite 사용시)
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // TypeScript 규칙
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],

      // 일반 코드 품질 규칙
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",

      // Prettier 통합
      "prettier/prettier": "warn",
    },
  },

  // Prettier와 충돌하는 규칙 비활성화
  prettierConfig
);
