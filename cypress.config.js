const { defineConfig } = require("cypress");

module.exports = defineConfig({

    e2e: {

        baseUrl: "http://localhost:3000",

        component: {

            devServer: {

                bundler: "webpack",
                framework: "nuxt"
            }
        },

        setupNodeEvents(on, config) {

            // Implement node event listeners here
        }
    }
});
