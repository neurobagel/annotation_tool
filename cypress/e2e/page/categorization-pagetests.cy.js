describe("tests on categorization page via programmatic state loading and store interaction", () => {

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
                cy.loadTestDataIntoStore();

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

            // Description of task: User selects one non-tool group category and paints one column as 'Subject ID'
            // Expected results: Annotation nav and Next page button are enabled
            it("simple categorization", () => {

                // 1. Assert annotation nav and next page button are disabled
                cy.assertNextPageAccess("annotation", false);

                // 2. Categorize first column in table as 'Subject ID'
                cy.categorizeColumn("Subject ID", 1);

                // 3. Assert that annotation nav and next page button are enabled
                cy.assertNextPageAccess("annotation", true);
            });

            // Description of task: User selects multiple non-tool group category and paints multiple columns
            // Expected results: Annotation nav and Next page button are enabled
            it("multiple categorization", () => {

                // 1. Assert annotation nav and next page button are disabled
                cy.assertNextPageAccess("annotation", false);

                // 2. Categorize first column in table as 'Subject ID'
                cy.categorizeColumn("Subject ID", 1);

                // 3. Assert that annotation nav and next page button are enabled
                cy.assertNextPageAccess("annotation", true);

                // 4. Categorize second column in table as 'Age'
                cy.categorizeColumn("Age", 2);

                // 5. Assert that annotation nav and next page button are *still* enabled
                cy.assertNextPageAccess("annotation", true);
            });

            // Description of task: User selects the tool group category and paints one column,
            // writes name of tool group, groups that column into that tool group by clicking column name and add
            // Expected results: Annotation nav and Next page button remain disabled
            it("simple toolgroup categorization", () => {

                // 1. Assert annotation nav and next page button are disabled
                cy.assertNextPageAccess("annotation", false);

                // 2. Categorize second column in table as 'Assessment Tool'
                cy.categorizeColumn("Assessment Tool", 2);

                // 3. Assert annotation nav and next page button are *still* disabled
                cy.assertNextPageAccess("annotation", false);

                // 4. Create a tool group based on the new assessment tool column

                // A. Fill in the toolgroup name textbox
                cy.get("[data-cy='toolgroup-name-textbox']")
                    .type("Test ToolGroup 1");

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
            });

            // Description of task: User selects non- and tool group categories, paints column with tool group paint,
            // creates tool group label, groups columns, paints columns with non-tool group categories
            // Expected results: Annotation nav and Next page button are enabled
            it("ordinary and toolgroup categorization", () => {

                // 1. Assert annotation nav and next page button are disabled
                cy.assertNextPageAccess("annotation", false);

                // 2. Categorize second column in table as 'Assessment Tool'
                cy.categorizeColumn("Assessment Tool", 2);

                // 3. Assert annotation nav and next page button are *still* disabled
                cy.assertNextPageAccess("annotation", false);

                // 4. Create a tool group based on the new assessment tool column

                // A. Fill in the toolgroup name textbox
                cy.get("[data-cy='toolgroup-name-textbox']")
                    .type("Test ToolGroup 1");

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
                cy.categorizeColumn("Subject ID", 1);

                // 7. Assert annotation nav and next page button are enabled
                cy.assertNextPageAccess("annotation", true);
            });
        });
    });
});