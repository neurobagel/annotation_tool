// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true // Added Node.js environment support
    },

    extends: [
        "eslint:recommended",
        "plugin:vue/strongly-recommended",
        "plugin:cypress/recommended"
    ],

    globals: {
        $nuxt: true,
        structuredClone: true, // Modern global utility
        require: true // Used for Cypress plugins and Node.js modules
    },

    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },

    plugins: [
        "vue",
        "cypress"
    ],

    rules: {
        semi: "error",

        // Tags ===============================================================

        "vue/max-attributes-per-line": ["error", {
            singleline: { max: 4 }
        }],

        "vue/html-closing-bracket-newline": ["warn", {
            multiline: "never"
        }],

        "vue/html-self-closing": ["warn", {
            html: { void: "always" }
        }],

        // Variables ==========================================================

        "no-unused-vars": ["warn", { args: "none" }],

        "vue/no-unused-vars": ["warn", {
            ignorePattern: "^_"
        }],

        // Script =============================================================

        "comma-dangle": ["error", "never"],

        "comma-spacing": ["error", { before: false, after: true }],

        // Whitespace =========================================================

        "no-trailing-spaces": ["error", { skipBlankLines: false, ignoreComments: false }],

        "vue/html-indent": ["warn", 4, {
            alignAttributesVertically: false
        }],

        "vue/multiline-html-element-content-newline": ["warn", {
            allowEmptyLines: true
        }],

        "vue/multi-word-component-names": ["error", {
            ignores: ["DefaultLayout"]
        }],

        "vue/script-indent": ["error", 4, {
            baseIndent: 1,
            switchCase: 1
        }]
    }
};
