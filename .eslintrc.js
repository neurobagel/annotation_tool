// eslint-disable-next-line no-undef
module.exports = {

    env: {

        browser: true,
        es2021: true,
    },

    extends: [

        "eslint:recommended",
        "plugin:vue/strongly-recommended"
    ],

    // Known globals
    globals: {

        $nuxt: true,

        // 'structuredClone' is available as of ES6 (ca. 2015), but ESLint does not yet know about it
        structuredClone: true
    },    

    parserOptions: {

        ecmaVersion: "latest",
        sourceType: "module",
    },

    plugins: ["vue"],

    rules: {

        // Tags ===============================================================
        
        "vue/max-attributes-per-line": [ "error", {

            // Maximum number of attributes on a single line opening tag
            "singleline": {
                "max": 4
            }
        }],
        
        "vue/html-closing-bracket-newline": [ "warn", {

            // Disallow line breaks before the closing bracket on a multiline opening tag, i.e. -
            // Yes: <tagname
            //          attribute1=""
            //          attribute2="">
            // No : <tagname
            //          attribute1=""
            //          attribute2=""
            //      >
            multiline: "never"
        }],
        
        "vue/html-self-closing": ["warn", {

            "html": {
                "void": "always"
            }
        }],

        // Variables ==========================================================

        "no-unused-vars": [ "warn", {

            // Do not check for unused variables in argument lists
            args: "none"
        }],
        
        "vue/no-unused-vars": [ "warn", {

            // Ignore unused variables beginning with '_' character
            // (Currently just used for unused variables in v-for statements)
            "ignorePattern": "^_"
        }],
        
        // Script =============================================================

        // No trailing commas
        "comma-dangle": ["error", "never"],

        // Comma spacing in arrays and objects
        "comma-spacing": ["error", { "before": false, "after": true }],

        // Whitespace =========================================================

        // Trailing whitespace only allowed in comments (specifically for comment block)
        "no-trailing-spaces": ["error", { "skipBlankLines": true }],

        // Four-space indentation for html tags in template portion of vue file
        "vue/html-indent": [ "warn", 4, {
            
            // Attributes do not have to be aligned vertically
            alignAttributesVertically: false
        }],

        "vue/multiline-html-element-content-newline": [ "warn", {

            // Allows blank lines around multiline tags
            allowEmptyLines: true
        }],

        // Four space indent for script portion of vue file
        "vue/script-indent": ["error", 4, {

            // First indentation for top-level statements is 1 indent
            "baseIndent": 1,

            // First indentation for case/default statements inside a switch is 1 indent
            "switchCase": 1
        }]        
    }
};
