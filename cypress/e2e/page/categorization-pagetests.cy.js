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

                // 3. Move to categorization page
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
        });
    });
});