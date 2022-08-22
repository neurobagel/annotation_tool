describe("tests on annotation page ui with programmatic state loading and store interaction", () => {

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

        context("annotation page tests with " + p_dataset.description + " data", () => {

            beforeEach(() => {

                // Setup

                // 1. Open index page
                // NOTE: Home is visited because some state-related store structures
                // needed for the categorization page are set up on index page creation
                cy.visit("/");

                // 2. Load test data
                cy.loadTestDataIntoStore(p_dataset);

                // 3. Move to the annotation page
                // NOTE: Routing to the page prevents the Vuex store from being wiped
                // when a page is 'visited' by Cypress
                cy.window().its("$nuxt.$router").then(router => {

                    router.push({ path: "/annotation" });
                });

            });

            it("simple age annotation", () => {

                // 1. Link 'Subject ID' and 'Age' to data table columns
                cy.loadAppState("annotation", {

                    categoryColumnPairs: [

                        ["Subject ID", "participant_id"],
                        ["Age", "age"]
                    ]
                });

                // 2. Assert annotation nav and next page button are disabled
                cy.assertNextPageAccess("download", false);

                // 3. Annotate 'Age'-categorized columns

                // A. Click on the 'Age' tab
                cy.get("[data-cy='annotation-category-tabs'] ul")
                    .contains("li", "Age")
                    .click();

                // B. Click on the 'Save Annotation' button
                cy.get("button")
                    .contains("Save Annotation")
                    .click();

                // 4. Assert annotation nav and next page button are enabled
                cy.assertNextPageAccess("download", true);
            });

            it("simple sex annotation", () => {

                // 1. Link 'Subject ID' and 'Sex' to data table columns
                cy.loadAppState("annotation", {

                    categoryColumnPairs: [

                        ["Subject ID", "participant_id"],
                        ["Sex", "sex"]
                    ]
                });

                // 2. Assert annotation nav and next page button are disabled
                cy.assertNextPageAccess("download", false);

                // 3. Annotate 'Age'-categorized columns

                // A. Click on the 'Sex' tab
                cy.get("[data-cy='annotation-category-tabs'] ul")
                    .contains("li", "Sex")
                    .click();

                // B. Select annotation choices for 'Sex' column values
                cy.get("[data-cy='discrete-select-Sex-0']").click().type("male{enter}");
                cy.get("[data-cy='discrete-select-Sex-1']").click().type("female{enter}");

                // C. Click on the 'Save Annotation' button
                cy.get("[data-cy='save-button-Sex']")
                    .click();

                // 4. Assert annotation nav and next page button are enabled
                cy.assertNextPageAccess("download", true);
            });

            it("simple diagnosis annotation", () => {

                // 1. Link 'Subject ID' and 'Diagnosis' to data table columns
                cy.loadAppState("annotation", {

                    categoryColumnPairs: [

                        ["Subject ID", "participant_id"],
                        ["Diagnosis", "group"]
                    ]
                });

            });

            it("single-column assessment tool group annotation", () => {

                // 1. Programmatically link categories to columns here
                cy.loadAppState("annotation", {

                    categoryColumnPairs: [

                        ["Subject ID", "participant_id"],
                        ["Age", "age"]
                    ],

                    toolGroups: [

                        {
                            name: "My Tool Group",
                            tools: ["iq"]
                        }
                    ]
                });
            });

            it("multi-column assessment tool group annotation", () => {

                // 1. Programmatically link categories to columns here
                cy.loadAppState("annotation", {

                    categoryColumnPairs: [

                        ["Subject ID", "participant_id"],
                        ["Age", "age"],
                        ["Sex", "sex"],
                        ["Diagnosis", "group"]
                    ],

                    toolGroups: [

                        {
                            name: "My Tool Group",
                            tools: ["iq"]
                        }
                    ]
                });
            });

            it("all category + multi-column assessment tool group annotation", () => {

                // 1. Programmatically link categories to columns here
                cy.loadAppState("annotation", {

                    categoryColumnPairs: [

                        ["Subject ID", "participant_id"],
                        ["Age", "age"],
                        ["Sex", "sex"],
                        ["Diagnosis", "group"]
                    ],

                    toolGroups: [

                        {
                            name: "My Tool Group",
                            tools: ["iq", "session"]
                        }
                    ]
                });

            });

            it("all category + multi-group assessment tool group annotation", () => {

                // 1. Programmatically link categories to columns here
                cy.loadAppState("annotation", {

                    categoryColumnPairs: [

                        ["Subject ID", "participant_id"],
                        ["Age", "age"],
                        ["Sex", "sex"],
                        ["Diagnosis", "group"]
                    ],

                    toolGroups: [

                        {
                            name: "My Tool Group",
                            tools: ["iq"]
                        },

                        {
                            name: "My Other Tool Group",
                            tools: ["session"]
                        }
                    ]
                });
            });
        });

    });

});