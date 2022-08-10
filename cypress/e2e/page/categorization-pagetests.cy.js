describe("tests on categorization page via programmatic state loading and store interaction", () => {

    beforeEach(() => {

        // Standard app setup
        cy.appSetup();
    });

    // Categorization page tests with 'good' data files
    context("categorization with good data", () => {

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
            // NOTE: Home is visited because some state-related store structures
            // needed for the categorization page are set up on index page creation
            cy.visit("/");

            // 3. Load state for categorization page

            // A. Save data table in store
            cy.get("@config").then(p_config => {

                cy.get("@dataTable").then(p_dataTable => {

                    cy.dispatchToNuxtStore("saveDataTable", {

                        data: p_dataTable,
                        filename: p_config.data_table,
                        fileType: "tsv"
                    });
                });
            });

            // B. Enable access to the categorization page
            cy.dispatchToNuxtStore("initializePage", {

                enable: true,
                pageName: "categorization"
            });

            // C. Save data dictionary in store
            cy.get("@config").then(p_config => {

                cy.get("@dataDictionary").then(p_dataDictionary => {

                    cy.dispatchToNuxtStore("saveDataDictionary", {

                        data: p_dataDictionary,
                        filename: p_config.data_dictionary,
                        fileType: "json"
                    });
                });
            });

            // 4. Move to categorization page
            // NOTE: Routing to the page prevents the Vuex store from being wiped
            // when a page is 'visited' by Cypress
            cy.window().its("$nuxt.$router").then(router => {

                router.push({ path: "/categorization" });
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
                .eq(1)
                .click();

            // Assert 2 - Nav and next button should be enabled
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
                .eq(1)
                .click();

            // Assert 2 - Nav and next button should be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("not.have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("not.have.class", "disabled");

            // Action 3

            // Select the next category
            cy.get("[data-cy='categorization-table'] tbody tr")
                .eq(2)
                .click();

            // Link the second column in the column select table with the 'Diagnosis' category
            cy.get("[data-cy='column-linking-table'] tbody tr td")
                .eq(2)
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
                .eq(1)
                .click();

            // Assert 2 - Nav and next button should not be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");

            // Action 3

            // Fill in the toolgroup name textbox
            cy.get("[data-cy='tool-name-textbox']")
                .type("Test ToolGroup 1");

            // Select the column in the assessment tool column multi-selectbox
            cy.get("[data-cy='column-multiselect']")
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
                .eq(1)
                .click();

            // Assert 2 - Nav and next button should not be enabled
            cy.get("[data-cy='menu-item-annotation'] a")
                .should("have.class", "disabled");
            cy.get("[data-cy='button-nextpage']")
                .should("have.class", "disabled");

            // Action 3

            // Fill in the toolgroup name textbox
            cy.get("[data-cy='tool-name-textbox']")
                .type("Test ToolGroup 1");

            // Select the column in the assessment tool column multi-selectbox
            cy.get("[data-cy='column-multiselect']")
                .select(0);

            // Create the tool group by clicking the 'create' button
            cy.get("[data-cy='create-toolgroup-button']")
                .click();

            // Select subject ID category
            cy.get("[data-cy='categorization-table']")
                .contains("Subject ID")
                .click();

            // Link the second column in the column select table with the 'Subject ID' category
            cy.get("[data-cy='column-linking-table'] tbody tr td")
                .eq(2)
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