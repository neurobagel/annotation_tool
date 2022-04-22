// eslint-disable-next-line no-undef
module.exports = {

    env: {

        browser: true,
        es2021: true,
    },

    extends: [

        // "airbnb", // TODO: activate this styleset
        "eslint:recommended",
        "plugin:vue/strongly-recommended",
        // "plugin:prettier/recommended", // TODO: consider activating
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

        "no-unused-vars": [ "error", {

            // Do not check for unused variables in argument lists
            args: "none"
        }],

        "vue/html-self-closing": [ "error", {

            html: {

                // Don't enforce self closing on custom components that contain no child tags 
                component: "any",

                // Enforce self-closing on void html elements (i.e. 'input')
                void: "always"
            }
        }],

        "vue/html-closing-bracket-newline": [ "warn", {

            // Disallow line breaks before the closing bracket on a multiline opening tag
            multiline: "never"
        }],        

        // Four-space indentation
        "vue/html-indent": [ "warn", 4, {
            
            // Attributes do not have to be aligned vertically
            alignAttributesVertically: false
        }],

        "vue/max-attributes-per-line": [ "error", {

            // Maximum number of attributes on a single line opening tag
            "singleline": {
                "max": 4
            }
        }],        

        "vue/multiline-html-element-content-newline": [ "warn", {

            // Allows blank lines in multiline tags
            allowEmptyLines: true
        }],

        "vue/no-unused-vars": [ "error", {

            // Ignore unused variables beginning with '_' character
            // (Currently just used for unused variables in v-for statements)
            "ignorePattern": "^_"
        }]
    }
};
