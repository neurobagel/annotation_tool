describe("tests on categorization page ui via programmatic state loading and store interaction", () => {

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

        context("categorization page tests with " + p_dataset.description + " data", () => {

            beforeEach(() => {

                // Setup

                // 1. Open index page
                // NOTE: Home is visited because some state-related store structures
                // needed for the categorization page are set up on index page creation
                cy.visit("/");

                // 2. Load test data
                cy.loadTestDataIntoStore(p_dataset);

                // 3. Enable access to the categorization page
                cy.dispatchToNuxtStore("initializePage", {

                    enable: true,
                    pageName: "categorization"
                });

                // 4. Move to categorization page
                // NOTE: Routing to the page prevents the Vuex store from being wiped
                // when a page is 'visited' by Cypress
                cy.window().its("$nuxt.$router").then(router => {

                    router.push({ path: "/categorization" });
                });
            });

            // Description of task:
            // 1. Selects 'Subject ID' category
            // 2. Links one column as containing subject ID
            // Expected results: Annotation nav and Next page button are enabled
            it("Single column categorization; categorize subject ID", () => {

                // 0. Categories required for this test and the number of required columns for each category
                const testCriteria = {

                    categories: [

                        ["Subject ID", 1]
                    ]
                };

                if ( cy.datasetMeetsTestCriteria("categorization", p_dataset, testCriteria) ) {

                    // 1. Assert annotation nav and next page button are disabled
                    cy.assertNextPageAccess("annotation", false);

                    // 2. Categorize first column in table as 'Subject ID'
                    cy.categorizeColumn("Subject ID", p_dataset["category_columns"]["Subject ID"][0]);

                    // 3. Assert that annotation nav and next page button are enabled
                    cy.assertNextPageAccess("annotation", true);
                }
            });

            // Description of task:
            // 1. Selects 'Subject ID' and one non-tool group category
            // 2. Links each to one column in the table
            // Expected results: Annotation nav and Next page button are enabled
            it("Multi-column categorization; categorize subject ID and age", () => {

                // 0. Categories required for this test and the number of required columns for each category
                const testCriteria = {

                    categories: [

                        ["Subject ID", 1],
                        ["Age", 1]
                    ]
                };

                if ( cy.datasetMeetsTestCriteria("categorization", p_dataset, testCriteria) ) {

                // 1. Assert annotation nav and next page button are disabled
                    cy.assertNextPageAccess("annotation", false);

                    // 2. Categorize a column in the table as 'Subject ID'
                    cy.categorizeColumn("Subject ID", p_dataset["category_columns"]["Subject ID"][0]);

                    // 3. Assert that annotation nav and next page button are enabled
                    cy.assertNextPageAccess("annotation", true);

                    // 4. Categorize a column in the table as 'Age'
                    cy.categorizeColumn("Age", p_dataset["category_columns"]["Age"][0]);

                    // 5. Assert that annotation nav and next page button are *still* enabled
                    cy.assertNextPageAccess("annotation", true);
                }
            });

            // Description of task:
            // 1. Selects the tool group category
            // 2. Links it to one column in the table
            // 3. Writes name of the tool group
            // 4. Groups that column into the tool group by clicking column name and 'add' button
            // Expected results: Annotation nav and Next page button remain disabled
            it("Categorize single column toolgroup; no subject ID", () => {

                // 0. Categories required for this test and the number of required columns for each category
                const testCriteria = {

                    categories: [

                        ["Assessment Tool", 1]
                    ]
                };

                if ( cy.datasetMeetsTestCriteria("categorization", p_dataset, testCriteria) ) {

                    // 1. Assert annotation nav and next page button are disabled
                    cy.assertNextPageAccess("annotation", false);

                    // 2. Categorize second column in table as 'Assessment Tool'
                    cy.categorizeColumn("Assessment Tool", p_dataset["category_columns"]["Assessment Tool"][0]);

                    // 3. Assert annotation nav and next page button are *still* disabled
                    cy.assertNextPageAccess("annotation", false);

                    // 4. Create a tool group based on the new assessment tool column

                    // A. Fill in the toolgroup name textbox
                    cy.get("[data-cy='toolgroup-name-textbox']")
                        .type("My Tool Group");

                    // B. Select the column in the assessment tool column multi-selectbox
                    cy.get("[data-cy='toolgroup-column-multiselect']")
                        .select(0);

                    // C. Create the tool group by clicking the 'create' button
                    cy.get("[data-cy='create-toolgroup-button']")
                        .click();

                    // 5. Assert that toolgroup is present in the tool groups table
                    cy.get("[data-cy='toolgroup-table'] tbody")
                        .children()
                        .should("have.length", 1);

                    // 6. Assert annotation nav and next page button are *still disabled*
                    cy.assertNextPageAccess("annotation", false);
                }
            });

            // Description of task:
            // 1. Selects 'Subject ID' and 'Assessment Tool' categories
            // 2. Links the tool to a column in the table
            // 3. Writes name of the tool group
            // 4. Groups that column into that tool group by clicking column name and 'add' button,
            // 5. Checks that next page nav/button are disabled
            // 6. Links 'Subject ID' to a column in the table.
            // Expected results: Annotation nav and Next page button are enabled
            it("Categorize subject ID and single column toolgroup", () => {

                // 0. Categories required for this test and the number of required columns for each category
                const testCriteria = {

                    categories: [

                        ["Subject ID", 1],
                        ["Assessment Tool", 1]
                    ]
                };

                if ( cy.datasetMeetsTestCriteria("categorization", p_dataset, testCriteria) ) {

                    // 1. Assert annotation nav and next page button are disabled
                    cy.assertNextPageAccess("annotation", false);

                    // 2. Categorize second column in table as 'Assessment Tool'
                    cy.categorizeColumn("Assessment Tool", p_dataset["category_columns"]["Assessment Tool"][0]);

                    // 3. Assert annotation nav and next page button are *still* disabled
                    cy.assertNextPageAccess("annotation", false);

                    // 4. Create a tool group based on the new assessment tool column

                    // A. Fill in the toolgroup name textbox
                    cy.get("[data-cy='toolgroup-name-textbox']")
                        .type("My Tool Group");

                    // B. Select the column in the assessment tool column multi-selectbox
                    cy.get("[data-cy='toolgroup-column-multiselect']")
                        .select(0);

                    // C. Create the tool group by clicking the 'create' button
                    cy.get("[data-cy='create-toolgroup-button']")
                        .click();

                    // 5. Assert that toolgroup is present in the tool groups table
                    cy.get("[data-cy='toolgroup-table'] tbody")
                        .children()
                        .should("have.length", 1);

                    // 6. Categorize first column in table as 'Subject ID'
                    cy.categorizeColumn("Subject ID", p_dataset["category_columns"]["Subject ID"][0]);

                    // 7. Assert annotation nav and next page button are enabled
                    cy.assertNextPageAccess("annotation", true);
                }
            });
        });
    });
});