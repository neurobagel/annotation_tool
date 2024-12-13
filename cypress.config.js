const { defineConfig } = require("cypress");

const { isFileExist, findFiles } = require("cy-verify-downloads");
const fs = require("fs");

module.exports = defineConfig({

    e2e: {
        viewportHeight: 1080,
        viewportWidth: 1920,

        baseUrl: "http://localhost:3000",

        // Every time a test runs, files (e.g. downloaded files from a download
        // page test) from previous tests are deleted.
        downloadsFolder: "cypress/downloads",
        trashAssetsBeforeRuns: true,

        setupNodeEvents(on, config) {

            // Implement node event listeners here

            // cy-verify-downloads plugin
            on("task", {
                async downloads(downloadsPath) {
                    return fs.readdirSync(downloadsPath);
                },                
                findFiles,
                isFileExist
            });
        },
        experimentalStudio: true
    },

    component: {
        viewportHeight: 1080,
        viewportWidth: 1920,

        devServer: {

            bundler: "webpack",
            framework: "nuxt"
        }
    }


});
