describe("tests on the index page via store interaction", () => {

    // Fixtures folder prefix needed for manual file loading
    const fixturesFolder = "./cypress/fixtures/";

    // List of datasets to use for these tests
    const datasets = [

        // Good data
        require("../../fixtures/tests/good-test-config.json")

        // NOTE: Add more dataset json files here via 'require'
    ];

    beforeEach(() => {

        // Standard app setup
        cy.appSetup();
    });

    datasets.forEach((p_dataset) => {

        context("index page with " + p_dataset.description + " data", () => {

            let dataFolder = fixturesFolder + p_dataset.source_folder;

            beforeEach(() => {

                // Setup

                // Open index page
                cy.visit("/");
            });

            // Description: User selects data table alone
            // Expected results: Categorization nav and next page button are enabled
            it("Select a data table only", () => {

                // 1. Go through index page, selecting participants tsv and json dictionary files

                // 1. Assert that categorization nav item and next button are disabled
                cy.assertNextPageAccess("categorization", false);

                // 2. Select data table file
                cy.get("[data-cy='data-table-selector']")
                    .contains("Choose file")
                    .click()
                    .selectFile(fixturesFolder + p_dataset.source_folder + p_dataset.data_table);

                // 3. Assert that categorization nav item and next button are enabled
                cy.assertNextPageAccess("categorization", true);
            });

            // Description: User cannot select a data dictionary alone
            // Expected results: Categorization nav and next page button remain disabled
            it("Selecting a data dictionary without a data table is not possible", () => {

                // 1. Assert that categorization nav item and next button are disabled
                cy.assertNextPageAccess("categorization", false);

                // 2. Check that data dictionary file select button is disabled
                cy.get("[data-cy='data-dictionary-selector']")
                    .find("label")
                    .first()
                    .should("have.class", "disabled-file-selector-button");

                // 3. Attempt to click on 'Choose file' button for data dictionary
                cy.get("[data-cy='data-dictionary-selector']")
                    .contains("Choose file")
                    .click();

                // 4. Assert that categorization nav item and next button are *still* disabled
                cy.assertNextPageAccess("categorization", false);
            });

            // Description: User selects data table and then selects data dictionary
            // Expected results: Categorization nav and Next page button are only enabled after data table selection
            it("Select data table followed by data dictionary", () => {

                // 1. Assert that categorization nav item and next button are disabled
                cy.assertNextPageAccess("categorization", false);

                // 2. Select data table file
                cy.get("[data-cy='data-table-selector']")
                    .contains("Choose file")
                    .click()
                    .selectFile(dataFolder + p_dataset.data_table);

                // 3. Assert that categorization nav item and next button are enabled
                cy.assertNextPageAccess("categorization", true);

                // 4. Select participants dictionary
                cy.get("[data-cy='data-dictionary-selector']")
                    .contains("Choose file")
                    .click()
                    .selectFile(dataFolder + p_dataset.data_dictionary);

                // 3. Assert that categorization nav item and next button are *still* enabled
                cy.assertNextPageAccess("categorization", true);
            });
        });
    });
});