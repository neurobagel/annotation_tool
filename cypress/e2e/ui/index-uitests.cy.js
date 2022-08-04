describe("tests on the index page via ui interaction", () => {

    beforeEach(() => {

        // Standard setup for annotation tool testing

        // A. Set viewport size
        // NOTE: Standard 13-inch laptop screen to start, but this can be expanded
        cy.viewport("macbook-13");
    });

    // Index page tests with 'good' data files
    context("index data loading with good data", () => {

        // Fixtures folder prefix needed for manual file loading
        let fixturesFolder = "./cypress/fixtures/";

        beforeEach(() => {

            // Setup

            // 1. Open the index page
            cy.visit("/");

            // 2. Load configuration file with testing parameters
            cy.fixture("tests/categorization/default-test-config.json").as("config");
        });

        // Description: User selects data table alone
        // Expected results: Categorization nav and Next page button are enabled
        it("select data table only", () => {

            // Action

            // Select data table file
            cy.get("@config").then(p_config => {

                cy.get("[data-cy='data-table-selector']")
                    .contains("Choose file")
                    .click()
                    .selectFile(fixturesFolder + p_config.source_folder + p_config.data_table);
            });

            // Assert

            // Check to see that categorization nav item and next button are enabled
            cy.get("[data-cy='menu-item-categorization'] a")
                .should("not.have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("not.have.class", "disabled");
        });

        // Description: User selects data dictionary alone
        // Expected results: Categorization nav and Next page button remain disabled
        it("select data dictionary only", () => {

            // Action

            // Select data dictionary file
            cy.get("@config").then(p_config => {

                cy.get("[data-cy='data-dictionary-selector']")
                    .contains("Choose file")
                    .click()
                    .selectFile(fixturesFolder + p_config.source_folder + p_config.data_dictionary);
            });

            // Assert

            // Check to see that categorization nav item and next button are enabled
            cy.get("[data-cy='menu-item-categorization'] a")
                .first()
                .should('have.class', 'disabled');
            cy.get("[data-cy='button-nextpage']")
                .should('have.class', 'disabled');
        });

        // Description: User selects data table and data dictionary
        // Expected results: Categorization nav and Next page button are only enabled after data table selection
        it("select both data table and dictionary", () => {

            // Action 1

            // Select data dictionary file
            cy.get("@config").then(p_config => {

                cy.get("[data-cy='data-dictionary-selector']")
                    .contains("Choose file")
                    .click()
                    .selectFile(fixturesFolder + p_config.source_folder + p_config.data_dictionary);
            });

            // Assert 1

            // Check to see that categorization nav item and next button are disabled
            cy.get("[data-cy='menu-item-categorization'] a")
                .first()
                .should('have.class', 'disabled');
            cy.get("[data-cy='button-nextpage']")
                .should('have.class', 'disabled');

            // Action 2

            // Select data table file
            cy.get("@config").then(p_config => {

                cy.get("[data-cy='data-table-selector']")
                    .contains("Choose file")
                    .click()
                    .selectFile(fixturesFolder + p_config.source_folder + p_config.data_table);
            });

            // Assert 2

            // Check to see that categorization nav item and next button are enabled
            cy.get("[data-cy='menu-item-categorization'] a")
                .should("not.have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("not.have.class", "disabled");
        });
    });
});