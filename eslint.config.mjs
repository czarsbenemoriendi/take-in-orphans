import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [{
    files: ["**/*.ts"],
    ignores: ["dist/**", "node_modules/**"],
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: "module",
    },

    rules: {
        "@typescript-eslint/naming-convention": ["warn", {
            selector: "import",
            format: ["camelCase", "PascalCase"],
        }],

        "operator-linebreak": ["error", "before", {
            "overrides": {
                "?": "before",
                ":": "before"
            }
        }],
        "multiline-ternary": ["error", "always-multiline"],

        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "warn"
    },
}];
