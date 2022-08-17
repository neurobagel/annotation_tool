describe("End to end test using a simple UI path through the app", () => {

    // Fixtures folder prefix needed for manual file loading
    const fixturesFolder = "./cypress/fixtures/";

    // List of datasets to use for these tests
    const datasets = [

        // Good data
        require("../../fixtures/tests/good-test-config.json")

        // NOTE: Add more dataset json files here via 'require'
    ];

    beforeEach(() => {

        // Standard setup for annotation tool testing
        cy.appSetup();

        // 2. Open the index page
        cy.visit("/");
    });

    datasets.forEach((p_dataset) => {

        const dataFolder = fixturesFolder + p_dataset.source_folder;

        it("simple end to end test with " + p_dataset.description + " data", () => {

            // 1. Go through index page, selecting participants tsv and json dictionary files

            // A. Assert that categorization nav item and next button are disabled
            cy.assertNextPageAccess("categorization", false);

            // B. Select data table file
            cy.get("[data-cy='data-table-selector']")
                .contains("Choose file")
                .click()
                .selectFile(dataFolder + p_dataset.data_table);

            // C. Assert that categorization nav item and next button are enabled
            cy.assertNextPageAccess("categorization", true);

            // D. Select participants dictionary
            cy.get("[data-cy='data-dictionary-selector']")
                .contains("Choose file")
                .click()
                .selectFile(dataFolder + p_dataset.data_dictionary);

            // E. Click the next page button to proceed to the categorization page
            cy.nextPageByButton();

            // 2. Go through categorization page, categorizing subject ID and age columns in the table

            // A. Assert nav and next button are not yet be enabled
            cy.assertNextPageAccess("annotation", false);

            // B. Categorize "participant_id" as "Subject ID"
            cy.categorizeColumn("Subject ID", 1);

            // C. Assert nav and next button are enabled
            cy.assertNextPageAccess("annotation", true);

            // D. Categorize "age" as "Age"
            cy.categorizeColumn("Age", 2);

            // E. Click the next page button to proceed to the categorization page
            cy.nextPageByButton();

            // 3. Go through annotation page, saving default age annotation

            // A. Assert that next page nav and button are disabled for download page
            cy.assertNextPageAccess("download", false);

            // B. Click on the 'Age' tab
            cy.get("[data-cy='annotation-category-tabs'] ul")
                .contains("li", "Age")
                .click();

            // C. Click on the 'Save Annotation' button
            cy.get("button")
                .contains("Save Annotation")
                .click();

            // D. Assert that next page nav and button are enabled for download page
            cy.assertNextPageAccess("download", true);

            // E. Click the next page button to proceed to the download page
            cy.nextPageByButton();

            // 4. Go through the download page, downloading the output annotation file

            // A. Click the download button
            cy.get("[data-cy='download-button']")
                .click();

            // B. Assert that csv file has downloaded
            // cy.verifyDownload(".json", { contains: true });
        });
    });
});