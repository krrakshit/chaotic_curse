import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // Enforce no 'any' types
      '@typescript-eslint/no-unsafe-any': 'off',   // Prevent unsafe any usage
      '@typescript-eslint/no-unsafe-assignment': 'off', // Prevent unsafe assignments
      '@typescript-eslint/no-unsafe-call': 'off',       // Prevent unsafe function calls
      '@typescript-eslint/no-unsafe-member-access': 'off', // Prevent unsafe property access
      '@typescript-eslint/no-unsafe-return': 'off',     // Prevent unsafe returns
    },
  },
];

export default eslintConfig;
