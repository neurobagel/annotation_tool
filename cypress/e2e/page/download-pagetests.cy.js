describe("tests on download page ui via programmatic state loading and store interaction", () => {
    // List of datasets to use for these tests
    const datasets = [
        // Good data
        require("../../fixtures/tests/good-test-config.json")

        // NOTE: Add more dataset json files here via 'require'
    ];

    datasets.forEach((p_dataset) => {
        context("download page tests with " + p_dataset.description + " data", () => {
            beforeEach(() => {
                // 1. Open index page
                cy.visit("/");

                // 2. Load test data
                cy.loadTestDataIntoStore(p_dataset);

                // 3. Move to the download page
                cy.window().its("$nuxt.$router").then(router => {
                    // A. Route to download page
                    router.push({ path: "/download" });

                    // B. Once routing is complete, set the current page in the nuxt store
                    // (normally would happen via navigation clicks)
                    cy.commitToVuexStore("setCurrentPage", "download");
                });

                // 4. Categories required for this test and the number of required columns for each category
                const testCriteria = {
                    categories: [
                        ["Subject ID", 1],
                        ["Age", 1],
                        ["Sex", 1]
                    ]
                };

                // 5. Load the app with test criteria using the dataset
                cy.loadAppState("download", p_dataset, testCriteria);
            });

            it("Clicking download button downloads annotated data dictionary JSON", () => {
                // 0. Checking downloads folder state before click
                cy.task("downloads", "cypress/downloads").then(folderStateBefore => {
                    // Ensure the dictionary preview can be shown
                    cy.get("[data-cy='dictionary-preview-button']").click();

                    // Check if the data dictionary preview is visible
                    cy.get("[data-cy='dictionary-preview']").should('be.visible');

                    // We need to first force enable the download because it is incomplete
                    cy.get('.custom-control-label').click();
                    cy.get('[data-cy="force-allow-download"]').check();

                    // Download the annotated data dictionary in Neurobagel JSON format
                    cy.get("[data-cy='download-button']")
                        .click();

                    // Check contents of downloads folder
                    cy.task("downloads", "cypress/downloads").then(folderStateAfter => {

                        // Check that we actually downloaded a file
                        expect(folderStateAfter.length).to.be.eq(folderStateBefore.length + 1);


                        cy.getVuexStoreValue("dataDictionary").then(dataDictionary => {

                            // Using the datadictionary name to locate the file downloaded by test for further verification
                            // may not be a foolproof solution since if another test ends up using the same data dictionary
                            // as input this approach may grab the wrong file and lead to test(s) failing
                            const dataDictionaryFilenameNoExt = dataDictionary.filename.split(".").slice(0, -1).join(".");
                            expect(folderStateAfter.some(filename => filename.includes(dataDictionaryFilenameNoExt))).to.be.true;

                            // Because we only have access to dataDictionary within the scope of this promise,
                            // we need to run our next assertion in here
                            const targetFile = folderStateAfter.filter(filename => filename.includes(dataDictionaryFilenameNoExt))[0];
                            cy.readFile('cypress/downloads/' + targetFile).then((fileContent) => {
                                expect(fileContent.participant_id.Annotations).to.have.property("Identifies");
                                expect(fileContent.participant_id.Annotations.Identifies).to.eq("participant");
                            });
                        });
                    });
                });
            });
        });
    });
});