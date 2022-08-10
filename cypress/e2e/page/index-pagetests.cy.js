describe("tests on the index page via store interaction", () => {

    beforeEach(() => {

        // Standard app setup
        cy.appSetup();
    });    

    // Index page tests with 'good' data files
    context("index data loading with good data", () => {

        beforeEach(() => {

            // Setup

            // 1. Load test data

            // A. Load configuration file with testing parameters
            cy.fixture("tests/categorization/default-test-config.json").as("config");

            // B. Load data files based on parameters
            cy.get("@config").then(p_config => {

                // I. Load participants.tsv from config parameters
                cy.loadDataTable(p_config.source_folder, p_config.data_table)
                    .as("dataTable");

                // II. Load data dictionary from config parameters
                cy.loadDataDictionary(p_config.source_folder, p_config.data_dictionary)
                    .as("dataDictionary");
            });

            // 2. Open index page
            cy.visit("/");
        });

        // Description: User selects data table alone
        // Expected results: Categorization nav and Next page button are enabled
        it("select data table only", () => {

            // Action

            // 1. Save data table in store
            cy.get("@config").then(p_config => {

                cy.get("@dataTable").then(p_dataTable => {

                    cy.dispatchToNuxtStore("saveDataTable", {

                        data: p_dataTable,
                        filename: p_config.data_table,
                        fileType: "tsv"
                    });
                });
            });

            // 2. Enable access to the categorization page
            cy.dispatchToNuxtStore("initializePage", {

                enable: true,
                pageName: "categorization"
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

            // 1. Save data dictionary in store
            cy.get("@config").then(p_config => {

                cy.get("@dataDictionary").then(p_dataDictionary => {

                    cy.dispatchToNuxtStore("saveDataDictionary", {

                        data: p_dataDictionary,
                        filename: p_config.data_dictionary,
                        fileType: "json"
                    });
                });
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

            // 1. Save data dictionary in store
            cy.get("@config").then(p_config => {

                cy.get("@dataDictionary").then(p_dataDictionary => {

                    cy.dispatchToNuxtStore("saveDataDictionary", {

                        data: p_dataDictionary,
                        filename: p_config.data_dictionary,
                        fileType: "json"
                    });
                });
            });

            // Assert 1

            // Check to see that categorization nav item and next button are disabled
            cy.get("[data-cy='menu-item-categorization'] a")
            .first()
            .should('have.class', 'disabled');
            cy.get("[data-cy='button-nextpage']")
            .should('have.class', 'disabled');

            // Action 2

            // 1. Save data table in store
            cy.get("@config").then(p_config => {

                cy.get("@dataTable").then(p_dataTable => {

                    cy.dispatchToNuxtStore("saveDataTable", {

                        data: p_dataTable,
                        filename: p_config.data_table,
                        fileType: "tsv"
                    });
                });
            });

            // 2. Enable access to the categorization page
            cy.dispatchToNuxtStore("initializePage", {

                enable: true,
                pageName: "categorization"
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