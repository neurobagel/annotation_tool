const { defineConfig } = require("cypress");

const { isFileExist, findFiles } = require("cy-verify-downloads");
const { fs } = require("fs");

module.exports = defineConfig({

    e2e: {

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
        }
    },

    component: {

        devServer: {

            bundler: "webpack",
            framework: "nuxt"
        }
    }


});
