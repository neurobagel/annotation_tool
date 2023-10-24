describe("tests on annotation page ui with programmatic state loading and store interaction", () => {

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

        context("Annotation page tests with " + p_dataset.description + " data", () => {

            beforeEach(() => {

                // NOTE: Home is visited because some state-related store
                // structures needed for the categorization page are set up on
                // index page creation. Routing to the annotation page then
                // prevents the Vuex store from being wiped when a page is
                // 'visited' by Cypress.
                // This is to be fixed by issues #179 and #180, after which we
                // should revert to 'cy.visit' for all page visits in tests.

                // 1. Open index page
                cy.visit("/");

                // 2. Load test data
                cy.loadTestDataIntoStore(p_dataset);

                // 3. Move to the annotation page
                cy.window().its("$nuxt.$router").then(router => {

                    // A. Route to annotation page
                    router.push({ path: "/annotation" });

                    // B. Once routing is complete, set the current page in the nuxt store
                    // (normally would happen via navigation clicks)
                    cy.commitToVuexStore("setCurrentPage", "annotation");
                });
            });

            it("Annotate age column; default age format transformations", () => {

                cy.window().its("$nuxt.$store").then(p_store => {
                });

                // 0. Categories required for this test and the number of required columns for each category
                const testCriteria = {

                    categories: [

                        ["Subject ID", 1],
                        ["Age", 1]
                    ]
                };

                if ( cy.datasetMeetsTestCriteria("annotation", p_dataset, testCriteria) ) {

                    // 1. Load the app with test criteria using the dataset
                    cy.loadAppState("annotation", p_dataset, testCriteria);

                    // 2. Pause until 'Age' tab (the default annotation tab) components are loaded
                    // NOTE: This DOM check is possible because the annotation tool uses server-side rendering
                    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Server-side-rendering
                    cy.get("[data-cy='annot-continuous-values-Age']").should("be.visible");

                    // 3. Assert annotation nav and next page button are disabled
                    cy.assertNextPageAccess("download", false);

                    // 4. Annotate the 'Age'-categorized table column

                    // A. Click on the 'Age' tab
                    cy.get("[data-cy='annotation-category-tabs'] ul")
                        .contains("li", "Age")
                        .click();

                    // B. Select the 'float' transformation heuristic
                    cy.get("[data-cy='selectTransform_age']").type("float{enter}");

                    // 5. Assert annotation nav and next page button are enabled
                    cy.assertNextPageAccess("download", true);
                }
            });

            it("Annotate sex column; simple male, female annotation", () => {

                // 0. Categories required for this test and the number of required columns for each category
                const testCriteria = {

                    categories: [

                        ["Subject ID", 1],
                        ["Sex", 1]
                    ]
                };

                if ( cy.datasetMeetsTestCriteria("annotation", p_dataset, testCriteria) ) {

                    // 1. Load the app with test criteria using the dataset
                    cy.loadAppState("annotation", p_dataset, testCriteria);

                    // 2. Pause until 'Sex' tab (the default annotation tab) components are loaded
                    // NOTE: This DOM check is possible because the annotation tool uses server-side rendering
                    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Server-side-rendering
                    cy.get("[data-cy='annot-categorical-Sex']").should("be.visible");

                    // 3. Assert annotation nav and next page button are disabled
                    cy.assertNextPageAccess("download", false);

                    // 4. Annotate 'Sex'-categorized column

                    // A. Click on the 'Sex' tab
                    cy.get("[data-cy='annotation-category-tabs'] ul")
                        .contains("li", "Sex")
                        .click();

                    // B. Select annotation choices for 'Sex' column values
                    cy.get("[data-cy='categoricalSelector_0']").click();
                    cy.get("[data-cy='categoricalSelector_0']").type("male{enter}");
                    cy.get("[data-cy='categoricalSelector_1']").click();
                    cy.get("[data-cy='categoricalSelector_1']").type("female{enter}");

                    // 5. Assert annotation nav and next page button are enabled
                    cy.assertNextPageAccess("download", true);
                }
            });

            it("Annotate diagnosis column; fill out all diagnosis column values", () => {

                // 0. Categories required for this test and the number of required columns for each category
                const testCriteria = {

                    categories: [

                        ["Subject ID", 1],
                        ["Diagnosis", 1]
                    ]
                };

                if ( cy.datasetMeetsTestCriteria("annotation", p_dataset, testCriteria) ) {

                    // 1. Load the app with test criteria using the dataset
                    cy.loadAppState("annotation", p_dataset, testCriteria);

                    // 2. Pause until 'Age' tab (the default annotation tab) components are loaded
                    // NOTE: This DOM check is possible because the annotation tool uses server-side rendering
                    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Server-side-rendering
                    cy.get("[data-cy='annot-categorical-Diagnosis']").should("be.visible");

                    // 3. Assert annotation nav and next page button are disabled
                    cy.assertNextPageAccess("download", false);

                    // 4. Annotate 'Diagnosis'-categorized column

                    // A. Click on the 'Diagnosis' tab
                    cy.get("[data-cy='annotation-category-tabs'] ul")
                        .contains("li", "Diagnosis")
                        .click();

                    // B. Enter annotated values for each unique value in the 'Diagnosis'-categorized column
                    // NOTE: This value of '3' should be pulled from the interface via the number of unique diagnosis values returned
                    cy.get("[data-cy='categoricalSelector_0']").click();
                    cy.get("[data-cy='categoricalSelector_0']").type("Depressive{enter}");
                    cy.get("[data-cy='categoricalSelector_1']").click();
                    cy.get("[data-cy='categoricalSelector_1']").type("Parkins{enter}");
                    cy.get("[data-cy='categoricalSelector_2']").click();
                    cy.get("[data-cy='categoricalSelector_2']").type("Smoker{enter}");

                    // 5. Assert annotation nav and next page button are enabled
                    cy.assertNextPageAccess("download", true);
                }
            });
        });
    });
});