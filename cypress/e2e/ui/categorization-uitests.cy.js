describe("tests on the categorization page via ui interaction", () => {

    beforeEach(() => {

        // Standard setup for annotation tool testing

        // A. Set viewport size
        // NOTE: Standard 13-inch laptop screen to start, but this can be expanded
        cy.viewport("macbook-13");
    });

    context("categorization with good data", () => {

        // Fixtures folder prefix needed for manual file loading
        let fixturesFolder = "./cypress/fixtures/";

        beforeEach(() => {

            // Setup

            // 1. Load configuration file with testing parameters
            cy.fixture("tests/categorization/default-test-config.json").as("config");

            // 2. Get past the index page
            cy.get("@config").then(p_config => {

                cy.passIndex(
                    fixturesFolder + p_config.source_folder + p_config.data_table,
                    fixturesFolder + p_config.source_folder + p_config.data_dictionary
                );
            });
        });

        // Description of task: User selects one non-tool group category and paints one column
        // Expected results: Annotation nav and Next page button are enabled
        it("simple categorization", () => {

            // Action 1

            // Select subject ID category
            cy.get("[data-cy='categorization-table']")
                .contains("Subject ID")
                .click();

            // Assert 1 - Nav and next button should not yet be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");

            // Action 2

            // Link the first column in the column select table with the subject ID category
            cy.get("[data-cy='column-linking-table'] tbody tr td")
                .contains("participant_id")
                .click();

            // Assert 2 - Nav and next button should be enabled
            // Assert 1
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("not.have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("not.have.class", "disabled");
        });

        // Description of task: User selects multiple non-tool group category and paints multiple columns
        // Expected results: Annotation nav and Next page button are enabled
        it("multiple categorization", () => {

            // Action 1

            // Select 'Subject ID' category
            cy.get("[data-cy='categorization-table']")
                .contains("Subject ID")
                .click();

            // Assert 1 - Nav and next button should not yet be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");

            // Action 2

            // Link the first column in the column select table with the 'Subject ID' category
            cy.get("[data-cy='column-linking-table'] tbody tr td")
                .contains("participant_id")
                .click();

            // Assert 2 - Nav and next button should be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("not.have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("not.have.class", "disabled");

            // Action 3

            // Select 'Diagnosis' category
            cy.get("[data-cy='categorization-table']")
                .contains("Diagnosis")
                .click();

            // Link the second column in the column select table with the 'Diagnosis' category
            cy.get("[data-cy='column-linking-table'] tbody tr td")
                .contains("group")
                .click();

            // Assert 3 - Nav and next button should *still* be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("not.have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("not.have.class", "disabled");
        });

        // Description of task: User selects the tool group category and paints one column,
        // writes name of tool group, groups that column into that tool group by clicking column name and add
        // Expected results: Annotation nav and Next page button remain disabled
        it("simple toolgroup categorization", () => {

            // Action 1

            // Select 'Assessment Tool' category
            cy.get("[data-cy='categorization-table']")
                .contains("Assessment Tool")
                .click();

            // Assert 1 - Nav and next button should not yet be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");

            // Action 2

            // Link the second column in the column select table with the 'Assessment Tool' category
            cy.get("[data-cy='column-linking-table'] tbody tr td")
                .contains("iq")
                .click();

            // Assert 2 - Nav and next button should not be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");

            // Action 3

            // Fill in the toolgroup name textbox
            cy.get("[data-cy='toolgroup-name-textbox']")
            .type("Test ToolGroup 1");

            // Select the column in the assessment tool column multi-selectbox
            cy.get("[data-cy='toolgroup-column-multiselect']")
                .select(0);

            // Create the tool group by clicking the 'create' button
            cy.get("[data-cy='create-toolgroup-button']")
                .click();

            // Assert 3 - Toolgroup is present in the tool groups table
            cy.get("[data-cy='toolgroup-table'] tbody")
                .children()
                .should("have.length", 1);

            // Assert 4 - Nav and next button should still be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");
        });

        // Description of task: User selects non- and tool group categories, paints column with tool group paint,
        // creates tool group label, groups columns, paints columns with non-tool group categories
        // Expected results: Annotation nav and Next page button are enabled
        it("ordinary and toolgroup categorization", () => {

            // Action 1

            // Select 'Assessment Tool' category
            cy.get("[data-cy='categorization-table']")
            .contains("Assessment Tool")
            .click();

            // Assert 1 - Nav and next button should not yet be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");

            // Action 2

            // Link the second column in the column select table with the 'Assessment Tool' category
            cy.get("[data-cy='column-linking-table'] tbody tr td")
                .contains("iq")
                .click();

            // Assert 2 - Nav and next button should not be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");

            // Action 3

            // Fill in the toolgroup name textbox
            cy.get("[data-cy='toolgroup-name-textbox']")
            .type("Test ToolGroup 1");

            // Select the column in the assessment tool column multi-selectbox
            cy.get("[data-cy='toolgroup-column-multiselect']")
                .select(0);

            // Create the tool group by clicking the 'create' button
            cy.get("[data-cy='create-toolgroup-button']")
                .click();

            // Select subject ID category
            cy.get("[data-cy='categorization-table']")
                .contains("Subject ID")
                .click();

            // Link the second column in the column select table with the 'Assessment Tool' category
            cy.get("[data-cy='column-linking-table'] tbody tr td")
                .contains("session")
                .click();

            // Assert 3 - Nav and next button should now be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("not.have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("not.have.class", "disabled");

            // Assert 4 - Toolgroup is present in the tool groups table
            cy.get("[data-cy='toolgroup-table'] tbody")
                .children()
                .should("have.length", 1);
        });
    });
});