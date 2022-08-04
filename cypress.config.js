const { defineConfig } = require("cypress");

const { isFileExist, findFiles } = require("cy-verify-downloads");

module.exports = defineConfig({

    e2e: {

        baseUrl: "http://localhost:3000",

        component: {

            devServer: {

                bundler: "webpack",
                framework: "nuxt"
            }
        },

        // Downloads location and behavior
        downloadsFolder: "cypress/downloads",
        trashAssetsBeforeRuns: true,

        setupNodeEvents(on, config) {

            // Implement node event listeners here

            // cy-verify-downloads plugin
            on("task", { isFileExist, findFiles });
        }
    },

    component: {

        devServer: {

            bundler: "webpack",
            framework: "nuxt"
        }
    }


});
