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
        // 1. Open the index page
        cy.visit("/");
    });

    datasets.forEach((p_dataset) => {

        const dataFolder = fixturesFolder + p_dataset.source_folder;

        it("simple end to end test with " + p_dataset.description + " data", () => {

            // 0. Categories required for this test and the number of required columns for each category
            const testCriteria = {

                categories: [

                    ["Subject ID", 1],
                    ["Age", 1],
                    ["Diagnosis", 1],
                    ["Assessment Tool", 1]
                ]
            };

            // 1. Go through index page, selecting participants tsv and json dictionary files

            // A. Assert that categorization nav item and next button are disabled
            cy.assertNextPageAccess("categorization", false);

            // B. Select data table file
            cy.get("[data-cy='data-table-selector']")
                .contains("Choose file")
                .selectFile(dataFolder + p_dataset.data_table);

            // C. Assert that categorization nav item and next button are enabled
            cy.assertNextPageAccess("categorization", true);

            // D. Select participants dictionary
            cy.get("[data-cy='data-dictionary-selector']")
                .contains("Choose file")
                .selectFile(dataFolder + p_dataset.data_dictionary);

            // E. Click the next page button to proceed to the categorization page
            cy.get("[data-cy='button-nextpage']").click();

            if ( cy.datasetMeetsTestCriteria("categorization", p_dataset, testCriteria) ) {

                // 2. Go through categorization page, categorizing subject ID and age columns in the table

                // A. Assert nav and next button are not yet be enabled
                cy.assertNextPageAccess("annotation", false);

                // B. Categorize "participant_id" as "Subject ID"
                cy.categorizeColumn("Subject ID", p_dataset["category_columns"]["Subject ID"][0]);

                // C. Assert nav and next button are not yet enabled
                // For annotation page to be enabled, subject ID and
                // at least one other column must be categorized.
                cy.assertNextPageAccess("annotation", false);

                // D. Categorize "age" as "Age" and "group" as "Diagnosis"
                cy.categorizeColumn("Age", p_dataset["category_columns"]["Age"][0]);
                cy.categorizeColumn("Diagnosis", p_dataset["category_columns"]["Diagnosis"][0]);
                cy.categorizeColumn("Assessment Tool", p_dataset["category_columns"]["Assessment Tool"][0]);

                cy.get("[data-cy='toolgroup-select']").type("Wechsler Abbreviated Scale of Intelligence{enter}");
                cy.get("[data-cy='assessment-tool-table']").contains("Wechsler Abbreviated Scale of Intelligence").click();
                cy.get("[data-cy='assessment-column-table']").contains("iq").click();


                // Since Age and subject ID have been categorized
                // annotation page is no accessible.
                cy.assertNextPageAccess("annotation", true);

                // E. Click the next page button to proceed to the annotation page
                cy.get("[data-cy='button-nextpage']").click();

                // Make sure that we can go back with the browser back button and the
                // app state also updates accordingly
                cy.get("[data-cy='button-nextpage']").contains('Review and download');
                cy.go('back');
                cy.get("[data-cy='button-nextpage']").contains('Annotate columns');
                cy.go('forward');
                cy.get("[data-cy='button-nextpage']").contains('Review and download');


                if ( cy.datasetMeetsTestCriteria("annotation", p_dataset, testCriteria)) {

                    // 3. Go through annotation page, saving default age annotation

                    // A. Assert that next page nav and button are disabled for download page
                    cy.assertNextPageAccess("download", false);

                    // B. Click on the 'Age' tab
                    cy.get("[data-cy='annotation-category-tabs'] ul")
                        .contains("li", "Age")
                        .click();

                    // B. Select the 'float' transformation heuristic
                    // :data-cy="'selectTransform_' + columnName" where columnName is age
                    cy.get("[data-cy='selectTransform_age']").click();
                    cy.get("[data-cy='selectTransform_age']").type("float{enter}");


                    // B. Click on the 'Diagnosis' tab
                    cy.get("[data-cy='annotation-category-tabs'] ul")
                        .contains("li", "Diagnosis")
                        .click();

                    cy.get("[data-cy='categoricalSelector_0']").type("Acute{enter}");
                    cy.get("[data-cy='isControlButton_1']").type("Acute{enter}");
                    cy.get("[data-cy='categoricalSelector_2']").type("Hearing{enter}");

                    // D. Assert that next page nav and button are enabled for download page
                    cy.assertNextPageAccess("download", true);

                    // E. Click the next page button to proceed to the download page
                    cy.get("[data-cy='button-nextpage']").click();

                    // 4. Go through the download page, downloading the output annotation file

                    cy.get("[data-cy='button-nextpage']").should('not.exist');

                    cy.get("[data-cy='download-button']")
                        .click();

                    cy.task("downloads", "cypress/downloads").then(folderStateAfter => {
                        cy.readFile('cypress/downloads/' + folderStateAfter[folderStateAfter.length - 1]).then((fileContent) => {
                            expect(fileContent.group.Annotations.Levels.HC.Label).to.eq("Healthy Control");
                            expect(fileContent.group.Annotations.Levels.HC.TermURL).to.eq("ncit:C94342");
                            expect(fileContent.iq.Annotations.IsAbout.Label).to.eq("Assessment tool");
                            expect(fileContent.iq.Annotations.IsAbout.TermURL).to.eq("nb:Assessment");
                            expect(fileContent.iq.Annotations.IsPartOf.Label).to.eq("Wechsler Abbreviated Scale of Intelligence");
                            expect(fileContent.iq.Annotations.IsPartOf.TermURL).to.eq("cogatlas:trm_4b94affc43245");
                          });
                    });

                }
            }
        });
    });
});